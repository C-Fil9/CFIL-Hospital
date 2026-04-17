const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String, // khoa
  hospital: String,
  experience: Number, // năm kinh nghiệm
  price: Number, // giá khám
  avatar: String,
  schedule: [
    {
      date: String,
      timeSlots: [String],
    },
  ],
});

module.exports = mongoose.model("Doctor", doctorSchema);