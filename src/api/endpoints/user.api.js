// src/api/endpoints/user.api.js

import api from '../axios.config';

/**
 * API para manejo de perfil de usuario
 */
export const userAPI = {
  /**
   * Obtener perfil del usuario actual
   * GET /api/user/profile
   */
  getProfile: async () => {
    try {
      console.log('[userAPI] Obteniendo perfil...');
      
      const response = await api.get('/api/user/profile');
      
      console.log('[userAPI] Perfil obtenido:', response.data);
      
      // axios.config.js retorna response completa, así que usamos response.data
      return response.data;
    } catch (error) {
      console.error('[userAPI] Error en getProfile:', error);
      console.error('[userAPI] Error response:', error.response?.data);
      console.error('[userAPI] Error status:', error.response?.status);
      throw error.response?.data || error;
    }
  },

  /**
   * Actualizar perfil del usuario
   * PUT /api/user/profile
   * @param {Object} profileData - { username, avatar, bio, preferences }
   */
  updateProfile: async (profileData) => {
    try {
      console.log('[userAPI] Actualizando perfil...');
      console.log('[userAPI] Datos a enviar:', {
        keys: Object.keys(profileData),
        hasAvatar: !!profileData.avatar,
        avatarSize: profileData.avatar ? `${(profileData.avatar.length / 1024).toFixed(2)} KB` : 'N/A',
        username: profileData.username,
        bio: profileData.bio?.substring(0, 50)
      });

      // Verificar que NO se esté enviando email
      if (profileData.email !== undefined) {
        console.warn('[userAPI] ADVERTENCIA: Se está intentando enviar email, eliminándolo...');
        const { email, ...dataWithoutEmail } = profileData;
        profileData = dataWithoutEmail;
      }

      // Verificar token antes de enviar
      const token = localStorage.getItem('token') || localStorage.getItem('gemini-api_token');
      console.log('[userAPI] Token presente:', !!token);
      if (token) {
        console.log('[userAPI] Token preview:', token.substring(0, 20) + '...');
      }

      const response = await api.put('/api/user/profile', profileData);
      
      console.log('[userAPI] Perfil actualizado exitosamente');
      console.log('[userAPI] Response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[userAPI] Error en updateProfile:', error);
      console.error('[userAPI] Error response:', error.response?.data);
      console.error('[userAPI] Error status:', error.response?.status);
      console.error('[userAPI] Error headers:', error.response?.headers);
      
      // Log adicional para debugging
      if (error.response?.status === 400) {
        console.error('[userAPI] Error 400 - Detalles:', {
          message: error.response.data?.message,
          errors: error.response.data?.errors
        });
      }
      
      if (error.response?.status === 401) {
        console.error('[userAPI] Error 401 - Token inválido o expirado');
      }
      
      // Lanzar el error con la estructura completa del servidor
      const serverError = error.response?.data || {};
      
      // Asegurar que tenga la estructura correcta
      throw {
        success: false,
        message: serverError.message || 'Error al actualizar el perfil',
        errors: serverError.errors || [],
        status: error.response?.status,
        ...serverError
      };
    }
  },

  /**
   * Actualizar preferencias del usuario (tema, idioma, notificaciones)
   * PUT /api/user/preferences
   * @param {Object} preferences - { theme, language, notifications }
   */
  updatePreferences: async (preferences) => {
    try {
      console.log('[userAPI] Actualizando preferencias:', preferences);
      
      const response = await api.put('/api/user/preferences', preferences);
      
      console.log('[userAPI] Preferencias actualizadas');
      
      return response.data;
    } catch (error) {
      console.error('[userAPI] Error en updatePreferences:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Cambiar contraseña del usuario
   * PUT /api/user/password
   * @param {string} currentPassword
   * @param {string} newPassword
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      console.log('[userAPI] Cambiando contraseña...');
      
      const response = await api.put('/api/user/password', {
        currentPassword,
        newPassword,
        confirmPassword: newPassword
      });
      
      console.log('[userAPI] Contraseña cambiada exitosamente');
      
      return response.data;
    } catch (error) {
      console.error('[userAPI] Error en changePassword:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Obtener estadísticas del usuario
   * GET /api/user/stats
   */
  getStats: async () => {
    try {
      console.log('[userAPI] Obteniendo estadísticas...');
      
      const response = await api.get('/api/user/stats');
      
      console.log('[userAPI] Estadísticas obtenidas');
      
      return response.data;
    } catch (error) {
      console.error('[userAPI] Error en getStats:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Eliminar cuenta de usuario
   * DELETE /api/user/account
   * @param {string} password - Contraseña para confirmar
   */
  deleteAccount: async (password) => {
    try {
      console.log('[userAPI] Eliminando cuenta...');
      
      const response = await api.delete('/api/user/account', {
        data: { password }
      });
      
      console.log('[userAPI] Cuenta eliminada');
      
      return response.data;
    } catch (error) {
      console.error('[userAPI] Error en deleteAccount:', error);
      throw error.response?.data || error;
    }
  }
};

export default userAPI;