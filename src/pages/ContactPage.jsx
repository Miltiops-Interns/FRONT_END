import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactPage = () => {
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
            <div className="info-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Location</h3>
                <p>123 Spice Street, Foodville, FL 12345</p>
              </div>
            </div>
            <div className="info-item">
              <i className="fas fa-phone"></i>
              <div>
                <h3>Phone</h3>
                <p>(555) 123-4567</p>
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
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
                <motion.div
                  className="form-line"
                  whileFocus={{ scaleX: 1 }}
                  initial={{ scaleX: 0 }}
                />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
                <motion.div
                  className="form-line"
                  whileFocus={{ scaleX: 1 }}
                  initial={{ scaleX: 0 }}
                />
              </div>
              <div className="form-group">
                <input type="tel" placeholder="Your Phone" />
                <motion.div
                  className="form-line"
                  whileFocus={{ scaleX: 1 }}
                  initial={{ scaleX: 0 }}
                />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" required></textarea>
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
            </form>
          </motion.div>
        </div>
      </section>

      <section className="map-section">
        <div className="map-container">
          {/* Add your map component or iframe here */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986432970718!3d40.697149422113014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1647043087964!5m2!1sen!2s"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
