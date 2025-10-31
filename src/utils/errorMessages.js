// src/utils/errorMessages.js

// Mensajes de error de validacion
export const VALIDATION_ERRORS = {
  required: 'Este campo es obligatorio',
  email: 'Correo electronico invalido',
  emailFormat: 'El formato del correo electronico no es valido',
  emailInstitutional: 'Debe usar un correo institucional (@ensenada.tecnm.mx)',
  password: 'La contraseña debe tener al menos 8 caracteres',
  passwordWeak: 'La contraseña es muy debil',
  passwordMatch: 'Las contraseñas no coinciden',
  passwordRequirements: 'La contraseña debe contener al menos una mayuscula, una minuscula y un numero',
  username: 'El nombre de usuario debe tener entre 3 y 30 caracteres',
  usernameFormat: 'El nombre de usuario solo puede contener letras, numeros, guiones y guiones bajos',
  minLength: (min) => `Debe tener al menos ${min} caracteres`,
  maxLength: (max) => `No debe exceder ${max} caracteres`,
  minValue: (min) => `El valor minimo es ${min}`,
  maxValue: (max) => `El valor maximo es ${max}`,
  invalidFormat: 'Formato invalido',
  invalidUrl: 'URL invalida',
  invalidPhone: 'Numero de telefono invalido',
  invalidDate: 'Fecha invalida',
  futureDateRequired: 'La fecha debe ser futura',
  pastDateRequired: 'La fecha debe ser pasada',
};

// Mensajes de error de archivos
export const FILE_ERRORS = {
  required: 'Debe seleccionar un archivo',
  tooLarge: (maxSize) => `El archivo es demasiado grande. Tamaño maximo: ${maxSize}`,
  invalidType: (allowedTypes) => `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes}`,
  uploadFailed: 'Error al subir el archivo',
  notFound: 'Archivo no encontrado',
  corruptedFile: 'El archivo esta corrupto o dañado',
  imageTooLarge: 'La imagen es demasiado grande. Maximo 5MB',
  audioTooLarge: 'El audio es demasiado grande. Maximo 10MB',
  pdfTooLarge: 'El PDF es demasiado grande. Maximo 10MB',
  invalidImage: 'Formato de imagen no valido. Usa JPG, PNG, GIF o WEBP',
  invalidAudio: 'Formato de audio no valido. Usa MP3, WAV o OGG',
  invalidPDF: 'El archivo debe ser un PDF valido',
};

// Mensajes de error de autenticacion
export const AUTH_ERRORS = {
  loginFailed: 'Error al iniciar sesion. Verifica tus credenciales',
  registerFailed: 'Error al registrar usuario',
  logoutFailed: 'Error al cerrar sesion',
  invalidCredentials: 'Credenciales invalidas',
  userNotFound: 'Usuario no encontrado',
  emailExists: 'El correo electronico ya esta registrado',
  usernameExists: 'El nombre de usuario ya esta en uso',
  unauthorized: 'No autorizado. Inicia sesion nuevamente',
  sessionExpired: 'Tu sesion ha expirado. Inicia sesion nuevamente',
  tokenInvalid: 'Token invalido o expirado',
  tokenExpired: 'Token expirado',
  permissionDenied: 'No tienes permisos para realizar esta accion',
  accountDisabled: 'Tu cuenta ha sido deshabilitada',
  accountNotVerified: 'Debes verificar tu cuenta antes de continuar',
  tooManyAttempts: 'Demasiados intentos. Intenta mas tarde',
  passwordIncorrect: 'Contraseña incorrecta',
  oldPasswordIncorrect: 'La contraseña actual es incorrecta',
};

// Mensajes de error de red
export const NETWORK_ERRORS = {
  noConnection: 'Sin conexion a internet',
  timeout: 'La peticion ha excedido el tiempo de espera',
  serverError: 'Error del servidor. Intenta mas tarde',
  serviceUnavailable: 'Servicio no disponible temporalmente',
  badRequest: 'Peticion invalida',
  notFound: 'Recurso no encontrado',
  forbidden: 'Acceso prohibido',
  conflict: 'Conflicto con el estado actual del recurso',
  unknown: 'Error desconocido. Intenta nuevamente',
};

// Mensajes de error de chat
export const CHAT_ERRORS = {
  sendFailed: 'Error al enviar mensaje',
  loadFailed: 'Error al cargar mensajes',
  emptyMessage: 'El mensaje no puede estar vacio',
  messageTooLong: 'El mensaje es demasiado largo',
  conversationNotFound: 'Conversacion no encontrada',
  createConversationFailed: 'Error al crear conversacion',
  deleteConversationFailed: 'Error al eliminar conversacion',
  updateConversationFailed: 'Error al actualizar conversacion',
  noConversationSelected: 'No hay conversacion seleccionada',
  aiResponseFailed: 'Error al obtener respuesta de IA',
  aiTimeout: 'La IA tardo demasiado en responder',
  contextLimitExceeded: 'Se ha excedido el limite de contexto',
};

// Mensajes de error genericos de CRUD
export const CRUD_ERRORS = {
  createFailed: 'Error al crear el registro',
  readFailed: 'Error al leer los datos',
  updateFailed: 'Error al actualizar el registro',
  deleteFailed: 'Error al eliminar el registro',
  fetchFailed: 'Error al obtener los datos',
  saveFailed: 'Error al guardar los cambios',
  notFound: 'Registro no encontrado',
  alreadyExists: 'El registro ya existe',
};

// Mensajes de exito
export const SUCCESS_MESSAGES = {
  loginSuccess: 'Inicio de sesion exitoso',
  registerSuccess: 'Registro exitoso',
  logoutSuccess: 'Sesion cerrada exitosamente',
  profileUpdated: 'Perfil actualizado exitosamente',
  passwordChanged: 'Contraseña cambiada exitosamente',
  emailSent: 'Correo enviado exitosamente',
  messageSent: 'Mensaje enviado',
  fileUploaded: 'Archivo subido exitosamente',
  fileSaved: 'Archivo guardado correctamente',
  conversationCreated: 'Conversacion creada',
  conversationDeleted: 'Conversacion eliminada',
  conversationUpdated: 'Conversacion actualizada',
  settingsSaved: 'Configuracion guardada',
  changesSaved: 'Cambios guardados exitosamente',
  operationSuccess: 'Operacion realizada exitosamente',
};

// Mapeo de codigos de estado HTTP a mensajes
export const HTTP_STATUS_MESSAGES = {
  200: 'Operacion exitosa',
  201: 'Recurso creado exitosamente',
  204: 'Operacion exitosa sin contenido',
  400: 'Peticion invalida',
  401: 'No autorizado',
  403: 'Acceso prohibido',
  404: 'Recurso no encontrado',
  409: 'Conflicto con el recurso',
  422: 'Datos no procesables',
  429: 'Demasiadas peticiones',
  500: 'Error interno del servidor',
  502: 'Error de gateway',
  503: 'Servicio no disponible',
  504: 'Timeout del gateway',
};

// Helper para obtener mensaje de error segun codigo HTTP
export const getHttpErrorMessage = (statusCode) => {
  return HTTP_STATUS_MESSAGES[statusCode] || NETWORK_ERRORS.unknown;
};

// Helper para obtener mensaje de error de API
export const getApiErrorMessage = (error) => {
  if (!error) return NETWORK_ERRORS.unknown;

  // Si el error tiene un mensaje custom del servidor
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Si es un error de validacion con multiples errores
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    if (Array.isArray(errors)) {
      return errors.join(', ');
    }
    if (typeof errors === 'object') {
      return Object.values(errors).flat().join(', ');
    }
  }

  // Error de red
  if (error.message === 'Network Error') {
    return NETWORK_ERRORS.noConnection;
  }

  // Timeout
  if (error.code === 'ECONNABORTED') {
    return NETWORK_ERRORS.timeout;
  }

  // Por codigo de estado HTTP
  if (error.response?.status) {
    return getHttpErrorMessage(error.response.status);
  }

  // Error generico
  return error.message || NETWORK_ERRORS.unknown;
};

// Helper para formatear errores de validacion
export const formatValidationErrors = (errors) => {
  if (!errors) return [];

  if (Array.isArray(errors)) {
    return errors;
  }

  if (typeof errors === 'object') {
    return Object.entries(errors).map(([field, messages]) => {
      const messageArray = Array.isArray(messages) ? messages : [messages];
      return `${field}: ${messageArray.join(', ')}`;
    });
  }

  return [String(errors)];
};

// Helper para verificar si es un error de autenticacion
export const isAuthError = (error) => {
  const status = error.response?.status;
  return status === 401 || status === 403;
};

// Helper para verificar si es un error de red
export const isNetworkError = (error) => {
  return error.message === 'Network Error' || error.code === 'ECONNABORTED';
};

// Helper para verificar si es un error del servidor
export const isServerError = (error) => {
  const status = error.response?.status;
  return status >= 500 && status < 600;
};

// Helper para verificar si es un error del cliente
export const isClientError = (error) => {
  const status = error.response?.status;
  return status >= 400 && status < 500;
};

export default {
  VALIDATION_ERRORS,
  FILE_ERRORS,
  AUTH_ERRORS,
  NETWORK_ERRORS,
  CHAT_ERRORS,
  CRUD_ERRORS,
  SUCCESS_MESSAGES,
  HTTP_STATUS_MESSAGES,
  getHttpErrorMessage,
  getApiErrorMessage,
  formatValidationErrors,
  isAuthError,
  isNetworkError,
  isServerError,
  isClientError,
};