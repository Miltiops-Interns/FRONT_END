import React, { useEffect, useState } from "react";
import "./ContactMessagesPage.css";
import { useNavigate } from "react-router-dom";


const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    await fetch(`http://localhost:5000/api/messages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMessages(messages.filter((msg) => msg._id !== id));
  };
  const navigate = useNavigate();
  return (
    <div className="messages-admin">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="dashboard-btn"
      >
        🏠 Back to Dashboard
      </button>
      <h2>📨 Contact Messages</h2>

      {loading ? (
        <p>Loading...</p>
      ) : messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <div className="message-list">
          {messages.map((msg) => (
            <div key={msg._id} className="message-card">
              <p>
                <strong>Name:</strong> {msg.name}
              </p>
              <p>
                <strong>Email:</strong> {msg.email}
              </p>
              <p>
                <strong>Subject:</strong> {msg.subject || "—"}
              </p>
              <p>
                <strong>Message:</strong>
                <br />
                {msg.message}
              </p>
              <button onClick={() => deleteMessage(msg._id)}>🗑️ Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessagesPage;
