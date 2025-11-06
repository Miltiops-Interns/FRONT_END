import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ReservationModal from "./ReservationModal";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  return (
    <>
      <nav className={`navbar ${isScrolled ? "scrolled" : ""} ${isHomePage ? "home-page" : ""}`}>
        <div className="nav-content">
          <Link to="/" className="logo">
            <div className="logo-container">
              <img src="/images/logopr3.png" alt="Punjabi Rasoi Logo" className="logo-image" />
              <span className="logo-text">
                <span className="logo-word">Punjabi</span>
                <span className="logo-word">Rasoi</span>
              </span>
            </div>
          </Link>

          <div className="nav-links">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
            <Link
              to="/menu"
              className={location.pathname === "/menu" ? "active" : ""}
            >
              Menu
            </Link>
            <Link
              to="/contact"
              className={location.pathname === "/contact" ? "active" : ""}
            >
              Contact
            </Link>
          </div>

          <div className="nav-actions">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="reserve-btn"
              onClick={() => setIsReservationOpen(true)}
            >
              Make a Reservation
            </motion.button>
          </div>
        </div>
      </nav>

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />
    </>
  );
};

export default Navbar;
