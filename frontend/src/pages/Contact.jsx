import { useState } from "react";
import "../styles/info-pages.css";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE_DEFAULT}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "Cảm ơn bạn! Tin nhắn đã được gửi thành công." });
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus({ type: "error", message: data.message || "Có lỗi xảy ra, vui lòng thử lại." });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatus({ type: "error", message: "Không thể kết nối đến máy chủ." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="info-page">
      {/* HERO */}
      <section className="page-hero">
        <h1>Liên hệ</h1>
        <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn</p>
      </section>

      {/* CONTACT CONTENT */}
      <section className="info-section">
        <div className="contact-grid">

          {/* Left: Contact Info */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>
              Thông tin liên hệ
            </h2>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="ci-icon">📍</div>
                <div>
                  <h4>Địa chỉ</h4>
                  <p>371 Điện Biên Phủ, Phường 4, Quận 3, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="ci-icon">📞</div>
                <div>
                  <h4>Hotline</h4>
                  <p>1900-xxxx (24/7)</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="ci-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>info@cfil.vn</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="ci-icon">🕐</div>
                <div>
                  <h4>Giờ làm việc</h4>
                  <p>Thứ 2 – Thứ 7: 7:30 – 16:30</p>
                  <p>Cấp cứu: 24/7</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="ci-icon">🚑</div>
                <div>
                  <h4>Cấp cứu</h4>
                  <p style={{ color: '#ef4444', fontWeight: '700', fontSize: '1.1rem' }}>115</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>
              Gửi tin nhắn
            </h2>

            <form className="contact-form" onSubmit={handleSubmit}>
              {status.message && (
                <div className={`status-message ${status.type}`} style={{
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: status.type === 'success' ? '#166534' : '#991b1b',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  {status.message}
                </div>
              )}
              <input
                name="name"
                placeholder="Họ và tên"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                name="phone"
                type="tel"
                placeholder="Số điện thoại"
                value={form.phone}
                onChange={handleChange}
                disabled={loading}
              />
              <input
                name="subject"
                placeholder="Chủ đề"
                value={form.subject}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <textarea
                name="message"
                placeholder="Nội dung tin nhắn..."
                value={form.message}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? "⌛ Đang gửi..." : "📨 Gửi tin nhắn"}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* MAP */}
      <section className="info-section alt-bg">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Bản đồ</h2>
            <p>Tìm đường đến bệnh viện CFil</p>
          </div>
          <div style={{
            width: '100%',
            height: '400px',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <iframe
              title="Bệnh Viện CFil"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3187!2d106.6867!3d10.7875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ3JzE1LjAiTiAxMDbCsDQxJzEyLjEiRQ!5e0!3m2!1svi!2svn!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
