import axios from "axios";

// Get API base URL from environment or use default
// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://your-backend.onrender.com/api" // Will be updated after backend deployment
    : "http://localhost:5000/api");
console.log("🔗 Axios Base URL:", API_BASE_URL); // Debug log

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("📤 API Request:", config.method?.toUpperCase(), config.url); // Debug log
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.config.url, response.status); // Debug log
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.config?.url); // Debug log

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
