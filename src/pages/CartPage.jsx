import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";
import { apiFetch } from "../utils/api";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchMenu = async () => {
      try {
        const res = await apiFetch("/api/menu");
        const data = await res.json();

        if (!isMounted) return; // Prevent state update if component unmounted

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
        if (isMounted) {
          console.error("Failed to fetch menu for cart page:", e);
        }
      }
    };

    fetchMenu();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  const flatMenuForSelectedCategory = useMemo(() => {
    const found = menuData.find((g) => g.category === selectedCategory);
    return found ? found.items : [];
  }, [menuData, selectedCategory]);

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert("Please enter your name and phone number");
      return;
    }
    setIsSubmittingOrder(true);
    try {
      const res = await apiFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          whatsapp: phone, // Use phone number for WhatsApp tracking
          items,
          totalPrice,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit order");
      setIsCheckoutOpen(false);
      setShowSuccessModal(true);
      clearCart();
      // Auto-close modal and navigate after 3 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while submitting your order.");
    } finally {
      setIsSubmittingOrder(false);
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

      <div className="cart-container">
        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link to="/menu">Browse the menu</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={
                      item.image || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23999'%3EItem%3C/text%3E%3C/svg%3E"
                    }
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">
                      {currency(Number(item.price) || 0)}
                    </div>
                  </div>
                  <div className="cart-item-actions">
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
                      className="remove-btn cart-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="cart-summary-row">
                <span>Items</span>
                <strong>{totalItems}</strong>
              </div>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <strong>{currency(totalPrice)}</strong>
              </div>
              <div className="cart-summary-row cart-summary-tax">
                <span>CGST (2.5%)</span>
                <span>{currency(totalPrice * 0.025)}</span>
              </div>
              <div className="cart-summary-row cart-summary-tax">
                <span>SGST/UTGST (2.5%)</span>
                <span>{currency(totalPrice * 0.025)}</span>
              </div>
              <div className="cart-summary-total">
                <span>Total</span>
                <strong>{currency(totalPrice * 1.05)}</strong>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </div>
        )}
      </div>

      {/* Add more items section */}
      <section className="cart-add-more">
        <h3>Add more items</h3>
        {menuData.length > 0 ? (
          <>
            <div className="cart-add-more-categories">
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
            <div className="cart-add-more-grid">
              {flatMenuForSelectedCategory.map((mi) => (
                <div key={mi._id} className="cart-add-more-card">
                  <img
                    src={
                      mi.image ||
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='180'%3E%3Crect width='300' height='180' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3EItem%3C/text%3E%3C/svg%3E"
                    }
                    alt={mi.name}
                    className="cart-add-more-image"
                  />
                  <div className="cart-add-more-details">
                    <div className="cart-add-more-name">{mi.name}</div>
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
          <p className="cart-add-more-loading">Loading menu...</p>
        )}
      </section>

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
                <label className="form-label">
                  Phone <span className="form-label-hint">(WhatsApp for tracking)</span>
                </label>
                <input
                  className="text-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone/WhatsApp number"
                  required
                />
              </div>
              <div className="modal-summary">
                <div className="modal-summary-row">
                  <span>Subtotal</span>
                  <span>{currency(totalPrice)}</span>
                </div>
                <div className="modal-summary-row modal-summary-tax">
                  <span>CGST (2.5%)</span>
                  <span>{currency(totalPrice * 0.025)}</span>
                </div>
                <div className="modal-summary-row modal-summary-tax">
                  <span>SGST/UTGST (2.5%)</span>
                  <span>{currency(totalPrice * 0.025)}</span>
                </div>
                <div className="order-total-row modal-summary-total">
                  <strong>Total</strong>
                  <strong>{currency(totalPrice * 1.05)}</strong>
                </div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="remove-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="checkout-btn"
                  disabled={isSubmittingOrder}
                >
                  {isSubmittingOrder ? (
                    <span className="checkout-loading">
                      <Loading type="food" size="small" />
                      <span>Submitting...</span>
                    </span>
                  ) : (
                    "Submit Order"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal Popup */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowSuccessModal(false);
              navigate("/");
            }}
          >
            <motion.div
              className="modal-content contact-success-modal"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-button"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/");
                }}
              >
                ×
              </button>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="success-message"
              >
                <i className="fas fa-check-circle"></i>
                <h3>Order Submitted Successfully!</h3>
                <p>Thank you for your order. We'll prepare your delicious meal and contact you soon!</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default CartPage;
