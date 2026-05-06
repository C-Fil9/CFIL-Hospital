const express = require("express");
const router = express.Router();
const multer = require("multer");

const chatController = require("../controllers/chatController");

// Multer — lưu vào memory (buffer) để gửi trực tiếp cho Gemini
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP"), false);
    }
  }
});

// Chat text
router.post("/", chatController.chatWithAI);

// Chat với hình ảnh
router.post("/image", upload.single("image"), chatController.chatWithImage);

module.exports = router;