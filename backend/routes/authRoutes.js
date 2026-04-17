const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { login } = require("../controllers/authController");

const router = express.Router();

/* REGISTER */
const sendEmail = require("../utils/sendEmail");

router.post("/register", async (req, res) => {

  console.log("REQ BODY:", req.body);

  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = new User({
      username,
      email,
      password,
      phone: req.body.phone,
      date: req.body.date,
      role: role || "user",
    });

    await user.save();

    // gửi mail
    await sendEmail(
      email,
      "Đăng ký tài khoản thành công",
      `
  Xin chào ${username},

  Bạn đã đăng ký tài khoản thành công.

  Email: ${email}
  Mật khẩu: ${password}

  Vui lòng giữ thông tin này cẩn thận.
  `
    );

    res.status(201).json({ message: "Register success" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* LOGIN */
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     if (!user)
//       return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Wrong password" });

//     res.json({
//       message: "Login success",
//       user: {
//         id: user._id,
//         username: user.username,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

router.post("/login", login);

/* FORGOT PASSWORD */
const { forgotPassword, verifyOtp, resetPassword } = require("../controllers/forgotPasswordController");

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;