// src/pages/Chat/Chat.jsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';
import { SITE_CONFIG } from '@config/constants';
import { geminiAPI } from '@api/endpoints/gemini.api';
import { conversationAPI } from '@api/endpoints/conversation.api';
import { userAPI } from '@api/endpoints/user.api';

import {
  ChatSidebar,
  ChatHeader,
  MessageList,
  ChatInput
} from '@components/chat';

const WELCOME_MESSAGE = {
  id: 'welcome',
  type: 'ai',
  content: 'Saludos. Soy el sistema de asistencia con inteligencia artificial del Tecnológico Nacional de México, Campus Ensenada. Mi propósito es brindarte apoyo en consultas académicas, investigación, desarrollo de proyectos y orientación estudiantil. ¿En qué tema requiere asistencia?',
  timestamp: new Date(),
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const SAFETY_TIMEOUT = 5 * 60 * 1000;
const STREAM_DELAY = 60;

function Chat() {
  const navigate = useNavigate();
  const { conversationId } = useParams();
  const { user, token, isAuthenticated, logout } = useAuth();
  const { setTheme } = useTheme();

  const streamBufferRef = useRef('');
  const lastRenderTimeRef = useRef(0);
  const sendingLockRef = useRef(false);
  const initFlagsRef = useRef({
    isInitialized: false,
    themeLoaded: false,
    conversationsLoaded: false
  });

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [temperature, setTemperature] = useState(0.7);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !token) {
      toast.error('Debes iniciar sesión');
      navigate(SITE_CONFIG.routes.login);
    }
  }, [isAuthenticated, token, navigate]);

  const loadUserTheme = useCallback(async () => {
    if (initFlagsRef.current.themeLoaded) return;

    try {
      const response = await userAPI.getProfile();
      
      if (response.success && response.data?.user?.preferences?.theme) {
        setTheme(response.data.user.preferences.theme);
      }
      
      initFlagsRef.current.themeLoaded = true;
    } catch (error) {
      if (error.response?.status !== 429) {
        console.error('Error cargando tema:', error);
      }
    }
  }, [setTheme]);

  const loadConversations = useCallback(async () => {
    if (initFlagsRef.current.conversationsLoaded) return;
    
    try {
      setIsLoadingConversations(true);
      const response = await conversationAPI.getConversations(1, 50);
      
      let conversationsList = [];
      
      if (response.data) {
        if (response.data.data?.conversations && Array.isArray(response.data.data.conversations)) {
          conversationsList = response.data.data.conversations;
        } else if (response.data.conversations && Array.isArray(response.data.conversations)) {
          conversationsList = response.data.conversations;
        } else if (Array.isArray(response.data)) {
          conversationsList = response.data;
        }
      }
      
      setConversations(conversationsList);
      initFlagsRef.current.conversationsLoaded = true;
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Sesión expirada');
        navigate(SITE_CONFIG.routes.login);
      } else if (error.response?.status !== 429) {
        toast.error('Error al cargar conversaciones');
      }
    } finally {
      setIsLoadingConversations(false);
    }
  }, [navigate]);

  const reloadConversations = useCallback(async () => {
    try {
      const response = await conversationAPI.getConversations(1, 50);
      
      let conversationsList = [];
      
      if (response.data) {
        if (response.data.data?.conversations && Array.isArray(response.data.data.conversations)) {
          conversationsList = response.data.data.conversations;
        } else if (response.data.conversations && Array.isArray(response.data.conversations)) {
          conversationsList = response.data.conversations;
        } else if (Array.isArray(response.data)) {
          conversationsList = response.data;
        }
      }
      
      setConversations(conversationsList);
    } catch (error) {
      if (error.response?.status !== 429 && error.response?.status !== 401) {
        console.error('Error recargando conversaciones:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !initFlagsRef.current.isInitialized) {
      initFlagsRef.current.isInitialized = true;
      
      const initialize = async () => {
        await loadUserTheme();
        await loadConversations();
      };
      
      initialize();
    }
    
    return () => {
      if (!isAuthenticated) {
        initFlagsRef.current = {
          isInitialized: false,
          themeLoaded: false,
          conversationsLoaded: false
        };
      }
    };
  }, [isAuthenticated, loadUserTheme, loadConversations]);

  useEffect(() => {
    if (conversationId && conversationId !== 'undefined' && conversationId !== 'null') {
      loadConversation(conversationId);
    } else {
      setMessages([WELCOME_MESSAGE]);
      setCurrentConversation(null);
    }
  }, [conversationId]);

  const loadConversation = useCallback(async (convId) => {
    if (!convId || convId === 'undefined' || convId === 'null') return;

    try {
      setIsLoading(true);
      const response = await conversationAPI.getConversation(convId);
      
      if (!response.data) {
        throw new Error('No se recibieron datos de la conversación');
      }

      let conversation = null;
      let messagesData = [];

      if (response.data.data) {
        conversation = response.data.data.conversation;
        messagesData = response.data.data.messages || [];
      } else if (response.data.conversation) {
        conversation = response.data.conversation;
        messagesData = response.data.messages || [];
      } else {
        conversation = response.data;
        messagesData = response.data.messages || [];
      }

      if (!conversation) {
        throw new Error('No se pudo extraer la conversación');
      }

      setCurrentConversation(conversation);
      
      const formattedMessages = messagesData.map(msg => ({
        id: msg.id || msg._id,
        type: msg.role === 'user' ? 'user' : 'ai',
        content: msg.content,
        timestamp: new Date(msg.createdAt || msg.timestamp),
        attachments: msg.attachments,
        tokens: msg.tokens,
        isStreaming: false
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error('Conversación no encontrada');
        navigate('/chat');
      } else if (error.response?.status === 401) {
        toast.error('Sesión expirada');
        navigate(SITE_CONFIG.routes.login);
      } else if (error.response?.status === 500) {
        toast.error('Error del servidor');
        navigate('/chat');
      } else {
        toast.error('Error al cargar la conversación');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleNewConversation = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setCurrentConversation(null);
    setSelectedFiles([]);
    setIsLoading(false);
    setIsStreaming(false);
    sendingLockRef.current = false;
    navigate('/chat');
    toast.success('Nueva conversación iniciada');
  }, [navigate]);

  const handleDeleteConversation = useCallback(async (convId) => {
    if (!convId) return;

    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta conversación?');
    if (!confirmDelete) return;

    try {
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
      toast.error('Error al eliminar conversación');
    }
  }, [currentConversation, handleNewConversation]);

  const handleFileSelect = useCallback((e, type = 'file') => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

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
          toast.error(`${file.name} no es un tipo válido`);
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

  const processChunkWithDelay = useCallback(async (chunk, accumulated, callback) => {
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTimeRef.current;
    
    if (timeSinceLastRender >= STREAM_DELAY) {
      lastRenderTimeRef.current = now;
      callback(chunk, accumulated);
      return;
    }
    
    const waitTime = STREAM_DELAY - timeSinceLastRender;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    lastRenderTimeRef.current = Date.now();
    callback(chunk, accumulated);
  }, []);

  const handleSendMessage = useCallback(async (messageContent) => {
    console.log('[CHAT] handleSendMessage llamado, lock:', sendingLockRef.current);
    
    if (sendingLockRef.current) {
      console.warn('[CHAT] Envío bloqueado - sendingLockRef es true');
      return;
    }

    if ((!messageContent || !messageContent.trim()) && selectedFiles.length === 0) {
      toast.error('Escribe un mensaje o adjunta un archivo');
      return;
    }

    if (isStreaming || isLoading) {
      console.warn('[CHAT] Bloqueado por isStreaming o isLoading');
      toast.error('Espera a que termine la respuesta actual');
      return;
    }

    sendingLockRef.current = true;
    console.log('[CHAT] Lock activado - Iniciando envío');

    const trimmedContent = messageContent?.trim() || '';
    const userMessageId = `user-${Date.now()}`;
    const aiMessageId = `ai-${Date.now()}`;

    const userMessage = {
      id: userMessageId,
      type: 'user',
      content: trimmedContent || 'Archivos adjuntos',
      timestamp: new Date(),
      files: selectedFiles.length > 0 ? selectedFiles.map(f => f.name) : null,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const filesForRequest = [...selectedFiles];
    setSelectedFiles([]);

    streamBufferRef.current = '';
    lastRenderTimeRef.current = 0;

    const safetyTimeoutId = setTimeout(() => {
      console.warn('[CHAT] Safety timeout alcanzado');
      setIsStreaming(false);
      setIsLoading(false);
      sendingLockRef.current = false;
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId && msg.isStreaming
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    }, SAFETY_TIMEOUT);

    try {
      let convId = currentConversation?.id || currentConversation?._id;
      const config = { temperature };

      let placeholderAdded = false;
      let completeCalled = false;

      const handleChunk = async (chunk, accumulated) => {
        streamBufferRef.current = accumulated;
        
        if (!placeholderAdded) {
          placeholderAdded = true;
          
          flushSync(() => {
            setIsLoading(false);
            setIsStreaming(true);
          });
          
          flushSync(() => {
            setMessages(prev => [...prev, {
              id: aiMessageId,
              type: 'ai',
              content: accumulated,
              timestamp: new Date(),
              isStreaming: true,
            }]);
          });
        } else {
          await processChunkWithDelay(chunk, accumulated, (chunk, accumulated) => {
            flushSync(() => {
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === aiMessageId 
                    ? { ...msg, content: accumulated, isStreaming: true }
                    : msg
                )
              );
            });
          });
        }
      };

      const handleComplete = (data) => {
        if (completeCalled) return;
        completeCalled = true;
        
        console.log('[CHAT] Mensaje completado');
        clearTimeout(safetyTimeoutId);
        
        const { conversation, messageId } = data;
        
        setIsStreaming(false);
        setIsLoading(false);
        sendingLockRef.current = false;
        
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId 
                ? { 
                    ...msg, 
                    content: streamBufferRef.current || msg.content,
                    isStreaming: false,
                    id: messageId || msg.id,
                    timestamp: msg.timestamp || new Date()
                  }
                : msg
            )
          );
        }, 150);

        if (conversation) {
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
          
          if (!convId) {
            navigate(`/chat/${newConvId}`, { replace: true });
          }
        }

        reloadConversations();
      };

      const handleError = (error) => {
        console.error('[CHAT] Error en mensaje:', error);
        clearTimeout(safetyTimeoutId);
        
        setIsStreaming(false);
        setIsLoading(false);
        sendingLockRef.current = false;
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId 
              ? { 
                  ...msg, 
                  content: streamBufferRef.current || 'Error al generar respuesta.',
                  isStreaming: false,
                  error: true
                }
              : msg
          )
        );
        
        let errorMessage = 'Error al enviar el mensaje';
        
        if (error.message?.includes('Token') || error.message?.includes('autenticación')) {
          errorMessage = 'Sesión expirada';
          setTimeout(() => navigate(SITE_CONFIG.routes.login), 2000);
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
      };

      if (filesForRequest.length > 0) {
        const formData = new FormData();
        formData.append('prompt', trimmedContent || 'Analiza estos archivos');
        
        if (convId) {
          formData.append('conversationId', convId);
        }
        
        filesForRequest.forEach((file) => {
          formData.append('files', file);
        });

        console.log('[CHAT] Enviando mensaje multimodal');
        await geminiAPI.sendMultimodalStream(
          formData,
          handleChunk,
          handleComplete,
          handleError,
          config
        );
        
      } else {
        console.log('[CHAT] Enviando mensaje de texto');
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
      console.error('[CHAT] Excepción en envío:', error);
      clearTimeout(safetyTimeoutId);
      
      setIsStreaming(false);
      setIsLoading(false);
      sendingLockRef.current = false;
      
      const errorMessage = error.response?.data?.message || error.message || 'Error al enviar el mensaje';
      toast.error(errorMessage);
    }
  }, [
    selectedFiles, 
    currentConversation, 
    navigate, 
    reloadConversations, 
    temperature, 
    isStreaming, 
    isLoading,
    processChunkWithDelay
  ]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

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
          onCancelStreaming={() => {
            setIsStreaming(false);
            setIsLoading(false);
            sendingLockRef.current = false;
            toast.success('Streaming cancelado');
          }}
        />

        <MessageList
          messages={messages}
          isLoading={isLoading}
          formatTime={formatTime}
        />

        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading || isStreaming || sendingLockRef.current}
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
          disabled={isLoading || isStreaming || sendingLockRef.current}
        />
      </main>
    </div>
  );
}

export default Chat;