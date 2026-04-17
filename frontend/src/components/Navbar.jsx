import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
import { useState, useEffect, useRef } from "react";
import { FaSun, FaMoon, FaLeaf } from "react-icons/fa";
import logo from "../../asset/logohpt.jpg";
import "../styles/navbar.css";

export default function Navbar() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef();

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Check admin an toàn hơn (hỗ trợ cả trường hợp chữ "Admin" viết hoa)
    const isAdmin = user?.role === "admin" || user?.role === "Admin" || user?.role === 1;

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* =====================================
            GÓC TRÁI: Logo + Menu Điều Hướng
        ===================================== */}
                <div className="navbar-left">
                    {/* Logo */}
                    <Link to="/" className="navbar-logo">
                        <img src={logo} alt="Logo" className="navbar-logo-img" />
                        <span className="logo-text">Bệnh Viện CFil</span>
                    </Link>

                    {/* Menu Links */}
                    <div className="navbar-menu">
                        <Link to="/" className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}>Trang chủ</Link>
                        <Link to="/about" className={`navbar-link ${location.pathname === "/about" ? "active" : ""}`}>Giới thiệu</Link>
                        <Link to="/treatment" className={`navbar-link ${location.pathname === "/treatment" ? "active" : ""}`}>Điều trị</Link>
                        <Link to="/services" className={`navbar-link ${location.pathname === "/services" ? "active" : ""}`}>Dịch vụ</Link>
                        <Link to="/guide" className={`navbar-link ${location.pathname === "/guide" ? "active" : ""}`}>Hướng dẫn</Link>
                        <Link to="/recruitment" className={`navbar-link ${location.pathname === "/recruitment" ? "active" : ""}`}>Tuyển dụng</Link>
                        <Link to="/contact" className={`navbar-link ${location.pathname === "/contact" ? "active" : ""}`}>Liên hệ</Link>

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={`navbar-link dashboard-link ${location.pathname === "/admin" ? "active" : ""
                                    }`}
                            >
                                📊 Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                {/* =====================================
            GÓC PHẢI: Nút Auth hoặc User Info
        ===================================== */}
                <div className="navbar-right">
                    {/* Theme Toggle */}
                    <button
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        title={`Chế độ: ${theme === "light" ? "Sáng" : theme === "dark" ? "Tối" : "Xanh"}`}
                    >
                        {theme === "light" ? <FaMoon /> : theme === "dark" ? <FaLeaf className="leaf-icon" /> : <FaSun className="sun-icon" />}
                    </button>
                    {!user ? (
                        <div className="auth-buttons">
                            <Link to="/login" className="navbar-btn">Đăng nhập</Link>
                            <Link to="/register" className="navbar-btn">Đăng ký</Link>
                        </div>
                    ) : (
                        <div className="user-dropdown" ref={dropdownRef}>
                            <div
                                className="user-info"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <div className="navbar-user">
                                    <span className="user-greeting">Xin chào,</span>
                                    <span className="user-name">{user.username}</span>
                                </div>

                                <img
                                    src={`https://ui-avatars.com/api/?name=${user.username}&background=e2e8f0&color=333&bold=true`}
                                    alt="avatar"
                                    className="navbar-avatar"
                                />
                            </div>

                            <div className={`dropdown-menu ${isDropdownOpen ? "show" : ""}`}>
                                <Link to="/profile" className="dropdown-item">
                                    👤 Hồ sơ
                                </Link>

                                <hr />

                                <button onClick={logout} className="dropdown-item logout-item">
                                    🚪 Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </nav>
    );
}