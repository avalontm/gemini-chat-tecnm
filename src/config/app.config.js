// src/config/app.config.js

// Configuracion general de la aplicacion
export const APP_CONFIG = {
  // Informacion de la aplicacion
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Gemini Chat TecNM',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: 'Plataforma de IA para la comunidad del TecNM Campus Ensenada',
    author: 'TecNM Campus Ensenada',
  },

  // Features habilitados/deshabilitados
  features: {
    voiceRecording: import.meta.env.VITE_ENABLE_VOICE_RECORDING === 'true',
    imageUpload: import.meta.env.VITE_ENABLE_IMAGE_UPLOAD === 'true',
    pdfUpload: import.meta.env.VITE_ENABLE_PDF_UPLOAD === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    darkMode: true,
    exportChat: true,
    searchConversations: true,
    favoriteConversations: true,
    archiveConversations: true,
  },

  // Configuracion de temas
  theme: {
    defaultTheme: 'light',
    storageKey: 'theme',
    themes: ['light', 'dark'],
    colors: {
      primary: 'blue',
      secondary: 'indigo',
      success: 'green',
      warning: 'yellow',
      error: 'red',
      info: 'cyan',
    },
  },

  // Configuracion de localStorage
  storage: {
    keys: {
      token: 'token',
      user: 'user',
      theme: 'theme',
      rememberMe: 'rememberMe',
      refreshToken: 'refreshToken',
      conversations: 'conversations',
      currentConversation: 'currentConversation',
      settings: 'settings',
    },
    prefix: 'gemini_chat_',
  },

  // Configuracion de validacion
  validation: {
    username: {
      minLength: 3,
      maxLength: 30,
      pattern: /^[a-zA-Z0-9_-]+$/,
      errorMessage: 'El nombre de usuario debe tener entre 3 y 30 caracteres',
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      errorMessage: 'Correo electronico invalido',
    },
    password: {
      minLength: 8,
      maxLength: 128,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      errorMessage: 'La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un numero',
    },
    message: {
      minLength: 1,
      maxLength: 4000,
      errorMessage: 'El mensaje debe tener entre 1 y 4000 caracteres',
    },
  },

  // Configuracion de archivos
  files: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760, // 10MB
    maxImageSize: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE) || 5242880, // 5MB
    maxAudioSize: parseInt(import.meta.env.VITE_MAX_AUDIO_SIZE) || 10485760, // 10MB
    maxPDFSize: parseInt(import.meta.env.VITE_MAX_PDF_SIZE) || 10485760, // 10MB
    
    allowedImageTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ],
    
    allowedAudioTypes: [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/webm',
      'audio/mp4',
    ],
    
    allowedDocTypes: [
      'application/pdf',
      'text/plain',
      'text/markdown',
    ],
    
    imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    audioExtensions: ['.mp3', '.wav', '.ogg', '.webm', '.m4a'],
    docExtensions: ['.pdf', '.txt', '.md'],
  },

  // Configuracion de chat
  chat: {
    maxMessageLength: 4000,
    maxMessagesPerConversation: 1000,
    autoSaveInterval: 30000, // 30 segundos
    typingIndicatorDelay: 1000,
    messageRetryAttempts: 3,
    messageRetryDelay: 2000,
    scrollBehavior: 'smooth',
    enableMarkdown: true,
    enableCodeHighlight: true,
    enableEmojis: true,
  },

  // Configuracion de conversaciones
  conversations: {
    defaultTitle: 'Nueva conversacion',
    maxConversations: 100,
    autoDeleteAfterDays: 90,
    enableAutoTitle: true,
    sortBy: 'updatedAt', // createdAt, updatedAt, title
    sortOrder: 'desc', // asc, desc
  },

  // Configuracion de UI
  ui: {
    animation: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out',
    },
    
    notifications: {
      position: 'top-right', // top-left, top-right, bottom-left, bottom-right, top-center, bottom-center
      duration: 3000,
      maxVisible: 3,
    },
    
    sidebar: {
      defaultOpen: true,
      width: 280,
      collapsible: true,
    },
    
    header: {
      height: 64,
      sticky: true,
    },
    
    footer: {
      height: 60,
      sticky: false,
    },
  },

  // Configuracion de paginacion
  pagination: {
    defaultPage: 1,
    defaultLimit: 50,
    maxLimit: 100,
    limits: [10, 25, 50, 100],
  },

  // Configuracion de busqueda
  search: {
    minLength: 2,
    debounceDelay: 300,
    maxResults: 50,
    highlightMatches: true,
  },

  // Configuracion de tiempo
  time: {
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    dateTimeFormat: 'dd/MM/yyyy HH:mm',
    relativeTimeThreshold: 86400000, // 24 horas en ms
    timezone: 'America/Tijuana',
  },

  // Configuracion de sesion
  session: {
    timeout: 3600000, // 1 hora en ms
    extendOnActivity: true,
    warningBeforeExpiry: 300000, // 5 minutos antes
  },

  // Configuracion de performance
  performance: {
    enableLazyLoading: true,
    enableVirtualization: true,
    imageOptimization: true,
    cacheStrategy: 'cache-first',
    preloadImages: false,
  },

  // Configuracion de accesibilidad
  accessibility: {
    enableKeyboardNavigation: true,
    enableScreenReader: true,
    highContrast: false,
    fontSize: 'medium', // small, medium, large
  },

  // Configuracion de desarrollo
  development: {
    enableDebugMode: import.meta.env.DEV,
    enableLogger: import.meta.env.DEV,
    logLevel: 'info', // error, warn, info, debug
    showErrorDetails: import.meta.env.DEV,
  },
};

// Helper para obtener valor de configuracion
export const getConfig = (path, defaultValue = null) => {
  return path.split('.').reduce((obj, key) => obj?.[key], APP_CONFIG) ?? defaultValue;
};

// Helper para verificar si una feature esta habilitada
export const isFeatureEnabled = (feature) => {
  return APP_CONFIG.features[feature] ?? false;
};

// Helper para obtener storage key con prefijo
export const getStorageKey = (key) => {
  return `${APP_CONFIG.storage.prefix}${key}`;
};

// Helper para validar tamaño de archivo segun tipo
export const validateFileSize = (file, type = 'file') => {
  const maxSizeKey = `max${type.charAt(0).toUpperCase() + type.slice(1)}Size`;
  const maxSize = APP_CONFIG.files[maxSizeKey] || APP_CONFIG.files.maxFileSize;
  return file.size <= maxSize;
};

// Helper para validar tipo de archivo
export const validateFileType = (file, category = 'image') => {
  const allowedTypesKey = `allowed${category.charAt(0).toUpperCase() + category.slice(1)}Types`;
  const allowedTypes = APP_CONFIG.files[allowedTypesKey];
  
  if (!allowedTypes) return true;
  
  return allowedTypes.includes(file.type);
};

// Helper para formatear bytes a formato legible
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Helper para validar password
export const validatePassword = (password) => {
  const config = APP_CONFIG.validation.password;
  
  if (password.length < config.minLength || password.length > config.maxLength) {
    return { valid: false, message: config.errorMessage };
  }
  
  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una letra mayuscula' };
  }
  
  if (config.requireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una letra minuscula' };
  }
  
  if (config.requireNumbers && !/\d/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un numero' };
  }
  
  if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un caracter especial' };
  }
  
  return { valid: true, message: 'Contraseña valida' };
};

// Helper para validar email
export const validateEmail = (email) => {
  const config = APP_CONFIG.validation.email;
  
  if (!config.pattern.test(email)) {
    return { valid: false, message: config.errorMessage };
  }
  
  return { valid: true, message: 'Email valido' };
};

// Helper para validar username
export const validateUsername = (username) => {
  const config = APP_CONFIG.validation.username;
  
  if (username.length < config.minLength || username.length > config.maxLength) {
    return { valid: false, message: config.errorMessage };
  }
  
  if (!config.pattern.test(username)) {
    return { valid: false, message: 'El nombre de usuario solo puede contener letras, numeros, guiones y guiones bajos' };
  }
  
  return { valid: true, message: 'Nombre de usuario valido' };
};

export default APP_CONFIG;