// src/api/endpoints/gemini.api.js

import api from '@api/axios.config';
import { getStorageKey } from '@config/app.config';
import { logger, handleError, validateServerResponse } from '@utils/errorHandler';

export const geminiAPI = {
  /**
   * Enviar mensaje de texto a Gemini (sin streaming)
   */
  sendText: async (prompt, conversationId = null, config = {}) => {
    const context = 'GEMINI_API.sendText';
    
    try {
      logger.info(context, 'Enviando mensaje de texto', { 
        prompt: prompt?.substring(0, 50), 
        conversationId,
        config
      });
      
      const payload = { prompt };
      
      if (conversationId && 
          conversationId !== 'null' && 
          conversationId !== 'undefined' &&
          typeof conversationId === 'string' &&
          conversationId.trim().length > 0) {
        payload.conversationId = conversationId;
      }

      if (config && Object.keys(config).length > 0) {
        payload.config = {
          temperature: config.temperature || 0.7,
          ...config
        };
      }

      const response = await api.post('/api/gemini/text', payload);
      
      validateServerResponse(response, context);
      logger.success(context, 'Mensaje enviado exitosamente');
      
      return response;
    } catch (error) {
      const errorInfo = handleError(error, context, { showToast: false });
      logger.error(context, 'Error al enviar mensaje', errorInfo);
      throw error;
    }
  },

  /**
   * Enviar mensaje de texto con streaming
   */
  sendTextStream: async (
    prompt, 
    conversationId = null, 
    onChunk, 
    onComplete, 
    onError,
    config = {}
  ) => {
    const context = 'GEMINI_API.sendTextStream';
    
    logger.info(context, 'Iniciando streaming', {
      prompt: prompt?.substring(0, 100),
      conversationId,
      config
    });

    try {
      const token = localStorage.getItem(getStorageKey('token'));
      logger.debug(context, 'Token verificado', { 
        present: !!token,
        key: getStorageKey('token')
      });
      
      if (!token) {
        const error = new Error('No hay token de autenticacion');
        logger.error(context, error.message);
        throw error;
      }

      const baseURL = api.defaults.baseURL || 'http://localhost:5000';
      logger.debug(context, 'URL base configurada', { baseURL });
      
      const payload = { prompt };
      
      if (conversationId && 
          conversationId !== 'null' && 
          conversationId !== 'undefined' &&
          typeof conversationId === 'string' &&
          conversationId.trim().length > 0) {
        payload.conversationId = conversationId;
        logger.debug(context, 'ConversationId agregado', { conversationId });
      } else {
        logger.debug(context, 'Sin conversationId (nueva conversacion)');
      }

      payload.config = {
        temperature: config.temperature || 0.7,
        ...config
      };

      logger.debug(context, 'Payload preparado', payload);

      const url = `${baseURL}/api/gemini/text/stream`;
      logger.info(context, 'Iniciando fetch', { url });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      logger.debug(context, 'Response recibida', { 
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        contentType: response.headers.get('content-type')
      });

      if (!response.ok) {
        logger.error(context, 'Response not OK', { status: response.status });
        
        let errorMessage = 'Error en streaming';
        let errorDetails = null;
        let validationErrors = null;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorDetails = errorData.details || errorData.error;
          validationErrors = errorData.errors;
          
          logger.error(context, 'Error del servidor', {
            status: response.status,
            message: errorMessage,
            details: errorDetails,
            validationErrors
          });
        } catch (e) {
          logger.error(context, 'No se pudo parsear error JSON');
        }
        
        const error = new Error(errorMessage);
        error.status = response.status;
        error.details = errorDetails;
        error.validationErrors = validationErrors;
        throw error;
      }

      const contentType = response.headers.get('content-type');
      logger.debug(context, 'Content-Type verificado', { contentType });

      logger.info(context, 'Iniciando lectura del stream');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';
      let conversationData = null;
      let messageId = null;
      let chunkCount = 0;
      let textChunkCount = 0;
      const startTime = Date.now();

      // CRITICO: Variable para controlar si ya llamamos onComplete
      let completeCalled = false;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          const duration = Date.now() - startTime;
          logger.success(context, 'Stream completado (done=true)', {
            totalChunks: chunkCount,
            textChunks: textChunkCount,
            responseLength: fullResponse.length,
            duration: `${duration}ms`,
            hasConversation: !!conversationData,
            hasMessageId: !!messageId
          });
          break;
        }

        const decodedChunk = decoder.decode(value, { stream: true });
        buffer += decodedChunk;
        chunkCount++;
        
        logger.debug(context, `Chunk ${chunkCount} recibido`, {
          size: decodedChunk.length,
          preview: decodedChunk.substring(0, 100)
        });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          logger.debug(context, 'Procesando linea', { 
            line: line.substring(0, 100) 
          });

          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            // CRITICO: Cuando llega [DONE], NO llamar onComplete aqui
            // Solo marcamos que llegó la señal
            if (data === '[DONE]') {
              logger.info(context, 'Senal [DONE] recibida - se llamara onComplete al salir del loop');
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              
              logger.debug(context, 'Datos parseados', {
                type: parsed.type,
                hasText: !!parsed.text,
                hasChunk: !!parsed.chunk,
                hasConversation: !!parsed.conversation,
                hasMessageId: !!parsed.messageId,
                hasError: !!parsed.error
              });
              
              if (parsed.type === 'start') {
                if (parsed.conversationId) {
                  logger.info(context, 'Evento START recibido', {
                    conversationId: parsed.conversationId,
                    metadata: parsed.metadata
                  });
                }
                continue;
              }
              
              if (parsed.type === 'chunk' && parsed.text) {
                textChunkCount++;
                fullResponse += parsed.text;
                
                logger.debug(context, `Chunk de texto ${textChunkCount}`, {
                  text: parsed.text.substring(0, 50),
                  accumulated: fullResponse.length
                });
                
                if (onChunk) {
                  onChunk(parsed.text, fullResponse);
                }
                continue;
              }
              
              if (parsed.type === 'end') {
                if (parsed.messageId) {
                  messageId = parsed.messageId;
                  logger.info(context, 'Evento END recibido', {
                    messageId,
                    conversationId: parsed.conversationId
                  });
                }
                
                if (parsed.conversationId && !conversationData) {
                  conversationData = {
                    id: parsed.conversationId,
                    _id: parsed.conversationId
                  };
                }
                
                if (parsed.conversation) {
                  conversationData = parsed.conversation;
                }
                continue;
              }
              
              if (parsed.chunk) {
                textChunkCount++;
                fullResponse += parsed.chunk;
                
                logger.debug(context, `Chunk de texto ${textChunkCount} (formato alt)`, {
                  chunk: parsed.chunk.substring(0, 50),
                  accumulated: fullResponse.length
                });
                
                if (onChunk) {
                  onChunk(parsed.chunk, fullResponse);
                }
              }
              
              if (parsed.conversation) {
                conversationData = parsed.conversation;
                logger.info(context, 'Conversacion recibida', { 
                  id: conversationData?.id || conversationData?._id,
                  title: conversationData?.title
                });
              }
              
              if (parsed.messageId && !messageId) {
                messageId = parsed.messageId;
                logger.info(context, 'MessageId recibido', { messageId });
              }

              if (parsed.error) {
                logger.error(context, 'Error en stream', { error: parsed.error });
                throw new Error(parsed.error);
              }
              
            } catch (parseError) {
              logger.error(context, 'Error parseando JSON', {
                error: parseError.message,
                data: data.substring(0, 200)
              });
            }
          } else {
            logger.warning(context, 'Linea sin formato data:', { line });
          }
        }
      }

      // CRITICO: Llamar onComplete UNA SOLA VEZ al terminar el loop
      if (onComplete && !completeCalled) {
        completeCalled = true;
        logger.info(context, 'Llamando onComplete (stream finalizado)');
        onComplete({
          fullResponse,
          conversationId: conversationData?.id || conversationData?._id,
          messageId,
          conversation: conversationData
        });
      }

      if (fullResponse.length === 0) {
        logger.error(context, 'Streaming finalizado sin respuesta');
        throw new Error('No se recibio contenido del modelo de IA');
      }

      logger.success(context, 'Streaming completado exitosamente', {
        responseLength: fullResponse.length,
        preview: fullResponse.substring(0, 100)
      });

      return {
        success: true,
        data: {
          response: fullResponse,
          conversation: conversationData,
          messageId
        }
      };

    } catch (error) {
      const errorInfo = handleError(error, context, { 
        showToast: false,
        logToConsole: true
      });
      
      logger.error(context, 'Error en sendTextStream', {
        message: error.message,
        status: error.status,
        details: error.details,
        validationErrors: error.validationErrors
      });
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  },

  /**
   * Enviar mensaje multimodal (sin streaming)
   */
  sendMultimodal: async (formData, config = {}) => {
    const context = 'GEMINI_API.sendMultimodal';
    
    try {
      logger.info(context, 'Enviando mensaje multimodal');
      
      const conversationId = formData.get('conversationId');
      if (!conversationId || 
          conversationId === 'null' || 
          conversationId === 'undefined' ||
          conversationId.trim().length === 0) {
        formData.delete('conversationId');
        logger.debug(context, 'ConversationId removido (no valido)');
      }

      if (config && Object.keys(config).length > 0) {
        formData.append('config', JSON.stringify({
          temperature: config.temperature || 0.7,
          ...config
        }));
        logger.debug(context, 'Config agregado');
      }

      const response = await api.post('/api/gemini/multimodal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      validateServerResponse(response, context);
      logger.success(context, 'Multimodal enviado exitosamente');
      
      return response;
    } catch (error) {
      const errorInfo = handleError(error, context, { showToast: false });
      logger.error(context, 'Error enviando multimodal', errorInfo);
      throw error;
    }
  },

  /**
   * Enviar mensaje multimodal con streaming
   */
  sendMultimodalStream: async (
    formData, 
    onChunk, 
    onComplete, 
    onError,
    config = {}
  ) => {
    const context = 'GEMINI_API.sendMultimodalStream';
    
    logger.info(context, 'Iniciando multimodal streaming');
    
    try {
      const token = localStorage.getItem(getStorageKey('token'));
      
      if (!token) {
        const error = new Error('No hay token de autenticacion');
        logger.error(context, error.message);
        throw error;
      }

      const conversationId = formData.get('conversationId');
      if (!conversationId || 
          conversationId === 'null' ||
          conversationId === 'undefined' ||
          conversationId.trim().length === 0) {
        formData.delete('conversationId');
        logger.debug(context, 'ConversationId removido');
      }

      if (config && Object.keys(config).length > 0) {
        formData.append('config', JSON.stringify({
          temperature: config.temperature || 0.7,
          ...config
        }));
      }

      const baseURL = api.defaults.baseURL || 'http://localhost:5000';
      const url = `${baseURL}/api/gemini/multimodal/stream`;
      
      logger.info(context, 'Iniciando fetch', { url });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      logger.debug(context, 'Response recibida', { 
        status: response.status, 
        ok: response.ok 
      });

      if (!response.ok) {
        let errorMessage = 'Error en streaming multimodal';
        let validationErrors = null;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          validationErrors = errorData.errors;
          
          logger.error(context, 'Error del servidor', { 
            status: response.status, 
            message: errorMessage,
            validationErrors
          });
        } catch (e) {
          logger.error(context, 'No se pudo parsear error');
        }
        
        const error = new Error(errorMessage);
        error.validationErrors = validationErrors;
        throw error;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';
      let conversationData = null;
      let messageId = null;
      let textChunkCount = 0;
      let completeCalled = false;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          logger.success(context, 'Stream completado', {
            textChunks: textChunkCount,
            responseLength: fullResponse.length
          });
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;

          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            if (data === '[DONE]') {
              logger.info(context, 'Senal [DONE] recibida');
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'start' && parsed.conversationId) {
                logger.info(context, 'Evento START', {
                  conversationId: parsed.conversationId
                });
                continue;
              }
              
              if (parsed.type === 'chunk' && parsed.text) {
                textChunkCount++;
                fullResponse += parsed.text;
                logger.debug(context, `Chunk ${textChunkCount}`, { 
                  length: parsed.text.length 
                });
                if (onChunk) {
                  onChunk(parsed.text, fullResponse);
                }
                continue;
              }
              
              if (parsed.type === 'end') {
                if (parsed.messageId) {
                  messageId = parsed.messageId;
                  logger.info(context, 'Evento END', { messageId });
                }
                if (parsed.conversationId && !conversationData) {
                  conversationData = {
                    id: parsed.conversationId,
                    _id: parsed.conversationId
                  };
                }
                if (parsed.conversation) {
                  conversationData = parsed.conversation;
                }
                continue;
              }
              
              if (parsed.chunk) {
                textChunkCount++;
                fullResponse += parsed.chunk;
                if (onChunk) {
                  onChunk(parsed.chunk, fullResponse);
                }
              }
              
              if (parsed.conversation) {
                conversationData = parsed.conversation;
                logger.info(context, 'Conversacion recibida');
              }
              
              if (parsed.messageId && !messageId) {
                messageId = parsed.messageId;
                logger.info(context, 'MessageId recibido', { messageId });
              }

              if (parsed.error) {
                logger.error(context, 'Error en stream', { error: parsed.error });
                throw new Error(parsed.error);
              }
            } catch (parseError) {
              logger.error(context, 'Error parseando JSON', parseError);
            }
          }
        }
      }

      // CRITICO: Llamar onComplete al salir del loop
      if (onComplete && !completeCalled) {
        completeCalled = true;
        logger.info(context, 'Llamando onComplete (stream finalizado)');
        onComplete({
          fullResponse,
          conversationId: conversationData?.id || conversationData?._id,
          messageId,
          conversation: conversationData
        });
      }

      if (fullResponse.length === 0) {
        logger.error(context, 'Stream sin contenido');
        throw new Error('No se recibio contenido del servidor');
      }

      logger.success(context, 'Multimodal streaming completado');
      
      return {
        success: true,
        data: {
          response: fullResponse,
          conversation: conversationData,
          messageId
        }
      };

    } catch (error) {
      const errorInfo = handleError(error, context, { showToast: false });
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    }
  },
};

export default geminiAPI;