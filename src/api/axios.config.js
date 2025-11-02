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
    // Obtener token del localStorage usando getStorageKey
    const token = localStorage.getItem(getStorageKey('token'));
    
    // Si existe token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Log en desarrollo
      if (import.meta.env.DEV) {
        console.log('[API-REQUEST] Token agregado -', config.method?.toUpperCase(), config.url);
      }
    } else {
      // Log en desarrollo si no hay token
      if (import.meta.env.DEV) {
        console.warn('[API-REQUEST] No token -', config.method?.toUpperCase(), config.url);
      }
    }
    
    return config;
  },
  (error) => {
    // Log de error en desarrollo
    if (import.meta.env.DEV) {
      console.error('[API-REQUEST] Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor - Manejo de respuestas y errores
api.interceptors.response.use(
  (response) => {
    // Log en desarrollo - IMPORTANTE: Ver la estructura completa
    if (import.meta.env.DEV) {
      console.log('[API-RESPONSE] Status:', response.status, 'URL:', response.config.url);
      console.log('[API-RESPONSE] Full response:', response);
      console.log('[API-RESPONSE] response.data:', response.data);
    }
    
    // IMPORTANTE: Retornar la respuesta completa, NO solo response.data
    // Esto es necesario para mantener compatibilidad con el código existente
    return response;
  },
  (error) => {
    // Log de error en desarrollo
    if (import.meta.env.DEV) {
      console.error('[API-ERROR] Status:', error.response?.status, 'URL:', error.config?.url);
      console.error('[API-ERROR] Error details:', error.response?.data);
      console.error('[API-ERROR] Full error:', error);
    }
    
    // Manejar errores especificos
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          console.error('[API-ERROR] No autorizado - Limpiando sesion...');
          localStorage.removeItem(getStorageKey('token'));
          localStorage.removeItem(getStorageKey('user'));
          localStorage.removeItem(getStorageKey('rememberMe'));
          
          // Solo redirigir si no estamos en login o register
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            console.log('[API-ERROR] Redirigiendo a /login...');
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
    
    // Retornar el error original
    return Promise.reject(error);
  }
);

export default api;