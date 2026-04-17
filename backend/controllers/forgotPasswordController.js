const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

// Gửi OTP về email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Vui lòng nhập email" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại trong hệ thống" });
    }

    // Tạo OTP 6 chữ số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP vào DB, hết hạn sau 5 phút
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    // Gửi email với OTP
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">🏥 HTKB System</h1>
          <p style="color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px;">Khôi phục mật khẩu</p>
        </div>
        <div style="padding: 32px 24px;">
          <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
            Xin chào <strong>${user.username || "bạn"}</strong>,
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP bên dưới:
          </p>
          <div style="background: linear-gradient(135deg, #f0fdfa, #ccfbf1); border: 2px dashed #0d9488; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f766e;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0 0 8px;">
            ⏰ Mã OTP có hiệu lực trong <strong>5 phút</strong>.
          </p>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; margin: 0;">
            🔒 Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </p>
        </div>
        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 HTKB System. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendEmail(
      email,
      "Mã xác thực đặt lại mật khẩu - HTKB System",
      `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 5 phút.`,
      htmlContent
    );

    res.json({ message: "Mã OTP đã được gửi về email của bạn" });

  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" });
  }
};

// Xác thực OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    res.json({ message: "Xác thực OTP thành công" });

  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Đặt lại mật khẩu mới
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetOtp: otp,
      resetOtpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: "Mã OTP không hợp lệ hoặc đã hết hạn" });
    }

    // Cập nhật mật khẩu (lưu plain text như hiện tại trong hệ thống)
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    // Gửi email thông báo đổi mật khẩu thành công
    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #0d9488, #0f766e); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">🏥 HTKB System</h1>
        </div>
        <div style="padding: 32px 24px; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
          <h2 style="color: #0f766e; margin: 0 0 12px; font-size: 18px;">Đổi mật khẩu thành công!</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Mật khẩu tài khoản <strong>${email}</strong> đã được cập nhật thành công.
          </p>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 16px;">
            Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ với chúng tôi ngay.
          </p>
        </div>
        <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 HTKB System. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendEmail(
      email,
      "Mật khẩu đã được thay đổi - HTKB System",
      "Mật khẩu tài khoản của bạn đã được thay đổi thành công.",
      htmlContent
    );

    res.json({ message: "Đặt lại mật khẩu thành công" });

  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
