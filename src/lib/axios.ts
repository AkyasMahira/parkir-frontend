import axios from "axios";

const api = axios.create({
  baseURL: "http://parkir-backend.test/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Middleware Frontend
api.interceptors.request.use(
  (config) => {
    // Ambil token dari LocalStorage
    const token = localStorage.getItem("token");

    // Jika token ada, tempelkan ke Header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
