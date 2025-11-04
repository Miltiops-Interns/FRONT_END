import React from "react";
import { motion } from "framer-motion";
import "./Loading.css";

const Loading = ({ 
  type = "dots", // "dots" or "food"
  size = "medium", // "small", "medium", "large"
  message = "",
  fullScreen = false,
  overlay = false 
}) => {
  // Three dots animation
  const DotsLoader = () => (
    <div className={`loading-dots loading-${size}`}>
      <motion.div
        className="loading-dot"
        animate={{
          y: [0, -10, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0,
        }}
      />
      <motion.div
        className="loading-dot"
        animate={{
          y: [0, -10, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.div
        className="loading-dot"
        animate={{
          y: [0, -10, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </div>
  );

  // Food-themed animation (steam rising from food)
  const FoodLoader = () => (
    <div className={`loading-food loading-${size}`}>
      <div className="food-container">
        {/* Plate */}
        <motion.div
          className="food-plate"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Steam lines */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="food-steam"
            style={{
              left: `${30 + i * 20}%`,
            }}
            animate={{
              y: [0, -30, -60],
              opacity: [0.7, 0.4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );

  const loaderContent = type === "food" ? <FoodLoader /> : <DotsLoader />;

  if (fullScreen) {
    return (
      <div className={`loading-fullscreen ${overlay ? "loading-overlay" : ""}`}>
        <div className="loading-content">
          {loaderContent}
          {message && <p className="loading-message">{message}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-wrapper">
      {loaderContent}
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;
