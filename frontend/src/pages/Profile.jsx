import { useAuth } from "../hooks/useAuth";
import "../styles/profile.css";
import avatar from "../../asset/avatar.webp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    gender: "Khác",
    dob: "",
    address: ""
  });

  const navigate = useNavigate();

  // 🔥 LOAD USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_DEFAULT}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
        setForm({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "Khác",
          dob: data.dob || "",
          address: data.address || ""
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, [navigate]);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 SAVE PROFILE
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_DEFAULT}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      setUser(data);
      setIsEdit(false);

      alert("Cập nhật thành công!");

    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return <h2>Đang tải...</h2>;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        
        {/* LEFT COLUMN: USER INFO CARD */}
        <div className="profile-card">
          <div className="profile-header">
            <img src={avatar} alt="avatar" />
            <h2>{user.username}</h2>
            <p>Bệnh nhân</p>
          </div>

          <div className="profile-info">
            <div className="info-row">
              <label>Họ và tên</label>
              {isEdit ? (
                <input name="username" value={form.username} onChange={handleChange} />
              ) : (
                <span>{user.username}</span>
              )}
            </div>

            <div className="info-row">
              <label>Email</label>
              {isEdit ? (
                <input name="email" value={form.email} onChange={handleChange} />
              ) : (
                <span>{user.email}</span>
              )}
            </div>

            <div className="info-row">
              <label>Giới tính</label>
              {isEdit ? (
                <select 
                  name="gender" 
                  value={form.gender} 
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f8fafc', outline: 'none' }}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              ) : (
                <span>{user.gender || "Chưa cập nhật"}</span>
              )}
            </div>

            <div className="info-row">
              <label>Ngày sinh</label>
              {isEdit ? (
                <input type="date" name="dob" value={form.dob} onChange={handleChange} />
              ) : (
                <span>{user.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : "Chưa cập nhật"}</span>
              )}
            </div>

            <div className="info-row">
              <label>Số điện thoại</label>
              {isEdit ? (
                <input name="phone" value={form.phone} onChange={handleChange} />
              ) : (
                <span>{user.phone || "Chưa cập nhật"}</span>
              )}
            </div>

            <div className="info-row">
              <label>Địa chỉ</label>
              {isEdit ? (
                <input name="address" value={form.address} onChange={handleChange} placeholder="Nhập địa chỉ..." />
              ) : (
                <span>{user.address || "Chưa cập nhật"}</span>
              )}
            </div>
          </div>

          <div className="profile-actions">
            {isEdit ? (
              <div className="edit-actions-container">
                <button className="save-btn" onClick={handleSave}>
                  Lưu thay đổi
                </button>
                <button className="cancel-btn" onClick={() => setIsEdit(false)}>
                  Hủy bỏ
                </button>
              </div>
            ) : (
              <>
                <button className="edit-btn" onClick={() => setIsEdit(true)}>
                  Chỉnh sửa thông tin
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVITY TABS/CONTENT */}
        <div className="profile-content">
          <div className="content-section">
            <h3 className="section-title">
              <div className="section-icon">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v8.616l-208 119.5-208-119.5V112h416zM48 400V181.7l196.2 112.7c3.6 2.1 7.7 3.1 11.8 3.1s8.2-1 11.8-3.1L464 181.7V400H48z"></path></svg>
              </div>
              Lịch sử liên hệ & Tư vấn
            </h3>
            <ContactHistory />
          </div>
          
          {/* Add more sections here later if needed, e.g., Appointment History */}
        </div>

      </div>
    </div>
  );
}

function ContactHistory() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_DEFAULT}/contacts/my-messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
      Đang tải dữ liệu...
    </div>
  );

  if (messages.length === 0) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
      Bạn chưa gửi tin nhắn liên hệ nào.
    </div>
  );

  return (
    <div className="contact-history-list">
      {messages.map((msg) => (
        <div key={msg._id} className="history-item">
          <div className="history-header">
            <div>
              <h4 className="history-subject">{msg.subject}</h4>
              <div className="history-date">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"></path></svg>
                {new Date(msg.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
            {msg.status === 'replied' ? (
              <span className="status-badge replied">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628 0z"></path></svg>
                Đã trả lời
              </span>
            ) : (
              <span className="status-badge pending">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm108.666 300.957a12.001 12.001 0 0 1-17.702-1.391L264 200.7V344c0 6.627-5.373 12-12 12h-40c-6.627 0-12-5.373-12-12V168c0-8.948 9.548-14.654 17.433-10.126l151.625 116.03a12.001 12.001 0 0 1 4.392 16.892l-8.784 18.161z"></path></svg>
                Chờ phản hồi
              </span>
            )}
          </div>
          
          <div className="history-message">
            {msg.message}
          </div>
          
          {msg.replyMessage && (
            <div className="reply-box">
              <div className="reply-header">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"></path></svg>
                Phản hồi từ Bác sĩ
              </div>
              <p className="reply-content">{msg.replyMessage}</p>
              <div className="reply-date">
                {new Date(msg.repliedAt).toLocaleString('vi-VN')}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}