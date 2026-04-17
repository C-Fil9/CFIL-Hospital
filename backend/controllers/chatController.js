require("dotenv").config();
const Doctor = require("../models/Doctor");
const { askAI } = require("../utils/gemini");

// 🔥 normalize tiếng Việt (FIX CHÍNH)
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/đ/g, "d") // QUAN TRỌNG
    .replace(/[\u0300-\u036f]/g, "");
};

// 🔥 mapping KHÔNG DẤU
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

// 🔥 detect chuyên khoa
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

// 🔥 filter đúng khoa (chống lệch)
const strictFilterDoctors = (doctors, specialties) => {
  if (specialties.length === 0) return doctors;

  return doctors.filter(doc =>
    specialties.some(s =>
      doc.specialty.toLowerCase().includes(s.toLowerCase())
    )
  );
};

// 🔥 ranking
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

// 🔥 clean data trả về
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

    // 🔥 1. detect
    const specialties = detectSpecialties(message);

    console.log("Message:", message);
    console.log("Detected:", specialties);

    // 🔥 2. QUERY (FIX LỖI CHÍNH)
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

    // 🔥 3. FILTER lại
    doctors = strictFilterDoctors(doctors, specialties);

    // 🔥 4. fallback nếu không có
    if (doctors.length === 0) {
      doctors = await Doctor.find().limit(5);
    }

    // 🔥 5. ranking
    doctors = rankDoctors(doctors, specialties);

    console.log("Doctors found:", doctors.length);

    // 🔥 6. context AI
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

module.exports = { chatWithAI };