import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    date: "",
    role: "user",
  });

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_BASE_DEFAULT}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      alert("Đăng ký thành công!");
      navigate("/login");
    } catch {
      alert("Không kết nối được server");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Tạo tài khoản</h2>

        <input
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="row">
          <input
            type="tel"
            placeholder="Phone"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            type="date"
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <button onClick={handleRegister}>Đăng ký</button>

        <p>
          Đã có tài khoản?
          <span onClick={() => navigate("/login")}> Đăng nhập</span>
        </p>
      </div>
    </div>
  );
};

export default Register;