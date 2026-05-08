const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      index: true,
    },

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

    diagnosis: {
      type: String,
      required: true,
    },

    prescription: [
      {
        name: String,
        dosage: String,
        instructions: String,
      },
    ],

    doctorNotes: String,
  },
  { timestamps: true }
);

// Mỗi appointment chỉ có 1 hồ sơ bệnh án
medicalRecordSchema.index({ appointmentId: 1 }, { unique: true });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);
