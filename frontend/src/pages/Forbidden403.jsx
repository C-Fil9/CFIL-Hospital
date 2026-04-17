import "../styles/forbidden403.css";

export default function Forbidden403() {
  return (
    <div className="forbidden-container">
      <div className="forbidden-content">
        <h1 className="forbidden-title">403</h1>
        <h2 className="forbidden-subtitle">Truy cập bị từ chối</h2>
        <p className="forbidden-message">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.
        </p>
        <a href="/" className="forbidden-button">Quay về trang chủ</a>
      </div>
    </div>
  );
}