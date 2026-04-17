import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";
import logo from "../../asset/logohpt.jpg";
import "../styles/appointments.css";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function Appointments() {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        hospital: "",
        service: "",
        price: 0,
        doctorId: "",
        date: "",
        time: "",
        description: "",
        paymentMethod: "",
    });

    useEffect(() => {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            alert("Bạn cần đăng nhập!");
            navigate("/login");
            return;
        }

        fetchDoctors();
    }, [navigate]);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(`${API_BASE_DEFAULT}/doctors`);
            const data = await res.json();
            setDoctors(data);
        } catch (err) {
            console.log(err);
        }
    };

    // 🔥 HANDLE CHANGE PRO
    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedForm = { ...form, [name]: value };

        // 🔥 Khi chọn bác sĩ → lấy giá + bệnh viện
        if (name === "doctorId") {
            const selectedDoctor = doctors.find(d => d._id === value);

            if (selectedDoctor) {
                updatedForm.price = Number(selectedDoctor.price);
                updatedForm.hospital = selectedDoctor.hospital || "";
            }
        }

        setForm(updatedForm);
    };

    // 🔥 SUBMIT PRO
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem("userId");

        // validate
        if (!form.service || !form.doctorId || !form.date || !form.time) {
            alert("Vui lòng nhập đầy đủ!");
            return;
        }

        if (!form.paymentMethod) {
            alert("Vui lòng chọn phương thức thanh toán!");
            return;
        }

        if (!/^[0-9]{9,11}$/.test(form.phone)) {
            alert("Số điện thoại không hợp lệ!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${API_BASE_DEFAULT}/appointments/user/${userId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            if (res.ok) {
                if (form.paymentMethod === "QR") {
                    // Create payment record with method = "qr"
                    await fetch(`${API_BASE_DEFAULT}/payments/create`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            appointmentId: data.data._id,
                            userId,
                            amount: form.price,
                            method: "qr",
                        }),
                    });

                    localStorage.setItem("appointmentId", data.data._id);
                    localStorage.setItem("appointmentPrice", form.price);
                    alert("Đặt lịch thành công! Chuyển sang thanh toán Online.");
                    navigate("/payment");
                } else {
                    // Create payment record with method = "counter"
                    await fetch(`${API_BASE_DEFAULT}/payments/create`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            appointmentId: data.data._id,
                            userId,
                            amount: form.price,
                            method: "counter",
                        }),
                    });

                    alert("Đặt lịch thành công! Vui lòng thanh toán tại quầy khi đến khám.");
                    navigate("/schedule");
                }
            } else {
                alert(data.message || "Đặt lịch thất bại!");
            }
        } catch (err) {
            console.log(err);
            alert("Lỗi server!");
        }

        setLoading(false);
    };

    return (
        <div className="page-container">
            <div className="appointment-card">
                <h1>
                    <img src={logo} alt="Logo" className="appointment-title-logo" />
                    Đặt lịch khám
                </h1>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Họ và tên"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Số điện thoại"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />

                    {/* 🔥 SERVICE */}
                    <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn dịch vụ</option>
                        <option value="Khám tổng quát">Khám tổng quát</option>
                        <option value="Khám chuyên khoa">Khám chuyên khoa</option>
                    </select>

                    {/* 🔥 DOCTOR */}
                    <select
                        name="doctorId"
                        value={form.doctorId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn bác sĩ</option>
                        {doctors.map((doc) => (
                            <option key={doc._id} value={doc._id}>
                                {doc.name} - {doc.specialty}
                            </option>
                        ))}
                    </select>

                    {/* 🔥 AUTO HOSPITAL */}
                    {form.hospital && (
                        <p className="hospital">
                            <img src={logo} alt="Logo" className="mini-logo-inline" />
                            {form.hospital}
                        </p>
                    )}

                    {/* 🔥 PRICE */}
                    {form.price > 0 && (
                        <div className="service-price">
                            💰 Giá khám:
                            <span className="price">
                                {form.price.toLocaleString("vi-VN")} VNĐ
                            </span>
                        </div>
                    )}

                    <input
                        type="date"
                        name="date"
                        value={form.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="time"
                        value={form.time}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn giờ khám</option>
                        <option value="08:00">08:00</option>
                        <option value="09:00">09:00</option>
                        <option value="10:00">10:00</option>
                        <option value="11:00">11:00</option>
                        <option value="13:00">13:00</option>
                        <option value="14:00">14:00</option>
                        <option value="15:00">15:00</option>
                        <option value="16:00">16:00</option>
                    </select>

                    <textarea
                        name="description"
                        placeholder="Mô tả triệu chứng"
                        value={form.description}
                        onChange={handleChange}
                    />

                    {/* 🔥 PAYMENT METHOD */}
                    <div className="payment-method-section">
                        <p className="payment-method-label">Phương thức thanh toán</p>
                        <div className="payment-method-options">
                            <label
                                className={`payment-method-card${form.paymentMethod === "QR" ? " selected" : ""}`}
                                htmlFor="pm-online"
                            >
                                <input
                                    type="radio"
                                    id="pm-online"
                                    name="paymentMethod"
                                    value="QR"
                                    checked={form.paymentMethod === "QR"}
                                    onChange={handleChange}
                                />
                                <FaCreditCard className="payment-method-icon" />
                                <span className="payment-method-name">Thanh toán Online</span>
                                <span className="payment-method-desc">Quét mã QR qua ứng dụng ngân hàng</span>
                            </label>

                            <label
                                className={`payment-method-card${form.paymentMethod === "Counter" ? " selected" : ""}`}
                                htmlFor="pm-counter"
                            >
                                <input
                                    type="radio"
                                    id="pm-counter"
                                    name="paymentMethod"
                                    value="Counter"
                                    checked={form.paymentMethod === "Counter"}
                                    onChange={handleChange}
                                />
                                <FaMoneyBillWave className="payment-method-icon" />
                                <span className="payment-method-name">Thanh toán tại quầy</span>
                                <span className="payment-method-desc">Thanh toán khi đến khám tại bệnh viện</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={form.price === 0 || !form.paymentMethod || loading}
                    >
                        {loading
                            ? "Đang xử lý..."
                            : form.paymentMethod === "QR"
                                ? "Đặt lịch & Thanh toán Online"
                                : form.paymentMethod === "Counter"
                                    ? "Đặt lịch & Thanh toán tại quầy"
                                    : "Chọn phương thức thanh toán"}
                    </button>
                </form>
            </div>
        </div>
    );
}