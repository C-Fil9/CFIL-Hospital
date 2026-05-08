import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "../../styles/medical-records.css";

const API = import.meta.env.VITE_API_BASE_DEFAULT;

export default function DoctorMedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/medical-records/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("vi-VN") : "—";

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mr-page doctor-mr-page">
      <div className="mr-page-header">
        <h1>📋 Hồ sơ bệnh án đã tạo</h1>
        <p>Danh sách hồ sơ bệnh án bạn đã tạo cho bệnh nhân</p>
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
          <p>Hồ sơ sẽ xuất hiện sau khi bạn hoàn thành khám cho bệnh nhân.</p>
        </div>
      ) : (
        <div className="mr-list">
          {records.map((record) => {
            const isExpanded = expandedId === record._id;
            const appt = record.appointmentId;
            const patient = record.userId;

            return (
              <div
                className={`mr-card ${isExpanded ? "expanded" : ""}`}
                key={record._id}
              >
                <div className="mr-card-header" onClick={() => toggleExpand(record._id)}>
                  <div className="mr-card-left">
                    <div className="mr-card-icon">🩺</div>
                    <div className="mr-card-summary">
                      <h3>{record.diagnosis}</h3>
                      <div className="mr-card-meta">
                        <span>👤 {patient?.username || appt?.fullName || "—"}</span>
                        <span className="mr-meta-dot">·</span>
                        <span>📧 {patient?.email || "—"}</span>
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

                {isExpanded && (
                  <div className="mr-card-body">
                    <div className="mr-info-row">
                      <div className="mr-info-item">
                        <span className="mr-info-label">Bệnh nhân</span>
                        <span className="mr-info-value">{appt?.fullName || patient?.username || "—"}</span>
                      </div>
                      <div className="mr-info-item">
                        <span className="mr-info-label">SĐT</span>
                        <span className="mr-info-value">{appt?.phone || patient?.phone || "—"}</span>
                      </div>
                      <div className="mr-info-item">
                        <span className="mr-info-label">Dịch vụ</span>
                        <span className="mr-info-value">{appt?.service || "—"}</span>
                      </div>
                    </div>

                    <div className="mr-section">
                      <div className="mr-section-label">📋 Chuẩn đoán</div>
                      <div className="mr-section-content diagnosis">
                        {record.diagnosis}
                      </div>
                    </div>

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

                    {record.doctorNotes && (
                      <div className="mr-section">
                        <div className="mr-section-label">📝 Lời dặn</div>
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
