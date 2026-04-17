import { useState } from "react";
import "../styles/info-pages.css";
import logo from "../../asset/logohpt.jpg";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function Recruitment() {
  const jobs = [
    {
      title: "Bác sĩ Nội tổng quát",
      department: "Khoa Nội",
      type: "Toàn thời gian",
      location: "TP.HCM",
      desc: "Khám bệnh, chẩn đoán và điều trị các bệnh lý nội khoa. Yêu cầu tốt nghiệp Đại học Y, có chứng chỉ hành nghề.",
    },
    {
      title: "Điều dưỡng viên",
      department: "Khoa Hồi sức",
      type: "Toàn thời gian",
      location: "TP.HCM",
      desc: "Chăm sóc và theo dõi bệnh nhân, hỗ trợ bác sĩ trong quá trình điều trị. Tốt nghiệp Cao đẳng/Đại học Điều dưỡng.",
    },
    {
      title: "Kỹ thuật viên xét nghiệm",
      department: "Phòng Xét nghiệm",
      type: "Toàn thời gian",
      location: "TP.HCM",
      desc: "Thực hiện các xét nghiệm sinh hóa, huyết học, vi sinh. Yêu cầu có kinh nghiệm với hệ thống tự động hóa.",
    },
    {
      title: "Nhân viên IT - Frontend Developer",
      department: "Phòng CNTT",
      type: "Toàn thời gian",
      location: "TP.HCM / Remote",
      desc: "Phát triển và bảo trì hệ thống đặt lịch khám trực tuyến. Yêu cầu thành thạo ReactJS, TailwindCSS.",
    },
    {
      title: "Chuyên viên Marketing Y tế",
      department: "Phòng Truyền thông",
      type: "Toàn thời gian",
      location: "TP.HCM",
      desc: "Lên kế hoạch và triển khai chiến dịch marketing cho bệnh viện. Ưu tiên có kinh nghiệm trong lĩnh vực y tế.",
    },
    {
      title: "Nhân viên Lễ tân",
      department: "Bộ phận Tiếp nhận",
      type: "Ca kíp",
      location: "TP.HCM",
      desc: "Tiếp nhận, hướng dẫn bệnh nhân, hỗ trợ thủ tục hành chính. Giao tiếp tốt, ngoại hình ưa nhìn.",
    },
  ];

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const openModal = (jobTitle) => {
    setSelectedJob(jobTitle);
    setShowModal(true);
    setStatus({ type: "", message: "" });
    setForm({ fullName: "", email: "", phone: "", coverLetter: "" });
    setCvFile(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJob("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setStatus({ type: "error", message: "Chỉ chấp nhận file PDF." });
        setCvFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setStatus({ type: "error", message: "File không được vượt quá 5MB." });
        setCvFile(null);
        return;
      }
      setCvFile(file);
      setStatus({ type: "", message: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    if (!cvFile) {
      setStatus({ type: "error", message: "Vui lòng tải lên CV (PDF)." });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("position", selectedJob);
    formData.append("coverLetter", form.coverLetter);
    formData.append("cvFile", cvFile);

    try {
      const response = await fetch(`${API_BASE_DEFAULT}/recruitments`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: "success", message: "🎉 Đơn ứng tuyển đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm." });
        setForm({ fullName: "", email: "", phone: "", coverLetter: "" });
        setCvFile(null);
        // Reset the file input
        const fileInput = document.getElementById("cv-file-input");
        if (fileInput) fileInput.value = "";
      } else {
        setStatus({ type: "error", message: data.message || "Có lỗi xảy ra, vui lòng thử lại." });
      }
    } catch (error) {
      console.error("Submit error:", error);
      setStatus({ type: "error", message: "Không thể kết nối đến máy chủ." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="info-page">
      {/* HERO */}
      <section className="page-hero">
        <h1>Tuyển dụng</h1>
        <p>Gia nhập đội ngũ Bệnh Viện CFil — nơi bạn tạo ra giá trị cho cộng đồng</p>
      </section>

      {/* WHY JOIN */}
      <section className="info-section">
        <div className="section-heading">
          <h2>Tại sao chọn CFil?</h2>
          <p>Môi trường làm việc chuyên nghiệp, chế độ đãi ngộ hấp dẫn</p>
        </div>

        <div className="card-grid card-grid-3">
          <div className="info-card">
            <div className="card-icon">💰</div>
            <h3>Lương thưởng hấp dẫn</h3>
            <p>Mức lương cạnh tranh, thưởng hiệu quả, 13 tháng lương và các phúc lợi khác.</p>
          </div>

          <div className="info-card">
            <div className="card-icon">📚</div>
            <h3>Đào tạo liên tục</h3>
            <p>Cơ hội đào tạo trong và ngoài nước, hỗ trợ học phí nâng cao trình độ chuyên môn.</p>
          </div>

          <div className="info-card">
            <div className="card-icon">🌟</div>
            <h3>Phát triển sự nghiệp</h3>
            <p>Lộ trình thăng tiến rõ ràng, cơ hội trở thành lãnh đạo và chuyên gia trong ngành.</p>
          </div>
        </div>
      </section>

      {/* JOB LISTINGS */}
      <section className="info-section alt-bg">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Vị trí đang tuyển</h2>
            <p>Tìm công việc phù hợp với bạn</p>
          </div>

          <div className="card-grid card-grid-2">
            {jobs.map((job, index) => (
              <div className="job-card" key={index}>
                <h3>{job.title}</h3>
                <div className="job-meta">
                  <span className="job-tag">
                    <img src={logo} alt="Logo" className="tag-mini-logo" />
                    {job.department}
                  </span>
                  <span className="job-tag">⏰ {job.type}</span>
                  <span className="job-tag">📍 {job.location}</span>
                </div>
                <p>{job.desc}</p>
                <button className="job-apply-btn" onClick={() => openModal(job.title)}>
                  Ứng tuyển ngay
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION STEPS */}
      <section className="info-section">
        <div className="section-heading">
          <h2>Quy trình ứng tuyển</h2>
        </div>

        <div className="steps-list">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Nộp hồ sơ</h3>
              <p>Nhấn nút "Ứng tuyển ngay" tại vị trí phù hợp, điền thông tin và tải lên CV.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Sàng lọc hồ sơ</h3>
              <p>Phòng nhân sự xem xét hồ sơ trong vòng 3–5 ngày làm việc.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Phỏng vấn</h3>
              <p>1-2 vòng phỏng vấn trực tiếp với trưởng khoa/phòng và ban tuyển dụng.</p>
            </div>
          </div>

          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Nhận kết quả</h3>
              <p>Thông báo kết quả trong vòng 7 ngày. Ứng viên trúng tuyển sẽ ký hợp đồng và onboarding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION MODAL */}
      {showModal && (
        <div className="recruit-modal-overlay" onClick={closeModal}>
          <div className="recruit-modal" onClick={(e) => e.stopPropagation()}>
            <button className="recruit-modal-close" onClick={closeModal}>✕</button>

            <div className="recruit-modal-header">
              <h2>Ứng tuyển vị trí</h2>
              <p className="recruit-modal-position">{selectedJob}</p>
            </div>

            <form className="recruit-form" onSubmit={handleSubmit}>
              {status.message && (
                <div className={`recruit-status ${status.type}`}>
                  {status.message}
                </div>
              )}

              <div className="recruit-form-group">
                <label>Họ và tên <span className="required">*</span></label>
                <input
                  name="fullName"
                  placeholder="Nguyễn Văn A"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="recruit-form-row">
                <div className="recruit-form-group">
                  <label>Email <span className="required">*</span></label>
                  <input
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="recruit-form-group">
                  <label>Số điện thoại <span className="required">*</span></label>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="0901 234 567"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="recruit-form-group">
                <label>Thư giới thiệu</label>
                <textarea
                  name="coverLetter"
                  placeholder="Giới thiệu bản thân và lý do bạn muốn ứng tuyển..."
                  value={form.coverLetter}
                  onChange={handleChange}
                  disabled={loading}
                  rows={4}
                />
              </div>

              <div className="recruit-form-group">
                <label>CV (PDF) <span className="required">*</span></label>
                <div className="recruit-file-upload">
                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                  />
                  <div className="recruit-file-info">
                    {cvFile ? (
                      <span className="file-selected">📄 {cvFile.name}</span>
                    ) : (
                      <span className="file-placeholder">📎 Chọn file PDF (tối đa 5MB)</span>
                    )}
                  </div>
                </div>
              </div>

              <button type="submit" className="recruit-submit-btn" disabled={loading}>
                {loading ? "⌛ Đang gửi..." : "🚀 Gửi đơn ứng tuyển"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
