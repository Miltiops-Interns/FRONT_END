import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Canvas } from "@react-three/fiber";
import DiningScene from "./components/DiningScene";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MenuPage from "./pages/MenuPage";
import ContactPage from "./pages/ContactPage";
import RestaurantScene from "./components/RestaurantScene";

// Menu Component
const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const [hoveredItem, setHoveredItem] = useState(null);
  const { scrollYProgress } = useScroll();

  const menuItems = [
    {
      category: "Starters",
      icon: "🥟",
      items: [
        {
          name: "Punjabi Samosa",
          price: "$5.99",
          description: "Crispy pastry filled with spiced potatoes and peas",
          image:
            "https://images.unsplash.com/photo-1601050592132-0d033d09c3c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Paneer Masala",
          price: "$8.99",
          description: "Grilled cottage cheese with Indian spices",
          image:
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Veg Pakora",
          price: "$6.99",
          description: "Assorted vegetables in spiced chickpea batter",
          image:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
      ],
    },
    {
      category: "Main Course",
      icon: "🍛",
      items: [
        {
          name: "Butter Chicken",
          price: "$16.99",
          description: "Tender chicken in rich tomato and butter sauce",
          image:
            "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Palak Paneer",
          price: "$14.99",
          description: "Cottage cheese in creamy spinach gravy",
          image:
            "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Chole Bhature",
          price: "$13.99",
          description: "Spiced chickpeas with fluffy fried bread",
          image:
            "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
      ],
    },
    {
      category: "Breads",
      icon: "🥖",
      items: [
        {
          name: "Butter Naan",
          price: "$3.99",
          description: "Soft leavened bread baked in tandoor",
          image:
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Garlic Naan",
          price: "$4.99",
          description: "Naan topped with garlic and butter",
          image:
            "https://images.unsplash.com/photo-1601050592132-0d033d09c3c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
        {
          name: "Laccha Paratha",
          price: "$4.99",
          description: "Layered whole wheat flatbread",
          image:
            "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        },
      ],
    },
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      scale: 1.05,
      rotateY: 10,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <section id="menu" className="menu-section">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={menuVariants}
        className="menu-container"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Menu
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="menu-subtitle"
        >
          Authentic Punjabi Flavors
        </motion.p>

        <motion.div
          className="category-tabs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {menuItems.map((category) => (
            <motion.button
              key={category.category}
              className={`category-tab ${
                selectedCategory === category.category ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="category-icon">{category.icon}</span>
              {category.category}
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, rotateX: -15 }}
            animate={{ opacity: 1, rotateX: 0 }}
            exit={{ opacity: 0, rotateX: 15 }}
            transition={{ duration: 0.5 }}
            className="menu-categories"
          >
            {menuItems
              .filter((category) => category.category === selectedCategory)
              .map((category) => (
                <motion.div
                  key={category.category}
                  className="menu-category"
                  variants={menuVariants}
                >
                  <div className="menu-items">
                    {category.items.map((item) => (
                      <motion.div
                        key={item.name}
                        className="menu-item"
                        variants={itemVariants}
                        whileHover="hover"
                        onHoverStart={() => setHoveredItem(item.name)}
                        onHoverEnd={() => setHoveredItem(null)}
                      >
                        <div className="menu-item-image">
                          <img src={item.image} alt={item.name} />
                          <motion.div
                            className="image-overlay"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: hoveredItem === item.name ? 1 : 0,
                            }}
                          />
                        </div>
                        <div className="menu-item-content">
                          <div className="menu-item-header">
                            <h4>{item.name}</h4>
                            <motion.span
                              className="price"
                              whileHover={{ scale: 1.1, color: "#FF4500" }}
                            >
                              {item.price}
                            </motion.span>
                          </div>
                          <p>{item.description}</p>
                          <motion.button
                            className="order-btn"
                            whileHover={{
                              scale: 1.05,
                              backgroundColor: "#FF6347",
                            }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Add to Order
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

// Home Page Component
const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

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

  const testimonials = [
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
  ];

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
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button secondary"
              >
                Make a Reservation
              </motion.button>
            </Link>
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
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
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
              </div>
            </motion.div>
          ))}
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
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cta-button secondary"
              >
                Make a Reservation
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.section>

      <Footer />
    </>
  );
};

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;
