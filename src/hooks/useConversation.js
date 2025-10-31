// src/hooks/useConversation.js

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@config/api.config';
import { APP_CONFIG } from '@config/app.config';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useConversation = (conversationId = null) => {
  const { token } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadConversation = useCallback(async (id = conversationId) => {
    if (!id || !token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.get.replace(':id', id)}`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversation(response.data.conversation);
      setMessages(response.data.conversation.messages || []);
    } catch (err) {
      console.error('Error cargando conversacion:', err);
      setError(err.message);
      toast.error('Error al cargar conversacion');
    } finally {
      setLoading(false);
    }
  }, [conversationId, token]);

  const updateTitle = useCallback(async (newTitle) => {
    if (!conversationId || !token) return;

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

      setConversation(response.data.conversation);
      toast.success('Titulo actualizado');
      return { success: true, conversation: response.data.conversation };
    } catch (err) {
      console.error('Error actualizando titulo:', err);
      toast.error('Error al actualizar titulo');
      return { success: false, error: err.message };
    }
  }, [conversationId, token]);

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addMessages = useCallback((newMessages) => {
    setMessages(prev => [...prev, ...newMessages]);
  }, []);

  const removeMessage = useCallback(async (messageId) => {
    if (!conversationId || !token) return;

    try {
      await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.deleteMessage
          .replace(':id', conversationId)
          .replace(':messageId', messageId)}`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast.success('Mensaje eliminado');
      return { success: true };
    } catch (err) {
      console.error('Error eliminando mensaje:', err);
      toast.error('Error al eliminar mensaje');
      return { success: false, error: err.message };
    }
  }, [conversationId, token]);

  const archiveConversation = useCallback(async () => {
    if (!conversationId || !token) return;

    try {
      await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.archive.replace(':id', conversationId)}`,
        {},
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversation(prev => ({ ...prev, archived: true }));
      toast.success('Conversacion archivada');
      return { success: true };
    } catch (err) {
      console.error('Error archivando conversacion:', err);
      toast.error('Error al archivar conversacion');
      return { success: false, error: err.message };
    }
  }, [conversationId, token]);

  const unarchiveConversation = useCallback(async () => {
    if (!conversationId || !token) return;

    try {
      await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.unarchive.replace(':id', conversationId)}`,
        {},
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversation(prev => ({ ...prev, archived: false }));
      toast.success('Conversacion desarchivada');
      return { success: true };
    } catch (err) {
      console.error('Error desarchivando conversacion:', err);
      toast.error('Error al desarchivar conversacion');
      return { success: false, error: err.message };
    }
  }, [conversationId, token]);

  const favoriteConversation = useCallback(async () => {
    if (!conversationId || !token) return;

    try {
      await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.favorite.replace(':id', conversationId)}`,
        {},
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversation(prev => ({ ...prev, favorite: true }));
      toast.success('Agregado a favoritos');
      return { success: true };
    } catch (err) {
      console.error('Error agregando a favoritos:', err);
      toast.error('Error al agregar a favoritos');
      return { success: false, error: err.message };
    }
  }, [conversationId, token]);

  const unfavoriteConversation = useCallback(async () => {
    if (!conversationId || !token) return;

    try {
      await axios.delete(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.unfavorite.replace(':id', conversationId)}`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setConversation(prev => ({ ...prev, favorite: false }));
      toast.success('Eliminado de favoritos');
      return { success: true };
    } catch (err) {
      console.error('Error eliminando de favoritos:', err);
      toast.error('Error al eliminar de favoritos');
      return { success: false, error: err.message };
    }
  }, [conversationId, token]);

  const exportToPDF = useCallback(async () => {
    if (!conversationId || !token) return;

    try {
      const response = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.exportPDF.replace(':id', conversationId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `conversation_${conversationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('PDF descargado');
      return { success: true };
    } catch (err) {
      console.error('Error exportando a PDF:', err);
      toast.error('Error al exportar a PDF');
      return { success: false, error: err.message };
    }
  }, [conversationId, token]);

  const exportToTXT = useCallback(async () => {
    if (!conversationId || !token) return;

    try {
      const response = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.conversations.exportTXT.replace(':id', conversationId)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `conversation_${conversationId}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('TXT descargado');
      return { success: true };
    } catch (err) {
      console.error('Error exportando a TXT:', err);
      toast.error('Error al exportar a TXT');
      return { success: false, error: err.message };
    }
  }, [conversationId, token]);

  const getMessageById = useCallback((messageId) => {
    return messages.find(msg => msg.id === messageId);
  }, [messages]);

  const getMessagesByRole = useCallback((role) => {
    return messages.filter(msg => msg.role === role);
  }, [messages]);

  const getUserMessages = useCallback(() => {
    return getMessagesByRole('user');
  }, [getMessagesByRole]);

  const getAiMessages = useCallback(() => {
    return getMessagesByRole('assistant');
  }, [getMessagesByRole]);

  const getMessageCount = useCallback(() => {
    return messages.length;
  }, [messages]);

  const isArchived = useCallback(() => {
    return conversation?.archived || false;
  }, [conversation]);

  const isFavorite = useCallback(() => {
    return conversation?.favorite || false;
  }, [conversation]);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId, loadConversation]);

  return {
    conversation,
    messages,
    loading,
    error,
    loadConversation,
    updateTitle,
    addMessage,
    addMessages,
    removeMessage,
    archiveConversation,
    unarchiveConversation,
    favoriteConversation,
    unfavoriteConversation,
    exportToPDF,
    exportToTXT,
    getMessageById,
    getMessagesByRole,
    getUserMessages,
    getAiMessages,
    getMessageCount,
    isArchived,
    isFavorite,
  };
};

export default useConversation;