import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../utils/checkToken";
import "./AdminOrdersPage.css";
import API_URL from "../config/api";

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const isValid = await checkToken();
      if (!isValid) {
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }
      fetchOrders();
    };
    init();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (e) {
      console.error("Error fetching orders:", e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  const handleWhatsApp = (phone, customerName, orderItems, totalPrice) => {
    // Format order items for WhatsApp message
    const itemsText = orderItems
      .map(
        (item) =>
          `${item.name} × ${item.quantity} - ₹${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const message = `Hi ${customerName}! 👋

Your order has been received and is being processed.

📋 Order Details:
${itemsText}

💰 Total: ₹${totalPrice.toFixed(2)}

We'll keep you updated on your order status. Thank you for choosing Punjabi Rasoi! 🍽️`;

    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);

    // Generate WhatsApp URL (works on both mobile and desktop)
    const whatsappUrl = `https://wa.me/${phone.replace(
      /\D/g,
      ""
    )}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="admin-orders-page">
        <div className="loading-container">
          <div>Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-page">
      <div className="orders-header">
        <h2>Orders Management</h2>
        <p>View and manage customer orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <h3>No orders yet</h3>
          <p>Orders will appear here once customers start placing them.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="customer-info">
                  <h3>{order.customerName}</h3>
                  <p>📱 Phone: {order.phone}</p>
                  {order.whatsapp && <p>💬 WhatsApp: {order.whatsapp}</p>}
                </div>
                <div>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <span className="item-name">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="item-price">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <strong>Total</strong>
                <strong>₹{Number(order.totalPrice).toFixed(2)}</strong>
              </div>

              <div className="order-actions">
                {["new", "processing", "completed", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      className={`status-btn ${
                        order.status === status ? "active" : ""
                      }`}
                      onClick={() => updateStatus(order._id, status)}
                    >
                      {status}
                    </button>
                  )
                )}

                {(order.phone || order.whatsapp) && (
                  <button
                    className="whatsapp-btn"
                    onClick={() =>
                      handleWhatsApp(
                        order.whatsapp || order.phone,
                        order.customerName,
                        order.items,
                        order.totalPrice
                      )
                    }
                  >
                    <span className="whatsapp-icon">💬</span>
                    WhatsApp
                  </button>
                )}
              </div>

              <div className="order-meta">
                <p>Order ID: {order._id}</p>
                <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
                {order.updatedAt !== order.createdAt && (
                  <p>Updated: {new Date(order.updatedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
