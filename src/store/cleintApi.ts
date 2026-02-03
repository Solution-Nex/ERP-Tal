import axios from "axios";
const API_BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const clientApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
// clientApi.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// clientApi.interceptors.response.use(
//   (response) => response.data,
//   (error) => {
//     if (error.response?.status === 401) {
//       const currentPath = window.location.pathname;
//       if (currentPath !== "/login") {
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error.response?.data || error.message);
//   }
// );

export default clientApi;