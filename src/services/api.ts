import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Variable para rastrear requests activos
let activeRequests = 0;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Solo mostrar loading en requests que pueden ser largos
  const showLoading = !config.url?.includes('/likes') && 
                     !config.url?.includes('/comments') &&
                     config.method?.toLowerCase() !== 'get' &&  // ✅ CORREGIDO
                     activeRequests === 0;
  
  // Eliminé el import dinámico porque no se usa
  // El loading se maneja mejor en cada componente
  
  activeRequests++;
  return config;
});

api.interceptors.response.use(
  (response) => {
    activeRequests--;
    return response;
  },
  (error) => {
    activeRequests--;
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ❤️ LIKES API
// ========================================
export const toggleLike = (postId: string | number) => {
  return api.post(`/api/posts/${postId}/likes`);
};

export const getLikeInfo = (postId: string | number) => {
  return api.get(`/api/posts/${postId}/likes`);
};