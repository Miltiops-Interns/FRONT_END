import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For demo purposes, we'll use a mock API response
  // In production, you would need to set up a backend proxy to handle the Google Places API
  // due to CORS restrictions and API key security
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Mock Google reviews data - replace this with actual API call
        const mockReviews = [
          {
            author_name: "Priya Sharma",
            rating: 5,
            relative_time_description: "2 weeks ago",
            text: "Amazing Punjabi food! The butter chicken is absolutely divine and the naan is perfectly fluffy. The ambiance is warm and welcoming. Highly recommend!",
            profile_photo_url:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            time: Date.now() - 14 * 24 * 60 * 60 * 1000,
          },
          {
            author_name: "Rajesh Kumar",
            rating: 5,
            relative_time_description: "1 month ago",
            text: "Best Indian restaurant in the area! Authentic flavors that remind me of home. The service is excellent and the portions are generous. Will definitely come back!",
            profile_photo_url:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            time: Date.now() - 30 * 24 * 60 * 60 * 1000,
          },
          {
            author_name: "Sarah Johnson",
            rating: 5,
            relative_time_description: "3 weeks ago",
            text: "Incredible dining experience! The spices are perfectly balanced and the food is cooked to perfection. The staff is friendly and the atmosphere is lovely.",
            profile_photo_url:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            time: Date.now() - 21 * 24 * 60 * 60 * 1000,
          },
          {
            author_name: "Amit Patel",
            rating: 5,
            relative_time_description: "1 week ago",
            text: "Outstanding Punjabi cuisine! The dal makhani is rich and creamy, and the tandoori dishes are perfectly charred. Great value for money!",
            profile_photo_url:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            time: Date.now() - 7 * 24 * 60 * 60 * 1000,
          },
          {
            author_name: "Lisa Chen",
            rating: 5,
            relative_time_description: "2 months ago",
            text: "Fantastic restaurant! The food is authentic and delicious. The biryani is a must-try and the desserts are heavenly. Highly recommend!",
            profile_photo_url:
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            time: Date.now() - 60 * 24 * 60 * 60 * 1000,
          },
          {
            author_name: "David Wilson",
            rating: 5,
            relative_time_description: "1 month ago",
            text: "Excellent Punjabi restaurant! The flavors are authentic and the portions are generous. The staff is very friendly and the service is quick.",
            profile_photo_url:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
            time: Date.now() - 35 * 24 * 60 * 60 * 1000,
          },
        ];

        // Sort by rating (highest first) and then by time (most recent first)
        const sortedReviews = mockReviews
          .sort((a, b) => {
            if (b.rating !== a.rating) {
              return b.rating - a.rating;
            }
            return b.time - a.time;
          })
          .slice(0, 6); // Get top 6 reviews

        setReviews(sortedReviews);
        setLoading(false);
      } catch (err) {
        setError("Failed to load reviews");
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
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
          <div className="loading-reviews">
            <div className="loading-spinner"></div>
            <p>Loading reviews from Google...</p>
          </div>
        </div>
      </motion.section>
    );
  }

  if (error) {
    return (
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
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
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
      <motion.div
        className="google-reviews-header"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="google-logo">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google Reviews</span>
        </div>
        <div className="average-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="star">
                ⭐
              </span>
            ))}
          </div>
          <span className="rating-text">
            4.9/5 from {reviews.length}+ reviews
          </span>
        </div>
      </motion.div>

      <div className="testimonials-container">
        {reviews.map((review, index) => (
          <motion.div
            key={`${review.author_name}-${review.time}`}
            className="testimonial-card google-review"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            }}
          >
            <div className="testimonial-header">
              <div className="testimonial-image">
                <img src={review.profile_photo_url} alt={review.author_name} />
              </div>
              <div className="reviewer-info">
                <h4 className="name">{review.author_name}</h4>
                <div className="rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="star">
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="review-date">{formatDate(review.time)}</span>
              </div>
            </div>
            <div className="testimonial-content">
              <p className="comment">{review.text}</p>
            </div>
            <div className="google-badge">
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google Review</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="reviews-cta"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p>Love our food? Leave us a review on Google!</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="review-button"
          onClick={() =>
            window.open(
              "https://www.google.com/search?q=Punjabi+Rasoi+reviews",
              "_blank"
            )
          }
        >
          Write a Review
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

export default GoogleReviews;
