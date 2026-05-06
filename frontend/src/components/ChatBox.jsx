import { useState, useRef, useEffect } from "react";
import "../styles/chatbox.css";
export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT;

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Xin chào 👋 Tôi có thể giúp gì cho bạn? Bạn có thể nhập triệu chứng hoặc gửi hình ảnh để được tư vấn." }
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP");
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Ảnh tối đa 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Reset input để có thể chọn lại cùng file
    e.target.value = "";
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  const sendMessage = async () => {
    if ((!input.trim() && !imageFile) || loading) return;

    const userMessage = input.trim();
    const hasImage = !!imageFile;
    const previewUrl = imagePreview;

    setInput("");
    setLoading(true);

    // Add user message + typing indicator
    setMessages(prev => [
      ...prev,
      {
        sender: "user",
        text: userMessage || (hasImage ? "📷 Gửi hình ảnh để phân tích" : ""),
        image: previewUrl
      },
      { sender: "bot", typing: true }
    ]);

    try {
      let data;

      if (hasImage) {
        // Gửi ảnh qua FormData
        const formData = new FormData();
        formData.append("image", imageFile);
        if (userMessage) formData.append("message", userMessage);

        const res = await fetch(`${API_BASE_DEFAULT}/chat/image`, {
          method: "POST",
          body: formData
        });
        data = await res.json();
      } else {
        // Gửi text bình thường
        const res = await fetch(`${API_BASE_DEFAULT}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: userMessage })
        });
        data = await res.json();
      }

      setMessages(prev => {
        const withoutTyping = prev.slice(0, -1);
        return [
          ...withoutTyping,
          {
            sender: "bot",
            text: data.reply,
            doctors: data.doctors || [],
            imageAnalysis: data.imageAnalysis || false
          }
        ];
      });

    } catch (err) {
      setMessages(prev => {
        const withoutTyping = prev.slice(0, -1);
        return [...withoutTyping, { sender: "bot", text: "Lỗi server ❌" }];
      });
    }

    // Clear image state (không revoke vì URL còn dùng trong message)
    setImageFile(null);
    setImagePreview(null);
    setLoading(false);
  };

  return (
    <div className="chat-container">
      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>

      {open && (
        <div className="chat-box">
          <div className="chat-header">
            <span>🤖 AI tư vấn sức khỏe</span>
            <span className="chat-header-badge">Hỗ trợ hình ảnh</span>
          </div>

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
                    <>
                      {/* Hiển thị ảnh trong tin nhắn user */}
                      {msg.image && (
                        <div className="msg-image-wrapper">
                          <img src={msg.image} alt="Ảnh gửi" className="msg-image" />
                        </div>
                      )}

                      {/* Badge phân tích ảnh */}
                      {msg.imageAnalysis && (
                        <div className="image-analysis-badge">
                          🔬 Phân tích hình ảnh
                        </div>
                      )}

                      <div className="bubble">{msg.text}</div>
                    </>
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

          {/* Image preview */}
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button className="image-preview-remove" onClick={removeImage} title="Xoá ảnh">
                ✕
              </button>
            </div>
          )}

          <div className="chat-footer">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              style={{ display: "none" }}
            />

            {/* Camera button */}
            <button
              className="image-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              title="Gửi hình ảnh"
            >
              📷
            </button>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={imageFile ? "Mô tả thêm (tuỳ chọn)..." : "Nhập câu hỏi..."}
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
              disabled={loading || (!input.trim() && !imageFile)}
            >
              {loading ? "⏳" : "Gửi"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}