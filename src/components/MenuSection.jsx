import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import Loading from "./Loading";

const normalizeCategoryKey = (value = "") =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s*\(\s*/g, "(")
    .replace(/\s*\)\s*/g, ")")
    .replace(/\s*-\s*/g, "-");

const categoryIconMap = {
  beverages: "🍹",
  dessert: "🍰",
  "basmati-e-bahar": "🍚",
  "bageecha-e-bahar": "🥗",
  "daawat-e-tandoor": "🍗",
  "mehfil-e-snacks": "🍢",
  "nashta-e-laziz": "🥞",
  "khaazana subji ka": "🥬",
  vegetarian: "🥦",
  "shorba-e-suroor": "🍲",
  "chinese platter": "🍜",
  "royal non-veg curries": "🍛",
  "tandoori non-veg platters": "🔥",
  "seafood splendours": "🦞",
  "nawabi gosht": "🍖",
  "tandoor se special": "🔥",
  chicken: "🍗",
  "chinese platter(non-veg)": "🍱",
  "shorba-e-suroor(non-veg)": "🍲",
  "nashta-e-laziz(non-veg)": "🥘",
  "basmati-e-bahar(non-veg)": "🍗",
  "mehfil-e-snacks(non-veg)": "🍢",
};

const categoryDietTypeMap = {
  beverages: "veg",
  dessert: "veg",
  "basmati-e-bahar": "veg",
  "bageecha-e-bahar": "veg",
  "daawat-e-tandoor": "veg",
  "mehfil-e-snacks": "veg",
  "nashta-e-laziz": "veg",
  "khaazana subji ka": "veg",
  vegetarian: "veg",
  "shorba-e-suroor": "veg",
  "chinese platter": "veg",
  "nashta-e-laziz(non-veg)": "nonVeg",
  "shorba-e-suroor(non-veg)": "nonVeg",
  "chinese platter(non-veg)": "nonVeg",
  "tandoor se special": "nonVeg",
  "basmati-e-bahar(non-veg)": "nonVeg",
  "mehfil-e-snacks(non-veg)": "nonVeg",
  "nawabi gosht": "nonVeg",
  chicken: "nonVeg",
  "royal non-veg curries": "nonVeg",
  "tandoori non-veg platters": "nonVeg",
  "seafood splendours": "nonVeg",
};

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonHovered, setButtonHovered] = useState(null);
  const [dietFilter, setDietFilter] = useState("veg");
  const [searchTerm, setSearchTerm] = useState("");

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

        const formatted = Object.entries(grouped).map(([category, items]) => {
          const normalizedKey = normalizeCategoryKey(category);
          const icon = categoryIconMap[normalizedKey] || "🍽️";

          const dietType =
            categoryDietTypeMap[normalizedKey] ||
            (normalizedKey.includes("non-veg") ||
            normalizedKey.includes("non veg") ||
            normalizedKey.includes("chicken") ||
            normalizedKey.includes("mutton") ||
            normalizedKey.includes("fish") ||
            normalizedKey.includes("seafood") ||
            normalizedKey.includes("egg")
              ? "nonVeg"
              : "veg");

          return {
            category,
            icon,
            items,
            dietType,
          };
        });

        setMenuItems(formatted);
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

  const filteredCategories = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return menuItems
      .filter(
        (category) =>
          category.dietType === dietFilter || category.dietType === "both"
      )
      .map((category) => {
        if (!search) {
          return category;
        }

        const filteredItems = category.items.filter((item) => {
          const nameMatch = item.name?.toLowerCase().includes(search);
          const descriptionMatch = item.description
            ?.toLowerCase()
            .includes(search);
          return nameMatch || descriptionMatch;
        });

        return {
          ...category,
          items: filteredItems,
        };
      })
      .filter((category) => category.items.length > 0);
  }, [menuItems, dietFilter, searchTerm]);

  useEffect(() => {
    if (filteredCategories.length === 0) {
      setSelectedCategory("");
      return;
    }

    const hasSelected = filteredCategories.some(
      (category) => category.category === selectedCategory
    );

    if (!hasSelected) {
      setSelectedCategory(filteredCategories[0].category);
    }
  }, [filteredCategories, selectedCategory]);

  const selectedCategoryData = useMemo(
    () =>
      filteredCategories.find(
        (category) => category.category === selectedCategory
      ) || null,
    [filteredCategories, selectedCategory]
  );

  const isSearchActive = searchTerm.trim().length > 0;

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
          className="diet-toggle-wrapper"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="diet-toggle" role="group" aria-label="Diet preference">
            <motion.div
              className="diet-toggle-slider"
              layout
              animate={{ x: dietFilter === "veg" ? "0%" : "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            />
            <button
              type="button"
              className={`diet-toggle-option ${
                dietFilter === "veg" ? "active" : ""
              }`}
              onClick={() => setDietFilter("veg")}
              aria-pressed={dietFilter === "veg"}
            >
              Veg
            </button>
            <button
              type="button"
              className={`diet-toggle-option ${
                dietFilter === "nonVeg" ? "active" : ""
              }`}
              onClick={() => setDietFilter("nonVeg")}
              aria-pressed={dietFilter === "nonVeg"}
            >
              Non-Veg
            </button>
          </div>
        </motion.div>

        <motion.div
          className="menu-search-wrapper"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="menu-search">
          
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search menu items..."
              aria-label="Search menu items"
            />
            {searchTerm && (
              <button
                type="button"
                className="menu-search-clear"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </motion.div>

        <motion.div
          className="category-tabs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredCategories.map((category) => (
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
          {selectedCategoryData ? (
            <motion.div
              key={selectedCategoryData.category}
              initial={{ opacity: 0, rotateX: -15 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 15 }}
              transition={{ duration: 0.5 }}
              className="menu-categories"
            >
              <motion.div
                className="menu-category"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="menu-items">
                  {selectedCategoryData.items.map((item) => (
                    <motion.div
                      key={item._id}
                      className={`menu-item ${
                        buttonHovered === item._id ? "button-hovered" : ""
                      }`}
                      variants={itemVariants}
                      whileHover={buttonHovered === item._id ? {} : "hover"}
                      onHoverStart={(e) => {
                        if (!e.target.closest(".order-btn")) {
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
                            setButtonHovered(item._id);
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            setButtonHovered(null);
                          }}
                          style={{ position: "relative", zIndex: 100 }}
                        >
                          Add to Order
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="menu-empty-state"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="menu-empty-state"
            >
              <h3>
                {isSearchActive
                  ? "No dishes match your search yet"
                  : dietFilter === "veg"
                  ? "Our vegetarian delights are on the way!"
                  : "We’re preparing non-veg delicacies!"}
              </h3>
              <p>
                {isSearchActive
                  ? "Try a different keyword or explore another category to discover more flavors."
                  : dietFilter === "veg"
                  ? "Vegetarian dishes will be available here soon. Please check back shortly."
                  : "Non-veg dishes will be added soon. Check back for delicious new additions."}
              </p>
              {isSearchActive && (
                <button
                  type="button"
                  className="menu-search-reset"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default MenuSection;
