import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaSync, FaClock, FaCheckCircle, FaChevronLeft } from "react-icons/fa";
import "../styles/payment.css";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function Payment() {
  const navigate = useNavigate();

  const appointmentId = localStorage.getItem("appointmentId");
  const userId = localStorage.getItem("userId");
  const amount = Number(localStorage.getItem("appointmentPrice")) || 0;

  const [qr, setQr] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút là đủ
  const [status, setStatus] = useState("pending"); // pending, processing, paid
  const [lastChecked, setLastChecked] = useState(null);

  const pollingIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  /* ===============================
     1. TẠO PAYMENT & QR CODE
  ================================ */
  useEffect(() => {
    if (!appointmentId) {
      console.warn("No appointmentId found, redirecting...");
      navigate("/");
      return;
    }

    const createPayment = async () => {
      try {
        const res = await fetch(`${API_BASE_DEFAULT}/payments/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId, userId, amount }),
        });

        const data = await res.json();
        if (data.qr) {
          setQr(data.qr);
        }
      } catch (err) {
        console.error("Create payment error:", err);
      }
    };

    createPayment();
  }, [appointmentId, userId, amount, navigate]);

  /* ===============================
     2. POLLING KIỂM TRA TRẠNG THÁI
  ================================ */
  const checkPayment = async () => {
    if (status === "paid") return;

    setLastChecked(new Date().toLocaleTimeString());
    setStatus("processing");

    try {
      const res = await fetch(`${API_BASE_DEFAULT}/payments/check/${appointmentId}`);
      const data = await res.json();

      if (data.paid) {
        setStatus("paid");
        clearInterval(pollingIntervalRef.current);
        clearInterval(countdownIntervalRef.current);

        localStorage.removeItem("appointmentId");
        localStorage.removeItem("appointmentPrice");

        setTimeout(() => {
          navigate("/schedule"); // Chuyển sang trang Lịch khám sau khi thành công
        }, 2000);
      } else {
        setStatus("pending");
      }
    } catch (err) {
      console.error("Check payment error:", err);
      setStatus("pending");
    }
  };

  useEffect(() => {
    if (appointmentId && status !== "paid") {
      pollingIntervalRef.current = setInterval(checkPayment, 4000); // 4 giây một lần
    }
    return () => clearInterval(pollingIntervalRef.current);
  }, [appointmentId, status]);

  /* ===============================
     3. ĐẾM NGƯỢC THỜI GIAN
  ================================ */
  useEffect(() => {
    if (status === "paid") return;

    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          clearInterval(pollingIntervalRef.current);
          alert("Hết thời gian thanh toán. Vui lòng thử lại.");
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownIntervalRef.current);
  }, [navigate, status]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-teal-600 transition-colors">
            <FaChevronLeft />
          </button>
          <h2 className="flex-grow text-center">Thanh toán Online</h2>
          <div className="w-4"></div>
        </div>

        <p className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-bold">Số tiền cần trả</p>
        <p className="amount">{amount.toLocaleString()} VND</p>

        <div className="qr-box">
          <p className="text-xs text-gray-400 mb-2 italic">Quét mã QR bằng ứng dụng Ngân hàng hoặc Ví điện tử</p>
          {qr ? (
            <img src={qr} className="qr shadow-xl ring-4 ring-teal-50" alt="QR Payment" />
          ) : (
            <div className="w-full h-48 flex items-center justify-center bg-gray-50 rounded-2xl animate-pulse">
              <p className="text-gray-400 text-sm">Đang tạo mã QR...</p>
            </div>
          )}

          <div className="mt-4 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Cú pháp chuyển khoản:</p>
            <p className="text-lg font-black text-slate-800 tracking-wider">PAY_{appointmentId}</p>
          </div>
        </div>

        <div className="timer flex items-center justify-center space-x-2">
          <FaClock className="animate-pulse" />
          <span>Hết hạn sau: <b>{formatTime(timeLeft)}</b></span>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <span className="flex items-center">
              <FaSync className={`mr-1 ${status === 'processing' ? 'animate-spin text-teal-500' : ''}`} />
              {status === 'processing' ? 'Đang kiểm tra...' : 'Tự động cập nhật'}
            </span>
            {lastChecked && <span>Cập nhật lúc: {lastChecked}</span>}
          </div>

          {status === "paid" ? (
            <div className="success flex items-center justify-center space-x-2">
              <FaCheckCircle className="text-xl" />
              <span>Thanh toán thành công! Đang chuyển hướng...</span>
            </div>
          ) : (
            <div className="bg-gray-50 p-3 rounded-xl text-[11px] text-gray-500 italic">
              * Sau khi chuyển khoản thành công, vui lòng giữ nguyên trang này trong vài giây để hệ thống xác nhận.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
