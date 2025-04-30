import axios from 'axios';
import { Cookies } from 'react-cookie';


const cookies = new Cookies();
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.request.use((config) => {
  const token = cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.response.use(
    (response) => {
        if (response.config.url.endsWith("/login") && response.status === 200) {
          const { token, user } = response.data;
          cookies.set("token", token, { path: "/", maxAge: 60 * 60 * 24 });
          cookies.set("user", JSON.stringify(user), {
            path: "/",
            maxAge: 60 * 60 * 24,
          });
        }
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
)


export const register = async (name, email, password) => api.post('/register', { name, email, password });
export const login = async (email, password) => api.post('/login', { email, password });
export const logout = async () => {
  cookies.remove("token", { path: "/" });
  cookies.remove("user", { path: "/" });
  return api.post('/logout');
}

export const dashboard = async () => api.get('/dashboard');
