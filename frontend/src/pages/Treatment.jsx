import "../styles/info-pages.css";
import logo from "../../asset/logohpt.jpg";

export default function Treatment() {
    return (
        <div className="info-page">
            {/* HERO */}
            <section className="page-hero">
                <h1>Điều trị</h1>
                <p>Phác đồ điều trị chuẩn quốc tế, cá nhân hóa theo từng bệnh nhân</p>
            </section>

            {/* SPECIALTIES */}
            <section className="info-section">
                <div className="section-heading">
                    <h2>Chuyên khoa điều trị</h2>
                    <p>Hơn 20 chuyên khoa sâu với đội ngũ bác sĩ giàu kinh nghiệm</p>
                </div>

                <div className="card-grid card-grid-3">
                    <div className="info-card">
                        <div className="card-icon">❤️</div>
                        <h3>Tim mạch</h3>
                        <p>Can thiệp mạch vành, phẫu thuật tim hở, điều trị rối loạn nhịp tim và bệnh van tim.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🧠</div>
                        <h3>Thần kinh</h3>
                        <p>Điều trị đột quỵ, Parkinson, động kinh, chấn thương sọ não và các bệnh lý thần kinh.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🦴</div>
                        <h3>Xương khớp</h3>
                        <p>Phẫu thuật thay khớp, nội soi khớp, điều trị thoát vị đĩa đệm, gãy xương phức tạp.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🫁</div>
                        <h3>Hô hấp</h3>
                        <p>Nội soi phế quản, điều trị COPD, hen suyễn, viêm phổi và các bệnh phổi mãn tính.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">
                            <img src={logo} alt="Logo" className="info-logo" />
                        </div>
                        <h3>Tiêu hóa</h3>
                        <p>Nội soi tiêu hóa, điều trị viêm gan, xơ gan, loét dạ dày và bệnh lý đường ruột.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">👁️</div>
                        <h3>Mắt</h3>
                        <p>Phẫu thuật Lasik, điều trị đục thủy tinh thể, glaucoma và các bệnh lý về mắt.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🦷</div>
                        <h3>Răng hàm mặt</h3>
                        <p>Cấy ghép Implant, chỉnh nha, phẫu thuật hàm và điều trị nha khoa tổng quát.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">👂</div>
                        <h3>Tai mũi họng</h3>
                        <p>Phẫu thuật nội soi xoang, cắt amidan, điều trị viêm tai giữa và ung thư vòm họng.</p>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🧬</div>
                        <h3>Ung bướu</h3>
                        <p>Hóa trị, xạ trị, phẫu thuật ung thư kết hợp liệu pháp miễn dịch tiên tiến.</p>
                    </div>
                </div>
            </section>

            {/* TREATMENT PROCESS */}
            <section className="info-section alt-bg">
                <div className="section-inner">
                    <div className="section-heading">
                        <h2>Quy trình điều trị</h2>
                        <p>Từ chẩn đoán đến phục hồi — chúng tôi đồng hành cùng bạn</p>
                    </div>

                    <div className="steps-list">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Khám & Chẩn đoán</h3>
                                <p>Bác sĩ thăm khám lâm sàng, chỉ định xét nghiệm và chẩn đoán hình ảnh để xác định bệnh lý.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Hội chẩn & Lập phác đồ</h3>
                                <p>Ekip bác sĩ đa chuyên khoa hội chẩn, xây dựng phác đồ điều trị cá nhân hóa cho từng bệnh nhân.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Tiến hành điều trị</h3>
                                <p>Thực hiện phác đồ điều trị với sự giám sát chặt chẽ, theo dõi tiến triển liên tục.</p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Phục hồi & Tái khám</h3>
                                <p>Hướng dẫn chế độ phục hồi, lịch tái khám định kỳ để đảm bảo kết quả điều trị tốt nhất.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
