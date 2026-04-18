import { useState, useRef, useEffect } from "react";
import "../styles/chatbox.css";
export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT
export default function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào 👋 Tôi có thể giúp gì cho bạn?" }
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // add user + typing (GỘP 1 lần setState)
    setMessages(prev => [
      ...prev,
      { sender: "user", text: userMessage },
      { sender: "bot", typing: true }
    ]);

    try {
      const res = await fetch(`${API_BASE_DEFAULT}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await res.json();

      setMessages(prev => {
        const withoutTyping = prev.slice(0, -1);
        return [
          ...withoutTyping,
          {
            sender: "bot",
            text: data.reply,
            doctors: data.doctors || []
          }
        ];
      });

    } catch (err) {
      setMessages(prev => {
        const withoutTyping = prev.slice(0, -1);
        return [...withoutTyping, { sender: "bot", text: "Lỗi server ❌" }];
      });
    }

    setLoading(false);
  };

  return (
    <div className="chat-container">
      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>

      {open && (
        <div className="chat-box">
          <div className="chat-header">🤖 AI tư vấn</div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.sender}`}>

                {msg.sender === "bot" && <div className="avatar">🤖</div>}

                <div className="content">
                  {msg.typing ? (
                    <div className="bubble typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <div className="bubble">{msg.text}</div>
                  )}

                  {/* Doctor list */}
                  {msg.doctors?.length > 0 && (
                    <div className="doctor-list">
                      {msg.doctors.map(doc => (
                        <div className="doctor-card" key={doc._id}>
                          <h4>{doc.name}</h4>
                          <p>{doc.specialty}</p>
                          <p>{doc.hospital}</p>

                          <button
                            onClick={() =>
                              window.location.href = `/appointments?doctor=${doc._id}`
                            }
                          >
                            Đặt lịch
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === "user" && <div className="avatar">🧑</div>}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <div className="chat-footer">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              rows={1}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}