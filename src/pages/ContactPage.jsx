import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactPage = () => {
  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // success or error

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
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
                  Dharampur, Himachal Pradesh 173209
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
                <p>info@punjabirasoi.com</p>
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
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </motion.button>
              {status === "success" && (
                <div className="success-message">
                  Thank you! Your message has been sent.
                </div>
              )}
              {status === "error" && (
                <div className="error-message">
                  Sorry, there was a problem. Please try again.
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      <section className="map-section">
        <div className="map-container">
          {/* Add your map component or iframe here */}
          <iframe
            src="https://www.google.com/maps?q=Koti,+Solan,+NH-22,+Ambala+Shimla+Kaurik+Road,+Dharampur,+Himachal+Pradesh+173209&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
