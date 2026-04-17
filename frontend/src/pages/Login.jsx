import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/Login.css";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  try {
    const user = await login(email, password);

    // lưu userId
    localStorage.setItem("userId", user._id);

    user.role === "Admin" ? navigate("/admin") : navigate("/");
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>

        <div className="input-group">
          <label>Email</label>
          <input onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Mật khẩu</label>
          <input type="password" onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="forgot-password-link">
          <Link to="/forgot-password">Quên mật khẩu?</Link>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Đăng nhập
        </button>

        {/* Google login */}
        <div className="google-login">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="google"
            onClick={() => loginWithGoogle()}
          />
          <span>Đăng nhập bằng Google</span>
        </div>
      </div>
    </div>
  );
};

export default Login;