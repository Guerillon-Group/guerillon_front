import axios from 'axios';
import { getToken, removeToken } from '../utils/token.utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur de requêtes : Injection automatique du Token Bearer
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur de réponses : Gestion automatique des erreurs 401 (Non autorisé)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        // Optionnel : redirection vers login ou notification de déconnexion
      }
    }
    return Promise.reject(error);
  }
);
