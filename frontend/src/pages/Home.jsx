import "../styles/home.css";
import banner1 from "../../asset/banner.jpg";
import banner2 from "../../asset/banner2.png";
import banner3 from "../../asset/banner3.png";
import banner4 from "../../asset/banner4.png";
import banner5 from "../../asset/banner5.png";
import banner6 from "../../asset/banner6.png";
import banner7 from "../../asset/banner7.png";
import logo from "../../asset/logohpt.jpg";

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const Home = () => {

    const banners = [
        banner1,
        banner2,
        banner3,
        banner4,
        banner5,
        banner6,
        banner7
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 4000);

        return () => clearInterval(interval);

    }, []);

    return (
        <>
            {/* QUICK SERVICES */}
            <section className="quick-services">
                <div className="service-grid">

                    <div className="service-item">
                        <Link to="/doctors">👨‍⚕️ Tìm bác sĩ</Link>
                    </div>

                    <div className="service-item">
                        <Link to="/schedule">📅 Lịch khám bệnh</Link>
                    </div>

                    <div className="service-item">
                        ⏰ Giờ khám bệnh
                    </div>

                    <div className="service-item">
                        <Link to="/appointments">📝 Đặt hẹn khám</Link>
                    </div>

                    <div className="service-item">
                        💰 Bảng giá
                    </div>

                </div>
            </section>

            {/* HERO BANNER */}
            <section className="hero-banner">

                <div className="banner-content">

                    <div className="banner-text slide-left">

                        <h3>CHÀO MỪNG 71 NĂM NGÀY THẦY THUỐC VIỆT NAM</h3>

                        <h1>Chăm sóc sức khỏe
                            <br />chất lượng cao</h1>

                        <p>
                            70 năm hành trình Ngoại khoa – Bệnh Viện CFil
                            <br />
                            Đón nhận Huân chương Lao động hạng Nhì
                        </p>

                        <span className="banner-date">28/02/2026</span>

                    </div>

                    <div className="banner-image slide-right">
                        <img
                            src={banners[current]}
                            alt="banner"
                            className="zoom-img"
                        />
                    </div>

                </div>

            </section>

            {/* FEATURES SECTION */}
            <section className="features-section">
                <div className="section-title">
                    <h2>Tại sao chọn chúng tôi?</h2>
                    <p>Cam kết mang đến dịch vụ y tế tốt nhất cho bạn và gia đình</p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🩺</div>
                        <h3>Bác sĩ chuyên khoa</h3>
                        <p>Đội ngũ bác sĩ giàu kinh nghiệm, được đào tạo chuyên sâu tại các trường đại học hàng đầu.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <img src={logo} alt="Logo" className="feature-logo" />
                        </div>
                        <h3>Trang thiết bị hiện đại</h3>
                        <p>Hệ thống máy móc, thiết bị y tế tiên tiến nhất, đảm bảo chẩn đoán chính xác.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">💊</div>
                        <h3>Dịch vụ toàn diện</h3>
                        <p>Từ khám tổng quát đến chuyên khoa sâu, đáp ứng mọi nhu cầu chăm sóc sức khỏe.</p>
                    </div>
                </div>
            </section>

            {/* STATS SECTION */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-item">
                        <h2>70+</h2>
                        <p>Năm kinh nghiệm</p>
                    </div>
                    <div className="stat-item">
                        <h2>200+</h2>
                        <p>Bác sĩ chuyên khoa</p>
                    </div>
                    <div className="stat-item">
                        <h2>50K+</h2>
                        <p>Bệnh nhân tin tưởng</p>
                    </div>
                    <div className="stat-item">
                        <h2>99%</h2>
                        <p>Hài lòng dịch vụ</p>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="cta-section">
                <h2>Đặt lịch khám ngay hôm nay</h2>
                <p>Chăm sóc sức khỏe sớm là cách tốt nhất để bảo vệ bạn và gia đình</p>
                <Link to="/appointments" className="cta-btn">
                    📅 Đặt lịch khám bệnh
                </Link>
            </section>

        </>
    );
};

export default Home;