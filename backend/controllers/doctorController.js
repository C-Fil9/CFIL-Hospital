const Doctor = require("../models/Doctor");

// lấy tất cả bác sĩ
exports.getDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  res.json(doctors);
};

// thêm bác sĩ
exports.createDoctor = async (req, res) => {
  try {

    const doctor = new Doctor(req.body);
    await doctor.save();

    res.json({
      message: "Doctor created",
      doctor
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// cập nhật
exports.updateDoctor = async (req, res) => {

  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(doctor);
};

// xóa
exports.deleteDoctor = async (req, res) => {

  await Doctor.findByIdAndDelete(req.params.id);

  res.json({
    message: "Doctor deleted"
  });
};