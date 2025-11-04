// src/pages/Chat/Chat.jsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '@context/AuthContext';
import { SITE_CONFIG } from '@config/constants';
import { geminiAPI } from '@api/endpoints/gemini.api';
import { conversationAPI } from '@api/endpoints/conversation.api';

import {
  ChatSidebar,
  ChatHeader,
  MessageList,
  ChatInput
} from '@components/Chat';

function Chat() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { user, token, isAuthenticated, logout } = useAuth();

  const abortControllerRef = useRef(null);
  const isCreatingConversationRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [temperature, setTemperature] = useState(0.7);

  // ==================== AUTENTICACIÓN ====================

  useEffect(() => {
    if (!isAuthenticated && !token) {
      toast.error('Debes iniciar sesión');
      navigate(SITE_CONFIG.routes.login);
    }
  }, [isAuthenticated, token, navigate]);

  // ==================== CARGAR CONVERSACIONES ====================

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  // ==================== CONVERSACIÓN ACTIVA ====================

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }

if (conversationId && conversationId !== 'undefined' && conversationId !== 'null') {
  loadConversation(conversationId);
} else {
  setMessages([{
    id: 'welcome',
    type: 'ai',
    content: 'Saludos. Soy el sistema de asistencia con inteligencia artificial del Tecnológico Nacional de México, Campus Ensenada. Mi propósito es brindarte apoyo en consultas académicas, investigación, desarrollo de proyectos y orientación estudiantil. ¿En qué tema requiere asistencia?',
    timestamp: new Date(),
  }]);
  setCurrentConversation(null);
}

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [conversationId]);

  // ==================== FUNCIONES DE CONVERSACIONES ====================

  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      
      const response = await conversationAPI.getConversations(1, 50);
      console.log('[CHAT] Response completo:', response);
      console.log('[CHAT] response.data:', response.data);
      
      let conversationsList = [];
      
      if (response.data) {
        // Estructura: { success: true, data: { conversations: [...] } }
        if (response.data.data?.conversations && Array.isArray(response.data.data.conversations)) {
          conversationsList = response.data.data.conversations;
        }
        // Estructura: { data: { conversations: [...] } }
        else if (response.data.conversations && Array.isArray(response.data.conversations)) {
          conversationsList = response.data.conversations;
        }
        // Estructura: { data: [...] } (array directo)
        else if (Array.isArray(response.data)) {
          conversationsList = response.data;
        }
      }
      
      console.log('[CHAT] Conversaciones procesadas:', conversationsList.length);
      setConversations(conversationsList);
    } catch (error) {
      console.error('[CHAT] Error cargando conversaciones:', error);
      if (error.response?.status === 401) {
        toast.error('Sesión expirada');
        navigate(SITE_CONFIG.routes.login);
      } else {
        toast.error('Error al cargar conversaciones');
      }
    } finally {
      setIsLoadingConversations(false);
    }
  }, [navigate]);

  const loadConversation = useCallback(async (convId) => {
    if (!convId || convId === 'undefined' || convId === 'null') {
      return;
    }

    try {
      setIsLoading(true);
      console.log('[CHAT] Cargando conversación:', convId);
      
      const response = await conversationAPI.getConversation(convId);
      console.log('[CHAT] Response completo:', response);
      console.log('[CHAT] response.data:', response.data);
      
      if (!response.data) {
        throw new Error('No se recibieron datos de la conversación');
      }

      // Extraer conversación: puede estar en data.data.conversation o data.conversation
      let conversation = null;
      let messagesData = [];

      if (response.data.data) {
        // Estructura: { success: true, data: { conversation: {...}, messages: [...] } }
        conversation = response.data.data.conversation;
        messagesData = response.data.data.messages || [];
      } else if (response.data.conversation) {
        // Estructura: { conversation: {...}, messages: [...] }
        conversation = response.data.conversation;
        messagesData = response.data.messages || [];
      } else {
        // Estructura plana
        conversation = response.data;
        messagesData = response.data.messages || [];
      }

      console.log('[CHAT] Conversación extraída:', conversation);
      console.log('[CHAT] Mensajes extraídos:', messagesData.length);

      if (!conversation) {
        throw new Error('No se pudo extraer la conversación de la respuesta');
      }

      setCurrentConversation(conversation);
      
      // Formatear mensajes para el frontend
      const formattedMessages = messagesData.map(msg => ({
        id: msg.id || msg._id,
        type: msg.role === 'user' ? 'user' : 'ai',
        content: msg.content,
        timestamp: new Date(msg.createdAt || msg.timestamp),
        attachments: msg.attachments,
        tokens: msg.tokens,
        isStreaming: false
      }));
      
      console.log('[CHAT] Mensajes formateados:', formattedMessages.length);
      setMessages(formattedMessages);
    } catch (error) {
      console.error('[CHAT] Error cargando conversación:', error);
      console.error('[CHAT] Error response:', error.response);
      
      if (error.response?.status === 404) {
        toast.error('Conversación no encontrada');
        navigate('/chat');
      } else if (error.response?.status === 401) {
        toast.error('Sesión expirada');
        navigate(SITE_CONFIG.routes.login);
      } else if (error.response?.status === 500) {
        toast.error('Error del servidor al cargar la conversación');
        navigate('/chat');
      } else {
        toast.error('Error al cargar la conversación');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleNewConversation = useCallback(() => {
    console.log('[CHAT] Nueva conversación');
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }

    setMessages([{
      id: 'welcome',
      type: 'ai',
      content: 'Hola! Soy tu asistente de IA powered by Google Gemini. En que puedo ayudarte hoy?',
      timestamp: new Date(),
    }]);
    setCurrentConversation(null);
    setSelectedFiles([]);
    setIsLoading(false);
    navigate('/chat');
    toast.success('Nueva conversación iniciada');
  }, [navigate]);

  const handleDeleteConversation = useCallback(async (convId) => {
    if (!convId) return;

    const confirmDelete = window.confirm('Estas seguro de que deseas eliminar esta conversación?');
    if (!confirmDelete) return;

    try {
      console.log('[CHAT] Eliminando conversación:', convId);
      await conversationAPI.deleteConversation(convId);
      
      setConversations(prev => 
        prev.filter(c => (c.id || c._id) !== convId)
      );
      
      const currentId = currentConversation?.id || currentConversation?._id;
      if (currentId === convId) {
        handleNewConversation();
      }
      
      toast.success('Conversación eliminada');
    } catch (error) {
      console.error('[CHAT] Error eliminando conversación:', error);
      toast.error('Error al eliminar conversación');
    }
  }, [currentConversation, handleNewConversation]);

  // ==================== CREAR CONVERSACIÓN ====================

  const createNewConversation = useCallback(async (firstMessage) => {
    if (isCreatingConversationRef.current) {
      console.log('[CHAT] Ya se está creando una conversación, esperando...');
      return null;
    }

    try {
      isCreatingConversationRef.current = true;
      console.log('[CHAT] Creando nueva conversación con mensaje:', firstMessage.substring(0, 50));
      
      const title = firstMessage.length > 50 
        ? firstMessage.substring(0, 50) + '...'
        : firstMessage;
      
      const response = await conversationAPI.createConversation(title, firstMessage);
      console.log('[CHAT] Conversación creada - Response completo:', response);
      console.log('[CHAT] response.data:', response.data);
      
      let newConversation = null;
      
      if (response.data) {
        if (response.data.conversation) {
          newConversation = response.data.conversation;
        } else if (response.data.data?.conversation) {
          newConversation = response.data.data.conversation;
        } else if (response.data.id || response.data._id) {
          newConversation = response.data;
        }
      }
      
      if (!newConversation) {
        console.error('[CHAT] No se pudo extraer la conversación de la respuesta:', response);
        throw new Error('Formato de respuesta inválido al crear conversación');
      }
      
      const conversationId = newConversation.id || newConversation._id;
      console.log('[CHAT] Conversación creada exitosamente. ID:', conversationId);
      console.log('[CHAT] Conversación completa:', newConversation);
      
      setCurrentConversation(newConversation);
      setConversations(prev => [newConversation, ...prev]);
      
      return newConversation;
      
    } catch (error) {
      console.error('[CHAT] Error creando conversación:', error);
      console.error('[CHAT] Error response:', error.response);
      console.error('[CHAT] Error data:', error.response?.data);
      throw error;
    } finally {
      isCreatingConversationRef.current = false;
    }
  }, []);

  // ==================== FUNCIONES DE ARCHIVOS ====================

  const handleFileSelect = useCallback((e, type = 'file') => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const MAX_FILES = 5;

    if (selectedFiles.length + files.length > MAX_FILES) {
      toast.error(`Máximo ${MAX_FILES} archivos permitidos`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} es muy grande (máx. 10MB)`);
        return false;
      }

      if (type === 'image') {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} no es una imagen válida`);
          return false;
        }
      } else {
        const isValidType = file.type === 'application/pdf' || file.type.startsWith('image/');
        if (!isValidType) {
          toast.error(`${file.name} no es un tipo de archivo válido`);
          return false;
        }
      }

      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} archivo(s) agregado(s)`);
    }

    e.target.value = '';
  }, [selectedFiles.length]);

  const handleRemoveFile = useCallback((index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // ==================== ENVIAR MENSAJE CON STREAMING ====================

  const handleSendMessage = useCallback(async (messageContent) => {
    console.log('='.repeat(50));
    console.log('[CHAT] handleSendMessage llamado');
    console.log('[CHAT] Contenido:', messageContent?.substring(0, 100));
    console.log('[CHAT] Archivos:', selectedFiles.length);
    console.log('[CHAT] Conversación actual:', currentConversation?.id || currentConversation?._id || 'NINGUNA');
    console.log('='.repeat(50));

    if ((!messageContent || !messageContent.trim()) && selectedFiles.length === 0) {
      toast.error('Por favor, escribe un mensaje o adjunta un archivo');
      return;
    }

    if (isStreaming) {
      toast.error('Espera a que termine la respuesta actual');
      return;
    }

    const trimmedContent = messageContent?.trim() || '';

    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: trimmedContent || 'Archivos adjuntos',
      timestamp: new Date(),
      files: selectedFiles.length > 0 ? selectedFiles.map(f => f.name) : null,
    };

    setMessages(prev => [...prev, userMessage]);
    
    // CRÍTICO: NO agregar placeholder aquí, solo setear estados
    setIsLoading(true);
    setIsStreaming(true);

    const filesForRequest = [...selectedFiles];
    setSelectedFiles([]);

    try {
      let convId = currentConversation?.id || currentConversation?._id;
      console.log('[CHAT] ConversationId inicial:', convId || 'NINGUNO');

      // NO crear conversación aquí, dejar que el backend lo haga automáticamente
      // El backend crea la conversación durante el streaming y la retorna en handleComplete
      
      console.log('[CHAT] ConversationId para envío:', convId || 'null (backend creará nueva)');

      const config = {
        temperature: temperature
      };

      // Variable para controlar si ya se agregó el placeholder
      let placeholderAdded = false;
      const aiMessageId = `ai-${Date.now()}`;

      const handleChunk = (chunk, accumulated) => {
        // CRÍTICO: Agregar placeholder solo cuando llega el PRIMER chunk
        if (!placeholderAdded) {
          console.log('[CHAT] Primer chunk recibido, agregando placeholder IA');
          placeholderAdded = true;
          
          setMessages(prev => [...prev, {
            id: aiMessageId,
            type: 'ai',
            content: accumulated,
            timestamp: new Date(),
            isStreaming: true,
          }]);
        } else {
          // Actualizar contenido del mensaje existente
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { ...msg, content: accumulated, isStreaming: true }
                : msg
            )
          );
        }
      };

      const handleComplete = (data) => {
        console.log('[CHAT] ========== handleComplete ==========');
        console.log('[CHAT] Data recibida:', data);
        
        const { conversation, messageId } = data;
        
        setIsStreaming(false);
        setIsLoading(false);
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, isStreaming: false, id: messageId || msg.id }
              : msg
          )
        );

        // Actualizar conversación si viene del servidor
        if (conversation) {
          console.log('[CHAT] Actualizando conversación desde stream:', conversation);
          const newConvId = conversation.id || conversation._id;
          
          setCurrentConversation(conversation);
          
          setConversations(prev => {
            const exists = prev.some(c => (c.id || c._id) === newConvId);
            if (exists) {
              return prev.map(c => 
                (c.id || c._id) === newConvId ? conversation : c
              );
            }
            return [conversation, ...prev];
          });
          
          // Navegar solo si NO teníamos conversación antes
          if (!convId) {
            console.log('[CHAT] Navegando a nueva conversación:', newConvId);
            navigate(`/chat/${newConvId}`, { replace: true });
          }
        }

        // Recargar lista de conversaciones
        loadConversations();
        console.log('[CHAT] ========== handleComplete FINALIZADO ==========');
      };

      const handleError = (error) => {
        console.error('[CHAT] ========== handleError ==========');
        console.error('[CHAT] Error:', error);
        
        setIsStreaming(false);
        setIsLoading(false);
        
        let errorMessage = 'Error al enviar el mensaje';
        
        if (error.message.includes('Token') || error.message.includes('autenticación')) {
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente.';
          setTimeout(() => navigate(SITE_CONFIG.routes.login), 2000);
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
        setMessages(prev => prev.filter(m => m.id !== aiMessageId && m.id !== userMessage.id));
        
        console.error('[CHAT] ========== handleError FINALIZADO ==========');
      };

      // Enviar mensaje al backend
      console.log('[CHAT] Enviando mensaje al backend...');
      if (filesForRequest.length > 0) {
        console.log('[CHAT] Tipo: Multimodal con', filesForRequest.length, 'archivos');
        
        const formData = new FormData();
        formData.append('prompt', trimmedContent || 'Analiza estos archivos');
        
        if (convId) {
          formData.append('conversationId', convId);
          console.log('[CHAT] conversationId agregado al FormData:', convId);
        }
        
        filesForRequest.forEach((file) => {
          formData.append('files', file);
        });

        await geminiAPI.sendMultimodalStream(
          formData,
          handleChunk,
          handleComplete,
          handleError,
          config
        );
      } else {
        console.log('[CHAT] Tipo: Texto plano');
        console.log('[CHAT] conversationId para texto:', convId || 'null');
        
        await geminiAPI.sendTextStream(
          trimmedContent,
          convId || null,
          handleChunk,
          handleComplete,
          handleError,
          config
        );
      }

    } catch (error) {
      console.error('[CHAT] ========== ERROR NO MANEJADO ==========');
      console.error('[CHAT] Error:', error);
      console.error('[CHAT] Error stack:', error.stack);
      
      setIsStreaming(false);
      setIsLoading(false);
      
      const errorMessage = error.response?.data?.message 
        || error.message 
        || 'Error al enviar el mensaje';
      
      toast.error(errorMessage);
      setMessages(prev => prev.filter(m => m.id !== userMessage.id && m.id !== aiMessageId));
      
      console.error('[CHAT] ========== ERROR FINALIZADO ==========');
    }
  }, [selectedFiles, currentConversation, navigate, loadConversations, temperature, isStreaming, createNewConversation]);

  // ==================== CANCELAR STREAMING ====================

  const handleCancelStreaming = useCallback(() => {
    if (isStreaming && abortControllerRef.current) {
      console.log('[CHAT] Cancelando streaming...');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
      setIsLoading(false);
      toast.success('Streaming cancelado');
    }
  }, [isStreaming]);

  // ==================== FUNCIÓN DE LOGOUT ====================

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  // ==================== UTILIDADES ====================

  const formatTime = useCallback((date) => {
    return new Date(date).toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  const formatRelativeTime = useCallback((date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Hace un momento';
    if (hours < 24) return `Hace ${hours}h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return new Date(date).toLocaleDateString('es-MX');
  }, []);

  // ==================== RENDER ====================

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden">
      
      <ChatSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        conversations={conversations}
        isLoadingConversations={isLoadingConversations}
        currentConversation={currentConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        user={user} 
        onLogout={handleLogout} 
        formatRelativeTime={formatRelativeTime}
      />

      <main className="flex-1 flex flex-col min-w-0">
        
        <ChatHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          currentConversation={currentConversation}
          temperature={temperature}
          setTemperature={setTemperature}
          isStreaming={isStreaming}
          onCancelStreaming={handleCancelStreaming}
        />

        <MessageList
          messages={messages}
          isLoading={isLoading}
          formatTime={formatTime}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
          disabled={isStreaming}
        />
      </main>
    </div>
  );
}

export default Chat;