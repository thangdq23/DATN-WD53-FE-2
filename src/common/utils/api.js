import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem("authenticate-storage");
    const token = raw ? JSON.parse(raw)?.state?.token : null;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    void 0;
  }
  return config;
});

export default api;
