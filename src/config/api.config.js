// src/config/api.config.js

// Configuracion de API
export const API_CONFIG = {
  // URL base de la API
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // Timeout para peticiones (en milisegundos)
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  
  // Headers por defecto
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuracion de autenticacion
  auth: {
    tokenKey: 'token',
    userKey: 'user',
    refreshTokenKey: 'refreshToken',
    rememberMeKey: 'rememberMe',
  },
  
  // Endpoints de la API
  endpoints: {
    // Auth endpoints
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
      profile: '/api/auth/profile',
      changePassword: '/api/auth/change-password',
      forgotPassword: '/api/auth/forgot-password',
      resetPassword: '/api/auth/reset-password',
      verifyEmail: '/api/auth/verify-email',
      refresh: '/api/auth/refresh',
      verifyToken: '/api/auth/verify-token',
    },
    
    // Gemini endpoints
    gemini: {
      text: '/api/gemini/text',
      image: '/api/gemini/image',
      voice: '/api/gemini/voice',
      pdf: '/api/gemini/pdf',
      multimodal: '/api/gemini/multimodal',
      conversation: '/api/gemini/conversation',
      suggestions: '/api/gemini/suggestions',
      generateTitle: '/api/gemini/generate-title',
      models: '/api/gemini/models',
      stop: '/api/gemini/stop',
      regenerate: '/api/gemini/regenerate',
      usage: '/api/gemini/usage',
    },
    
    // Conversation endpoints
    conversations: {
      list: '/api/conversations',
      get: '/api/conversations/:id',
      create: '/api/conversations',
      update: '/api/conversations/:id',
      delete: '/api/conversations/:id',
      messages: '/api/conversations/:id/messages',
      addMessage: '/api/conversations/:id/messages',
      deleteMessage: '/api/conversations/:id/messages/:messageId',
      search: '/api/conversations/search',
      archive: '/api/conversations/:id/archive',
      unarchive: '/api/conversations/:id/unarchive',
      archived: '/api/conversations/archived',
      favorite: '/api/conversations/:id/favorite',
      unfavorite: '/api/conversations/:id/favorite',
      favorites: '/api/conversations/favorites',
      exportPDF: '/api/conversations/:id/export/pdf',
      exportTXT: '/api/conversations/:id/export/txt',
      stats: '/api/conversations/stats',
    },
  },
  
  // Codigos de estado HTTP
  statusCodes: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
  
  // Configuracion de retry
  retry: {
    enabled: true,
    maxRetries: 3,
    retryDelay: 1000,
    retryOn: [408, 429, 500, 502, 503, 504],
  },
  
  // Configuracion de cache
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5 minutos
    excludeEndpoints: [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/logout',
    ],
  },
  
  // Configuracion de upload de archivos
  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
    maxImageSize: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE) || 5242880, // 5MB
    maxAudioSize: parseInt(import.meta.env.VITE_MAX_AUDIO_SIZE) || 10485760, // 10MB
    maxPDFSize: parseInt(import.meta.env.VITE_MAX_PDF_SIZE) || 10485760, // 10MB
    
    allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    allowedAudioTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'],
    allowedDocTypes: ['application/pdf', 'text/plain'],
  },
  
  // Configuracion de paginacion
  pagination: {
    defaultPage: 1,
    defaultLimit: 50,
    maxLimit: 100,
  },
  
  // Configuracion de Gemini
  gemini: {
    defaultTemperature: 0.7,
    defaultMaxTokens: 2048,
    maxTemperature: 1.0,
    minTemperature: 0.0,
    maxPromptLength: 4000,
  },
};

// Helper para construir URLs con parametros
export const buildURL = (endpoint, params = {}) => {
  let url = endpoint;
  
  // Reemplazar parametros en la URL
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};

// Helper para validar tamaño de archivo
export const validateFileSize = (file, type = 'file') => {
  const maxSize = API_CONFIG.upload[`max${type.charAt(0).toUpperCase() + type.slice(1)}Size`] 
    || API_CONFIG.upload.maxFileSize;
  
  return file.size <= maxSize;
};

// Helper para validar tipo de archivo
export const validateFileType = (file, category = 'image') => {
  const allowedTypes = API_CONFIG.upload[`allowed${category.charAt(0).toUpperCase() + category.slice(1)}Types`];
  
  if (!allowedTypes) return true;
  
  return allowedTypes.includes(file.type);
};

// Helper para formatear bytes a formato legible
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default API_CONFIG;