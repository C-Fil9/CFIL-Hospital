const express = require("express");
const router = express.Router();

const {
  createAppointment,
  getAppointmentsByUser,
  getAllAppointments,
  payAppointment,
  cancelAppointment,
} = require("../controllers/appointmentController");

router.post("/user/:userId", createAppointment);
router.get("/user/:userId", getAppointmentsByUser);
router.get("/", getAllAppointments);

router.put("/pay/:id", payAppointment);

// ✅ REST chuẩn
router.put("/:id/cancel", cancelAppointment);

module.exports = router;