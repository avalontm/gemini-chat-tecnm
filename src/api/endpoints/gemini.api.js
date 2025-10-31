// src/api/endpoints/gemini.api.js
import api from '../axios.config';

// API de Gemini
export const geminiAPI = {
  /**
   * Enviar mensaje de texto a Gemini
   * @param {string} prompt - Texto del mensaje
   * @param {string} conversationId - ID de la conversacion (opcional)
   * @param {number} temperature - Temperatura de generacion (0.0 - 1.0)
   * @param {number} maxTokens - Maximo de tokens en la respuesta
   * @returns {Promise} - Promise con respuesta de Gemini
   */
  sendText: async (prompt, conversationId = null, temperature = 0.7, maxTokens = 2048) => {
    try {
      const response = await api.post('/api/gemini/text', {
        prompt,
        conversationId,
        temperature,
        maxTokens,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Enviar imagen con prompt a Gemini
   * @param {FormData} formData - FormData con imagen y prompt
   * @returns {Promise} - Promise con analisis de la imagen
   */
  sendImage: async (formData) => {
    try {
      const response = await api.post('/api/gemini/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Enviar audio para transcripcion y analisis
   * @param {FormData} formData - FormData con archivo de audio
   * @returns {Promise} - Promise con transcripcion y respuesta
   */
  sendVoice: async (formData) => {
    try {
      const response = await api.post('/api/gemini/voice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Enviar PDF para analisis
   * @param {FormData} formData - FormData con archivo PDF y prompt
   * @returns {Promise} - Promise con analisis del PDF
   */
  sendPDF: async (formData) => {
    try {
      const response = await api.post('/api/gemini/pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Enviar multiples archivos (multimodal)
   * @param {FormData} formData - FormData con multiples archivos y prompt
   * @returns {Promise} - Promise con respuesta multimodal
   */
  sendMultimodal: async (formData) => {
    try {
      const response = await api.post('/api/gemini/multimodal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Continuar conversacion existente
   * @param {string} conversationId - ID de la conversacion
   * @param {string} prompt - Texto del mensaje
   * @returns {Promise} - Promise con respuesta de Gemini
   */
  continueConversation: async (conversationId, prompt) => {
    try {
      const response = await api.post(`/api/gemini/conversation/${conversationId}`, {
        prompt,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener sugerencias de prompts
   * @param {string} context - Contexto actual de la conversacion
   * @returns {Promise} - Promise con sugerencias
   */
  getSuggestions: async (context) => {
    try {
      const response = await api.post('/api/gemini/suggestions', {
        context,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generar titulo para conversacion
   * @param {string} conversationId - ID de la conversacion
   * @returns {Promise} - Promise con titulo generado
   */
  generateTitle: async (conversationId) => {
    try {
      const response = await api.post(`/api/gemini/generate-title/${conversationId}`);
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener modelos disponibles de Gemini
   * @returns {Promise} - Promise con lista de modelos
   */
  getModels: async () => {
    try {
      const response = await api.get('/api/gemini/models');
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Detener generacion en curso
   * @param {string} requestId - ID de la peticion en curso
   * @returns {Promise} - Promise con confirmacion
   */
  stopGeneration: async (requestId) => {
    try {
      const response = await api.post('/api/gemini/stop', {
        requestId,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Regenerar ultima respuesta
   * @param {string} conversationId - ID de la conversacion
   * @param {string} messageId - ID del mensaje a regenerar
   * @returns {Promise} - Promise con nueva respuesta
   */
  regenerateResponse: async (conversationId, messageId) => {
    try {
      const response = await api.post('/api/gemini/regenerate', {
        conversationId,
        messageId,
      });
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener estadisticas de uso
   * @returns {Promise} - Promise con estadisticas
   */
  getUsageStats: async () => {
    try {
      const response = await api.get('/api/gemini/usage');
      
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default geminiAPI;