// src/api/axios.config.js
import axios from 'axios';

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
    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    
    // Si existe token, agregarlo al header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('Request:', config.method?.toUpperCase(), config.url);
    }
    
    return config;
  },
  (error) => {
    // Log de error en desarrollo
    if (import.meta.env.DEV) {
      console.error('Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor - Manejo de respuestas y errores
api.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (import.meta.env.DEV) {
      console.log('Response:', response.status, response.config.url);
    }
    
    // Retornar solo la data de la respuesta
    return response.data;
  },
  (error) => {
    // Log de error en desarrollo
    if (import.meta.env.DEV) {
      console.error('Response Error:', error.response?.status, error.config?.url);
    }
    
    // Manejar errores especificos
    if (error.response) {
      // El servidor respondio con un codigo de estado fuera del rango 2xx
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token invalido o expirado - Limpiar sesion y redirigir a login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
          
        case 403:
          // Acceso prohibido
          console.error('Acceso prohibido');
          break;
          
        case 404:
          // Recurso no encontrado
          console.error('Recurso no encontrado');
          break;
          
        case 500:
          // Error del servidor
          console.error('Error del servidor');
          break;
          
        default:
          console.error('Error:', data?.message || 'Error desconocido');
      }
      
      // Retornar error con mensaje personalizado
      return Promise.reject({
        status,
        message: data?.message || 'Error en la peticion',
        errors: data?.errors || null,
      });
    } else if (error.request) {
      // La peticion fue hecha pero no hubo respuesta
      return Promise.reject({
        status: 0,
        message: 'No hay conexion con el servidor',
      });
    } else {
      // Algo paso al configurar la peticion
      return Promise.reject({
        status: 0,
        message: error.message || 'Error al realizar la peticion',
      });
    }
  }
);

export default api;