// API Configuration
// This will automatically use the environment variable if set, or fallback to localhost for development

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default API_URL;

