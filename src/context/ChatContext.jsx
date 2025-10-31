// src/context/ChatContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { API_CONFIG } from '@config/api.config';
import { APP_CONFIG, getStorageKey } from '@config/app.config';

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Cargar conversaciones del usuario
  const loadConversations = useCallback(async () => {
    if (!isAuthenticated || !token) return;

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.list}`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversations(response.data.conversations || []);
      
      // Guardar en localStorage
      localStorage.setItem(
        getStorageKey('conversations'),
        JSON.stringify(response.data.conversations || [])
      );
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
      toast.error('Error al cargar conversaciones');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  // Cargar conversaciones al iniciar
  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated, loadConversations]);

  // Crear nueva conversacion
  const createConversation = async (title = null) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.create}`,
        { 
          title: title || APP_CONFIG.conversations.defaultTitle 
        },
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newConversation = response.data.conversation;
      
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      setMessages([]);

      toast.success('Nueva conversacion creada');

      return { success: true, conversation: newConversation };
    } catch (error) {
      console.error('Error creando conversacion:', error);
      toast.error('Error al crear conversacion');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar conversacion activa
  const selectConversation = async (conversationId) => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.get.replace(':id', conversationId)}`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const conversation = response.data.conversation;
      
      setCurrentConversation(conversation);
      setMessages(conversation.messages || []);

      // Guardar conversacion actual en localStorage
      localStorage.setItem(
        getStorageKey('currentConversation'),
        JSON.stringify(conversation)
      );

      return { success: true, conversation };
    } catch (error) {
      console.error('Error seleccionando conversacion:', error);
      toast.error('Error al cargar conversacion');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Enviar mensaje de texto
  const sendMessage = async (content, conversationId = null) => {
    try {
      setSending(true);
      setIsTyping(true);

      const targetConversationId = conversationId || currentConversation?.id;

      if (!targetConversationId) {
        const newConv = await createConversation();
        if (!newConv.success) {
          throw new Error('No se pudo crear la conversacion');
        }
      }

      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.gemini.text}`,
        {
          prompt: content,
          conversationId: targetConversationId || currentConversation?.id,
        },
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { userMessage, aiMessage } = response.data;

      // Agregar mensajes al estado
      setMessages(prev => [...prev, userMessage, aiMessage]);

      // Actualizar conversacion actual
      if (currentConversation) {
        setCurrentConversation(prev => ({
          ...prev,
          messages: [...(prev.messages || []), userMessage, aiMessage],
          updatedAt: new Date().toISOString(),
        }));
      }

      return { success: true, userMessage, aiMessage };
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Error al enviar mensaje';
      
      toast.error(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setSending(false);
      setIsTyping(false);
    }
  };

  // Enviar imagen
  const sendImage = async (file, prompt = '', conversationId = null) => {
    try {
      setSending(true);
      setIsTyping(true);

      const targetConversationId = conversationId || currentConversation?.id;

      const formData = new FormData();
      formData.append('image', file);
      formData.append('prompt', prompt);
      formData.append('conversationId', targetConversationId);

      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.gemini.image}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { userMessage, aiMessage } = response.data;

      setMessages(prev => [...prev, userMessage, aiMessage]);

      return { success: true, userMessage, aiMessage };
    } catch (error) {
      console.error('Error enviando imagen:', error);
      toast.error('Error al enviar imagen');
      return { success: false, error: error.message };
    } finally {
      setSending(false);
      setIsTyping(false);
    }
  };

  // Enviar audio
  const sendVoice = async (file, conversationId = null) => {
    try {
      setSending(true);
      setIsTyping(true);

      const targetConversationId = conversationId || currentConversation?.id;

      const formData = new FormData();
      formData.append('audio', file);
      formData.append('conversationId', targetConversationId);

      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.gemini.voice}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const { userMessage, aiMessage } = response.data;

      setMessages(prev => [...prev, userMessage, aiMessage]);

      return { success: true, userMessage, aiMessage };
    } catch (error) {
      console.error('Error enviando audio:', error);
      toast.error('Error al enviar audio');
      return { success: false, error: error.message };
    } finally {
      setSending(false);
      setIsTyping(false);
    }
  };

  // Eliminar conversacion
  const deleteConversation = async (conversationId) => {
    try {
      await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.delete.replace(':id', conversationId)}`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversations(prev => prev.filter(conv => conv.id !== conversationId));

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }

      toast.success('Conversacion eliminada');

      return { success: true };
    } catch (error) {
      console.error('Error eliminando conversacion:', error);
      toast.error('Error al eliminar conversacion');
      return { success: false, error: error.message };
    }
  };

  // Actualizar titulo de conversacion
  const updateConversationTitle = async (conversationId, newTitle) => {
    try {
      const response = await axios.put(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.update.replace(':id', conversationId)}`,
        { title: newTitle },
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedConversation = response.data.conversation;

      setConversations(prev =>
        prev.map(conv =>
          conv.id === conversationId ? updatedConversation : conv
        )
      );

      if (currentConversation?.id === conversationId) {
        setCurrentConversation(updatedConversation);
      }

      toast.success('Titulo actualizado');

      return { success: true, conversation: updatedConversation };
    } catch (error) {
      console.error('Error actualizando titulo:', error);
      toast.error('Error al actualizar titulo');
      return { success: false, error: error.message };
    }
  };

  // Buscar conversaciones
  const searchConversations = async (query) => {
    try {
      const response = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.search}`,
        {
          params: { q: query },
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { success: true, conversations: response.data.conversations };
    } catch (error) {
      console.error('Error buscando conversaciones:', error);
      return { success: false, error: error.message };
    }
  };

  // Limpiar mensajes actuales
  const clearMessages = () => {
    setMessages([]);
    setCurrentConversation(null);
  };

  // Regenerar ultima respuesta
  const regenerateResponse = async () => {
    if (messages.length < 2) return;

    try {
      setSending(true);
      setIsTyping(true);

      const lastUserMessage = messages
        .slice()
        .reverse()
        .find(msg => msg.role === 'user');

      if (!lastUserMessage) {
        throw new Error('No se encontro mensaje de usuario');
      }

      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.gemini.regenerate}`,
        {
          messageId: lastUserMessage.id,
          conversationId: currentConversation?.id,
        },
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { aiMessage } = response.data;

      // Reemplazar ultima respuesta de AI
      setMessages(prev => {
        const newMessages = [...prev];
        const lastAiIndex = newMessages.length - 1;
        if (newMessages[lastAiIndex]?.role === 'assistant') {
          newMessages[lastAiIndex] = aiMessage;
        } else {
          newMessages.push(aiMessage);
        }
        return newMessages;
      });

      return { success: true, aiMessage };
    } catch (error) {
      console.error('Error regenerando respuesta:', error);
      toast.error('Error al regenerar respuesta');
      return { success: false, error: error.message };
    } finally {
      setSending(false);
      setIsTyping(false);
    }
  };

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    sending,
    isTyping,
    loadConversations,
    createConversation,
    selectConversation,
    sendMessage,
    sendImage,
    sendVoice,
    deleteConversation,
    updateConversationTitle,
    searchConversations,
    clearMessages,
    regenerateResponse,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useChat = () => {
  const context = useContext(ChatContext);
  
  if (context === undefined) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  
  return context;
};

export { ChatContext };
export default ChatContext;