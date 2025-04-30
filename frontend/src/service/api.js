import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = cookies.get("token");
  // console.log("Token:", token); // Log the token value
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // console.log("Config Headers:", config.headers);
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (
      (response.config.url.endsWith("/login") ||
        response.config.url.endsWith("/register")) &&
      response.status === 200
    ) {
      const { token, user } = response.data.data;
// Log the response data

      cookies.set("token", token);
      cookies.set("user", JSON.stringify(user));
    }
    //
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerApi = async (
  name,
  email,
  password,
  password_confirmation
) => api.post("/register", { name, email, password, password_confirmation });

export const loginApi = async (email, password) =>
  api.post("/login", { email, password });

export const logoutApi = async () => api.delete("/logout");

export const dashboardApi = async () => api.get("/dashboard");
