const Recruitment = require("../models/Recruitment");
const path = require("path");
const fs = require("fs");

// @desc    Submit a recruitment application
// @route   POST /api/recruitments
// @access  Public
exports.submitApplication = async (req, res) => {
  try {
    const { fullName, email, phone, position, coverLetter } = req.body;

    if (!fullName || !email || !phone || !position) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin bắt buộc." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng tải lên file CV (PDF)." });
    }

    const newApplication = await Recruitment.create({
      fullName,
      email,
      phone,
      position,
      coverLetter,
      cvFilePath: req.file.path.replace(/\\/g, "/"),
    });

    res.status(201).json({
      success: true,
      message: "Đơn ứng tuyển đã được gửi thành công!",
      data: newApplication,
    });
  } catch (error) {
    console.error("Submit Application Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau." });
  }
};

// @desc    Get all recruitment applications (Admin)
// @route   GET /api/recruitments
// @access  Private
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Recruitment.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error("Get Applications Error:", error);
    res.status(500).json({ message: "Lỗi khi tải danh sách đơn ứng tuyển." });
  }
};

// @desc    Update application status (Admin)
// @route   PUT /api/recruitments/:id
// @access  Private
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Recruitment.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Không tìm thấy đơn ứng tuyển." });
    }

    if (status) application.status = status;

    const updated = await application.save();

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Update Application Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

// @desc    Delete application (Admin)
// @route   DELETE /api/recruitments/:id
// @access  Private
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Recruitment.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Không tìm thấy đơn ứng tuyển." });
    }

    // Delete the CV file
    const filePath = path.resolve(application.cvFilePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Recruitment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Đã xóa đơn ứng tuyển." });
  } catch (error) {
    console.error("Delete Application Error:", error);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};
