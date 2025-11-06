import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loading from "../components/Loading";
import { apiFetch } from "../utils/api";

const ContactPage = () => {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // success or error
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setIsLoading(true);
    try {
      const res = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (res.ok) {
        setStatus("success");
        setShowSuccessModal(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          setStatus(null);
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <Navbar />
      <div className="page-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="header-content"
        >
          <h1>Contact Us</h1>
          <p>We'd love to hear from you</p>
        </motion.div>
      </div>

      <section className="contact-section">
        <div className="contact-container">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="contact-info"
          >
            <h2>Get in Touch</h2>
            <br></br>
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Location</h3>
                <p>
                  Koti, Solan, NH-22, Ambala Shimla Kaurik Road, Dharampur,
                  Himachal Pradesh 173209
                </p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-phone"></i>
              <div>
                <h3>Phone</h3>
                <p>09896532415</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-envelope"></i>
              <div>
                <h3>Email</h3>
                <p>punjabirasoikoti@gmail.com</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-clock"></i>
              <div>
                <h3>Hours</h3>
                <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
                <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="contact-form-container"
          >
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <motion.div
                  className="form-line"
                  whileFocus={{ scaleX: 1 }}
                  initial={{ scaleX: 0 }}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <motion.div
                  className="form-line"
                  whileFocus={{ scaleX: 1 }}
                  initial={{ scaleX: 0 }}
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  placeholder="Your Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <motion.div
                  className="form-line"
                  whileFocus={{ scaleX: 1 }}
                  initial={{ scaleX: 0 }}
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Your Message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <motion.div
                  className="form-line"
                  whileFocus={{ scaleX: 1 }}
                  initial={{ scaleX: 0 }}
                />
              </div>
              <motion.button
                type="submit"
                className="submit-btn"
                whileHover={!isLoading ? { scale: 1.05 } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                disabled={isLoading}
                style={{ position: "relative" }}
              >
                {isLoading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
                    <Loading type="dots" size="small" />
                    <span>Sending...</span>
                  </span>
                ) : (
                  "Send Message"
                )}
              </motion.button>
              {status === "error" && (
                <div className="error-message">
                  Sorry, there was a problem. Please try again.
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </section>

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
              setStatus(null);
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
                  setStatus(null);
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
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We'll get back to you shortly.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="map-section">
        <div className="map-container">
          {mapLoading && (
            <div className="map-loading-overlay">
              <Loading type="dots" size="medium" message="Loading map..." />
            </div>
          )}
          {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
          <iframe
            title="Restaurant Location Map - Punjabi Rasoi"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.8234567890123!2d76.9954564!3d30.8654167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390f8f4547b07fcf%3A0x78e05b4fa2fb20f!2sHotel%20Saloni%20(RESTAURANT%20PUNJABI%20RASOI)!5e0!3m2!1sen!2sin!4v1692345678901!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0, opacity: mapLoading ? 0 : 1, transition: "opacity 0.5s ease" }}
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => {
              setTimeout(() => {
                setMapLoading(false);
              }, 500);
            }}
            onError={() => {
              setMapLoading(false);
            }}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
