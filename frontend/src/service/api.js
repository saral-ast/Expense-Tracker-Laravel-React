import axios from "axios";
import { Cookies } from "react-cookie";
// Removed direct imports to break circular dependency

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
    return response;
  },
  (error) => {
    // Check if the error is due to authentication issues
    if (error.response && 
        (error.response.status === 401 || 
         (error.response.data && error.response.data.message === "Unauthenticated."))
    ) {
      // Remove cookies directly to avoid circular dependency
      cookies.remove("token");
      cookies.remove("user");
      
      // Use dynamic import to avoid circular dependency
     
      
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth Api
export const registerApi = async (
  name,
  email,
  password,
  password_confirmation
) => api.post("/register", { name, email, password, password_confirmation });
export const loginApi = async (email, password) =>
  api.post("/login", { email, password });
export const logoutApi = async () => api.delete("/logout");

//Groups Api
export const getGroupsApi = async () => api.get("/groups");
export const createGroupApi = async (name) => api.post("/groups", { name });
export const updateGroupApi = async (id, name) => api.post(`/groups/${id}`, { name });
export const deleteGroupApi = async (id) => api.delete(`/groups/${id}`);

//Expenses Api
export const getExpensesApi = async () => api.get("/expenses");
export const createExpenseApi = async (name, amount, date, group_id) =>
  api.post("/expenses", { name, amount, date, group_id });
export const updateExpenseApi = async (id, name, amount, date, group_id) =>
  api.post(`/expenses/${id}`, { name, amount, date, group_id });
export const deleteExpenseApi = async (id) => api.delete(`/expenses/${id}`);

// Dashboard Api
export const dashboardApi = async () => api.get("/dashboard");

// In service/api.js

// Add this with your other API functions
export const exportExpensesCSV = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add any filters to the query parameters
  if (filters.userId) queryParams.append('user_id', filters.userId);
  if (filters.groupId) queryParams.append('group_id', filters.groupId);
  if (filters.startDate) queryParams.append('start_date', filters.startDate);
  if (filters.endDate) queryParams.append('end_date', filters.endDate);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return api.get(`/expenses/export${queryString}`);
};

export const exportExpensesPDF = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  // Add any filters to the query parameters
  if (filters.userId) queryParams.append("user_id", filters.userId);
  if (filters.groupId) queryParams.append("group_id", filters.groupId);
  if (filters.startDate) queryParams.append("start_date", filters.startDate);
  if (filters.endDate) queryParams.append("end_date", filters.endDate);

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  return api.get(`/expenses/export-pdf${queryString}`);
};
// Export Api
// export const getApi = async () => api.get('/expnses/export');
