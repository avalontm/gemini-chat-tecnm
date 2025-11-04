// src/api/endpoints/auth.api.js
import api from '../axios.config';

// API de autenticación
export const authAPI = {
  /**
   * Login de usuario
   * @param {string} numeroControlOrEmail - Número de control o email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise} - Promise con datos del usuario y token
   */
  login: async (numeroControlOrEmail, password) => {
    try {
      // Determinar si es número de control o email
      const isNumeroControl = /^\d{8}$/.test(numeroControlOrEmail);
      
      const response = await api.post('/api/auth/login', {
        ...(isNumeroControl 
          ? { numeroControl: numeroControlOrEmail }
          : { email: numeroControlOrEmail }
        ),
        password,
      });
      
      // Guardar token y usuario en localStorage
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Registro de nuevo usuario del TecNM
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.numeroControl - Número de control (8 dígitos)
   * @param {string} userData.password - Contraseña
   * @param {string} userData.nombreCompleto - Nombre completo
   * @param {string} userData.carrera - Carrera
   * @param {number} userData.semestre - Semestre (1-12)
   * @param {string} [userData.telefono] - Teléfono (opcional)
   * @param {string} [userData.avatar] - Avatar en base64 (opcional)
   * @returns {Promise} - Promise con datos del usuario y token
   */
  register: async (userData) => {
    try {
      console.log('[authAPI] Registrando usuario...');
      console.log('[authAPI] Datos:', {
        numeroControl: userData.numeroControl,
        nombreCompleto: userData.nombreCompleto,
        carrera: userData.carrera,
        semestre: userData.semestre,
        telefono: userData.telefono || 'No proporcionado',
        avatar: userData.avatar ? 'Presente' : 'No proporcionado',
      });

      const response = await api.post('/api/auth/register', userData);
      
      console.log('[authAPI] Respuesta de registro:', response.data);
      
      // Guardar token y usuario en localStorage
      if (response.data?.data?.token) {
        localStorage.setItem('token', response.data.data.token);
        console.log('[authAPI] Token guardado');
      }
      if (response.data?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        console.log('[authAPI] Usuario guardado');
      }
      
      return response.data;
    } catch (error) {
      console.error('[authAPI] Error en registro:', error);
      console.error('[authAPI] Error response:', error.response?.data);
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
      
      return response.data;
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
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar perfil del usuario
   * @param {Object} data - Datos a actualizar
   * @param {string} [data.nombreCompleto] - Nombre completo
   * @param {string} [data.carrera] - Carrera
   * @param {number} [data.semestre] - Semestre (1-12)
   * @param {string} [data.telefono] - Teléfono (10 dígitos)
   * @param {string} [data.avatar] - Avatar en base64
   * @returns {Promise} - Promise con datos actualizados
   */
  updateProfile: async (data) => {
    try {
      console.log('[authAPI] Actualizando perfil...');
      
      // Asegurarse de NO enviar numeroControl ni email
      const { numeroControl, email, ...updateData } = data;
      
      if (numeroControl !== undefined || email !== undefined) {
        console.warn('[authAPI] Se intentó modificar campos inmutables (numeroControl/email), eliminándolos...');
      }
      
      const response = await api.put('/api/auth/profile', updateData);
      
      // Actualizar datos del usuario en localStorage
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('[authAPI] Error al actualizar perfil:', error);
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
      const response = await api.post('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Solicitar recuperacion de contraseña
   * @param {string} numeroControlOrEmail - Número de control o email
   * @returns {Promise} - Promise con confirmacion
   */
  forgotPassword: async (numeroControlOrEmail) => {
    try {
      const isNumeroControl = /^\d{8}$/.test(numeroControlOrEmail);
      
      const response = await api.post('/api/auth/forgot-password', {
        ...(isNumeroControl 
          ? { numeroControl: numeroControlOrEmail }
          : { email: numeroControlOrEmail }
        ),
      });
      
      return response.data;
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
      
      return response.data;
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
      
      return response.data;
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
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
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
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default authAPI;