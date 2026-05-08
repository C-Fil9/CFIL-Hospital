const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const sendEmail = require("../utils/sendEmail");

/* ===============================
   CREATE APPOINTMENT
================================ */

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;
    const userId = req.params.userId;

    if (!doctorId || !date || !time) {
      return res.status(400).json({
        message: "Thiếu thông tin",
      });
    }

    // 🔥 1. Kiểm tra bác sĩ có bị trùng không
    const doctorConflict = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: "Cancelled" }
    });

    if (doctorConflict) {
      return res.status(400).json({
        message: "Bác sĩ đã có lịch hẹn vào khung giờ này",
      });
    }

    // 🔥 2. Kiểm tra chính bạn có bị trùng lịch không
    const userConflict = await Appointment.findOne({
      userId,
      date,
      time,
      status: { $ne: "Cancelled" }
    });

    if (userConflict) {
      return res.status(400).json({
        message: "Bạn đã có một lịch hẹn khác vào khung giờ này",
      });
    }

    // ✅ Nếu ok thì mới tạo
    const appointment = await Appointment.create({
      ...req.body,
      userId,
    });

    // lấy user + doctor song song
    const [user, doctor] = await Promise.all([
      User.findById(userId),
      Doctor.findById(doctorId),
    ]);

    const text = `
🎉 XÁC NHẬN ĐẶT LỊCH

Xin chào ${user.username},

👨‍⚕️ Bác sĩ: ${doctor.name}
🏥 Bệnh viện: ${doctor.hospital}
📅 Ngày: ${date}
⏰ Giờ: ${time}

Cảm ơn bạn ❤️
    `;

    sendEmail(user.email, "Xác nhận đặt lịch", text)
      .catch(err => console.log(err));

    res.status(201).json({
      message: "Đặt lịch thành công",
      data: appointment,
    });

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Khung giờ đã có người đặt",
      });
    }

    res.status(500).json({
      message: "Lỗi server",
    });
  }
};

/* ===============================
   GET USER APPOINTMENTS
================================ */

exports.getAppointmentsByUser = async (req, res) => {
  try {
    const data = await Appointment.find({ userId: req.params.userId })
      .populate("doctorId")
      .sort({ date: -1 })
      .lean();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   ADMIN GET ALL
================================ */

exports.getAllAppointments = async (req, res) => {
  try {
    const data = await Appointment.find()
      .populate("doctorId")
      .populate("userId")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   PAYMENT
================================ */

exports.payAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Không tìm thấy",
      });
    }

    appointment.paymentStatus = "paid";
    appointment.status = "Confirmed";
    appointment.transactionId = "TRANS_" + Date.now();

    await appointment.save();

    res.json({
      message: "Thanh toán thành công",
      data: appointment,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   CANCEL
================================ */

exports.cancelAppointment = async (req, res) => {
  try {
    const data = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );

    res.json({
      message: "Đã huỷ lịch",
      data,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};