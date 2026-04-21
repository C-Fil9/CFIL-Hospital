import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../../styles/doctor-layout.css";

const API = import.meta.env.VITE_API_BASE_DEFAULT;

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/messages/conversations/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setConversations(data);

        // Tính toán stats
        const total = data.length;
        const pending = data.filter((c) => c.status === "Pending").length;
        const confirmed = data.filter((c) => c.status === "Confirmed").length;
        const completed = data.filter((c) => c.status === "Completed").length;
        setStats({ total, pending, confirmed, completed });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("vi-VN");
  };

  const statusLabel = {
    Pending: "Chờ xác nhận",
    Confirmed: "Đã xác nhận",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
  };

  return (
    <div className="doctor-dashboard">
      {/* Welcome Banner */}
      <div className="doctor-welcome-banner">
        <div className="welcome-icon">👨‍⚕️</div>
        <div>
          <h2>Xin chào, Bác sĩ {user?.username}!</h2>
          <p>Chào mừng bạn quay trở lại hệ thống quản lý &amp; nhắn tin bệnh nhân.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="doctor-stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📅</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Tổng lịch hẹn</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Chờ xác nhận</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <h3>{stats.confirmed}</h3>
            <p>Đã xác nhận</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🏁</div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Appointment table */}
      <div className="appointments-table-section">
        <div className="section-header">
          <h3>📋 Danh sách bệnh nhân đặt lịch</h3>
          <button className="view-all-btn" onClick={() => navigate("/doctor/messages")}>
            💬 Xem tin nhắn
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Đang tải dữ liệu...</div>
        ) : conversations.length === 0 ? (
          <div className="empty-state">
            <p>Chưa có bệnh nhân nào đặt lịch.</p>
          </div>
        ) : (
          <table className="appt-table">
            <thead>
              <tr>
                <th>Bệnh nhân</th>
                <th>Email</th>
                <th>Ngày khám</th>
                <th>Giờ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((c) => (
                <tr key={c.appointmentId}>
                  <td>
                    <strong>{c.patient?.username || "—"}</strong>
                  </td>
                  <td>{c.patient?.email || "—"}</td>
                  <td>{formatDate(c.date)}</td>
                  <td>{c.time}</td>
                  <td>
                    <span className={`status-badge ${c.status?.toLowerCase()}`}>
                      {statusLabel[c.status] || c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="chat-btn"
                      onClick={() => navigate(`/doctor/messages?appt=${c.appointmentId}`)}
                    >
                      💬 Nhắn tin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
