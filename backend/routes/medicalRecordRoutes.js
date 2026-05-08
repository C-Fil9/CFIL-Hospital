const express = require("express");
const router = express.Router();

const {
  createMedicalRecord,
  getRecordsByUser,
  getRecordsByDoctor,
  getRecordByAppointment,
} = require("../controllers/medicalRecordController");

const { verifyToken, isDoctor } = require("../middlewares/authMiddleware");

// 🩺 Bác sĩ tạo hồ sơ bệnh án
router.post("/", verifyToken, isDoctor, createMedicalRecord);

// 📋 Bệnh nhân xem hồ sơ của mình
router.get("/user/:userId", verifyToken, getRecordsByUser);

// 📋 Bác sĩ xem hồ sơ đã tạo
router.get("/doctor", verifyToken, isDoctor, getRecordsByDoctor);

// 📋 Xem hồ sơ theo lịch hẹn
router.get("/appointment/:appointmentId", verifyToken, getRecordByAppointment);

module.exports = router;
