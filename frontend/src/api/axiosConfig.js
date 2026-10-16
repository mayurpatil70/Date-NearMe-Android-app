import axios from "axios";

// Dynamically use Vercel production URL, env variable, or localhost fallback
const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const url = process.env.NEXT_PUBLIC_API_URL;
    return url.endsWith("/api") ? url : `${url.replace(/\/$/, "")}/api`;
  }
  if (process.env.REACT_APP_API_URL) {
    const url = process.env.REACT_APP_API_URL;
    return url.endsWith("/api") ? url : `${url.replace(/\/$/, "")}/api`;
  }
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    // In production (Vercel), point directly to the live backend
    return "https://date-near-me-android-app-backend.vercel.app/api";
  }
  return "http://localhost:5000/api";
};

const baseURL = getBaseURL();

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
