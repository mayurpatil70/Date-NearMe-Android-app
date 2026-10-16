import axios from "axios";

// Dynamically use Vercel production URL or localhost fallback
const rawBaseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

// Ensure baseURL points to /api without double slashes
const baseURL = rawBaseURL.endsWith("/api")
  ? rawBaseURL
  : `${rawBaseURL.replace(/\/$/, "")}/api`;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests and attach the JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Intercept responses for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

export default api;
