const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
  getDoctorConversations,
  getPatientConversations,
  markAsRead,
} = require("../controllers/messageController");

const { verifyToken, isDoctor } = require("../middlewares/authMiddleware");

// Gửi tin nhắn (cả doctor và patient)
router.post("/", verifyToken, sendMessage);

// ⚠️ PHẢI để routes cụ thể TRƯỚC /:appointmentId (dynamic param)
// Danh sách hội thoại của bác sĩ
router.get("/conversations/doctor", verifyToken, isDoctor, getDoctorConversations);

// Danh sách hội thoại của bệnh nhân
router.get("/conversations/patient", verifyToken, getPatientConversations);

// Đánh dấu đã đọc
router.put("/read/:appointmentId", verifyToken, markAsRead);

// Lấy tin nhắn theo appointment (phải để sau các routes cụ thể)
router.get("/:appointmentId", verifyToken, getMessages);

module.exports = router;
