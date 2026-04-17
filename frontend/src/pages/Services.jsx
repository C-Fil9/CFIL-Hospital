import { Link } from "react-router-dom";
import "../styles/info-pages.css";
import logo from "../../asset/logohpt.jpg";

export default function Services() {
    return (
        <div className="info-page">
            {/* HERO */}
            <section className="page-hero">
                <h1>Dịch vụ y tế</h1>
                <p>Đa dạng dịch vụ chăm sóc sức khỏe, đáp ứng mọi nhu cầu của bạn và gia đình</p>
            </section>

            {/* MAIN SERVICES */}
            <section className="info-section">
                <div className="section-heading">
                    <h2>Dịch vụ nổi bật</h2>
                    <p>Chúng tôi cung cấp dịch vụ y tế toàn diện từ khám sức khỏe đến điều trị chuyên sâu</p>
                </div>

                <div className="card-grid card-grid-3">
                    <div className="info-card">
                        <div className="card-icon">🩺</div>
                        <h3>Khám tổng quát</h3>
                        <p>Kiểm tra sức khỏe toàn diện, tầm soát bệnh lý tiềm ẩn với các gói khám phù hợp mọi độ tuổi.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">⚕️</div>
                        <h3>Khám chuyên khoa</h3>
                        <p>Hơn 20 chuyên khoa sâu: Tim mạch, Thần kinh, Xương khớp, Tiêu hóa, Da liễu, Mắt...</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🔬</div>
                        <h3>Xét nghiệm</h3>
                        <p>Hệ thống phòng xét nghiệm hiện đại, kết quả chính xác, trả nhanh trong ngày.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">📷</div>
                        <h3>Chẩn đoán hình ảnh</h3>
                        <p>CT Scanner, MRI, Siêu âm, X-quang kỹ thuật số với hình ảnh độ phân giải cao.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">
                            <img src={logo} alt="Logo" className="info-logo" />
                        </div>
                        <h3>Phẫu thuật</h3>
                        <p>Phẫu thuật nội soi tiên tiến, phẫu thuật vi phẫu và các kỹ thuật can thiệp ít xâm lấn.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">💬</div>
                        <h3>Tư vấn trực tuyến</h3>
                        <p>Tư vấn bác sĩ qua video call, tiện lợi mọi lúc mọi nơi với AI hỗ trợ thông minh.</p>
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section className="info-section alt-bg">
                <div className="section-inner">
                    <div className="section-heading">
                        <h2>Bảng giá gói khám</h2>
                        <p>Giá minh bạch, hợp lý — phù hợp mọi nhu cầu</p>
                    </div>

                    <div className="card-grid card-grid-3">
                        <div className="info-card">
                            <div className="card-icon">🥉</div>
                            <h3>Gói Cơ bản</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0d9488', margin: '10px 0' }}>500.000 VNĐ</p>
                            <p>Khám tổng quát, xét nghiệm máu, đo huyết áp, điện tim cơ bản.</p>
                        </div>

                        <div className="info-card" style={{ borderColor: '#99f6e4', boxShadow: '0 8px 30px rgba(13,148,136,0.1)' }}>
                            <div className="card-icon">🥇</div>
                            <h3>Gói Nâng cao</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0d9488', margin: '10px 0' }}>1.200.000 VNĐ</p>
                            <p>Gồm gói Cơ bản + siêu âm bụng, chụp X-quang, xét nghiệm chuyên sâu.</p>
                        </div>

                        <div className="info-card">
                            <div className="card-icon">💎</div>
                            <h3>Gói VIP</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0d9488', margin: '10px 0' }}>2.500.000 VNĐ</p>
                            <p>Toàn diện: CT Scan, MRI, nội soi, khám chuyên khoa đầy đủ, bác sĩ riêng.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="info-section" style={{ textAlign: 'center' }}>
                <h2 style={{ marginBottom: '14px' }}>Sẵn sàng đặt lịch?</h2>
                <p style={{ color: '#64748b', marginBottom: '28px' }}>Đội ngũ bác sĩ đang chờ đồng hành cùng bạn</p>
                <Link to="/appointments" className="job-apply-btn" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                    📅 Đặt lịch khám ngay
                </Link>
            </section>
        </div>
    );
}
