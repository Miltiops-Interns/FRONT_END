import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import Loading from "./Loading";

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonHovered, setButtonHovered] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await apiFetch("/api/menu");
        const data = await res.json();

        if (!isMounted) return; // Prevent state update if component unmounted

        const grouped = data.reduce((acc, item) => {
          const cat = item.category;
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(item);
          return acc;
        }, {});

        const formatted = Object.entries(grouped).map(([category, items]) => ({
          category,
          icon: "🍽️", // optional: you can customize per category
          items,
        }));

        setMenuItems(formatted);
        if (formatted.length > 0) {
          setSelectedCategory(formatted[0].category);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch menu:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMenu();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

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
      scale: 1.02,
      rotateY: 5,
      transition: {
        duration: 0.2,
      },
    },
  };

  const navigate = useNavigate();
  const { addItem } = useCart();

  const handleAddToCart = (item) => {
    // Backend returns price as number (₹) and _id as id
    addItem({
      id: item._id,
      name: item.name,
      price: Number(item.price) || 0,
      image: item.image,
    });
    navigate("/cart");
  };

  if (loading) {
    return (
      <section className="menu-section">
        <div className="menu-container">
          <div className="menu-loading-wrapper">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="menu-loading-content"
            >
              <Loading type="dots" size="large" message="Preparing our delicious menu..." />
              <motion.p
                className="menu-loading-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Please wait while we fetch the best dishes for you
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="menu-section">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={menuVariants}
        className="menu-container"
      >
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
                  initial="hidden"
                  animate="visible"
                >
                  <div className="menu-items">
                    {category.items.map((item) => (
                      <motion.div
                        key={item._id}
                        className={`menu-item ${buttonHovered === item._id ? 'button-hovered' : ''}`}
                        variants={itemVariants}
                        whileHover={buttonHovered === item._id ? {} : "hover"}
                        onHoverStart={(e) => {
                          // Don't trigger hover if hovering over button
                          if (!e.target.closest('.order-btn')) {
                            setHoveredItem(item.name);
                          }
                        }}
                        onHoverEnd={() => setHoveredItem(null)}
                      >
                        <div className="menu-item-image">
                          <img
                            src={
                              item.image ||
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='150' height='150' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E"
                            }
                            alt={item.name}
                          />
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
                              ₹{item.price}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              // Disable menu item hover animation when hovering button
                              setButtonHovered(item._id);
                            }}
                            onMouseLeave={(e) => {
                              e.stopPropagation();
                              setButtonHovered(null);
                            }}
                            style={{ position: 'relative', zIndex: 100 }}
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

export default MenuSection;
