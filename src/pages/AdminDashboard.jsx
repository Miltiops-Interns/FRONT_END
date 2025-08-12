import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../utils/checkToken";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [messageCount, setMessageCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const verify = async () => {
      const isValid = await checkToken();
      if (!isValid) {
        localStorage.removeItem("token");
        navigate("/admin/login");
      }
    };

    verify();
    fetchMessageCount();
    fetchReservationCount();
    fetchOrderCount();
  }, [navigate]);

  const fetchMessageCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/messages/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setMessageCount(data.count);
    } catch (err) {
      console.error("Error fetching message count:", err);
    }
  };

  const fetchReservationCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/reservations/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setReservationCount(data.count);
    } catch (err) {
      console.error("Error fetching reservation count:", err);
    }
  };

  const fetchOrderCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/orders/count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setOrderCount(data.count);
    } catch (err) {
      console.error("Error fetching order count:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h3>Admin Panel</h3>
        <ul>
          <li onClick={() => navigate("/admin/menu")}>Manage Menu</li>
          <li onClick={() => navigate("/admin/orders")}>
            Orders{" "}
            {orderCount > 0 && (
              <span className="message-count">({orderCount})</span>
            )}
          </li>
          <li onClick={() => navigate("/admin/reservations")}>
            Reservations{" "}
            {reservationCount > 0 && (
              <span className="message-count">({reservationCount})</span>
            )}
          </li>
          <li onClick={() => navigate("/admin/contact")}>
            Contact Messages{" "}
            {messageCount > 0 && (
              <span className="message-count">({messageCount})</span>
            )}
          </li>
        </ul>
        <button onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main-content">
        <h2>Welcome, Admin 👋</h2>
        <p>This is your dashboard. Choose an action from the left.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
