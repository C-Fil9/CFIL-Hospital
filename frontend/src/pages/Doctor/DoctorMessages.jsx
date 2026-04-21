import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import "../../styles/doctor-layout.css";

const API = import.meta.env.VITE_API_BASE_DEFAULT;

export default function DoctorMessages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);
  const pollRef = useRef(null);

  // Load conversation list
  const fetchConversations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/messages/conversations/doctor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setConversations(data);

        // Auto-select nếu có query param ?appt=xxx
        const apptParam = searchParams.get("appt");
        if (apptParam) {
          const found = data.find((c) => c.appointmentId === apptParam);
          if (found) setSelectedConv(found);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load & poll messages of selected conversation
  useEffect(() => {
    if (!selectedConv) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API}/messages/${selectedConv.appointmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (Array.isArray(data)) setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadMessages();
    // Polling mỗi 5 giây
    pollRef.current = setInterval(loadMessages, 5000);
    return () => clearInterval(pollRef.current);
  }, [selectedConv]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !selectedConv || sending) return;

    setSending(true);
    try {
      const token = localStorage.getItem("token");
      const receiverId = selectedConv.patient?._id;

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

      // Refresh messages + conversations
      const res = await fetch(
        `${API}/messages/${selectedConv.appointmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);

      fetchConversations();
    } catch (err) {
      console.error(err);
    }
    setSending(false);
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("vi-VN");
  };

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className="messages-page">
      <h2>💬 Tin nhắn với bệnh nhân</h2>

      <div className="messages-container">
        {/* LEFT: Conversation List */}
        <div className="conversation-list">
          <div className="conv-list-header">
            Lịch hẹn ({conversations.length})
          </div>
          <div className="conv-items">
            {conversations.length === 0 && (
              <div style={{ padding: "24px", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>
                Chưa có bệnh nhân nào đặt lịch
              </div>
            )}
            {conversations.map((conv) => (
              <div
                key={conv.appointmentId}
                className={`conv-item${selectedConv?.appointmentId === conv.appointmentId ? " active" : ""}`}
                onClick={() => setSelectedConv(conv)}
              >
                <div className="conv-avatar">
                  {getInitial(conv.patient?.username)}
                </div>
                <div className="conv-info">
                  <div className="conv-name">{conv.patient?.username || "Bệnh nhân"}</div>
                  <div className="conv-preview">
                    {conv.lastMessage ? conv.lastMessage.content : "Chưa có tin nhắn"}
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

        {/* RIGHT: Chat Window */}
        {selectedConv ? (
          <div className="chat-window">
            {/* Header */}
            <div className="chat-window-header">
              <div className="chat-header-avatar">
                {getInitial(selectedConv.patient?.username)}
              </div>
              <div className="chat-header-info">
                <h4>{selectedConv.patient?.username || "Bệnh nhân"}</h4>
                <p>
                  {selectedConv.patient?.email} &nbsp;·&nbsp;
                  Lịch hẹn: {formatDate(selectedConv.date)} lúc {selectedConv.time}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 && (
                <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", padding: "32px 0" }}>
                  Bắt đầu cuộc trò chuyện với bệnh nhân...
                </div>
              )}
              {messages.map((msg) => {
                const isMine = msg.senderId?._id === user?._id || msg.senderId === user?._id;
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
                placeholder="Nhập tin nhắn cho bệnh nhân..."
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
          <div className="chat-window no-chat-selected">
            <div className="icon">💬</div>
            <p>Chọn bệnh nhân để bắt đầu nhắn tin</p>
          </div>
        )}
      </div>
    </div>
  );
}
