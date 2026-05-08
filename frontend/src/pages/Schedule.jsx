import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/schedule.css";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function Schedule() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`${API_BASE_DEFAULT}/appointments/user/${userId}`)
      .then(res => res.json())
      .then(data => setAppointments(data))
      .catch(err => console.log(err));
  }, []);

  const handlePay = (item) => {
    localStorage.setItem("appointmentId", item._id);
    localStorage.setItem("appointmentPrice", item.price);
    navigate("/payment");
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch khám này?")) return;
    
    try {
      const res = await fetch(`${API_BASE_DEFAULT}/appointments/${id}/cancel`, {
        method: "PUT",
      });
      
      if (res.ok) {
        setAppointments(appointments.map(item => 
          item._id === id ? { ...item, status: "Cancelled" } : item
        ));
        alert("Đã hủy lịch thành công");
      } else {
        alert("Lỗi khi hủy lịch");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi hệ thống");
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "unpaid": return "Chưa thanh toán";
      case "paid": return "Đã thanh toán";
      case "failed": return "Thanh toán lỗi";
      default: return status;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "Pending": return "Chờ xác nhận";
      case "Confirmed": return "Đã xác nhận";
      case "Completed": return "Hoàn thành";
      case "Cancelled": return "Đã hủy";
      default: return status;
    }
  };

  return (
    <div className="schedule-container">
      <h1>📅 Lịch khám của bạn</h1>

      {appointments.length === 0 ? (
        <p className="no-data">Không có lịch khám</p>
      ) : (
        <div className="schedule-grid">
          {appointments.map((item) => (
            <div className="schedule-card" key={item._id}>
              <h3>👤 {item.fullName}</h3>
              <p><b>Bệnh viện:</b> {item.hospital}</p>
              <p><b>Dịch vụ:</b> {item.service} - <b>{Number(item.price).toLocaleString()}đ</b></p>
              <p><b>Bác sĩ:</b> {item.doctorId?.name || "Chưa cập nhật"}</p>
              <p><b>Ngày khám:</b> {new Date(item.date).toLocaleDateString('vi-VN')}</p>
              <p><b>Khung giờ:</b> {item.time}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                <span className={`status ${item.status?.toLowerCase()}`}>
                  {getStatusLabel(item.status)}
                </span>
                
                <span className={`status-payment ${item.paymentStatus}`}>
                  {getStatusText(item.paymentStatus)}
                </span>
              </div>

              <div className="action-buttons">
                {item.paymentStatus === "unpaid" && item.status !== "Cancelled" && (
                  <button className="pay-btn" onClick={() => handlePay(item)}>
                    Thanh toán ngay
                  </button>
                )}
                {item.status === "Completed" && (
                  <button className="view-record-btn" onClick={() => navigate("/medical-records")}>
                    🩺 Xem hồ sơ bệnh án
                  </button>
                )}
                {item.status !== "Cancelled" && item.status !== "Completed" && (
                  <button className="cancel-btn" onClick={() => handleCancel(item._id)}>
                    Hủy lịch
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}