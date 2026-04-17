import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserMd,
  FaCalendarCheck,
  FaUsers,
  FaBell,
  FaCog,
  FaEnvelope,
  FaBriefcase,
  FaMoneyBillWave,
  FaBars,
  FaChevronLeft,
} from "react-icons/fa";
import "../styles/admin.css";

const menuItems = [
  { path: "/admin/", icon: FaTachometerAlt, label: "Dashboard" },
  { path: "/admin/manage-doctors", icon: FaUserMd, label: "Doctors" },
  { path: "/admin/manage-appointments", icon: FaCalendarCheck, label: "Appointments" },
  { path: "/admin/manage-payments", icon: FaMoneyBillWave, label: "Thanh toán" },
  { path: "/admin/manage-users", icon: FaUsers, label: "Users" },
  { path: "/admin/manage-contacts", icon: FaEnvelope, label: "Contacts" },
  { path: "/admin/manage-recruitments", icon: FaBriefcase, label: "Tuyển dụng" },
  { path: "/admin/notifications", icon: FaBell, label: "Notifications" },
  { path: "/admin/settings", icon: FaCog, label: "Settings" },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={`dashboard ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          {!collapsed && <h2>HTKB Admin</h2>}
          <button
            className="sidebar-toggle-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Mở menu" : "Thu gọn menu"}
          >
            {collapsed ? <FaBars /> : <FaChevronLeft />}
          </button>
        </div>

        <ul className="menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path} className={isActive ? "active" : ""}>
                <Link to={item.path} title={collapsed ? item.label : ""}>
                  <Icon className="menu-icon" />
                  {!collapsed && <span className="menu-label">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
