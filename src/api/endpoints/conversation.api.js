// src/api/endpoints/conversation.api.js
import api from '../axios.config';

// API de conversaciones
export const conversationAPI = {
  /**
   * Obtener todas las conversaciones del usuario
   * @param {number} page - Numero de pagina
   * @param {number} limit - Limite de resultados por pagina
   * @returns {Promise} - Promise con lista de conversaciones
   */
  getConversations: async (page = 1, limit = 50) => {
    try {
      const response = await api.get('/api/conversations', {
        params: { page, limit },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener una conversacion especifica con sus mensajes
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con datos de la conversacion
   */
  getConversation: async (conversationId) => {
    try {
      const response = await api.get(`/api/conversations/${conversationId}`);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crear nueva conversacion
   * @param {string} title - Titulo de la conversacion (opcional)
   * @param {string} firstMessage - Primer mensaje (opcional)
   * @returns {Promise} - Promise con datos de la nueva conversacion
   */
  createConversation: async (title = null, firstMessage = null) => {
    try {
      const response = await api.post('/api/conversations', {
        title,
        firstMessage,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualizar titulo de conversacion
   * @param {string} conversationId - ID de la conversacion
   * @param {string} title - Nuevo titulo
   * @returns {Promise} - Promise con conversacion actualizada
   */
  updateConversation: async (conversationId, title) => {
    try {
      const response = await api.put(`/api/conversations/${conversationId}`, {
        title,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar conversacion
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con confirmacion
   */
  deleteConversation: async (conversationId) => {
    try {
      const response = await api.delete(`/api/conversations/${conversationId}`);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener mensajes de una conversacion
   * @param {string} conversationId - ID de la conversacion
   * @param {number} page - Numero de pagina
   * @param {number} limit - Limite de mensajes por pagina
   * @returns {Promise} - Promise con mensajes
   */
  getMessages: async (conversationId, page = 1, limit = 50) => {
    try {
      const response = await api.get(`/api/conversations/${conversationId}/messages`, {
        params: { page, limit },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Agregar mensaje a conversacion
   * @param {string} conversationId - ID de la conversacion
   * @param {string} content - Contenido del mensaje
   * @param {string} role - Rol del mensaje (user o assistant)
   * @returns {Promise} - Promise con mensaje creado
   */
  addMessage: async (conversationId, content, role = 'user') => {
    try {
      const response = await api.post(`/api/conversations/${conversationId}/messages`, {
        content,
        role,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Eliminar mensaje
   * @param {string} conversationId - ID de la conversacion
   * @param {string} messageId - ID del mensaje
   * @returns {Promise} - Promise con confirmacion
   */
  deleteMessage: async (conversationId, messageId) => {
    try {
      const response = await api.delete(
        `/api/conversations/${conversationId}/messages/${messageId}`
      );
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Buscar en conversaciones
   * @param {string} query - Termino de busqueda
   * @param {number} page - Numero de pagina
   * @param {number} limit - Limite de resultados
   * @returns {Promise} - Promise con resultados de busqueda
   */
  searchConversations: async (query, page = 1, limit = 20) => {
    try {
      const response = await api.get('/api/conversations/search', {
        params: { query, page, limit },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Archivar conversacion
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con confirmacion
   */
  archiveConversation: async (conversationId) => {
    try {
      const response = await api.post(`/api/conversations/${conversationId}/archive`);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Desarchivar conversacion
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con confirmacion
   */
  unarchiveConversation: async (conversationId) => {
    try {
      const response = await api.post(`/api/conversations/${conversationId}/unarchive`);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener conversaciones archivadas
   * @param {number} page - Numero de pagina
   * @param {number} limit - Limite de resultados
   * @returns {Promise} - Promise con conversaciones archivadas
   */
  getArchivedConversations: async (page = 1, limit = 50) => {
    try {
      const response = await api.get('/api/conversations/archived', {
        params: { page, limit },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Marcar conversacion como favorita
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con confirmacion
   */
  favoriteConversation: async (conversationId) => {
    try {
      const response = await api.post(`/api/conversations/${conversationId}/favorite`);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Quitar conversacion de favoritos
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con confirmacion
   */
  unfavoriteConversation: async (conversationId) => {
    try {
      const response = await api.delete(`/api/conversations/${conversationId}/favorite`);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener conversaciones favoritas
   * @param {number} page - Numero de pagina
   * @param {number} limit - Limite de resultados
   * @returns {Promise} - Promise con conversaciones favoritas
   */
  getFavoriteConversations: async (page = 1, limit = 50) => {
    try {
      const response = await api.get('/api/conversations/favorites', {
        params: { page, limit },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Exportar conversacion a PDF
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con archivo PDF
   */
  exportToPDF: async (conversationId) => {
    try {
      const response = await api.get(`/api/conversations/${conversationId}/export/pdf`, {
        responseType: 'blob',
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Exportar conversacion a TXT
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con archivo TXT
   */
  exportToTXT: async (conversationId) => {
    try {
      const response = await api.get(`/api/conversations/${conversationId}/export/txt`, {
        responseType: 'blob',
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener estadisticas de conversaciones
   * @returns {Promise} - Promise con estadisticas
   */
  getStats: async () => {
    try {
      const response = await api.get('/api/conversations/stats');
      
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default conversationAPI;