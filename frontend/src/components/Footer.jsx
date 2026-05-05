import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../../asset/logohpt.jpg";
import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Column 1 - Hospital Info */}
        <div className="footer-col">
          <h3 className="footer-brand">
            <img src={logo} alt="Logo" className="footer-logo" />
            Bệnh Viện CFil
          </h3>
          <p className="footer-desc">
            Hệ thống y tế chất lượng cao, chăm sóc sức khỏe toàn diện với đội ngũ bác sĩ chuyên khoa hàng đầu.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>

        {/* Column 2 - Quick Links */}
        <div className="footer-col">
          <h4>Liên kết nhanh</h4>
          <ul>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/doctors">Bác sĩ</Link></li>
            <li><Link to="/appointments">Đặt lịch khám</Link></li>
            <li><Link to="/schedule">Lịch khám</Link></li>
          </ul>
        </div>

        {/* Column 3 - Services */}
        <div className="footer-col">
          <h4>Dịch vụ</h4>
          <ul>
            <li><a href="#">Khám tổng quát</a></li>
            <li><a href="#">Khám chuyên khoa</a></li>
            <li><a href="#">Xét nghiệm</a></li>
            <li><a href="#">Tư vấn trực tuyến</a></li>
          </ul>
        </div>

        {/* Column 4 - Contact */}
        <div className="footer-col">
          <h4>Liên hệ</h4>
          <div className="footer-contact">
            <p><FaPhoneAlt className="contact-icon" /> <strong>Hotline:</strong> 1900-xxxx</p>
            <p><FaEnvelope className="contact-icon" /> info@cfil.vn</p>
            <p><FaMapMarkerAlt className="contact-icon" /> TP. Hồ Chí Minh, Việt Nam</p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2026 Bệnh Viện CFil. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
}
