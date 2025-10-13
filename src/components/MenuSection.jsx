import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_URL}/api/menu`);
        const data = await res.json();

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
        console.error("Failed to fetch menu:", err);
      }
    };

    fetchMenu();
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
      scale: 1.05,
      rotateY: 10,
      transition: {
        duration: 0.3,
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
                        className="menu-item"
                        variants={itemVariants}
                        whileHover="hover"
                        onHoverStart={() => setHoveredItem(item.name)}
                        onHoverEnd={() => setHoveredItem(null)}
                      >
                        <div className="menu-item-image">
                          <img
                            src={
                              item.image ||
                              "https://via.placeholder.com/150?text=No+Image"
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
                            onClick={() => handleAddToCart(item)}
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
