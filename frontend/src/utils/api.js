//import axios from "axios";

//const api = axios.create({
//  baseURL: "http://localhost:5000/api"
//});

//api.interceptors.request.use((config) => {
  //const token = localStorage.getItem("token");
  //if (token) config.headers.Authorization = `Bearer ${token}`;
  //return config;
//});

//export default api;
export const API_BASE_DEFAULT = import.meta.env.VITE_API_BASE_DEFAULT

export function apiUrl(path) {
  if (!path) return API_BASE_DEFAULT;
  return `${API_BASE_DEFAULT}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
