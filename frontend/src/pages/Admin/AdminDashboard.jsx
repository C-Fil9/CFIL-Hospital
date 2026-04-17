import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserMd,
  FaCalendarCheck,
  FaEnvelope,
  FaBell,
} from "react-icons/fa";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const lineData = [
  { month: "Apr", users: 2 },
  { month: "May", users: 3 },
  { month: "Jun", users: 3 },
  { month: "Jul", users: 4 },
  { month: "Aug", users: 4 },
  { month: "Sep", users: 5 },
  { month: "Oct", users: 5 },
  { month: "Nov", users: 5 },
  { month: "Dec", users: 6 },
  { month: "Jan", users: 7 }
];

const barData = [
  { month: "Aug", published: 3, draft: 1 },
  { month: "Sep", published: 5, draft: 0 },
  { month: "Oct", published: 5, draft: 1 },
  { month: "Nov", published: 4, draft: 3 },
  { month: "Dec", published: 3, draft: 3 },
  { month: "Jan", published: 3, draft: 5 }
];

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  
  useEffect(() => {
    // Fetch all counts in parallel
    Promise.all([
      fetch(`${API_BASE_DEFAULT}/users`).then(r => r.json()),
      fetch(`${API_BASE_DEFAULT}/doctors`).then(r => r.json()),
      fetch(`${API_BASE_DEFAULT}/appointments`).then(r => r.json()),
      fetch(`${API_BASE_DEFAULT}/contacts`).then(r => r.json()),
    ])
      .then(([users, doctors, appts, contacts]) => {
        setUserCount(users.length);
        setDoctorCount(doctors.length);
        setAppointmentCount(appts.length);
        setContactCount(contacts.length);
        // Show the 5 most recent appointments
        setAppointments(appts.slice(0, 5));
      })
      .catch(err => console.error("Dashboard fetch error:", err));
  }, []);

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <input placeholder="Search..." />
        <div className="top-icons">
          <FaBell />
          <img
            src="https://i.pravatar.cc/40"
            alt="admin"
          />
        </div>
      </div>

      <h1 className="title">Dashboard</h1>

      {/* Cards */}
      <div className="cards">
        <div className="card">
          <div>
            <p>Total Users</p>
            <h2>{userCount}</h2>
          </div>
          <FaUsers className="icon blue" />
        </div>

        <div className="card">
          <div>
            <p>Doctors</p>
            <h2>{doctorCount}</h2>
          </div>
          <FaUserMd className="icon green" />
        </div>

        <div className="card">
          <div>
            <p>Total Appointments</p>
            <h2>{appointmentCount}</h2>
          </div>
          <FaCalendarCheck className="icon purple" />
        </div>

        <div className="card">
          <div>
            <p>Contact Messages</p>
            <h2>{contactCount}</h2>
          </div>
          <FaEnvelope className="icon red" />
        </div>
      </div>

      {/* Charts */}
      <div className="charts">
        <div className="chart-box">
          <h3>User Signups</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Content Production</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="published" fill="#10b981" />
              <Bar dataKey="draft" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table — Real appointments from DB */}
      <div className="table-box">
        <h3>Lịch hẹn gần đây</h3>
        <table>
          <thead>
            <tr>
              <th>Bệnh nhân</th>
              <th>Bác sĩ</th>
              <th>Ngày</th>
              <th>Giờ</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>
                  Chưa có lịch hẹn nào.
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.fullName || a.userId?.username || "—"}</td>
                  <td>{a.doctorId?.name || "—"}</td>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td className={a.paymentStatus === "paid" ? "done" : "pending"}>
                    {a.paymentStatus === "paid" ? "Đã thanh toán" : "Chưa thanh toán"}
                  </td>
                  <td className={a.status === "Confirmed" ? "done" : a.status === "Cancelled" ? "pending" : ""}>
                    {a.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}