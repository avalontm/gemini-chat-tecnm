// src/hooks/useChat.js

import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatContext from '@context/ChatContext';
import { SITE_CONFIG } from '@config/constants';
import { APP_CONFIG } from '@config/app.config';

export const useChat = () => {
  const context = useContext(ChatContext);
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }

  const createAndSelectConversation = useCallback(async (title = null) => {
    const result = await context.createConversation(title);
    
    if (result.success && result.conversation) {
      await context.selectConversation(result.conversation.id);
    }
    
    return result;
  }, [context]);

  const sendMessageAndWait = useCallback(async (content, conversationId = null) => {
    return await context.sendMessage(content, conversationId);
  }, [context]);

  const sendImageAndWait = useCallback(async (file, prompt = '', conversationId = null) => {
    return await context.sendImage(file, prompt, conversationId);
  }, [context]);

  const sendVoiceAndWait = useCallback(async (file, conversationId = null) => {
    return await context.sendVoice(file, conversationId);
  }, [context]);

  const deleteConversationWithConfirm = useCallback(async (conversationId, skipConfirm = false) => {
    if (!skipConfirm) {
      const confirmed = window.confirm('¿Estas seguro de eliminar esta conversacion?');
      if (!confirmed) return { success: false, cancelled: true };
    }
    
    return await context.deleteConversation(conversationId);
  }, [context]);

  const getConversationById = useCallback((conversationId) => {
    return context.conversations.find(conv => conv.id === conversationId);
  }, [context.conversations]);

  const getRecentConversations = useCallback((limit = 10) => {
    return context.conversations.slice(0, limit);
  }, [context.conversations]);

  const getConversationCount = useCallback(() => {
    return context.conversations.length;
  }, [context.conversations]);

  const getMessageCount = useCallback(() => {
    return context.messages.length;
  }, [context.messages]);

  const getLastMessage = useCallback(() => {
    if (context.messages.length === 0) return null;
    return context.messages[context.messages.length - 1];
  }, [context.messages]);

  const getLastUserMessage = useCallback(() => {
    return context.messages
      .slice()
      .reverse()
      .find(msg => msg.role === 'user');
  }, [context.messages]);

  const getLastAiMessage = useCallback(() => {
    return context.messages
      .slice()
      .reverse()
      .find(msg => msg.role === 'assistant');
  }, [context.messages]);

  const hasMessages = useCallback(() => {
    return context.messages.length > 0;
  }, [context.messages]);

  const hasConversations = useCallback(() => {
    return context.conversations.length > 0;
  }, [context.conversations]);

  const isCurrentConversation = useCallback((conversationId) => {
    return context.currentConversation?.id === conversationId;
  }, [context.currentConversation]);

  const canSendMessage = useCallback(() => {
    return !context.sending && !context.loading;
  }, [context.sending, context.loading]);

  const isMessageLimitReached = useCallback(() => {
    return context.messages.length >= APP_CONFIG.chat.maxMessagesPerConversation;
  }, [context.messages]);

  const getCurrentConversationTitle = useCallback(() => {
    return context.currentConversation?.title || APP_CONFIG.conversations.defaultTitle;
  }, [context.currentConversation]);

  const searchMessages = useCallback((query) => {
    if (!query || query.trim() === '') return [];
    
    const lowerQuery = query.toLowerCase();
    
    return context.messages.filter(msg => 
      msg.content?.toLowerCase().includes(lowerQuery)
    );
  }, [context.messages]);

  const filterMessagesByRole = useCallback((role) => {
    return context.messages.filter(msg => msg.role === role);
  }, [context.messages]);

  const getUserMessages = useCallback(() => {
    return filterMessagesByRole('user');
  }, [filterMessagesByRole]);

  const getAiMessages = useCallback(() => {
    return filterMessagesByRole('assistant');
  }, [filterMessagesByRole]);

  const startNewChat = useCallback(async () => {
    const result = await createAndSelectConversation();
    
    if (result.success) {
      navigate(SITE_CONFIG.routes.chat);
    }
    
    return result;
  }, [createAndSelectConversation, navigate]);

  const switchConversation = useCallback(async (conversationId) => {
    const result = await context.selectConversation(conversationId);
    
    if (result.success) {
      navigate(`${SITE_CONFIG.routes.chat}/${conversationId}`);
    }
    
    return result;
  }, [context, navigate]);

  const exportConversation = useCallback((format = 'txt') => {
    if (!context.currentConversation) return null;
    
    const title = getCurrentConversationTitle();
    const messagesText = context.messages
      .map(msg => `${msg.role === 'user' ? 'Usuario' : 'Asistente'}: ${msg.content}`)
      .join('\n\n');
    
    const content = `${title}\n${'='.repeat(title.length)}\n\n${messagesText}`;
    
    if (format === 'json') {
      return JSON.stringify({
        conversation: context.currentConversation,
        messages: context.messages,
      }, null, 2);
    }
    
    return content;
  }, [context.currentConversation, context.messages, getCurrentConversationTitle]);

  const downloadConversation = useCallback((format = 'txt') => {
    const content = exportConversation(format);
    if (!content) return;
    
    const filename = `conversation_${context.currentConversation.id}.${format}`;
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  }, [context.currentConversation, exportConversation]);

  return {
    conversations: context.conversations,
    currentConversation: context.currentConversation,
    messages: context.messages,
    loading: context.loading,
    sending: context.sending,
    isTyping: context.isTyping,
    
    loadConversations: context.loadConversations,
    createConversation: context.createConversation,
    selectConversation: context.selectConversation,
    sendMessage: context.sendMessage,
    sendImage: context.sendImage,
    sendVoice: context.sendVoice,
    deleteConversation: context.deleteConversation,
    updateConversationTitle: context.updateConversationTitle,
    searchConversations: context.searchConversations,
    clearMessages: context.clearMessages,
    regenerateResponse: context.regenerateResponse,
    
    createAndSelectConversation,
    sendMessageAndWait,
    sendImageAndWait,
    sendVoiceAndWait,
    deleteConversationWithConfirm,
    getConversationById,
    getRecentConversations,
    getConversationCount,
    getMessageCount,
    getLastMessage,
    getLastUserMessage,
    getLastAiMessage,
    hasMessages,
    hasConversations,
    isCurrentConversation,
    canSendMessage,
    isMessageLimitReached,
    getCurrentConversationTitle,
    searchMessages,
    filterMessagesByRole,
    getUserMessages,
    getAiMessages,
    startNewChat,
    switchConversation,
    exportConversation,
    downloadConversation,
  };
};

export default useChat;