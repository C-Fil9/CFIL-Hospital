import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../asset/logohpt.jpg";
import "../styles/doctor.css";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🔥 Thêm State quản lý từ khóa tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await fetch(`${API_BASE_DEFAULT}/doctors`);
                if (!res.ok) throw new Error("Không lấy được danh sách bác sĩ");
                const data = await res.json();
                setDoctors(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // 🔥 Tự động lọc danh sách bác sĩ mỗi khi searchTerm thay đổi
    const filteredDoctors = doctors.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) // Mở rộng: Cho phép tìm luôn theo chuyên khoa
    );

    if (loading) return <p className="loading-msg">⏳ Đang tải danh sách bác sĩ...</p>;
    if (error) return <p className="error-msg">❌ Lỗi: {error}</p>;

    return (
        <div className="doctors-container">
            <h1 className="doctors-title">Đội ngũ bác sĩ chuyên khoa</h1>

            {/* =========================================
                THANH TÌM KIẾM BÁC SĨ 
            ========================================= */}
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 Tìm kiếm theo tên bác sĩ hoặc chuyên khoa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="doctors-grid">
                {/* Kiểm tra nếu danh sách rỗng thì báo lỗi, nếu có thì render */}
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <div className="doctor-card" key={doctor._id}>
                            <div className="doctor-card-body">
                                <img
                                    src={doctor.avatar || "https://via.placeholder.com/150?text=No+Avatar"}
                                    alt={doctor.name}
                                    className="doctor-avatar"
                                />

                                <div className="doctor-info">
                                    <h2 className="doctor-name">{doctor.name}</h2>
                                    <p className="doctor-meta">
                                        <span className="meta-icon">⚕️</span> Chuyên khoa: {doctor.specialty}
                                    </p>
                                    <p className="doctor-meta">
                                        <span className="meta-icon">
                                            <img src={logo} alt="Logo" className="card-mini-logo" />
                                        </span> Bệnh viện: {doctor.hospital}
                                    </p>
                                    <p className="doctor-meta">
                                        <span className="meta-icon">⏳</span> Kinh nghiệm: {doctor.experience} năm
                                    </p>
                                    <p className="doctor-meta doctor-price">
                                        💰 {Number(doctor.price).toLocaleString("vi-VN")} VNĐ
                                    </p>
                                </div>
                            </div>

                            <Link to={`/doctors/${doctor._id}`} className="doctor-btn">
                                Xem hồ sơ & Đặt lịch
                            </Link>
                        </div>
                    ))
                ) : (
                    /* Hiển thị khi không tìm thấy kết quả */
                    <div className="no-result-msg">
                        <p>🥲 Không tìm thấy bác sĩ hoặc chuyên khoa nào khớp với "{searchTerm}".</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Doctors;