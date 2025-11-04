// src/api/endpoints/export.api.js

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

// API de exportación
export const exportAPI = {
  /**
   * Exportar conversación a PDF
   * @param {string} conversationId - ID de la conversación
   * @returns {Promise} - Promise con blob del PDF
   */
  exportToPDF: async (conversationId) => {
    try {
      console.log('[exportAPI] Exportando a PDF...');
      
      if (!isValidConversationId(conversationId)) {
        throw new Error('ID de conversación inválido');
      }

      const response = await api.get(`/api/export/${conversationId}/pdf`, {
        responseType: 'blob'
      });
      
      console.log('[exportAPI] PDF exportado exitosamente');
      return response.data;
    } catch (error) {
      console.error('[exportAPI] Error exportando a PDF:', error);
      console.error('[exportAPI] Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Exportar conversación a TXT
   * @param {string} conversationId - ID de la conversación
   * @returns {Promise} - Promise con blob del TXT
   */
  exportToTXT: async (conversationId) => {
    try {
      console.log('[exportAPI] Exportando a TXT...');
      
      if (!isValidConversationId(conversationId)) {
        throw new Error('ID de conversación inválido');
      }

      const response = await api.get(`/api/export/${conversationId}/txt`, {
        responseType: 'blob'
      });
      
      console.log('[exportAPI] TXT exportado exitosamente');
      return response.data;
    } catch (error) {
      console.error('[exportAPI] Error exportando a TXT:', error);
      console.error('[exportAPI] Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Exportar conversación a JSON
   * @param {string} conversationId - ID de la conversación
   * @returns {Promise} - Promise con blob del JSON
   */
  exportToJSON: async (conversationId) => {
    try {
      console.log('[exportAPI] Exportando a JSON...');
      
      if (!isValidConversationId(conversationId)) {
        throw new Error('ID de conversación inválido');
      }

      const response = await api.get(`/api/export/${conversationId}/json`, {
        responseType: 'blob'
      });
      
      console.log('[exportAPI] JSON exportado exitosamente');
      return response.data;
    } catch (error) {
      console.error('[exportAPI] Error exportando a JSON:', error);
      console.error('[exportAPI] Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Exportar todas las conversaciones
   * @param {string} format - Formato (pdf, txt, json)
   * @returns {Promise} - Promise con blob del archivo comprimido
   */
  exportAll: async (format) => {
    try {
      console.log('[exportAPI] Exportando todas las conversaciones...');
      
      const validFormats = ['pdf', 'txt', 'json'];
      if (!validFormats.includes(format)) {
        throw new Error(`Formato inválido. Usar: ${validFormats.join(', ')}`);
      }

      const response = await api.get(`/api/export/all/${format}`, {
        responseType: 'blob'
      });
      
      console.log('[exportAPI] Todas las conversaciones exportadas exitosamente');
      return response.data;
    } catch (error) {
      console.error('[exportAPI] Error exportando todas las conversaciones:', error);
      console.error('[exportAPI] Error response:', error.response?.data);
      throw error;
    }
  }
};

export default exportAPI;