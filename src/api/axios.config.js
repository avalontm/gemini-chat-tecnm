// src/api/axios.config.js
import axios from 'axios';
import { getStorageKey } from '@config/app.config';

// Obtener configuracion desde variables de entorno
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Agregar token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(getStorageKey('token'));
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Manejo de respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('[API-ERROR] No autorizado - Limpiando sesion...');
          localStorage.removeItem(getStorageKey('token'));
          localStorage.removeItem(getStorageKey('user'));
          localStorage.removeItem(getStorageKey('rememberMe'));
          
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          console.error('[API-ERROR] Acceso prohibido');
          break;
          
        case 404:
          console.error('[API-ERROR] Recurso no encontrado');
          break;
          
        case 500:
          console.error('[API-ERROR] Error del servidor');
          break;
          
        default:
          console.error('[API-ERROR] Error:', data?.message || 'Error desconocido');
      }
    } else if (error.request) {
      console.error('[API-ERROR] No hay conexion con el servidor');
    } else {
      console.error('[API-ERROR] Error al realizar la peticion:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;