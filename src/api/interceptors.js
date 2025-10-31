// src/api/interceptors.js
import toast from 'react-hot-toast';

// Interceptor para manejar errores de autenticacion
export const authInterceptor = (error) => {
  if (error.status === 401) {
    toast.error('Sesion expirada. Por favor, inicia sesion nuevamente.');
    
    // Limpiar datos de sesion
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirigir a login despues de un breve delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }
  
  return Promise.reject(error);
};

// Interceptor para manejar errores de red
export const networkInterceptor = (error) => {
  if (error.status === 0) {
    toast.error('No hay conexion con el servidor. Verifica tu internet.');
  }
  
  return Promise.reject(error);
};

// Interceptor para manejar errores de validacion
export const validationInterceptor = (error) => {
  if (error.status === 422 || error.status === 400) {
    // Si hay errores de validacion especificos
    if (error.errors && typeof error.errors === 'object') {
      // Mostrar el primer error de validacion
      const firstError = Object.values(error.errors)[0];
      if (Array.isArray(firstError)) {
        toast.error(firstError[0]);
      } else {
        toast.error(firstError);
      }
    } else {
      toast.error(error.message || 'Error de validacion');
    }
  }
  
  return Promise.reject(error);
};

// Interceptor para manejar errores del servidor
export const serverInterceptor = (error) => {
  if (error.status === 500) {
    toast.error('Error del servidor. Intenta nuevamente mas tarde.');
  } else if (error.status === 503) {
    toast.error('Servicio no disponible. Intenta nuevamente mas tarde.');
  }
  
  return Promise.reject(error);
};

// Interceptor para manejar errores de permisos
export const permissionInterceptor = (error) => {
  if (error.status === 403) {
    toast.error('No tienes permisos para realizar esta accion.');
  }
  
  return Promise.reject(error);
};

// Interceptor para manejar recursos no encontrados
export const notFoundInterceptor = (error) => {
  if (error.status === 404) {
    toast.error('Recurso no encontrado.');
  }
  
  return Promise.reject(error);
};

// Interceptor general que combina todos los anteriores
export const globalErrorInterceptor = (error) => {
  // Ejecutar interceptores en orden de prioridad
  authInterceptor(error);
  networkInterceptor(error);
  validationInterceptor(error);
  permissionInterceptor(error);
  notFoundInterceptor(error);
  serverInterceptor(error);
  
  return Promise.reject(error);
};

// Interceptor para refresh token (opcional)
export const refreshTokenInterceptor = async (error, api) => {
  const originalRequest = error.config;
  
  // Si el error es 401 y no es un retry
  if (error.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Intentar obtener nuevo token
      const response = await api.post('/api/auth/refresh', { refreshToken });
      const { token } = response.data;
      
      // Guardar nuevo token
      localStorage.setItem('token', token);
      
      // Reintentar peticion original con nuevo token
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Si falla el refresh, limpiar todo y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
  
  return Promise.reject(error);
};

// Helper para aplicar todos los interceptores a una instancia de axios
export const applyInterceptors = (axiosInstance) => {
  // Response interceptor para errores
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Transformar error de axios al formato esperado
      const transformedError = {
        status: error.response?.status || 0,
        message: error.response?.data?.message || error.message,
        errors: error.response?.data?.errors || null,
        config: error.config,
      };
      
      return globalErrorInterceptor(transformedError);
    }
  );
  
  return axiosInstance;
};