import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../styles/doctor-layout.css";

export default function DoctorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="doctor-layout">
      {/* Sidebar */}
      <aside className="doctor-sidebar">
        <div className="doctor-sidebar-header">
          <div className="doctor-avatar-circle">👨‍⚕️</div>
          <div>
            <p className="doctor-sidebar-name">{user?.username}</p>
            <p className="doctor-sidebar-role">Bác sĩ</p>
          </div>
        </div>

        <nav className="doctor-sidebar-nav">
          <NavLink
            to="/doctor"
            end
            className={({ isActive }) =>
              `doctor-nav-item${isActive ? " active" : ""}`
            }
          >
            🏠 Tổng quan
          </NavLink>
          <NavLink
            to="/doctor/messages"
            className={({ isActive }) =>
              `doctor-nav-item${isActive ? " active" : ""}`
            }
          >
            💬 Tin nhắn bệnh nhân
          </NavLink>
          <NavLink
            to="/doctor/medical-records"
            className={({ isActive }) =>
              `doctor-nav-item${isActive ? " active" : ""}`
            }
          >
            📋 Hồ sơ bệnh án
          </NavLink>
        </nav>

        <button className="doctor-logout-btn" onClick={handleLogout}>
          🚪 Đăng xuất
        </button>
      </aside>

      {/* Main content */}
      <main className="doctor-main">
        <Outlet />
      </main>
    </div>
  );
}
