import React, { useEffect, useState } from "react";
import "./ContactMessagesPage.css";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    const fetchMessages = async () => {
      try {
        const res = await apiFetch("/api/messages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        
        if (!isMounted) return; // Prevent state update if component unmounted
        
        setMessages(data);
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching messages:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [token]);

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    await apiFetch(`/api/messages/${id}`, {
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
                <strong>Phone:</strong> {msg.phone || "—"}
              </p>
              <p>
                <strong>Message:</strong>
                <br />
                {msg.message}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(msg.createdAt).toLocaleString()}
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
