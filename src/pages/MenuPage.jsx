import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MenuSection from "../components/MenuSection";

const MenuPage = () => {
  return (
    <div className="menu-page">
      <Navbar />
      <div className="page-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="header-content"
        >
          <h1>Our Menu</h1>
          <p>Discover the authentic flavors of Punjab</p>
        </motion.div>
      </div>
      <MenuSection />
      <Footer />
    </div>
  );
};

export default MenuPage;
