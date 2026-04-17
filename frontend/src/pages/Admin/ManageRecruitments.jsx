import React, { useState, useEffect, useMemo } from "react";
import {
  FaBriefcase,
  FaDownload,
  FaTrash,
  FaEye,
  FaTimes,
  FaSearch,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function ManageRecruitments() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // CV modal
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [cvModalUrl, setCvModalUrl] = useState("");
  const [cvModalName, setCvModalName] = useState("");

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE_DEFAULT}/recruitments`);
      const data = await res.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`${API_BASE_DEFAULT}/recruitments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đơn ứng tuyển này?")) return;
    try {
      const res = await fetch(`${API_BASE_DEFAULT}/recruitments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const openCvModal = (app) => {
    setCvModalUrl(`${API_BASE_DEFAULT}/${app.cvFilePath}`);
    setCvModalName(app.fullName);
    setCvModalOpen(true);
  };

  const closeCvModal = () => {
    setCvModalOpen(false);
    setCvModalUrl("");
    setCvModalName("");
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return "Chờ xử lý";
      case "reviewed": return "Đã xem";
      case "accepted": return "Chấp nhận";
      case "rejected": return "Từ chối";
      default: return status;
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Stats
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const accepted = applications.filter((a) => a.status === "accepted").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;
    return { total, pending, accepted, rejected };
  }, [applications]);

  // Filtered list
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchSearch =
        app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "all" || app.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  return (
    <>
      <h1 className="title" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <FaBriefcase style={{ color: "#0d9488" }} />
        Quản lý tuyển dụng
      </h1>

      {/* Stats Cards */}
      <div className="recruit-stats">
        <div className="recruit-stat-card stat-total">
          <div className="stat-icon-wrap"><FaClipboardList /></div>
          <div><p className="stat-number">{stats.total}</p><p className="stat-label">Tổng đơn</p></div>
        </div>
        <div className="recruit-stat-card stat-pending">
          <div className="stat-icon-wrap"><FaClock /></div>
          <div><p className="stat-number">{stats.pending}</p><p className="stat-label">Chờ xử lý</p></div>
        </div>
        <div className="recruit-stat-card stat-accepted">
          <div className="stat-icon-wrap"><FaCheckCircle /></div>
          <div><p className="stat-number">{stats.accepted}</p><p className="stat-label">Chấp nhận</p></div>
        </div>
        <div className="recruit-stat-card stat-rejected">
          <div className="stat-icon-wrap"><FaTimesCircle /></div>
          <div><p className="stat-number">{stats.rejected}</p><p className="stat-label">Từ chối</p></div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="recruit-toolbar">
        <div className="recruit-search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, vị trí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="recruit-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="reviewed">Đã xem</option>
          <option value="accepted">Chấp nhận</option>
          <option value="rejected">Từ chối</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-box" style={{ marginTop: "0" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Đang tải dữ liệu...</p>
        ) : filteredApps.length === 0 ? (
          <p style={{ color: "#64748b", textAlign: "center", padding: "40px" }}>
            {applications.length === 0 ? "Chưa có đơn ứng tuyển nào." : "Không tìm thấy kết quả phù hợp."}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Ứng viên</th>
                <th>Vị trí</th>
                <th>Ngày nộp</th>
                <th>CV</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app._id} className="recruit-row">
                  <td>
                    <strong style={{ color: "#1e293b" }}>{app.fullName}</strong><br />
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{app.email}</span><br />
                    <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>{app.phone}</span>
                  </td>
                  <td>
                    <span className="position-badge">{app.position}</span>
                  </td>
                  <td style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    {formatDate(app.createdAt)}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="btn-cv btn-view-cv"
                        onClick={() => openCvModal(app)}
                        title="Xem CV"
                      >
                        <FaEye /> Xem
                      </button>
                      <a
                        href={`${API_BASE_DEFAULT}/${app.cvFilePath}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-cv btn-download-cv"
                        title="Tải CV"
                      >
                        <FaDownload /> Tải
                      </a>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${app.status}`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        disabled={updatingId === app._id}
                        className="recruit-status-select"
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="reviewed">Đã xem</option>
                        <option value="accepted">Chấp nhận</option>
                        <option value="rejected">Từ chối</option>
                      </select>
                      <button
                        onClick={() => handleDelete(app._id)}
                        className="btn-delete-app"
                      >
                        <FaTrash /> Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== CV VIEWER MODAL ===== */}
      {cvModalOpen && (
        <div className="cv-modal-overlay" onClick={closeCvModal}>
          <div className="cv-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="cv-modal-header">
              <h3>CV — {cvModalName}</h3>
              <div className="cv-modal-actions">
                <a
                  href={cvModalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-modal-download-btn"
                >
                  <FaDownload /> Tải xuống
                </a>
                <button className="cv-modal-close-btn" onClick={closeCvModal}>
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="cv-modal-body">
              <iframe
                src={cvModalUrl}
                title={`CV - ${cvModalName}`}
                className="cv-iframe"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ===== RECRUITMENT STATS ===== */
        .recruit-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }
        .recruit-stat-card {
          background: white;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .recruit-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        .stat-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }
        .stat-total .stat-icon-wrap { background: #ede9fe; color: #7c3aed; }
        .stat-pending .stat-icon-wrap { background: #fef3c7; color: #d97706; }
        .stat-accepted .stat-icon-wrap { background: #dcfce7; color: #16a34a; }
        .stat-rejected .stat-icon-wrap { background: #fee2e2; color: #dc2626; }
        .stat-number { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0; line-height: 1; }
        .stat-label { font-size: 0.82rem; color: #94a3b8; margin: 2px 0 0 0; }

        /* ===== TOOLBAR ===== */
        .recruit-toolbar {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          align-items: center;
        }
        .recruit-search-box {
          flex: 1;
          position: relative;
        }
        .recruit-search-box .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 14px;
        }
        .recruit-search-box input {
          width: 100%;
          padding: 10px 12px 10px 36px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          background: white;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .recruit-search-box input:focus {
          outline: none;
          border-color: #0d9488;
          box-shadow: 0 0 0 3px rgba(13,148,136,0.1);
        }
        .recruit-filter-select {
          padding: 10px 14px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.88rem;
          background: white;
          cursor: pointer;
          min-width: 170px;
          transition: border-color 0.2s;
        }
        .recruit-filter-select:focus {
          outline: none;
          border-color: #0d9488;
        }

        /* ===== TABLE ===== */
        .recruit-row:hover {
          background: #f8fafc;
        }
        .position-badge {
          background: #f0fdfa;
          color: #0d9488;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
        }

        /* ===== CV BUTTONS ===== */
        .btn-cv {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          text-decoration: none;
        }
        .btn-view-cv {
          background: #ede9fe;
          color: #7c3aed;
        }
        .btn-view-cv:hover {
          background: #ddd6fe;
          transform: translateY(-1px);
        }
        .btn-download-cv {
          background: #f0fdfa;
          color: #0d9488;
          border: 1px solid #ccfbf1;
        }
        .btn-download-cv:hover {
          background: #ccfbf1;
          transform: translateY(-1px);
        }

        /* ===== STATUS ===== */
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.78rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .status-badge.pending { background: #fef3c7; color: #92400e; }
        .status-badge.reviewed { background: #dbeafe; color: #1e40af; }
        .status-badge.accepted { background: #dcfce7; color: #166534; }
        .status-badge.rejected { background: #fee2e2; color: #991b1b; }

        .recruit-status-select {
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 0.8rem;
          cursor: pointer;
          background: white;
          transition: border-color 0.2s;
        }
        .recruit-status-select:focus {
          outline: none;
          border-color: #0d9488;
        }
        .btn-delete-app {
          padding: 6px 10px;
          border-radius: 8px;
          border: none;
          background: #fee2e2;
          color: #ef4444;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        .btn-delete-app:hover {
          background: #fecaca;
          transform: translateY(-1px);
        }

        /* ===== CV MODAL ===== */
        .cv-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .cv-modal-content {
          background: white;
          border-radius: 16px;
          width: 85vw;
          max-width: 1000px;
          height: 88vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 60px rgba(0,0,0,0.3);
          animation: slideUp 0.3s ease;
          overflow: hidden;
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .cv-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #f0fdfa, #ede9fe);
        }
        .cv-modal-header h3 {
          margin: 0;
          font-size: 1.05rem;
          color: #1e293b;
        }
        .cv-modal-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cv-modal-download-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: #0d9488;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          transition: background 0.2s;
        }
        .cv-modal-download-btn:hover {
          background: #0f766e;
        }
        .cv-modal-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: #fee2e2;
          color: #ef4444;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.2s;
        }
        .cv-modal-close-btn:hover {
          background: #fecaca;
          transform: scale(1.05);
        }
        .cv-modal-body {
          flex: 1;
          padding: 0;
          overflow: hidden;
        }
        .cv-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 900px) {
          .recruit-stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .recruit-toolbar {
            flex-direction: column;
          }
          .recruit-filter-select {
            width: 100%;
          }
          .cv-modal-content {
            width: 95vw;
            height: 90vh;
          }
        }
      `}</style>
    </>
  );
}