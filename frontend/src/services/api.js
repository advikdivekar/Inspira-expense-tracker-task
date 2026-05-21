import axios from "axios";

const api = axios.create({
  baseURL: "/api",          // vite proxy forwards this to backend in dev, nginx handles it in prod
  headers: {
    "Content-Type": "application/json",
  },
});

// attach JWT token to every request automatically if it exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// if any request gets a 401, clear the token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("admin_token");
      window.location.href = "/manager/login";
    }
    return Promise.reject(error);
  }
);

export default api;