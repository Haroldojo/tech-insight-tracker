import axios from "axios";

// In production (Render), set VITE_API_BASE_URL to your backend URL
// e.g. https://tech-insight-tracker-api.onrender.com/api
// In local dev, Vite proxies /api to localhost:8000
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
});

// Attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

// On 401 → clear token and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
