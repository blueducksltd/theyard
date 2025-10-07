import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: `${process.env.BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: sends cookies with requests
});

// Request interceptor - adds token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from cookie using js-cookie
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handles token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove("token", { path: "/" });
      window.location.href = "/admin/auth";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
