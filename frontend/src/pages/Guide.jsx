import { Link } from "react-router-dom";
import "../styles/info-pages.css";

export default function Guide() {
  return (
    <div className="info-page">
      {/* HERO */}
      <section className="page-hero">
        <h1>Hướng dẫn</h1>
        <p>Thông tin hữu ích giúp bạn chuẩn bị tốt nhất cho lần khám bệnh</p>
      </section>

      {/* BOOKING GUIDE */}
      <section className="info-section">
        <div className="section-heading">
          <h2>Hướng dẫn đặt lịch khám</h2>
          <p>4 bước đơn giản để đặt lịch khám bệnh trực tuyến</p>
        </div>

        <div className="steps-list">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Đăng ký / Đăng nhập</h3>
              <p>Tạo tài khoản hoặc đăng nhập bằng email. Bạn cũng có thể đăng nhập nhanh bằng Google.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Chọn dịch vụ & bác sĩ</h3>
              <p>Chọn dịch vụ khám (tổng quát hoặc chuyên khoa), sau đó chọn bác sĩ phù hợp. Hệ thống sẽ tự động hiển thị giá và bệnh viện.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Chọn ngày giờ khám</h3>
              <p>Chọn ngày và khung giờ khám phù hợp. Mô tả triệu chứng để bác sĩ chuẩn bị tốt hơn.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Thanh toán & Xác nhận</h3>
              <p>Thanh toán qua mã QR. Sau khi thanh toán thành công, lịch khám sẽ được xác nhận tự động.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PATIENT GUIDE */}
      <section className="info-section alt-bg">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Lưu ý khi đi khám</h2>
            <p>Chuẩn bị đầy đủ để buổi khám diễn ra thuận lợi</p>
          </div>

          <div className="card-grid card-grid-2">
            <div className="info-card" style={{ textAlign: 'left' }}>
              <h3>📋 Giấy tờ cần mang</h3>
              <ul style={{ paddingLeft: '20px', marginTop: '12px', color: '#475569', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li>CMND / CCCD hoặc Hộ chiếu</li>
                <li>Thẻ BHYT (nếu có)</li>
                <li>Kết quả khám trước (nếu có)</li>
                <li>Đơn thuốc đang sử dụng</li>
                <li>Mã xác nhận đặt lịch</li>
              </ul>
            </div>

            <div className="info-card" style={{ textAlign: 'left' }}>
              <h3>⏰ Thời gian khám</h3>
              <ul style={{ paddingLeft: '20px', marginTop: '12px', color: '#475569', fontSize: '0.9rem', lineHeight: '1.8' }}>
                <li><strong>Buổi sáng:</strong> 7:30 – 11:30</li>
                <li><strong>Buổi chiều:</strong> 13:00 – 16:30</li>
                <li><strong>Thứ Bảy:</strong> 7:30 – 11:30 (chỉ buổi sáng)</li>
                <li><strong>Chủ Nhật:</strong> Nghỉ</li>
                <li>Đến trước giờ hẹn 15–30 phút</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="info-section">
        <div className="section-heading">
          <h2>Câu hỏi thường gặp</h2>
        </div>

        <div className="text-block">
          <h3>Tôi có thể hủy hoặc đổi lịch khám không?</h3>
          <p>Bạn có thể hủy hoặc đổi lịch trước 24 giờ so với giờ hẹn. Liên hệ hotline 1900-xxxx hoặc đăng nhập tài khoản để thao tác.</p>

          <h3>Bệnh viện có hỗ trợ bảo hiểm y tế không?</h3>
          <p>Có, bệnh viện liên kết với hầu hết các đơn vị bảo hiểm y tế. Vui lòng mang theo thẻ BHYT khi đến khám.</p>

          <h3>Nhận kết quả xét nghiệm bao lâu?</h3>
          <p>Xét nghiệm cơ bản: 2-4 giờ. Xét nghiệm chuyên sâu: 1-3 ngày. Kết quả sẽ gửi qua email và ứng dụng.</p>

          <h3>Tôi cần tư vấn gấp thì sao?</h3>
          <p>
            Sử dụng tính năng <strong>AI tư vấn</strong> (💬 góc phải màn hình) hoặc gọi hotline <strong>1900-xxxx</strong> để được hỗ trợ ngay.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="info-section alt-bg" style={{ textAlign: 'center' }}>
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '14px' }}>Cần hỗ trợ thêm?</h2>
          <p style={{ color: '#64748b', marginBottom: '28px' }}>Liên hệ ngay với đội ngũ chăm sóc khách hàng</p>
          <Link to="/contact" className="job-apply-btn" style={{ padding: '14px 36px', fontSize: '1rem' }}>
            📞 Liên hệ chúng tôi
          </Link>
        </div>
      </section>
    </div>
  );
}
