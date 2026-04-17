import React, { useState, useEffect } from "react";
import {
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaSearch,
  FaCheck,
  FaUndo,
  FaTrash,
  FaQrcode,
  FaStore,
  FaSpinner,
  FaInbox,
} from "react-icons/fa";
import "../../styles/mnpayment.css";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${API_BASE_DEFAULT}/payments/all`);
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    const label = status === "paid" ? "xác nhận thanh toán" : "hoàn tác về chờ thanh toán";
    if (!window.confirm(`Bạn có chắc muốn ${label} cho giao dịch này?`)) return;

    try {
      const res = await fetch(`${API_BASE_DEFAULT}/payments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchPayments();
      } else {
        alert("Cập nhật trạng thái thất bại!");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Lỗi server!");
    }
  };

  const deletePayment = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa giao dịch này?")) return;

    try {
      const res = await fetch(`${API_BASE_DEFAULT}/payments/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPayments();
      } else {
        alert("Xóa thất bại!");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      alert("Lỗi server!");
    }
  };

  // --- Statistics ---
  const totalPayments = payments.length;
  const paidPayments = payments.filter((p) => p.status === "paid").length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;
  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + (p.amount || 0), 0);
  const qrCount = payments.filter((p) => p.method === "qr").length;
  const counterCount = payments.filter((p) => p.method === "counter").length;

  // --- Filtering ---
  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      (p.userId?.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.userId?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.content || "").toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchMethod = filterMethod === "all" || p.method === filterMethod;

    return matchSearch && matchStatus && matchMethod;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return (amount || 0).toLocaleString("vi-VN") + " ₫";
  };

  return (
    <>
      <div className="payment-admin-container">
        {/* Header */}
        <div className="payment-admin-header">
          <h2>
            <FaMoneyBillWave /> Quản lý thanh toán
          </h2>
        </div>

        {/* Stat Cards */}
        <div className="payment-stats">
          <div className="payment-stat-card">
            <div className="stat-icon total">
              <FaMoneyBillWave />
            </div>
            <div className="stat-info">
              <h3>{totalPayments}</h3>
              <p>Tổng giao dịch</p>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon paid">
              <FaCheckCircle />
            </div>
            <div className="stat-info">
              <h3>{paidPayments}</h3>
              <p>Đã thanh toán</p>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon pending-icon">
              <FaClock />
            </div>
            <div className="stat-info">
              <h3>{pendingPayments}</h3>
              <p>Chờ thanh toán</p>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon revenue">
              <FaChartLine />
            </div>
            <div className="stat-info">
              <h3>{formatCurrency(totalRevenue)}</h3>
              <p>Doanh thu</p>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon qr-icon">
              <FaQrcode />
            </div>
            <div className="stat-info">
              <h3>{qrCount}</h3>
              <p>QR Online</p>
            </div>
          </div>

          <div className="payment-stat-card">
            <div className="stat-icon counter-icon">
              <FaStore />
            </div>
            <div className="stat-info">
              <h3>{counterCount}</h3>
              <p>Tại quầy</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="payment-filter-bar">
          <input
            type="text"
            placeholder="🔍 Tìm theo tên, email, mã giao dịch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="paid">Đã thanh toán</option>
            <option value="pending">Chờ thanh toán</option>
          </select>
          <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)}>
            <option value="all">Tất cả phương thức</option>
            <option value="qr">QR Code</option>
            <option value="counter">Tại quầy</option>
          </select>
        </div>

        {/* Table */}
        <div className="payment-table-box">
          {loading ? (
            <div className="payment-loading">
              <FaSpinner className="fa-spin" />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="payment-empty">
              <FaInbox />
              <p>Không có giao dịch nào.</p>
            </div>
          ) : (
            <table className="payment-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Người dùng</th>
                  <th>Mã giao dịch</th>
                  <th>Số tiền</th>
                  <th>Phương thức</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p, index) => (
                  <tr key={p._id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className="user-cell">
                        <strong>{p.userId?.username || "N/A"}</strong>
                        <span>{p.userId?.email || ""}</span>
                      </div>
                    </td>
                    <td>
                      <span className="payment-content-code">{p.content}</span>
                    </td>
                    <td>
                      <span className="payment-amount">
                        {formatCurrency(p.amount)}
                      </span>
                    </td>
                    <td>
                      <span className={`method-badge ${p.method}`}>
                        {p.method === "qr" ? (
                          <><FaQrcode /> QR Code</>
                        ) : (
                          <><FaStore /> Tại quầy</>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className={`pay-status ${p.status}`}>
                        {p.status === "paid" ? (
                          <><FaCheckCircle /> Đã thanh toán</>
                        ) : (
                          <><FaClock /> Chờ thanh toán</>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className="payment-date">
                        {formatDate(p.createdAt)}
                      </span>
                    </td>
                    <td>
                      <div className="payment-actions">
                        {p.status === "pending" ? (
                          <button
                            className="pay-action-btn confirm"
                            title="Xác nhận đã thanh toán"
                            onClick={() => updateStatus(p._id, "paid")}
                          >
                            <FaCheck />
                          </button>
                        ) : (
                          <button
                            className="pay-action-btn revert"
                            title="Hoàn tác về chờ thanh toán"
                            onClick={() => updateStatus(p._id, "pending")}
                          >
                            <FaUndo />
                          </button>
                        )}
                        <button
                          className="pay-action-btn delete"
                          title="Xóa giao dịch"
                          onClick={() => deletePayment(p._id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
