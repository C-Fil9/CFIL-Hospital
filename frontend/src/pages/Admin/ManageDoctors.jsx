import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import logo from "../../../asset/logohpt.jpg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../styles/mndoctor.css";

const TIME_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const DOCTOR_COLORS = [
  "#5b9bd5", "#70c1b3", "#f4a261", "#e76f51",
  "#a78bfa", "#f472b6", "#34d399", "#fbbf24",
];

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    return monday;
  });
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    hospital: "",
    price: "",
    experience: "",
    avatar: "",
  });

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_BASE_DEFAULT}/doctors`);
      setDoctors(res.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bác sĩ:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_BASE_DEFAULT}/appointments`);
      setAppointments(res.data);
    } catch (error) {
      console.error("Lỗi khi tải lịch hẹn:", error);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  // ====== WEEK NAVIGATION ======
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(currentWeekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentWeekStart]);

  const goToPrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const goToNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const goToCurrentWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now);
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(monday);
  };

  const formatWeekLabel = () => {
    const start = weekDays[0];
    const end = weekDays[6];
    const monthNames = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()} – ${end.getDate()} ${monthNames[start.getMonth()]} ${start.getFullYear()}`;
    }
    return `${start.getDate()}/${start.getMonth() + 1} – ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
  };

  // ====== MAP APPOINTMENTS TO CALENDAR ======
  const getAppointmentsForSlot = (dayDate, timeSlot) => {
    const dateStr = dayDate.toISOString().split("T")[0];
    return appointments.filter((a) => {
      if (a.status === "Cancelled") return false;
      const aDate = new Date(a.date).toISOString().split("T")[0];
      return aDate === dateStr && a.time === timeSlot;
    });
  };

  const getDoctorColor = (doctorId) => {
    const idx = doctors.findIndex((d) => d._id === doctorId);
    return DOCTOR_COLORS[idx % DOCTOR_COLORS.length];
  };

  const getDoctorName = (appt) => {
    if (appt.doctorId?.name) return appt.doctorId.name;
    const doc = doctors.find((d) => d._id === appt.doctorId);
    return doc?.name || "N/A";
  };

  // ====== FORM HANDLERS ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_DEFAULT}/doctors/${editingId}`, form);
        setEditingId(null);
      } else {
        await axios.post(`${API_BASE_DEFAULT}/doctors`, form);
      }
      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
    }
  };

  const deleteDoctor = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này không?")) {
      try {
        await axios.delete(`${API_BASE_DEFAULT}/doctors/${id}`);
        fetchDoctors();
      } catch (error) {
        console.error("Lỗi khi xóa bác sĩ:", error);
      }
    }
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor._id);
    setForm({
      name: doctor.name || "",
      specialty: doctor.specialty || "",
      hospital: doctor.hospital || "",
      price: doctor.price || "",
      experience: doctor.experience || "",
      avatar: doctor.avatar || "",
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      specialty: "",
      hospital: "",
      price: "",
      experience: "",
      avatar: "",
    });
  };

  return (
    <>
      <div className="manage-container">
        <h2 className="manage-title">Quản lý bác sĩ</h2>

        {/* ====== FORM ====== */}
        <form className="doctor-form" onSubmit={handleSubmit}>
          <input
            placeholder="Tên bác sĩ"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Chuyên khoa"
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            required
          />
          <input
            placeholder="Bệnh viện"
            value={form.hospital}
            onChange={(e) => setForm({ ...form, hospital: e.target.value })}
            required
          />
          <input
            placeholder="Giá khám (VND)"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            placeholder="Năm kinh nghiệm"
            type="number"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            required
          />
          <input
            placeholder="Link Ảnh đại diện (Avatar URL)"
            type="url"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
          />

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editingId ? "💾 Cập nhật bác sĩ" : "➕ Thêm bác sĩ"}
            </button>

            {editingId && (
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>

        {/* ====== LỊCH LÀM VIỆC - WEEKLY CALENDAR ====== */}
        <div className="schedule-section">
          <div className="schedule-header">
            <h3 className="section-title">📅 Lịch việc</h3>
            <div className="week-nav">
              <button className="week-nav-btn" onClick={goToPrevWeek}>
                <FaChevronLeft />
              </button>
              <span className="week-label">{formatWeekLabel()}</span>
              <button className="week-nav-btn" onClick={goToNextWeek}>
                <FaChevronRight />
              </button>
              <button className="today-btn" onClick={goToCurrentWeek}>
                Hôm nay
              </button>
            </div>
          </div>

          {/* Day headers with dates */}
          <div className="calendar-grid">
            <div className="calendar-corner"></div>
            {weekDays.map((day, idx) => {
              const isToday = new Date().toDateString() === day.toDateString();
              return (
                <div key={idx} className={`calendar-day-header ${isToday ? "today" : ""}`}>
                  <span className="day-name">{DAY_LABELS[day.getDay()]}</span>
                  <span className={`day-number ${isToday ? "today-number" : ""}`}>
                    {day.getDate()}
                  </span>
                </div>
              );
            })}

            {/* Time rows */}
            {TIME_SLOTS.map((slot) => (
              <React.Fragment key={slot}>
                <div className="calendar-time-label">{slot}</div>
                {weekDays.map((day, dayIdx) => {
                  const appts = getAppointmentsForSlot(day, slot);
                  const isToday = new Date().toDateString() === day.toDateString();
                  return (
                    <div
                      key={dayIdx}
                      className={`calendar-cell ${isToday ? "today-col" : ""}`}
                    >
                      {appts.map((a) => {
                        const docId = a.doctorId?._id || a.doctorId;
                        const color = getDoctorColor(docId);
                        const doctorName = getDoctorName(a);
                        const shortDoctor = doctorName.split(" ").slice(-2).join(" ");
                        return (
                          <div
                            key={a._id}
                            className="calendar-event"
                            style={{
                              backgroundColor: color + "20",
                              borderLeft: `4px solid ${color}`,
                              color: color,
                            }}
                            title={`${slot} - ${doctorName}\nBệnh nhân: ${a.fullName}`}
                          >
                            <span className="event-time">{slot}</span>
                            <span className="event-doctor">{shortDoctor}</span>
                            <span className="event-patient">{a.fullName}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Doctor Legend */}
          <div className="doctor-legend">
            <span className="legend-title">Bác sĩ:</span>
            {doctors.map((d, idx) => (
              <span key={d._id} className="legend-item">
                <span
                  className="legend-dot"
                  style={{ backgroundColor: DOCTOR_COLORS[idx % DOCTOR_COLORS.length] }}
                ></span>
                {d.name}
              </span>
            ))}
          </div>
        </div>

        {/* ====== DANH SÁCH BÁC SĨ ====== */}
        <div className="doctor-list">
          {doctors.map((d) => (
            <div className="doctor-card" key={d._id}>
              <div className="doctor-avatar-container">
                <img
                  src={d.avatar || "https://via.placeholder.com/150?text=No+Avatar"}
                  alt={d.name}
                  className="doctor-avatar"
                />
              </div>

              <div className="doctor-info">
                <div className="doctor-name">{d.name}</div>
                <div className="doctor-specialty">⚕️ {d.specialty}</div>
                <div className="doctor-hospital">
                  <img src={logo} alt="Logo" className="mini-logo-inline" /> 
                  {d.hospital}
                </div>
                <div className="doctor-experience">⏳ Kinh nghiệm: {d.experience} năm</div>
                <div className="doctor-price">
                  💰 {Number(d.price).toLocaleString("vi-VN")} VND
                </div>
              </div>

              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEdit(d)}>
                  Sửa
                </button>
                <button className="delete-btn" onClick={() => deleteDoctor(d._id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}