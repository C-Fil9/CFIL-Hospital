import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/mnappointment.css";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function AdminAppointments() {

  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_DEFAULT}/appointments`
      );
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const cancelAppointment = async (id) => {
    const confirmCancel = window.confirm("Bạn có chắc muốn huỷ lịch này?");
    if (!confirmCancel) return;

    try {
      await axios.put(
        `${API_BASE_DEFAULT}/appointments/${id}/cancel`
      );
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="appointment-container">

        <h2 className="appointment-title">
          Quản lý lịch khám
        </h2>

        <table className="appointment-table">

          <thead>
            <tr>
              <th>Bệnh nhân</th>
              <th>Bác sĩ</th>
              <th>Ngày</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>

            {appointments.map((a) => (

              <tr key={a._id}>

                <td>{a.fullName}</td>

                <td>{a.doctorId?.name}</td>

                <td>{a.date}</td>

                <td
                  className={
                    a.paymentStatus === "paid"
                      ? "status-paid"
                      : "status-pending"
                  }
                >
                  {a.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                </td>

                <td
                  className={
                    a.status === "Cancelled"
                      ? "status-cancel"
                      : "status-active"
                  }
                >
                  {a.status}
                </td>

                <td>

                  <button
                    className="cancel-btn"
                    onClick={() => cancelAppointment(a._id)}
                    disabled={a.status === "Cancelled"}
                  >
                    Hủy
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </>
  );
}