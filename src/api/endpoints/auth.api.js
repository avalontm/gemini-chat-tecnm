// src/api/endpoints/auth.api.js
import api from '../axios.config';

// API de autenticacion
export const authAPI = {
  /**
   * Login de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise} - Promise con datos del usuario y token
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });
      
      // Guardar token y usuario en localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Registro de nuevo usuario
   * @param {string} username - Nombre de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise} - Promise con datos del usuario y token
   */
  register: async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
      });
      
      // Guardar token y usuario en localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout de usuario
   * @returns {Promise} - Promise con confirmacion de logout
   */
  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      
      // Limpiar datos de localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      return response;
    } catch (error) {
      // Limpiar localStorage incluso si falla la peticion
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      throw error;
    }
  },

  /**
   * Obtener perfil del usuario actual
   * @returns {Promise} - Promise con datos del perfil
   */
  getProfile: async () => {
    try {
      const response = await api.get('/api/auth/profile');
      
      // Actualizar datos del usuario en localStorage
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar perfil del usuario
   * @param {Object} data - Datos a actualizar
   * @returns {Promise} - Promise con datos actualizados
   */
  updateProfile: async (data) => {
    try {
      const response = await api.put('/api/auth/profile', data);
      
      // Actualizar datos del usuario en localStorage
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Cambiar contraseña del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise} - Promise con confirmacion
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Solicitar recuperacion de contraseña
   * @param {string} email - Email del usuario
   * @returns {Promise} - Promise con confirmacion
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', {
        email,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resetear contraseña con token
   * @param {string} token - Token de recuperacion
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise} - Promise con confirmacion
   */
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/api/auth/reset-password', {
        token,
        newPassword,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verificar email del usuario
   * @param {string} token - Token de verificacion
   * @returns {Promise} - Promise con confirmacion
   */
  verifyEmail: async (token) => {
    try {
      const response = await api.post('/api/auth/verify-email', {
        token,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise} - Promise con nuevo token
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/api/auth/refresh', {
        refreshToken,
      });
      
      // Actualizar token en localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verificar si el token es valido
   * @returns {Promise} - Promise con validacion
   */
  verifyToken: async () => {
    try {
      const response = await api.get('/api/auth/verify-token');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authAPI;