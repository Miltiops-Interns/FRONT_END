import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../utils/checkToken";
import "./AdminOrdersPage.css";
import { apiFetch } from "../utils/api";

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const isValid = await checkToken();
      if (!isMounted) return; // Prevent navigation if component unmounted
      
      if (!isValid) {
        localStorage.removeItem("token");
        navigate("/admin/login");
        return;
      }
      
      if (isMounted) {
        fetchOrders();
      }
    };
    
    init();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch("/api/orders", {
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
      await apiFetch(`/api/orders/${id}`, {
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

  const handleWhatsApp = (phone, customerName, orderItems, subtotal, cgst, sgst, totalPrice) => {
    // Format order items for WhatsApp message
    const itemsText = orderItems
      .map(
        (item) =>
          `${item.name} × ${item.quantity} - ₹${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    // Calculate subtotal if not provided (for backward compatibility)
    const calculatedSubtotal = subtotal || orderItems.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
    const calculatedCGST = cgst || calculatedSubtotal * 0.025;
    const calculatedSGST = sgst || calculatedSubtotal * 0.025;
    const calculatedTotal = totalPrice || calculatedSubtotal + calculatedCGST + calculatedSGST;

    // Use simple emojis - using ASCII-safe alternatives that work better with WhatsApp
    // Using simple symbols that encode properly in URLs
    const message = `Hi ${customerName}! 

Your order has been received and is being processed.

Order Details:
${itemsText}

Subtotal: ₹${calculatedSubtotal.toFixed(2)}
CGST (2.5%): ₹${calculatedCGST.toFixed(2)}
SGST/UTGST (2.5%): ₹${calculatedSGST.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━
Total: ₹${calculatedTotal.toFixed(2)}

We'll keep you updated on your order status. Thank you for choosing Punjabi Rasoi!`;
    
    // Encode message for WhatsApp URL
    // Use encodeURIComponent which properly encodes UTF-8 characters
    const encodedMessage = encodeURIComponent(message);
    
    // Generate WhatsApp URL using api.whatsapp.com (better emoji support than wa.me)
    const cleanPhone = phone.replace(/\D/g, "");
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

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
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="dashboard-btn"
      >
        🏠 Back to Dashboard
      </button>
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
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{Number(order.subtotal || order.totalPrice).toFixed(2)}</span>
                  </div>
                  {order.cgst !== undefined && order.sgst !== undefined && (
                    <>
                      <div className="summary-row">
                        <span>CGST (2.5%):</span>
                        <span>₹{Number(order.cgst).toFixed(2)}</span>
                      </div>
                      <div className="summary-row">
                        <span>SGST/UTGST (2.5%):</span>
                        <span>₹{Number(order.sgst).toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="summary-row total-row">
                    <strong>Total:</strong>
                    <strong>₹{Number(order.totalPrice).toFixed(2)}</strong>
                  </div>
                </div>
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
                        order.subtotal,
                        order.cgst,
                        order.sgst,
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
