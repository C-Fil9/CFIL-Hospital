import React, { useState, useEffect } from "react";
import {
  FaReply,
  FaCheckCircle,
  FaTrash,
} from "react-icons/fa";

export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export default function ManageContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_BASE_DEFAULT}/contacts`);
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (id) => {
    if (!replyMessage.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_DEFAULT}/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyMessage, status: "replied" }),
      });
      if (res.ok) {
        setReplyingTo(null);
        setReplyMessage("");
        fetchContacts();
      }
    } catch (error) {
      console.error("Error replying:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa liên hệ này?")) return;

    try {
      const res = await fetch(`${API_BASE_DEFAULT}/contacts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchContacts();
      } else {
        alert("Xóa thất bại!");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Lỗi server!");
    }
  };

  return (
    <>
      <h1 className="title">Quản lý liên hệ</h1>

      <div className="table-box" style={{ marginTop: '20px' }}>
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Người gửi</th>
                <th>Chủ đề</th>
                <th>Nội dung</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <React.Fragment key={c._id}>
                  <tr>
                    <td>
                      <strong>{c.name}</strong><br />
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.email}</span>
                    </td>
                    <td>{c.subject}</td>
                    <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.message}</td>
                    <td>
                      <span className={`status-badge ${c.status}`}>
                        {c.status === 'pending' ? 'Chưa trả lời' : 'Đã trả lời'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {c.status === 'pending' ? (
                          <button onClick={() => setReplyingTo(c._id)} className="action-btn reply">
                            <FaReply /> Phản hồi
                          </button>
                        ) : (
                          <span style={{ color: '#10b981' }}><FaCheckCircle /> Hoàn tất</span>
                        )}
                        <button onClick={() => handleDelete(c._id)} className="action-btn delete">
                          <FaTrash /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                  {replyingTo === c._id && (
                    <tr>
                      <td colSpan="5" style={{ padding: '15px', backgroundColor: '#f8fafc' }}>
                        <textarea
                          style={{ width: '100%', height: '100px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                          placeholder="Nhập nội dung phản hồi cho người dùng..."
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                        />
                        <div style={{ marginTop: '10px', textAlign: 'right' }}>
                          <button
                            onClick={() => setReplyingTo(null)}
                            style={{ marginRight: '10px', background: '#94a3b8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px' }}
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => handleReply(c._id)}
                            disabled={submitting}
                            style={{ background: '#0d9488', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px' }}
                          >
                            {submitting ? "Đang gửi..." : "Gửi phản hồi"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    
      <style>{`
        .status-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .status-badge.pending { background: #fef3c7; color: #92400e; }
        .status-badge.replied { background: #dcfce7; color: #166534; }
        .action-btn {
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 500;
        }
        .action-btn.reply { background: #3b82f6; color: white; }
        .action-btn.delete { background: #ef4444; color: white; }
        .action-btn.delete:hover { background: #dc2626; }
        .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </>
  );
}
