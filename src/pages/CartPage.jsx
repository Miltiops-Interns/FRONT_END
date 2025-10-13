import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";
import API_URL from "../config/api";

const currency = (amount) => `₹${amount.toFixed(2)}`;

const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  // Local state for showing additional menu items
  const [menuData, setMenuData] = useState([]); // grouped: [{ category, items: [...] }]
  const [selectedCategory, setSelectedCategory] = useState("");
  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_URL}/api/menu`);
        const data = await res.json();

        const grouped = data.reduce((acc, item) => {
          const cat = item.category || "Others";
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item);
          return acc;
        }, {});

        const formatted = Object.entries(grouped).map(([category, items]) => ({
          category,
          items,
        }));

        setMenuData(formatted);
        if (formatted.length > 0) setSelectedCategory(formatted[0].category);
      } catch (e) {
        console.error("Failed to fetch menu for cart page:", e);
      }
    };

    fetchMenu();
  }, []);

  const flatMenuForSelectedCategory = useMemo(() => {
    const found = menuData.find((g) => g.category === selectedCategory);
    return found ? found.items : [];
  }, [menuData, selectedCategory]);

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert("Please enter your name and phone number");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          whatsapp,
          items,
          totalPrice,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit order");
      setIsCheckoutOpen(false);
      alert("Order submitted successfully!");
      clearCart();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting your order.");
    }
  };

  const { addItem } = useCart();
  const handleAddMore = (menuItem) => {
    addItem({
      id: menuItem._id,
      name: menuItem.name,
      price: Number(menuItem.price) || 0,
      image: menuItem.image,
    });
  };

  return (
    <div className="cart-page">
      <Navbar />

      <div className="page-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="header-content"
        >
          <h1>Your Order</h1>
          <p>Review your selections and proceed to checkout</p>
        </motion.div>
      </div>

      <div
        className="cart-container"
        style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}
      >
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <p>Your cart is empty.</p>
            <Link to="/menu">Browse the menu</Link>
          </div>
        ) : (
          <div
            className="cart-content"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: 24,
            }}
          >
            <div className="cart-items" style={{ display: "grid", gap: 16 }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "80px 1fr auto",
                    gap: 16,
                    alignItems: "center",
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <img
                    src={
                      item.image || "https://via.placeholder.com/80?text=Item"
                    }
                    alt={item.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: "#444" }}>
                      {currency(Number(item.price) || 0)}
                    </div>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <input
                      className="qty-input"
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          item.id,
                          Math.max(1, Number(e.target.value) || 1)
                        )
                      }
                    />
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Increase"
                    >
                      +
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="cart-summary"
              style={{
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 16,
                height: "fit-content",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Order Summary</h3>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Items</span>
                <strong>{totalItems}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <span>Total</span>
                <strong>{currency(totalPrice)}</strong>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="checkout-btn"
                style={{ width: "100%", marginTop: 16 }}
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Add more items section */}
      <div style={{ maxWidth: 960, margin: "24px auto", padding: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Add more items</h3>
        {menuData.length > 0 ? (
          <>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 12,
              }}
            >
              {menuData.map((group) => (
                <button
                  key={group.category}
                  onClick={() => setSelectedCategory(group.category)}
                  className={`category-pill ${
                    selectedCategory === group.category ? "active" : ""
                  }`}
                >
                  {group.category}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 16,
              }}
            >
              {flatMenuForSelectedCategory.map((mi) => (
                <div
                  key={mi._id}
                  style={{
                    border: "1px solid #eee",
                    borderRadius: 8,
                    padding: 12,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <img
                    src={
                      mi.image ||
                      "https://via.placeholder.com/300x180?text=Item"
                    }
                    alt={mi.name}
                    style={{
                      width: "100%",
                      height: 140,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{mi.name}</div>
                    <div>{currency(Number(mi.price) || 0)}</div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddMore(mi)}
                    className="add-more-btn"
                  >
                    Add
                  </motion.button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ color: "#666" }}>Loading menu...</p>
        )}
      </div>

      {/* Checkout modal */}
      {isCheckoutOpen && (
        <div className="checkout-modal">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Your Details</h3>
              <button
                className="modal-close"
                onClick={() => setIsCheckoutOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <form className="modal-form" onSubmit={submitOrder}>
              <div className="form-field">
                <label className="form-label">Name</label>
                <input
                  className="text-input"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">Phone</label>
                <input
                  className="text-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">WhatsApp (optional)</label>
                <input
                  className="text-input"
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="WhatsApp number"
                />
              </div>
              <div className="order-total-row">
                <strong>Total</strong>
                <strong>{currency(totalPrice)}</strong>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="remove-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="checkout-btn">
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CartPage;
