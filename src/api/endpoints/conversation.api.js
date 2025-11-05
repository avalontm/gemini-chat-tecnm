// src/api/endpoints/conversation.api.js

import api from '../axios.config';

/**
 * Validar conversationId
 * @param {string} conversationId 
 * @returns {boolean}
 */
const isValidConversationId = (conversationId) => {
  return conversationId && 
         conversationId !== 'null' && 
         conversationId !== 'undefined' &&
         typeof conversationId === 'string' &&
         conversationId.trim().length > 0;
};

/**
 * Normalizar ID de conversación (soporta id y _id)
 * @param {object} conversation 
 * @returns {string}
 */
const getConversationId = (conversation) => {
  return conversation?.id || conversation?._id;
};

/**
 * Manejo centralizado de errores
 * @param {Error} error 
 * @param {string} context 
 */
const handleAPIError = (error, context) => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    switch (status) {
      case 401:
        console.error('[CONVERSATION API] No autenticado - Token expirado o inválido');
        break;
      case 403:
        console.error('[CONVERSATION API] No autorizado - Acceso denegado');
        break;
      case 404:
        console.error('[CONVERSATION API] Recurso no encontrado');
        break;
      case 500:
        console.error('[CONVERSATION API] Error del servidor');
        break;
      default:
        console.error('[CONVERSATION API] Error:', status, message);
    }
  }
  
  throw error;
};

// API de conversaciones
const conversationAPI = {
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
      handleAPIError(error, 'getConversations');
    }
  },

  /**
   * Obtener una conversacion especifica con sus mensajes
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con datos de la conversacion
   */
  getConversation: async (conversationId) => {
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    try {
      const response = await api.get(`/api/conversations/${conversationId}`);
      return response;
    } catch (error) {
      handleAPIError(error, 'getConversation');
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
      const payload = {};
      
      if (title && title.trim().length > 0) {
        payload.title = title.trim();
      }
      
      if (firstMessage && firstMessage.trim().length > 0) {
        payload.firstMessage = firstMessage.trim();
      }
      
      const response = await api.post('/api/conversations', payload);
      return response;
    } catch (error) {
      handleAPIError(error, 'createConversation');
    }
  },

  /**
   * Actualizar titulo de conversacion
   * @param {string} conversationId - ID de la conversacion
   * @param {string} title - Nuevo titulo
   * @returns {Promise} - Promise con conversacion actualizada
   */
  updateConversation: async (conversationId, title) => {
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    if (!title || title.trim().length === 0) {
      const error = new Error('El título no puede estar vacío');
      throw error;
    }

    try {
      const response = await api.put(`/api/conversations/${conversationId}`, {
        title: title.trim(),
      });
      
      return response;
    } catch (error) {
      handleAPIError(error, 'updateConversation');
    }
  },

  /**
   * Eliminar conversacion
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con confirmacion
   */
  deleteConversation: async (conversationId) => {
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    try {
      const response = await api.delete(`/api/conversations/${conversationId}`);
      return response;
    } catch (error) {
      handleAPIError(error, 'deleteConversation');
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
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    try {
      const response = await api.get(`/api/conversations/${conversationId}/messages`, {
        params: { page, limit },
      });
      
      return response;
    } catch (error) {
      handleAPIError(error, 'getMessages');
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
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    if (!content || content.trim().length === 0) {
      const error = new Error('El contenido del mensaje no puede estar vacío');
      throw error;
    }

    if (role !== 'user' && role !== 'assistant') {
      const error = new Error('Rol inválido. Debe ser "user" o "assistant"');
      throw error;
    }

    try {
      const response = await api.post(`/api/conversations/${conversationId}/messages`, {
        content: content.trim(),
        role,
      });
      
      return response;
    } catch (error) {
      handleAPIError(error, 'addMessage');
    }
  },

  /**
   * Eliminar mensaje
   * @param {string} conversationId - ID de la conversacion
   * @param {string} messageId - ID del mensaje
   * @returns {Promise} - Promise con confirmacion
   */
  deleteMessage: async (conversationId, messageId) => {
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    if (!isValidConversationId(messageId)) {
      const error = new Error('ID de mensaje inválido');
      throw error;
    }

    try {
      const response = await api.delete(
        `/api/conversations/${conversationId}/messages/${messageId}`
      );
      
      return response;
    } catch (error) {
      handleAPIError(error, 'deleteMessage');
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
    if (!query || query.trim().length === 0) {
      const error = new Error('La búsqueda no puede estar vacía');
      throw error;
    }

    try {
      const response = await api.get('/api/conversations/search', {
        params: { 
          query: query.trim(), 
          page, 
          limit 
        },
      });
      
      return response;
    } catch (error) {
      handleAPIError(error, 'searchConversations');
    }
  },

  /**
   * Archivar conversacion
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con confirmacion
   */
  archiveConversation: async (conversationId) => {
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    try {
      const response = await api.post(`/api/conversations/${conversationId}/archive`);
      return response;
    } catch (error) {
      handleAPIError(error, 'archiveConversation');
    }
  },

  /**
   * Desarchivar conversacion
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con confirmacion
   */
  unarchiveConversation: async (conversationId) => {
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    try {
      const response = await api.post(`/api/conversations/${conversationId}/unarchive`);
      return response;
    } catch (error) {
      handleAPIError(error, 'unarchiveConversation');
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
      handleAPIError(error, 'getArchivedConversations');
    }
  },

  /**
   * Marcar conversacion como favorita
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con confirmacion
   */
  favoriteConversation: async (conversationId) => {
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    try {
      const response = await api.post(`/api/conversations/${conversationId}/favorite`);
      return response;
    } catch (error) {
      handleAPIError(error, 'favoriteConversation');
    }
  },

  /**
   * Quitar conversacion de favoritos
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con confirmacion
   */
  unfavoriteConversation: async (conversationId) => {
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    try {
      const response = await api.delete(`/api/conversations/${conversationId}/favorite`);
      return response;
    } catch (error) {
      handleAPIError(error, 'unfavoriteConversation');
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
      handleAPIError(error, 'getFavoriteConversations');
    }
  },

  /**
   * Exportar conversacion a PDF
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con archivo PDF
   */
  exportToPDF: async (conversationId) => {
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    try {
      const response = await api.get(`/api/conversations/${conversationId}/export/pdf`, {
        responseType: 'blob',
      });
      
      return response;
    } catch (error) {
      handleAPIError(error, 'exportToPDF');
    }
  },

  /**
   * Exportar conversacion a TXT
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con archivo TXT
   */
  exportToTXT: async (conversationId) => {
    if (!isValidConversationId(conversationId)) {
      const error = new Error('ID de conversación inválido');
      throw error;
    }

    try {
      const response = await api.get(`/api/conversations/${conversationId}/export/txt`, {
        responseType: 'blob',
      });
      
      return response;
    } catch (error) {
      handleAPIError(error, 'exportToTXT');
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
      handleAPIError(error, 'getStats');
    }
  },
};

// Exportar tanto como named export como default export
export { conversationAPI };
export default conversationAPI;