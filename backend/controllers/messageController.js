const Message = require("../models/Message");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

/* ===============================
   GỬI TIN NHẮN
================================ */
exports.sendMessage = async (req, res) => {
  try {
    const { appointmentId, receiverId, content } = req.body;
    const senderId = req.user.id;

    if (!appointmentId || !receiverId || !content) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    // Kiểm tra appointment tồn tại
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      appointmentId,
      content,
    });

    const populated = await message.populate([
      { path: "senderId", select: "username email role" },
      { path: "receiverId", select: "username email role" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   LẤY TIN NHẮN THEO APPOINTMENT
================================ */
exports.getMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const messages = await Message.find({ appointmentId })
      .populate("senderId", "username email role")
      .populate("receiverId", "username email role")
      .sort({ createdAt: 1 });

    // Đánh dấu đã đọc cho tin nhắn gửi đến user hiện tại
    await Message.updateMany(
      { appointmentId, receiverId: req.user.id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   DANH SÁCH HỘI THOẠI - BÁC SĨ
   (Hiển thị bệnh nhân đã đặt lịch)
================================ */
exports.getDoctorConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Tìm Doctor document liên kết với user này
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) {
      return res.status(404).json({ message: "Không tìm thấy thông tin bác sĩ" });
    }

    // 2. Lấy tất cả appointments của bác sĩ này
    const appointments = await Appointment.find({ doctorId: doctor._id })
      .populate("userId", "username email phone")
      .sort({ date: -1 });

    // 3. Với mỗi appointment, lấy tin nhắn cuối cùng + số chưa đọc
    const conversations = await Promise.all(
      appointments.map(async (appt) => {
        const lastMessage = await Message.findOne({ appointmentId: appt._id })
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await Message.countDocuments({
          appointmentId: appt._id,
          receiverId: userId,
          read: false,
        });

        return {
          appointmentId: appt._id,
          patient: appt.userId,
          date: appt.date,
          time: appt.time,
          status: appt.status,
          lastMessage,
          unreadCount,
        };
      })
    );

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   DANH SÁCH HỘI THOẠI - BỆNH NHÂN
================================ */
exports.getPatientConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Lấy appointments của bệnh nhân
    const appointments = await Appointment.find({ userId })
      .populate({
        path: "doctorId",
        populate: { path: "userId", select: "username email" },
      })
      .sort({ date: -1 });

    const conversations = await Promise.all(
      appointments.map(async (appt) => {
        const lastMessage = await Message.findOne({ appointmentId: appt._id })
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await Message.countDocuments({
          appointmentId: appt._id,
          receiverId: userId,
          read: false,
        });

        return {
          appointmentId: appt._id,
          doctor: {
            _id: appt.doctorId?._id,
            name: appt.doctorId?.name,
            specialty: appt.doctorId?.specialty,
            hospital: appt.doctorId?.hospital,
            userId: appt.doctorId?.userId,
          },
          date: appt.date,
          time: appt.time,
          status: appt.status,
          lastMessage,
          unreadCount,
        };
      })
    );

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===============================
   ĐÁnh DẤU ĐÃ ĐỌC
================================ */
exports.markAsRead = async (req, res) => {
  try {
    await Message.updateMany(
      {
        appointmentId: req.params.appointmentId,
        receiverId: req.user.id,
        read: false,
      },
      { read: true }
    );
    res.json({ message: "Đã đánh dấu đọc" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
