// src/api/endpoints/reports.api.js

import api from '../axios.config';

// API de reportes
export const reportsAPI = {
  /**
   * Generar reporte desde plantilla predefinida
   * @param {Object} reportData - Datos completos del reporte
   * @param {string} reportData.templateId - ID de la plantilla (research_paper, academic_report, technical_document)
   * @param {string} reportData.topic - Tema del reporte
   * @param {string} reportData.additionalInstructions - Instrucciones adicionales
   * @param {Object} reportData.metadata - Metadatos
   * @param {string} reportData.metadata.school - Institución
   * @param {string} reportData.metadata.faculty - Facultad/Carrera
   * @param {string} reportData.metadata.subject - Materia
   * @param {string} reportData.metadata.student - Estudiante
   * @param {string|number} reportData.metadata.studentId - Número de control
   * @param {string} reportData.metadata.professor - Profesor
   * @param {string} reportData.metadata.group - Grupo
   * @returns {Promise} - Promise con blob del DOCX
   */
  generateReportFromTemplate: async (reportData) => {
    try {
      console.log('[reportsAPI] Generando reporte desde plantilla...');
      console.log('[reportsAPI] Datos enviados:', reportData);

      // Validaciones básicas
      if (!reportData.templateId) {
        throw new Error('templateId es requerido');
      }

      if (!reportData.topic || !reportData.topic.trim()) {
        throw new Error('El tema del reporte es requerido');
      }

      // Validar metadata requerida
      if (!reportData.metadata) {
        throw new Error('Los metadatos son requeridos');
      }

      const requiredMetadata = ['school', 'student', 'studentId'];
      for (const field of requiredMetadata) {
        if (!reportData.metadata[field] || !reportData.metadata[field].toString().trim()) {
          throw new Error(`El campo ${field} en metadata es requerido`);
        }
      }

      // Preparar datos para el backend
      const processedData = {
        templateId: reportData.templateId,
        topic: reportData.topic.trim(),
        additionalInstructions: reportData.additionalInstructions?.trim() || '',
        metadata: {
          school: reportData.metadata.school?.trim() || '',
          faculty: reportData.metadata.faculty?.trim() || '',
          subject: reportData.metadata.subject?.trim() || '',
          student: reportData.metadata.student?.trim() || '',
          studentId: reportData.metadata.studentId ? 
            (isNaN(reportData.metadata.studentId) ? 
              reportData.metadata.studentId.toString().trim() : 
              Number(reportData.metadata.studentId)) 
            : '',
          professor: reportData.metadata.professor?.trim() || '',
          group: reportData.metadata.group?.trim() || ''
        }
      };

      console.log('[reportsAPI] Datos procesados para enviar:', processedData);

      const response = await api.post('/api/reports/generate-from-template', 
        processedData,
        {
          responseType: 'blob',
          timeout: 60000, // 60 segundos timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Verificar que la respuesta sea un blob válido
      if (!response.data || !(response.data instanceof Blob)) {
        throw new Error('La respuesta del servidor no es un archivo válido');
      }

      if (response.data.size === 0) {
        throw new Error('El servidor devolvió un archivo vacío');
      }

      console.log('[reportsAPI] Reporte generado exitosamente, tamaño:', response.data.size, 'tipo:', response.data.type);
      return response.data;

    } catch (error) {
      console.error('[reportsAPI] Error generando reporte:', error);
      
      // Manejar diferentes tipos de error
      if (error.response) {
        // Error del servidor (4xx, 5xx)
        const status = error.response.status;
        const data = error.response.data;
        
        console.error('[reportsAPI] Error response:', {
          status,
          statusText: error.response.statusText,
          headers: error.response.headers,
          data: data
        });

        // LEER EL BLOB DE ERROR para obtener el mensaje real
        if (data instanceof Blob) {
          try {
            const errorText = await data.text();
            console.error('[reportsAPI] Error blob content:', errorText);
            
            let errorMessage = `Error ${status}: No se pudo generar el reporte`;
            
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.message || errorJson.error || errorJson.details || errorMessage;
              
              // Log detallado del error del servidor
              console.error('[reportsAPI] Error del servidor:', {
                message: errorJson.message,
                error: errorJson.error,
                details: errorJson.details
              });
              
            } catch (e) {
              // Si no es JSON válido, usar el texto como está
              if (errorText && errorText.trim() !== '') {
                errorMessage = `Error ${status}: ${errorText}`;
              }
            }
            
            throw new Error(errorMessage);
            
          } catch (blobError) {
            console.error('[reportsAPI] Error leyendo blob de error:', blobError);
            throw new Error(`Error ${status}: No se pudo procesar la respuesta del servidor`);
          }
        } else {
          // Si no es blob, usar el data directamente
          console.error('[reportsAPI] Error data (no blob):', data);
          throw new Error(data?.message || data?.error || `Error ${status}: ${error.response.statusText}`);
        }
        
      } else if (error.request) {
        // Error de red o timeout
        console.error('[reportsAPI] No se recibió respuesta del servidor:', error.request);
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
        
      } else {
        // Error en la configuración
        console.error('[reportsAPI] Error de configuración:', error.message);
        throw error;
      }
    }
  },

  /**
   * Obtener plantillas de reportes disponibles
   * @returns {Promise} - Promise con lista de plantillas
   */
  getTemplates: async () => {
    try {
      console.log('[reportsAPI] Obteniendo plantillas...');

      const response = await api.get('/api/reports/templates');
      
      console.log('[reportsAPI] Plantillas obtenidas exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('[reportsAPI] Error obteniendo plantillas:', error);
      
      if (error.response) {
        const status = error.response.status;
        console.error('[reportsAPI] Error response:', error.response.data);
        throw new Error(`Error ${status}: ${error.response.data?.message || 'No se pudieron obtener las plantillas'}`);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw error;
      }
    }
  },

  /**
   * Generar reporte personalizado
   * @param {string} prompt - Instrucciones para el reporte
   * @param {Object} options - Opciones adicionales
   * @param {string} [options.conversationId] - ID de conversación relacionada
   * @param {string} [options.templateType] - Tipo de plantilla
   * @param {string} [options.format] - Formato de salida
   * @param {Object} [options.metadata] - Metadatos del reporte
   * @returns {Promise} - Promise con blob del reporte
   */
  generateCustomReport: async (prompt, options = {}) => {
    try {
      console.log('[reportsAPI] Generando reporte personalizado...');
      console.log('[reportsAPI] Datos:', {
        prompt: prompt.substring(0, 100) + '...',
        ...options
      });

      if (!prompt || !prompt.trim()) {
        throw new Error('El prompt es requerido para generar el reporte');
      }

      const requestData = {
        prompt: prompt.trim(),
        ...options
      };

      const response = await api.post('/api/reports/generate', 
        requestData,
        {
          responseType: 'blob',
          timeout: 60000
        }
      );

      if (!response.data || !(response.data instanceof Blob)) {
        throw new Error('La respuesta del servidor no es un archivo válido');
      }

      if (response.data.size === 0) {
        throw new Error('El servidor devolvió un archivo vacío');
      }
      
      console.log('[reportsAPI] Reporte personalizado generado exitosamente, tamaño:', response.data.size);
      return response.data;
    } catch (error) {
      console.error('[reportsAPI] Error generando reporte personalizado:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        // Manejar blob de error
        if (error.response.data instanceof Blob) {
          try {
            const errorText = await error.response.data.text();
            let errorMessage = `Error ${status}: No se pudo generar el reporte personalizado`;
            
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch (e) {
              if (errorText && errorText.trim() !== '') {
                errorMessage = `Error ${status}: ${errorText}`;
              }
            }
            
            throw new Error(errorMessage);
          } catch (blobError) {
            throw new Error(`Error ${status}: No se pudo procesar la respuesta del servidor`);
          }
        } else {
          throw new Error(error.response.data?.message || error.response.data?.error || `Error ${status}`);
        }
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw error;
      }
    }
  },

  /**
   * Exportar conversación existente como documento Word profesional
   * @param {string} conversationId - ID de la conversación
   * @returns {Promise} - Promise con blob del DOCX
   */
  exportConversationToDocx: async (conversationId) => {
    try {
      console.log('[reportsAPI] Exportando conversación a DOCX...');
      
      if (!conversationId || conversationId === 'null' || conversationId === 'undefined') {
        throw new Error('ID de conversación inválido');
      }

      const response = await api.get(`/api/reports/conversation/${conversationId}/docx`, {
        responseType: 'blob',
        timeout: 60000
      });

      if (!response.data || !(response.data instanceof Blob)) {
        throw new Error('La respuesta del servidor no es un archivo válido');
      }

      if (response.data.size === 0) {
        throw new Error('El servidor devolvió un archivo vacío');
      }
      
      console.log('[reportsAPI] Conversación exportada a DOCX exitosamente, tamaño:', response.data.size);
      return response.data;
    } catch (error) {
      console.error('[reportsAPI] Error exportando conversación a DOCX:', error);
      
      if (error.response) {
        const status = error.response.status;
        
        if (error.response.data instanceof Blob) {
          try {
            const errorText = await error.response.data.text();
            let errorMessage = `Error ${status}: No se pudo exportar la conversación`;
            
            try {
              const errorJson = JSON.parse(errorText);
              errorMessage = errorJson.message || errorJson.error || errorMessage;
            } catch (e) {
              if (errorText && errorText.trim() !== '') {
                errorMessage = `Error ${status}: ${errorText}`;
              }
            }
            
            throw new Error(errorMessage);
          } catch (blobError) {
            throw new Error(`Error ${status}: No se pudo procesar la respuesta del servidor`);
          }
        } else {
          throw new Error(error.response.data?.message || error.response.data?.error || `Error ${status}`);
        }
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw error;
      }
    }
  },

  /**
   * Generar reporte y guardarlo en servidor
   * @param {Object} reportData - Datos del reporte
   * @param {string} reportData.title - Título del reporte
   * @param {string} reportData.prompt - Instrucciones
   * @param {string} [reportData.conversationId] - ID de conversación relacionada
   * @param {string} [reportData.templateType] - Tipo de plantilla
   * @param {Object} [reportData.metadata] - Metadatos del reporte
   * @returns {Promise} - Promise con información del reporte guardado
   */
  generateAndSave: async (reportData) => {
    try {
      console.log('[reportsAPI] Generando y guardando reporte...');
      console.log('[reportsAPI] Datos:', {
        title: reportData.title,
        prompt: reportData.prompt?.substring(0, 100) + '...',
        conversationId: reportData.conversationId,
        templateType: reportData.templateType,
        metadata: reportData.metadata
      });

      if (!reportData.title || !reportData.title.trim()) {
        throw new Error('El título del reporte es requerido');
      }

      if (!reportData.prompt || !reportData.prompt.trim()) {
        throw new Error('El prompt es requerido');
      }

      const processedData = {
        ...reportData,
        title: reportData.title.trim(),
        prompt: reportData.prompt.trim()
      };

      const response = await api.post('/api/reports/generate-and-save', processedData);
      
      console.log('[reportsAPI] Reporte generado y guardado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('[reportsAPI] Error generando y guardando reporte:', error);
      
      if (error.response) {
        const status = error.response.status;
        console.error('[reportsAPI] Error response:', error.response.data);
        throw new Error(error.response.data?.message || error.response.data?.error || `Error ${status}: No se pudo guardar el reporte`);
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor');
      } else {
        throw error;
      }
    }
  }
};

export default reportsAPI;