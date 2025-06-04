import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const [hoveredItem, setHoveredItem] = useState(null);

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
          name: "Paneer Tikka",
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

export default MenuSection;
