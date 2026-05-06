const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ tạo model 1 lần duy nhất
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const askAI = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini error:", err.message);
    return null;
  }
};

// ✅ Phân tích hình ảnh với Gemini Vision
const askAIWithImage = async (prompt, imageBuffer, mimeType) => {
  try {
    const base64Image = imageBuffer.toString("base64");
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType,
      },
    };
    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text();
  } catch (err) {
    console.error("Gemini vision error:", err.message);
    return null;
  }
};

module.exports = { askAI, askAIWithImage };