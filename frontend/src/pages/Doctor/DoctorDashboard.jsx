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

  // ---- Modal state ----
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState([{ name: "", dosage: "", instructions: "" }]);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  // ---- Modal handlers ----
  const openModal = (conv) => {
    setSelectedAppt(conv);
    setDiagnosis("");
    setPrescription([{ name: "", dosage: "", instructions: "" }]);
    setDoctorNotes("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppt(null);
  };

  const addPrescriptionRow = () => {
    setPrescription([...prescription, { name: "", dosage: "", instructions: "" }]);
  };

  const removePrescriptionRow = (index) => {
    if (prescription.length <= 1) return;
    setPrescription(prescription.filter((_, i) => i !== index));
  };

  const updatePrescription = (index, field, value) => {
    const updated = [...prescription];
    updated[index][field] = value;
    setPrescription(updated);
  };

  const handleSubmitComplete = async () => {
    if (!diagnosis.trim()) {
      alert("Vui lòng nhập chuẩn đoán bệnh!");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      // Lọc bỏ các dòng thuốc trống
      const filteredPrescription = prescription.filter(p => p.name.trim());

      const res = await fetch(`${API}/medical-records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId: selectedAppt.appointmentId,
          diagnosis: diagnosis.trim(),
          prescription: filteredPrescription,
          doctorNotes: doctorNotes.trim(),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Đã hoàn thành khám bệnh!");
        closeModal();
        fetchConversations(); // Refresh data
      } else {
        alert(result.message || "Lỗi khi cập nhật");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi hệ thống");
    }
    setSubmitting(false);
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
                  <td className="appt-actions">
                    <button
                      className="chat-btn"
                      onClick={() => navigate(`/doctor/messages?appt=${c.appointmentId}`)}
                    >
                      💬 Nhắn tin
                    </button>
                    {c.status !== "Completed" && c.status !== "Cancelled" && (
                      <button
                        className="complete-exam-btn"
                        onClick={() => openModal(c)}
                      >
                        📝 Khám xong
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== MODAL KHÁM BỆNH ===== */}
      {showModal && (
        <div className="exam-modal-overlay" onClick={closeModal}>
          <div className="exam-modal" onClick={(e) => e.stopPropagation()}>
            <div className="exam-modal-header">
              <div className="exam-modal-title">
                <span className="exam-modal-icon">🩺</span>
                <div>
                  <h3>Hồ sơ bệnh án</h3>
                  <p>Bệnh nhân: <strong>{selectedAppt?.patient?.username}</strong> — {formatDate(selectedAppt?.date)} lúc {selectedAppt?.time}</p>
                </div>
              </div>
              <button className="exam-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="exam-modal-body">
              {/* Chuẩn đoán */}
              <div className="exam-field">
                <label className="exam-label">
                  <span className="exam-label-icon">📋</span> Chuẩn đoán bệnh <span className="required">*</span>
                </label>
                <textarea
                  className="exam-textarea"
                  placeholder="Nhập chuẩn đoán bệnh..."
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Kê đơn thuốc */}
              <div className="exam-field">
                <label className="exam-label">
                  <span className="exam-label-icon">💊</span> Đơn thuốc
                </label>
                <div className="prescription-list">
                  {prescription.map((p, i) => (
                    <div className="prescription-row" key={i}>
                      <span className="prescription-num">{i + 1}</span>
                      <input
                        type="text"
                        placeholder="Tên thuốc"
                        value={p.name}
                        onChange={(e) => updatePrescription(i, "name", e.target.value)}
                        className="prescription-input name"
                      />
                      <input
                        type="text"
                        placeholder="Liều lượng"
                        value={p.dosage}
                        onChange={(e) => updatePrescription(i, "dosage", e.target.value)}
                        className="prescription-input dosage"
                      />
                      <input
                        type="text"
                        placeholder="Cách dùng"
                        value={p.instructions}
                        onChange={(e) => updatePrescription(i, "instructions", e.target.value)}
                        className="prescription-input instructions"
                      />
                      <button
                        className="prescription-remove"
                        onClick={() => removePrescriptionRow(i)}
                        disabled={prescription.length <= 1}
                        title="Xóa dòng"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button className="prescription-add" onClick={addPrescriptionRow}>
                  ＋ Thêm thuốc
                </button>
              </div>

              {/* Lời dặn */}
              <div className="exam-field">
                <label className="exam-label">
                  <span className="exam-label-icon">📝</span> Lời dặn
                </label>
                <textarea
                  className="exam-textarea"
                  placeholder="Nhập lời dặn cho bệnh nhân..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="exam-modal-footer">
              <button className="exam-cancel-btn" onClick={closeModal} disabled={submitting}>
                Hủy
              </button>
              <button
                className="exam-submit-btn"
                onClick={handleSubmitComplete}
                disabled={submitting}
              >
                {submitting ? "Đang lưu..." : "✅ Hoàn thành khám"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
