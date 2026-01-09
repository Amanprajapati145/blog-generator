import axios from "axios";
import { getCookie } from "cookies-next";

const baseURL =
  process.env.NEXT_PUBLIC_BACKEND_URL // || "http://localhost:4000";

const backendUrl = axios.create({
  baseURL,
  withCredentials: true,
});

// Add request interceptor to include the token
backendUrl.interceptors.request.use((config) => {
  // Get the token from cookies
  const token = getCookie('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default backendUrl;
