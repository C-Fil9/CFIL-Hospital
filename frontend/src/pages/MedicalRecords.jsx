import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/medical-records.css";

const API = import.meta.env.VITE_API_BASE_DEFAULT;

export default function MedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    fetch(`${API}/medical-records/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRecords(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("vi-VN") : "—";

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!user) return null;

  return (
    <div className="mr-page">
      <div className="mr-page-header">
        <h1>🩺 Hồ sơ bệnh án</h1>
        <p>Xem lại kết quả khám bệnh và đơn thuốc từ bác sĩ</p>
      </div>

      {loading ? (
        <div className="mr-loading">
          <div className="mr-spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="mr-empty">
          <div className="mr-empty-icon">📋</div>
          <h3>Chưa có hồ sơ bệnh án</h3>
          <p>Hồ sơ sẽ xuất hiện sau khi bác sĩ hoàn thành khám cho bạn.</p>
        </div>
      ) : (
        <div className="mr-list">
          {records.map((record) => {
            const isExpanded = expandedId === record._id;
            const appt = record.appointmentId;

            return (
              <div
                className={`mr-card ${isExpanded ? "expanded" : ""}`}
                key={record._id}
              >
                {/* Card Header — clickable */}
                <div className="mr-card-header" onClick={() => toggleExpand(record._id)}>
                  <div className="mr-card-left">
                    <div className="mr-card-icon">🩺</div>
                    <div className="mr-card-summary">
                      <h3>{record.diagnosis}</h3>
                      <div className="mr-card-meta">
                        <span>👨‍⚕️ BS. {record.doctorId?.name || "—"}</span>
                        <span className="mr-meta-dot">·</span>
                        <span>🏥 {record.doctorId?.hospital || "—"}</span>
                        <span className="mr-meta-dot">·</span>
                        <span>📅 {formatDate(appt?.date)}</span>
                        <span className="mr-meta-dot">·</span>
                        <span>⏰ {appt?.time || "—"}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`mr-card-arrow ${isExpanded ? "open" : ""}`}>
                    ▾
                  </div>
                </div>

                {/* Card Body — expandable */}
                {isExpanded && (
                  <div className="mr-card-body">
                    {/* Thông tin lịch hẹn */}
                    <div className="mr-info-row">
                      <div className="mr-info-item">
                        <span className="mr-info-label">Bệnh nhân</span>
                        <span className="mr-info-value">{appt?.fullName || "—"}</span>
                      </div>
                      <div className="mr-info-item">
                        <span className="mr-info-label">Dịch vụ</span>
                        <span className="mr-info-value">{appt?.service || "—"}</span>
                      </div>
                      <div className="mr-info-item">
                        <span className="mr-info-label">Chuyên khoa</span>
                        <span className="mr-info-value">{record.doctorId?.specialty || "—"}</span>
                      </div>
                    </div>

                    {/* Chuẩn đoán */}
                    <div className="mr-section">
                      <div className="mr-section-label">📋 Chuẩn đoán</div>
                      <div className="mr-section-content diagnosis">
                        {record.diagnosis}
                      </div>
                    </div>

                    {/* Đơn thuốc */}
                    {record.prescription && record.prescription.length > 0 && (
                      <div className="mr-section">
                        <div className="mr-section-label">💊 Đơn thuốc</div>
                        <table className="mr-prescription-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Tên thuốc</th>
                              <th>Liều lượng</th>
                              <th>Cách dùng</th>
                            </tr>
                          </thead>
                          <tbody>
                            {record.prescription.map((med, idx) => (
                              <tr key={idx}>
                                <td className="med-num">{idx + 1}</td>
                                <td className="med-name">{med.name}</td>
                                <td>{med.dosage}</td>
                                <td>{med.instructions}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Lời dặn */}
                    {record.doctorNotes && (
                      <div className="mr-section">
                        <div className="mr-section-label">📝 Lời dặn của bác sĩ</div>
                        <div className="mr-section-content notes">
                          {record.doctorNotes}
                        </div>
                      </div>
                    )}

                    <div className="mr-timestamp">
                      Ngày tạo: {formatDate(record.createdAt)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
