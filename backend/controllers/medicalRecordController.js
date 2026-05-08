const MedicalRecord = require("../models/MedicalRecord");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

/* ===============================
   TẠO HỒ SƠ BỆNH ÁN (Bác sĩ)
================================ */
exports.createMedicalRecord = async (req, res) => {
  try {
    const { appointmentId, diagnosis, prescription, doctorNotes } = req.body;

    if (!appointmentId || !diagnosis) {
      return res.status(400).json({ message: "Vui lòng nhập chuẩn đoán bệnh" });
    }

    // Kiểm tra appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({ message: "Lịch hẹn đã bị hủy" });
    }

    // Kiểm tra đã có hồ sơ chưa
    const existing = await MedicalRecord.findOne({ appointmentId });
    if (existing) {
      return res.status(400).json({ message: "Lịch hẹn này đã có hồ sơ bệnh án" });
    }

    // Tạo hồ sơ bệnh án
    const record = await MedicalRecord.create({
      appointmentId,
      userId: appointment.userId,
      doctorId: appointment.doctorId,
      diagnosis,
      prescription: prescription || [],
      doctorNotes: doctorNotes || "",
    });

    // Cập nhật trạng thái appointment
    appointment.status = "Completed";
    await appointment.save();

    // Gửi email thông báo cho bệnh nhân
    try {
      const [user, doctor] = await Promise.all([
        User.findById(appointment.userId),
        Doctor.findById(appointment.doctorId),
      ]);

      if (user?.email) {
        const prescriptionText = (prescription || [])
          .map((p, i) => `  ${i + 1}. ${p.name} — ${p.dosage} — ${p.instructions}`)
          .join("\n");

        const emailText = `
🩺 KẾT QUẢ KHÁM BỆNH

Xin chào ${user.username},

Bác sĩ ${doctor?.name || ""} đã hoàn thành khám cho bạn.

📋 Chuẩn đoán: ${diagnosis}

💊 Đơn thuốc:
${prescriptionText || "  Không có đơn thuốc"}

📝 Lời dặn: ${doctorNotes || "Không có"}

Cảm ơn bạn đã sử dụng dịch vụ ❤️
        `;

        sendEmail(user.email, "Kết quả khám bệnh", emailText)
          .catch(err => console.log("Email error:", err));
      }
    } catch (emailErr) {
      console.log("Email send failed:", emailErr);
    }

    res.status(201).json({
      message: "Đã tạo hồ sơ bệnh án",
      data: record,
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Lịch hẹn này đã có hồ sơ bệnh án" });
    }
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   LẤY HỒ SƠ THEO BỆNH NHÂN
================================ */
exports.getRecordsByUser = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ userId: req.params.userId })
      .populate("appointmentId", "fullName date time hospital service phone")
      .populate("doctorId", "name specialty hospital")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   LẤY HỒ SƠ THEO BÁC SĨ
================================ */
exports.getRecordsByDoctor = async (req, res) => {
  try {
    const userId = req.user.id;

    // Tìm Doctor document
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy thông tin bác sĩ" });
    }

    const records = await MedicalRecord.find({ doctorId: doctor._id })
      .populate("appointmentId", "fullName date time hospital service phone")
      .populate("userId", "username email phone")
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   LẤY 1 HỒ SƠ THEO APPOINTMENT
================================ */
exports.getRecordByAppointment = async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({ appointmentId: req.params.appointmentId })
      .populate("appointmentId", "fullName date time hospital service phone")
      .populate("doctorId", "name specialty hospital")
      .populate("userId", "username email phone");

    if (!record) {
      return res.status(404).json({ message: "Chưa có hồ sơ bệnh án" });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
