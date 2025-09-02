import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReservationModal from "./ReservationModal";

const Footer = () => {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Punjabi Rasoi</h3>
          <p>
            Experience the authentic flavors of Punjab in a warm and inviting
            atmosphere.
          </p>
          <div className="social-links">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fab fa-facebook-f"></i>
            </motion.a>
            <motion.a
              href="https://www.instagram.com/hotel_saloni_?igsh=MTlibXV5cXV5bXd1eg==
 "
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fab fa-instagram"></i>
            </motion.a>
            <motion.a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fab fa-twitter"></i>
            </motion.a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/menu">Menu</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>
            <i className="fas fa-map-marker-alt"></i> Koti, Solan, NH-22, Ambala
            Shimla Kaurik Road, Dharampur, Dharampur, Himachal Pradesh 173209
          </p>
          <p>
            <i className="fas fa-phone"></i> 09896532415
          </p>
          <p>
            <i className="fas fa-envelope"></i> newi@punjabirasoi.com
          </p>
        </div>

        <div className="footer-section">
          <h4>Opening Hours</h4>
          <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
          <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
          <motion.button
            className="reservation-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ width: "100%" }}
            onClick={() => setIsReservationOpen(true)}
          >
            Make a Reservation
          </motion.button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; 2024 Punjabi Rasoi. All rights
          <Link to="/admin/login" className="footer-admin-link">
            {" "}
            reserved
          </Link>
          .
        </p>
      </div>

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />
    </footer>
  );
};

export default Footer;
