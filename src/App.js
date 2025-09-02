import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MenuPage from "./pages/MenuPage";
import ContactPage from "./pages/ContactPage";
import RestaurantScene from "./components/RestaurantScene";
import ReservationModal from "./components/ReservationModal";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMenuPage from "./pages/AdminMenuPage";
import AdminReservationsPage from "./pages/AdminReservationsPage";
import ContactMessagesPage from "./pages/ContactMessagesPage";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import AdminOrdersPage from "./pages/AdminOrdersPage";

// Home Page Component
const HomePage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const features = [
    {
      title: "Authentic Flavors",
      description: "Experience the rich and authentic taste of Punjab",
      icon: "🌶️",
      image:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Traditional Ambiance",
      description: "Immerse yourself in the warm and inviting atmosphere",
      icon: "🏺",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
    {
      title: "Expert Chefs",
      description: "Our master chefs bring decades of culinary expertise",
      icon: "👨‍🍳",
      image:
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    },
  ];

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reviews");
        const data = await response.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Fallback to static reviews if API fails
        setTestimonials([
          {
            name: "Sarah Johnson",
            comment:
              "The best Punjabi food I've ever had! The butter chicken is to die for.",
            rating: 5,
            image:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          },
          {
            name: "Michael Chen",
            comment:
              "Authentic flavors and amazing service. A must-visit restaurant!",
            rating: 5,
            image:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          },
          {
            name: "Priya Patel",
            comment:
              "Feels like home! The spices and aromas are exactly like my grandmother's cooking.",
            rating: 5,
            image:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Punjabi Rasoi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Experience the authentic flavors of Punjab
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button primary"
              >
                View Our Menu
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button secondary"
              onClick={() => setIsReservationOpen(true)}
            >
              Make a Reservation
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="features-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="features-container">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="feature-image">
                <img src={feature.image} alt={feature.title} />
                <div className="feature-overlay">
                  <span className="feature-icon">{feature.icon}</span>
                </div>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Restaurant Scene Section */}
      <RestaurantScene />

      {/* Testimonials Section */}
      <motion.section
        className="testimonials-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What Our Guests Say
        </motion.h2>
        <div className="testimonials-container">
          {loading ? (
            // Loading state
            <motion.div
              className="loading-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
                width: "100%",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: "40px",
                  height: "40px",
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #FF6B35",
                  borderRadius: "50%",
                }}
              />
            </motion.div>
          ) : testimonials.length > 0 ? (
            // Reviews loaded successfully
            testimonials.map((testimonial, index) => (
              <motion.div
                key={`${testimonial.name}-${index}`}
                className="testimonial-card"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="testimonial-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="testimonial-content">
                  <div className="rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="star">
                        ⭐
                      </span>
                    ))}
                  </div>
                  <p className="comment">{testimonial.comment}</p>
                  <h4 className="name">{testimonial.name}</h4>
                  {testimonial.time && (
                    <small className="review-time">
                      {new Date(testimonial.time * 1000).toLocaleDateString()}
                    </small>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            // No reviews available
            <motion.div
              className="no-reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center",
                padding: "40px",
                width: "100%",
              }}
            >
              <p>No reviews available at the moment.</p>
              <p>Be the first to share your experience!</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="cta-section"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to Experience Authentic Punjabi Cuisine?</h2>
          <p>Join us for an unforgettable dining experience</p>
          <div className="cta-buttons">
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button primary"
              >
                View Menu
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button secondary"
              onClick={() => setIsReservationOpen(true)}
            >
              Make a Reservation
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />
  
      <Footer />
    </>
  );
};

// Main App Component
function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/menu" element={<AdminMenuPage />} />
          <Route
            path="/admin/reservations"
            element={<AdminReservationsPage />}
          />
          <Route path="/admin/contact" element={<ContactMessagesPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
