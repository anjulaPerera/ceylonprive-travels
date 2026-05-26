import axios from "axios";

// Create an axios instance with the backend URL as the base.
// Every API call uses this instance — one place to change the URL.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ───────────────────────────────────────
// Runs before every request is sent.
// Reads the JWT from localStorage and attaches it to the
// Authorization header automatically — no manual token management.
api.interceptors.request.use(
  (config) => {
    // localStorage is only available in the browser, not on the server.
    // The typeof check prevents errors during Next.js server-side rendering.
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("ceylonprive_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response Interceptor ──────────────────────────────────────
// Runs after every response is received.
// If the server returns 401 (token expired or invalid),
// clear the stored token and redirect to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("ceylonprive_token");
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
