const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{9,11}$/,
    },

    hospital: String,
    service: String,

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    description: String,

    price: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed"],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["QR", "Counter", "None"],
      default: "None",
    },

    transactionId: String,

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// 🔥 CHỐNG TRÙNG LỊCH (Bác sĩ không bị đặt trùng giờ, trừ các lịch đã Huỷ)
appointmentSchema.index(
  { doctorId: 1, date: 1, time: 1 },
  { 
    unique: true, 
    partialFilterExpression: { status: { $in: ["Pending", "Confirmed", "Completed"] } } 
  }
);

module.exports = mongoose.model("Appointment", appointmentSchema);