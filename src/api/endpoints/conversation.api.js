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
  console.error(`[CONVERSATION API] Error en ${context}:`, error);
  
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
      console.log('[CONVERSATION API] Obteniendo conversaciones', { page, limit });
      
      const response = await api.get('/api/conversations', {
        params: { page, limit },
      });
      
      console.log('[CONVERSATION API] Conversaciones obtenidas:', response.data?.length || 0);
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
      console.error('[CONVERSATION API] getConversation - ID inválido:', conversationId);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Obteniendo conversación:', conversationId);
      
      const response = await api.get(`/api/conversations/${conversationId}`);
      
      console.log('[CONVERSATION API] Conversación obtenida:', getConversationId(response.data.conversation));
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
      console.log('[CONVERSATION API] Creando conversación', { title, firstMessage: !!firstMessage });
      
      const payload = {};
      
      if (title && title.trim().length > 0) {
        payload.title = title.trim();
      }
      
      if (firstMessage && firstMessage.trim().length > 0) {
        payload.firstMessage = firstMessage.trim();
      }
      
      const response = await api.post('/api/conversations', payload);
      
      console.log('[CONVERSATION API] Conversación creada:', getConversationId(response.data.conversation));
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
      console.error('[CONVERSATION API] updateConversation - ID inválido:', conversationId);
      throw error;
    }

    if (!title || title.trim().length === 0) {
      const error = new Error('El título no puede estar vacío');
      console.error('[CONVERSATION API] updateConversation - Título vacío');
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Actualizando conversación:', conversationId);
      
      const response = await api.put(`/api/conversations/${conversationId}`, {
        title: title.trim(),
      });
      
      console.log('[CONVERSATION API] Conversación actualizada');
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
      console.error('[CONVERSATION API] deleteConversation - ID inválido:', conversationId);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Eliminando conversación:', conversationId);
      
      const response = await api.delete(`/api/conversations/${conversationId}`);
      
      console.log('[CONVERSATION API] Conversación eliminada');
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
      console.error('[CONVERSATION API] getMessages - ID inválido:', conversationId);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Obteniendo mensajes:', { conversationId, page, limit });
      
      const response = await api.get(`/api/conversations/${conversationId}/messages`, {
        params: { page, limit },
      });
      
      console.log('[CONVERSATION API] Mensajes obtenidos:', response.data?.length || 0);
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
      console.error('[CONVERSATION API] addMessage - ID inválido:', conversationId);
      throw error;
    }

    if (!content || content.trim().length === 0) {
      const error = new Error('El contenido del mensaje no puede estar vacío');
      console.error('[CONVERSATION API] addMessage - Contenido vacío');
      throw error;
    }

    if (role !== 'user' && role !== 'assistant') {
      const error = new Error('Rol inválido. Debe ser "user" o "assistant"');
      console.error('[CONVERSATION API] addMessage - Rol inválido:', role);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Agregando mensaje:', { conversationId, role });
      
      const response = await api.post(`/api/conversations/${conversationId}/messages`, {
        content: content.trim(),
        role,
      });
      
      console.log('[CONVERSATION API] Mensaje agregado');
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
      console.error('[CONVERSATION API] deleteMessage - conversationId inválido:', conversationId);
      throw error;
    }

    if (!isValidConversationId(messageId)) {
      const error = new Error('ID de mensaje inválido');
      console.error('[CONVERSATION API] deleteMessage - messageId inválido:', messageId);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Eliminando mensaje:', { conversationId, messageId });
      
      const response = await api.delete(
        `/api/conversations/${conversationId}/messages/${messageId}`
      );
      
      console.log('[CONVERSATION API] Mensaje eliminado');
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
      console.error('[CONVERSATION API] searchConversations - Query vacío');
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Buscando conversaciones:', query);
      
      const response = await api.get('/api/conversations/search', {
        params: { 
          query: query.trim(), 
          page, 
          limit 
        },
      });
      
      console.log('[CONVERSATION API] Resultados encontrados:', response.data?.length || 0);
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
      console.error('[CONVERSATION API] archiveConversation - ID inválido:', conversationId);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Archivando conversación:', conversationId);
      
      const response = await api.post(`/api/conversations/${conversationId}/archive`);
      
      console.log('[CONVERSATION API] Conversación archivada');
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
      console.error('[CONVERSATION API] unarchiveConversation - ID inválido:', conversationId);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Desarchivando conversación:', conversationId);
      
      const response = await api.post(`/api/conversations/${conversationId}/unarchive`);
      
      console.log('[CONVERSATION API] Conversación desarchivada');
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
      console.log('[CONVERSATION API] Obteniendo conversaciones archivadas', { page, limit });
      
      const response = await api.get('/api/conversations/archived', {
        params: { page, limit },
      });
      
      console.log('[CONVERSATION API] Conversaciones archivadas obtenidas:', response.data?.length || 0);
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
      console.error('[CONVERSATION API] favoriteConversation - ID inválido:', conversationId);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Marcando como favorita:', conversationId);
      
      const response = await api.post(`/api/conversations/${conversationId}/favorite`);
      
      console.log('[CONVERSATION API] Conversación marcada como favorita');
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
      console.error('[CONVERSATION API] unfavoriteConversation - ID inválido:', conversationId);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Quitando de favoritos:', conversationId);
      
      const response = await api.delete(`/api/conversations/${conversationId}/favorite`);
      
      console.log('[CONVERSATION API] Conversación quitada de favoritos');
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
      console.log('[CONVERSATION API] Obteniendo conversaciones favoritas', { page, limit });
      
      const response = await api.get('/api/conversations/favorites', {
        params: { page, limit },
      });
      
      console.log('[CONVERSATION API] Conversaciones favoritas obtenidas:', response.data?.length || 0);
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
      console.error('[CONVERSATION API] exportToPDF - ID inválido:', conversationId);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Exportando a PDF:', conversationId);
      
      const response = await api.get(`/api/conversations/${conversationId}/export/pdf`, {
        responseType: 'blob',
      });
      
      console.log('[CONVERSATION API] PDF generado');
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
      console.error('[CONVERSATION API] exportToTXT - ID inválido:', conversationId);
      throw error;
    }

    try {
      console.log('[CONVERSATION API] Exportando a TXT:', conversationId);
      
      const response = await api.get(`/api/conversations/${conversationId}/export/txt`, {
        responseType: 'blob',
      });
      
      console.log('[CONVERSATION API] TXT generado');
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
      console.log('[CONVERSATION API] Obteniendo estadísticas');
      
      const response = await api.get('/api/conversations/stats');
      
      console.log('[CONVERSATION API] Estadísticas obtenidas');
      return response;
    } catch (error) {
      handleAPIError(error, 'getStats');
    }
  },
};

// Exportar tanto como named export como default export
export { conversationAPI };
export default conversationAPI;