import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Restaurant Interior",
      category: "interior",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Chef Preparing Food",
      category: "food",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Traditional Indian Cuisine",
      category: "food",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Restaurant Ambiance",
      category: "interior",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Delicious Curry",
      category: "food",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Chef's Special",
      category: "food",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Restaurant Bar",
      category: "interior",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      alt: "Special Occasion",
      category: "interior",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="gallery-section">
      <motion.div
        className="gallery-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {galleryImages.map((image) => (
          <motion.div
            key={image.id}
            className="gallery-item"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            onClick={() => setSelectedImage(image)}
          >
            <img src={image.src} alt={image.alt} />
            <div className="image-overlay">
              <span>{image.alt}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-button"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <img src={selectedImage.src} alt={selectedImage.alt} />
              <p>{selectedImage.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
