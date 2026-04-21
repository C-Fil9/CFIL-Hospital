import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import "../styles/doctor-layout.css";

const API = import.meta.env.VITE_API_BASE_DEFAULT;

export default function PatientChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);
  const pollRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/messages/conversations/patient`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Poll messages when conversation selected
  useEffect(() => {
    if (!selectedConv) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/messages/${selectedConv.appointmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadMessages();
    pollRef.current = setInterval(loadMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, [selectedConv]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedConv || sending) return;
    setSending(true);
    try {
      const token = localStorage.getItem("token");
      // Doctor's userId is stored in doctor.userId
      const receiverId = selectedConv.doctor?.userId?._id || selectedConv.doctor?.userId;

      await fetch(`${API}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          appointmentId: selectedConv.appointmentId,
          receiverId,
          content: input.trim(),
        }),
      });

      setInput("");
      const res = await fetch(`${API}/messages/${selectedConv.appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
      fetchConversations();
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : "");
  const formatTime = (ts) =>
    ts ? new Date(ts).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "";

  if (!user) return null;

  return (
    <div className="patient-chat-page" style={{ padding: "90px 24px 40px" }}>
      <h2>💬 Tin nhắn với Bác sĩ</h2>

      {loading ? (
        <p style={{ color: "#64748b" }}>Đang tải dữ liệu...</p>
      ) : conversations.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px",
            background: "#f8fafc",
            borderRadius: "14px",
            color: "#94a3b8",
            border: "1px dashed #cbd5e1",
          }}
        >
          <p style={{ fontSize: "2rem", margin: "0 0 8px" }}>💬</p>
          <p>Bạn chưa có lịch hẹn nào. Hãy đặt lịch để nhắn tin với bác sĩ.</p>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "20px", height: "520px" }}>
          {/* Left: conversation list */}
          <div
            style={{
              width: "280px",
              minWidth: "280px",
              background: "#fff",
              borderRadius: "14px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                padding: "14px 16px",
                fontWeight: 700,
                fontSize: "0.88rem",
                color: "#1e293b",
                borderBottom: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            >
              Lịch hẹn của bạn ({conversations.length})
            </div>
            <div style={{ overflowY: "auto", flex: 1 }}>
              {conversations.map((conv) => (
                <div
                  key={conv.appointmentId}
                  onClick={() => setSelectedConv(conv)}
                  className={`conv-item${selectedConv?.appointmentId === conv.appointmentId ? " active" : ""}`}
                >
                  <div className="conv-avatar" style={{ fontSize: "1.2rem", background: "linear-gradient(135deg,#0f4c81,#1a73e8)" }}>
                    👨‍⚕️
                  </div>
                  <div className="conv-info">
                    <div className="conv-name">
                      BS. {conv.doctor?.name || "Bác sĩ"}
                    </div>
                    <div className="conv-preview">
                      {conv.doctor?.specialty}
                    </div>
                    <div className="conv-date">
                      📅 {formatDate(conv.date)} {conv.time}
                    </div>
                  </div>
                  {conv.unreadCount > 0 && (
                    <div className="unread-badge">{conv.unreadCount}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: chat */}
          {selectedConv ? (
            <div
              className="patient-chat-panel"
              style={{ flex: 1 }}
            >
              {/* Header */}
              <div className="chat-window-header">
                <div className="chat-header-avatar">👨‍⚕️</div>
                <div className="chat-header-info">
                  <h4>BS. {selectedConv.doctor?.name}</h4>
                  <p>
                    {selectedConv.doctor?.specialty} — {selectedConv.doctor?.hospital}
                    &nbsp;·&nbsp; Lịch hẹn: {formatDate(selectedConv.date)} lúc {selectedConv.time}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", padding: "32px" }}>
                    Bắt đầu cuộc trò chuyện với bác sĩ...
                  </div>
                )}
                {messages.map((msg) => {
                  const isMine =
                    msg.senderId?._id === user?._id ||
                    msg.senderId === user?._id;
                  return (
                    <div
                      key={msg._id}
                      className={`msg-bubble-wrap ${isMine ? "mine" : "theirs"}`}
                    >
                      <div className="msg-bubble">{msg.content}</div>
                      <div className="msg-time">{formatTime(msg.createdAt)}</div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="chat-input-area">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi gửi bác sĩ..."
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  className="chat-send-btn"
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                >
                  {sending ? "..." : "Gửi ➤"}
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                flex: 1,
                background: "#fff",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "12px",
                color: "#94a3b8",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              }}
            >
              <span style={{ fontSize: "2.5rem" }}>💬</span>
              <p style={{ fontSize: "0.95rem" }}>Chọn lịch hẹn để nhắn tin với bác sĩ</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
