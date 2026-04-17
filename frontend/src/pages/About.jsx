import "../styles/info-pages.css";
import logo from "../../asset/logohpt.jpg";

export default function About() {
    return (
        <div className="info-page">
            {/* HERO */}
            <section className="page-hero">
                <h1>Giới thiệu</h1>
                <p>Hành trình 70 năm xây dựng và phát triển — nơi bạn tin tưởng gửi gắm sức khỏe</p>
            </section>

            {/* STORY */}
            <section className="info-section">
                <div className="text-block">
                    <h3>Về Bệnh Viện CFil</h3>
                    <p>
                        Bệnh viện CFil được thành lập với sứ mệnh mang đến dịch vụ chăm sóc sức khỏe chất lượng cao,
                        tiếp cận mọi tầng lớp nhân dân. Với hơn 70 năm kinh nghiệm, chúng tôi tự hào là một trong
                        những bệnh viện hàng đầu tại TP. Hồ Chí Minh.
                    </p>
                    <p>
                        Trải qua nhiều thập kỷ, bệnh viện không ngừng đổi mới, nâng cấp cơ sở vật chất và
                        trang thiết bị y tế hiện đại, đồng thời phát triển đội ngũ chuyên gia y tế giỏi chuyên môn,
                        tận tâm với nghề.
                    </p>

                    <h3>Tầm nhìn & Sứ mệnh</h3>
                    <p>
                        <strong>Tầm nhìn:</strong> Trở thành bệnh viện đa khoa hàng đầu khu vực Đông Nam Á,
                        tiên phong trong ứng dụng công nghệ y tế hiện đại.
                    </p>
                    <p>
                        <strong>Sứ mệnh:</strong> Cung cấp dịch vụ y tế toàn diện, chất lượng cao với chi phí
                        hợp lý, lấy người bệnh làm trung tâm.
                    </p>
                </div>
            </section>

            {/* CORE VALUES */}
            <section className="info-section alt-bg">
                <div className="section-inner">
                    <div className="section-heading">
                        <h2>Giá trị cốt lõi</h2>
                        <p>Những nguyên tắc định hướng mọi hoạt động của chúng tôi</p>
                    </div>

                    <div className="value-grid">
                        <div className="value-card">
                            <div className="v-icon">❤️</div>
                            <h4>Tận tâm</h4>
                            <p>Luôn đặt sức khỏe bệnh nhân lên hàng đầu</p>
                        </div>
                        <div className="value-card">
                            <div className="v-icon">🔬</div>
                            <h4>Chuyên nghiệp</h4>
                            <p>Đội ngũ y bác sĩ giỏi chuyên môn</p>
                        </div>
                        <div className="value-card">
                            <div className="v-icon">🤝</div>
                            <h4>Tin cậy</h4>
                            <p>Minh bạch trong mọi hoạt động khám chữa bệnh</p>
                        </div>
                        <div className="value-card">
                            <div className="v-icon">🚀</div>
                            <h4>Đổi mới</h4>
                            <p>Tiên phong ứng dụng công nghệ y tế mới</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="info-section">
                <div className="section-heading">
                    <h2>Con số ấn tượng</h2>
                </div>
                <div className="card-grid card-grid-3" style={{ textAlign: 'center' }}>
                    <div className="info-card">
                        <div className="card-icon">
                            <img src={logo} alt="Logo" className="info-logo" />
                        </div>
                        <h3>5 cơ sở</h3>
                        <p>Mạng lưới rộng khắp TP.HCM và vùng lân cận</p>
                    </div>
                    <div className="info-card">
                        <div className="card-icon">👨‍⚕️</div>
                        <h3>200+ bác sĩ</h3>
                        <p>Chuyên gia đầu ngành, giàu kinh nghiệm thực tiễn</p>
                    </div>
                    <div className="info-card">
                        <div className="card-icon">🏆</div>
                        <h3>15+ giải thưởng</h3>
                        <p>Được công nhận bởi Bộ Y tế và tổ chức quốc tế</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
