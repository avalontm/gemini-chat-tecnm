// src/utils/errorHandler.js

/**
 * Sistema centralizado de manejo de errores con logs detallados
 */

// Colores para logs en consola (solo desarrollo)
const LOG_STYLES = {
  error: 'color: #EF4444; font-weight: bold; font-size: 12px;',
  warning: 'color: #F59E0B; font-weight: bold; font-size: 12px;',
  info: 'color: #3B82F6; font-weight: bold; font-size: 12px;',
  success: 'color: #10B981; font-weight: bold; font-size: 12px;',
  debug: 'color: #6B7280; font-size: 11px;'
};

/**
 * Logger mejorado con timestamps y contexto
 */
export const logger = {
  error: (context, message, data = null) => {
    const timestamp = new Date().toISOString();
    console.group(`%c[ERROR] ${context}`, LOG_STYLES.error);
    console.log(`%cTimestamp: ${timestamp}`, LOG_STYLES.debug);
    console.log(`%cMessage: ${message}`, 'color: #EF4444;');
    if (data) {
      console.log('%cData:', 'color: #EF4444; font-weight: bold;');
      console.log(data);
    }
    console.trace('Stack trace:');
    console.groupEnd();
  },

  warning: (context, message, data = null) => {
    const timestamp = new Date().toISOString();
    console.group(`%c[WARNING] ${context}`, LOG_STYLES.warning);
    console.log(`%cTimestamp: ${timestamp}`, LOG_STYLES.debug);
    console.log(`%cMessage: ${message}`, 'color: #F59E0B;');
    if (data) {
      console.log('%cData:', 'color: #F59E0B; font-weight: bold;');
      console.log(data);
    }
    console.groupEnd();
  },

  info: (context, message, data = null) => {
    const timestamp = new Date().toISOString();
    console.group(`%c[INFO] ${context}`, LOG_STYLES.info);
    console.log(`%cTimestamp: ${timestamp}`, LOG_STYLES.debug);
    console.log(`%cMessage: ${message}`, 'color: #3B82F6;');
    if (data) {
      console.log('%cData:', 'color: #3B82F6;');
      console.log(data);
    }
    console.groupEnd();
  },

  success: (context, message, data = null) => {
    const timestamp = new Date().toISOString();
    console.group(`%c[SUCCESS] ${context}`, LOG_STYLES.success);
    console.log(`%cTimestamp: ${timestamp}`, LOG_STYLES.debug);
    console.log(`%cMessage: ${message}`, 'color: #10B981;');
    if (data) {
      console.log('%cData:', 'color: #10B981;');
      console.log(data);
    }
    console.groupEnd();
  },

  debug: (context, message, data = null) => {
    if (import.meta.env.MODE !== 'development') return;
    
    const timestamp = new Date().toISOString();
    console.group(`%c[DEBUG] ${context}`, LOG_STYLES.debug);
    console.log(`%cTimestamp: ${timestamp}`, LOG_STYLES.debug);
    console.log(`%cMessage: ${message}`, LOG_STYLES.debug);
    if (data) {
      console.log('%cData:', LOG_STYLES.debug);
      console.log(data);
    }
    console.groupEnd();
  }
};

/**
 * Tipos de errores del servidor
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  STREAMING: 'STREAMING_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Mensajes de error amigables para el usuario
 */
export const USER_ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Error de conexión. Verifica tu internet.',
  [ERROR_TYPES.AUTH]: 'Sesión expirada. Por favor inicia sesión nuevamente.',
  [ERROR_TYPES.VALIDATION]: 'Datos inválidos. Verifica la información.',
  [ERROR_TYPES.SERVER]: 'Error del servidor. Intenta nuevamente.',
  [ERROR_TYPES.TIMEOUT]: 'Tiempo de espera agotado. Intenta nuevamente.',
  [ERROR_TYPES.STREAMING]: 'Error en el streaming. Intenta nuevamente.',
  [ERROR_TYPES.UNKNOWN]: 'Error inesperado. Intenta nuevamente.'
};

/**
 * Detectar tipo de error basado en el error recibido
 */
export const detectErrorType = (error) => {
  if (!error) return ERROR_TYPES.UNKNOWN;

  // Error de red
  if (!navigator.onLine || error.message === 'Network Error') {
    return ERROR_TYPES.NETWORK;
  }

  // Error de autenticación (401)
  if (error.response?.status === 401) {
    return ERROR_TYPES.AUTH;
  }

  // Error de validación (400, 422)
  if (error.response?.status === 400 || error.response?.status === 422) {
    return ERROR_TYPES.VALIDATION;
  }

  // Error de timeout
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return ERROR_TYPES.TIMEOUT;
  }

  // Error de streaming
  if (error.message.includes('stream') || error.message.includes('chunk')) {
    return ERROR_TYPES.STREAMING;
  }

  // Error del servidor (500+)
  if (error.response?.status >= 500) {
    return ERROR_TYPES.SERVER;
  }

  return ERROR_TYPES.UNKNOWN;
};

/**
 * Parsear error del servidor y extraer información útil
 */
export const parseServerError = (error) => {
  const errorInfo = {
    type: detectErrorType(error),
    status: null,
    message: null,
    details: null,
    timestamp: new Date().toISOString(),
    raw: error
  };

  if (error.response) {
    // Error con respuesta del servidor
    errorInfo.status = error.response.status;
    errorInfo.message = error.response.data?.message || error.response.statusText;
    errorInfo.details = error.response.data?.details || error.response.data?.error;
    
    logger.error('SERVER ERROR', `Status ${errorInfo.status}`, {
      url: error.config?.url,
      method: error.config?.method,
      status: errorInfo.status,
      message: errorInfo.message,
      details: errorInfo.details,
      headers: error.response.headers
    });
  } else if (error.request) {
    // Request hecho pero sin respuesta
    errorInfo.message = 'No se recibió respuesta del servidor';
    
    logger.error('REQUEST ERROR', errorInfo.message, {
      url: error.config?.url,
      method: error.config?.method,
      timeout: error.config?.timeout
    });
  } else {
    // Error al configurar el request
    errorInfo.message = error.message || 'Error desconocido';
    
    logger.error('CLIENT ERROR', errorInfo.message, {
      error: error
    });
  }

  return errorInfo;
};

/**
 * Obtener mensaje amigable para el usuario
 */
export const getUserFriendlyMessage = (error) => {
  const errorInfo = parseServerError(error);
  
  // Si el servidor envía un mensaje personalizado, usarlo
  if (errorInfo.message && errorInfo.message.length < 200) {
    return errorInfo.message;
  }

  // Sino, usar mensaje genérico
  return USER_ERROR_MESSAGES[errorInfo.type] || USER_ERROR_MESSAGES[ERROR_TYPES.UNKNOWN];
};

/**
 * Manejar error de manera centralizada
 */
export const handleError = (error, context = 'General', options = {}) => {
  const {
    showToast = true,
    logToConsole = true,
    customMessage = null,
    onAuthError = null,
    additionalData = null
  } = options;

  const errorInfo = parseServerError(error);

  // Log detallado en consola
  if (logToConsole) {
    logger.error(context, errorInfo.message, {
      type: errorInfo.type,
      status: errorInfo.status,
      details: errorInfo.details,
      additionalData
    });
  }

  // Mensaje para el usuario
  const userMessage = customMessage || getUserFriendlyMessage(error);

  // Manejar error de autenticación
  if (errorInfo.type === ERROR_TYPES.AUTH && onAuthError) {
    logger.warning(context, 'Sesión expirada, ejecutando callback');
    onAuthError();
  }

  return {
    ...errorInfo,
    userMessage
  };
};

/**
 * Wrapper para try-catch con manejo automático de errores
 */
export const withErrorHandling = async (fn, context, options = {}) => {
  try {
    logger.info(context, 'Iniciando operación');
    const result = await fn();
    logger.success(context, 'Operación completada exitosamente', result);
    return { success: true, data: result };
  } catch (error) {
    const errorInfo = handleError(error, context, options);
    return { success: false, error: errorInfo };
  }
};

/**
 * Validar respuesta del servidor
 */
export const validateServerResponse = (response, context) => {
  if (!response) {
    logger.error(context, 'Respuesta vacía del servidor');
    throw new Error('Respuesta vacía del servidor');
  }

  if (!response.data) {
    logger.error(context, 'Respuesta sin datos', { response });
    throw new Error('Respuesta sin datos');
  }

  logger.debug(context, 'Respuesta válida', {
    status: response.status,
    hasData: !!response.data
  });

  return true;
};

/**
 * Monitor de conexión
 */
export const ConnectionMonitor = {
  listeners: [],

  init() {
    window.addEventListener('online', () => {
      logger.success('CONNECTION', 'Conexión restaurada');
      this.notifyListeners(true);
    });

    window.addEventListener('offline', () => {
      logger.error('CONNECTION', 'Conexión perdida');
      this.notifyListeners(false);
    });
  },

  addListener(callback) {
    this.listeners.push(callback);
  },

  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  },

  notifyListeners(isOnline) {
    this.listeners.forEach(callback => callback(isOnline));
  },

  isOnline() {
    return navigator.onLine;
  }
};

/**
 * Retry con exponential backoff
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  initialDelay = 1000,
  context = 'Retry'
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.info(context, `Intento ${attempt}/${maxRetries}`);
      const result = await fn();
      logger.success(context, `Éxito en intento ${attempt}`);
      return result;
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        logger.error(context, `Falló después de ${maxRetries} intentos`, error);
        break;
      }

      const delay = initialDelay * Math.pow(2, attempt - 1);
      logger.warning(context, `Intento ${attempt} falló, reintentando en ${delay}ms`, error);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export default {
  logger,
  ERROR_TYPES,
  USER_ERROR_MESSAGES,
  detectErrorType,
  parseServerError,
  getUserFriendlyMessage,
  handleError,
  withErrorHandling,
  validateServerResponse,
  ConnectionMonitor,
  retryWithBackoff
};