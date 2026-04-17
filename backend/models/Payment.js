const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  method: {
    type: String,
    enum: ["counter", "qr"],
    default: "qr"
  },

  content: {
    type: String,
    required: true,
    unique: true
  },

  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);