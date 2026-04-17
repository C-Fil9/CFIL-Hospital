const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const recruitmentController = require("../controllers/recruitmentController");

// Multer config — save PDF to uploads/cv/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cv/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận file PDF."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Public: submit application with CV upload
router.post("/", upload.single("cvFile"), recruitmentController.submitApplication);

// Admin: get all applications
router.get("/", recruitmentController.getAllApplications);

// Admin: update status
router.put("/:id", recruitmentController.updateApplicationStatus);

// Admin: delete application
router.delete("/:id", recruitmentController.deleteApplication);

module.exports = router;
