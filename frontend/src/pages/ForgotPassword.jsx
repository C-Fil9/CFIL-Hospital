import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

const ForgotPassword = () => {
  const navigate = useNavigate();

  // Steps: 1 = nhập email, 2 = nhập OTP, 3 = mật khẩu mới
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const otpRefs = useRef([]);

  // Countdown timer cho resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Bước 1: Gửi OTP về email
  const handleSendOtp = async () => {
    if (!email) return setError("Vui lòng nhập email");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_DEFAULT}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setSuccess(data.message);
      setStep(2);
      setCountdown(300); // 5 phút
      setTimeout(() => otpRefs.current[0]?.focus(), 100);

    } catch {
      setError("Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý nhập OTP từng ô
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Tự động chuyển ô tiếp theo
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) return setError("Vui lòng nhập đầy đủ mã OTP");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_DEFAULT}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setSuccess("Xác thực thành công!");
      setStep(3);

    } catch {
      setError("Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  // Send OTP lại
  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError("");
    setOtp(["", "", "", "", "", ""]);

    try {
      const res = await fetch(`${API_BASE_DEFAULT}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setSuccess("Đã gửi lại mã OTP mới!");
      setCountdown(300);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);

    } catch {
      setError("Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: Đặt lại mật khẩu
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return setError("Vui lòng nhập đầy đủ");
    if (newPassword.length < 6) return setError("Mật khẩu phải có ít nhất 6 ký tự");
    if (newPassword !== confirmPassword) return setError("Mật khẩu xác nhận không khớp");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_DEFAULT}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join(""), newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setSuccess(data.message);
      setStep(4); // Success screen

    } catch {
      setError("Không kết nối được server");
    } finally {
      setLoading(false);
    }
  };

  // Format countdown
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="forgot-container">
      {/* Background decorations */}
      <div className="forgot-bg-orb forgot-bg-orb-1"></div>
      <div className="forgot-bg-orb forgot-bg-orb-2"></div>
      <div className="forgot-bg-orb forgot-bg-orb-3"></div>

      <div className="forgot-card">
        {/* Progress indicator */}
        <div className="forgot-progress">
          <div className={`forgot-progress-step ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}>
            <div className="forgot-progress-dot">{step > 1 ? "✓" : "1"}</div>
            <span>Email</span>
          </div>
          <div className={`forgot-progress-line ${step > 1 ? "active" : ""}`}></div>
          <div className={`forgot-progress-step ${step >= 2 ? "active" : ""} ${step > 2 ? "done" : ""}`}>
            <div className="forgot-progress-dot">{step > 2 ? "✓" : "2"}</div>
            <span>Xác thực</span>
          </div>
          <div className={`forgot-progress-line ${step > 2 ? "active" : ""}`}></div>
          <div className={`forgot-progress-step ${step >= 3 ? "active" : ""} ${step > 3 ? "done" : ""}`}>
            <div className="forgot-progress-dot">{step > 3 ? "✓" : "3"}</div>
            <span>Mật khẩu</span>
          </div>
        </div>

        {/* ====== STEP 1: EMAIL ====== */}
        {step === 1 && (
          <div className="forgot-step forgot-step-enter">
            <div className="forgot-icon">📧</div>
            <h2>Quên mật khẩu?</h2>
            <p className="forgot-desc">
              Nhập email đã đăng ký, chúng tôi sẽ gửi mã xác thực để khôi phục mật khẩu.
            </p>

            <div className="forgot-input-group">
              <label>Email</label>
              <div className="forgot-input-wrapper">
                <span className="forgot-input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                />
              </div>
            </div>

            {error && <div className="forgot-alert error">{error}</div>}

            <button
              className="forgot-btn primary"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? (
                <span className="forgot-spinner"></span>
              ) : (
                <>Gửi mã xác thực</>
              )}
            </button>

            <button className="forgot-btn link" onClick={() => navigate("/login")}>
              ← Quay lại đăng nhập
            </button>
          </div>
        )}

        {/* ====== STEP 2: OTP ====== */}
        {step === 2 && (
          <div className="forgot-step forgot-step-enter">
            <div className="forgot-icon">🔐</div>
            <h2>Nhập mã xác thực</h2>
            <p className="forgot-desc">
              Mã OTP 6 chữ số đã được gửi đến <strong>{email}</strong>
            </p>

            <div className="forgot-otp-container" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`forgot-otp-input ${digit ? "filled" : ""}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                />
              ))}
            </div>

            <div className="forgot-timer">
              {countdown > 0 ? (
                <span>⏰ Mã hết hạn sau <strong>{formatTime(countdown)}</strong></span>
              ) : (
                <span className="forgot-expired">⚠️ Mã đã hết hạn</span>
              )}
            </div>

            {error && <div className="forgot-alert error">{error}</div>}
            {success && <div className="forgot-alert success">{success}</div>}

            <button
              className="forgot-btn primary"
              onClick={handleVerifyOtp}
              disabled={loading || otp.join("").length < 6}
            >
              {loading ? <span className="forgot-spinner"></span> : "Xác nhận"}
            </button>

            <button
              className={`forgot-btn link ${countdown > 0 ? "disabled" : ""}`}
              onClick={handleResendOtp}
              disabled={countdown > 0}
            >
              {countdown > 0 ? `Gửi lại sau ${formatTime(countdown)}` : "Gửi lại mã OTP"}
            </button>
          </div>
        )}

        {/* ====== STEP 3: NEW PASSWORD ====== */}
        {step === 3 && (
          <div className="forgot-step forgot-step-enter">
            <div className="forgot-icon">🔑</div>
            <h2>Đặt mật khẩu mới</h2>
            <p className="forgot-desc">
              Tạo mật khẩu mới cho tài khoản <strong>{email}</strong>
            </p>

            <div className="forgot-input-group">
              <label>Mật khẩu mới</label>
              <div className="forgot-input-wrapper">
                <span className="forgot-input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 6 ký tự"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(""); }}
                />
                <button
                  type="button"
                  className="forgot-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="forgot-input-group">
              <label>Xác nhận mật khẩu</label>
              <div className="forgot-input-wrapper">
                <span className="forgot-input-icon">🔒</span>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                />
                <button
                  type="button"
                  className="forgot-eye-btn"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Password strength indicator */}
            {newPassword && (
              <div className="forgot-password-strength">
                <div className="forgot-strength-bar">
                  <div
                    className={`forgot-strength-fill ${
                      newPassword.length < 6
                        ? "weak"
                        : newPassword.length < 10
                        ? "medium"
                        : "strong"
                    }`}
                    style={{
                      width:
                        newPassword.length < 6
                          ? "33%"
                          : newPassword.length < 10
                          ? "66%"
                          : "100%",
                    }}
                  ></div>
                </div>
                <span
                  className={
                    newPassword.length < 6
                      ? "weak"
                      : newPassword.length < 10
                      ? "medium"
                      : "strong"
                  }
                >
                  {newPassword.length < 6
                    ? "Yếu"
                    : newPassword.length < 10
                    ? "Trung bình"
                    : "Mạnh"}
                </span>
              </div>
            )}

            {error && <div className="forgot-alert error">{error}</div>}

            <button
              className="forgot-btn primary"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? <span className="forgot-spinner"></span> : "Đặt lại mật khẩu"}
            </button>
          </div>
        )}

        {/* ====== STEP 4: SUCCESS ====== */}
        {step === 4 && (
          <div className="forgot-step forgot-step-enter">
            <div className="forgot-success-animation">
              <div className="forgot-success-circle">
                <svg viewBox="0 0 52 52">
                  <circle className="forgot-success-circle-bg" cx="26" cy="26" r="25" />
                  <path className="forgot-success-check" d="M14 27l7 7 16-16" />
                </svg>
              </div>
            </div>
            <h2 className="forgot-success-title">Thành công!</h2>
            <p className="forgot-desc">
              Mật khẩu của bạn đã được thay đổi thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
            </p>

            <button
              className="forgot-btn primary"
              onClick={() => navigate("/login")}
            >
              Đăng nhập ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
