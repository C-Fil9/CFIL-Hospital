require("dotenv").config();
const Doctor = require("../models/Doctor");
const { askAI, askAIWithImage } = require("../utils/gemini");

//  normalize tiếng Việt (FIX CHÍNH)
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/đ/g, "d") // QUAN TRỌNG
    .replace(/[\u0300-\u036f]/g, "");
};
const symptomMap = {
  "dau lung": "xương khớp",
  "cot song": "xương khớp",
  "khop": "xương khớp",

  "ho": "hô hấp",
  "kho tho": "hô hấp",

  "sot": "nhiễm trùng",

  "dau bung": "tiêu hoá",
  "tieu chay": "tiêu hoá",

  "tim": "tim mạch",
  "dau nguc": "tim mạch",

  "mun": "da liễu",
  "di ung da": "da liễu",
  "noi ban do": "da liễu",

  "dau dau": "thần kinh",
  "mat ngu": "thần kinh",

  "tieu duong": "nội tiết",
  "suy than": "nội tiết",

  "dau mat": "mắt",
  "nhin mo": "mắt",

  "dau rang": "răng hàm mặt",
  "sau rang": "răng hàm mặt",

  "viem xoang": "tai mũi họng",
  "dau hong": "tai mũi họng",
};

// detect chuyên khoa
const detectSpecialties = (message) => {
  const msg = normalizeText(message);
  const found = new Set();

  for (const key in symptomMap) {
    if (msg.includes(key)) {
      found.add(symptomMap[key]);
    }
  }

  return Array.from(found);
};

// filter đúng khoa (chống lệch)
const strictFilterDoctors = (doctors, specialties) => {
  if (specialties.length === 0) return doctors;

  return doctors.filter(doc =>
    specialties.some(s =>
      doc.specialty.toLowerCase().includes(s.toLowerCase())
    )
  );
};

// ranking
const rankDoctors = (doctors, specialties) => {
  return doctors
    .map(doc => {
      let score = 0;

      // match chuyên khoa
      if (
        specialties.some(s =>
          doc.specialty.toLowerCase().includes(s.toLowerCase())
        )
      ) {
        score += 10;
      }

      // kinh nghiệm
      score += doc.experience * 0.5;

      // giá rẻ hơn ưu tiên
      score += 1000000 / (doc.price + 1);

      return { ...doc.toObject(), score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

//  clean data trả về
const formatDoctorsResponse = (docs) => {
  return docs.map(doc => ({
    _id: doc._id,
    name: doc.name,
    specialty: doc.specialty,
    hospital: doc.hospital,
    experience: doc.experience,
    price: doc.price,
  }));
};

const chatWithAI = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.json({
        reply: "Bạn hãy mô tả triệu chứng nhé 👇",
        aiStatus: "empty"
      });
    }

    // 1. detect
    const specialties = detectSpecialties(message);

    console.log("Message:", message);
    console.log("Detected:", specialties);

    // 2. QUERY (FIX LỖI CHÍNH)
    let doctors = [];

    if (specialties.length > 0) {
      doctors = await Doctor.find({
        specialty: {
          $regex: specialties.join("|"),
          $options: "i"
        }
      });
    } else {
      doctors = await Doctor.find({
        $or: [
          { specialty: { $regex: message, $options: "i" } },
          { hospital: { $regex: message, $options: "i" } }
        ]
      });
    }

    //  3. FILTER lại
    doctors = strictFilterDoctors(doctors, specialties);

    //  4. fallback nếu không có
    if (doctors.length === 0) {
      doctors = await Doctor.find().limit(5);
    }

    //  5. ranking
    doctors = rankDoctors(doctors, specialties);

    console.log("Doctors found:", doctors.length);

    //  6. context AI
    const context = history
      .slice(-3)
      .map(m => `${m.sender}: ${m.text}`)
      .join("\n");

    let aiReply = "";
    let aiStatus = "ok";

    try {
      const prompt = `
Bạn là AI tư vấn y tế.

Context:
${context}

User: ${message}

Chuyên khoa gợi ý: ${specialties.join(", ") || "không rõ"}

Yêu cầu:
- Trả lời 2 câu
- Dễ hiểu
- KHÔNG chẩn đoán
- Thân thiện

Nếu có bác sĩ → khuyến khích đặt lịch.

Kết thúc bằng:
"⚠️ Thông tin chỉ mang tính tham khảo."
`;

      aiReply = await askAI(prompt);

      if (!aiReply) throw new Error("AI null");

    } catch (err) {
      aiStatus = "fallback";

      aiReply = specialties.length
        ? `Triệu chứng có thể liên quan đến ${specialties.join(", ")}. Bạn nên đi khám sớm.`
        : "Bạn mô tả rõ hơn giúp mình nhé.";
    }

    return res.json({
      reply: aiReply,
      doctors: formatDoctorsResponse(doctors),
      specialties,
      aiStatus
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      reply: "Server lỗi 😢",
      aiStatus: "error"
    });
  }
};

// ✅ Chat với hình ảnh — phân tích ảnh y tế
const chatWithImage = async (req, res) => {
  try {
    const file = req.file;
    const message = req.body.message || "";

    if (!file) {
      return res.status(400).json({
        reply: "Vui lòng gửi hình ảnh để phân tích 📷",
        aiStatus: "no_image"
      });
    }

    // Validate mime type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        reply: "Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP 🖼️",
        aiStatus: "invalid_type"
      });
    }

    console.log("📷 Image received:", file.originalname, file.mimetype, file.size);

    // Prompt phân tích ảnh y tế
    const prompt = `
Bạn là AI hỗ trợ y tế chuyên phân tích hình ảnh.

${message ? `Bệnh nhân mô tả: ${message}` : "Bệnh nhân gửi hình ảnh để tham khảo."}

Hãy phân tích hình ảnh và thực hiện:
1. Mô tả những gì bạn quan sát được trong ảnh (triệu chứng nhìn thấy)
2. Đưa ra nhận định sơ bộ về tình trạng có thể
3. Gợi ý chuyên khoa phù hợp nên khám (ví dụ: da liễu, xương khớp, mắt, tai mũi họng...)
4. Đưa ra lời khuyên ban đầu

Yêu cầu:
- Trả lời bằng tiếng Việt
- Ngắn gọn, dễ hiểu (tối đa 4-5 câu)
- Thân thiện, không gây hoang mang
- KHÔNG đưa ra chẩn đoán xác định
- Ghi rõ chuyên khoa gợi ý ở cuối dòng riêng, format: "Chuyên khoa gợi ý: [tên khoa]"

Kết thúc bằng:
"⚠️ Đây chỉ là nhận định sơ bộ từ AI, không thay thế chẩn đoán của bác sĩ. Vui lòng đến cơ sở y tế để được khám trực tiếp."
`;

    let aiReply = "";
    let aiStatus = "ok";
    let specialties = [];

    try {
      aiReply = await askAIWithImage(prompt, file.buffer, file.mimetype);

      if (!aiReply) throw new Error("AI vision null");

      // Extract chuyên khoa từ AI response
      const specialtyMatch = aiReply.match(/[Cc]huyên khoa gợi ý[:\s]*(.+)/i);
      if (specialtyMatch) {
        const raw = specialtyMatch[1]
          .replace(/["\*\.]/g, "")
          .split(/[,\/]/)
          .map(s => s.trim().toLowerCase())
          .filter(Boolean);
        specialties = raw;
      }

      // Fallback: detect từ message text nếu có
      if (specialties.length === 0 && message) {
        specialties = detectSpecialties(message);
      }

    } catch (err) {
      console.error("Vision AI error:", err.message);
      aiStatus = "fallback";
      aiReply = "Mình chưa thể phân tích được ảnh này. Bạn hãy mô tả thêm triệu chứng nhé! 🏥";
    }

    // Query doctors dựa trên specialties
    let doctors = [];

    if (specialties.length > 0) {
      doctors = await Doctor.find({
        specialty: {
          $regex: specialties.join("|"),
          $options: "i"
        }
      });
    }

    if (doctors.length === 0) {
      doctors = await Doctor.find().limit(5);
    }

    doctors = rankDoctors(doctors, specialties);

    console.log("🔍 Specialties from image:", specialties);
    console.log("👨‍⚕️ Doctors found:", doctors.length);

    return res.json({
      reply: aiReply,
      doctors: formatDoctorsResponse(doctors),
      specialties,
      aiStatus,
      imageAnalysis: true
    });

  } catch (err) {
    console.error("❌ chatWithImage error:", err);
    return res.status(500).json({
      reply: "Server lỗi khi phân tích ảnh 😢",
      aiStatus: "error"
    });
  }
};

module.exports = { chatWithAI, chatWithImage };