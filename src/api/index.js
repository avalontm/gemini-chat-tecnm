// src/api/index.js

// Exportar instancia de axios configurada
export { default as api } from './axios.config';

// Exportar interceptores
export * from './interceptors';

// Exportar todas las APIs de endpoints
export { authAPI } from './endpoints/auth.api';
export { geminiAPI } from './endpoints/gemini.api';
export { conversationAPI } from './endpoints/conversation.api';
export { userAPI } from './endpoints/user.api';
export { exportAPI } from './endpoints/export.api';
export { reportsAPI } from './endpoints/reports.api';

// Exportar como objeto default para importacion alternativa
import { authAPI } from './endpoints/auth.api';
import { geminiAPI } from './endpoints/gemini.api';
import { conversationAPI } from './endpoints/conversation.api';
import { userAPI } from './endpoints/user.api';
import { exportAPI } from './endpoints/export.api';
import { reportsAPI } from './endpoints/reports.api';

export default {
  auth: authAPI,
  gemini: geminiAPI,
  conversation: conversationAPI,
  user: userAPI,
  export: exportAPI,
  reports: reportsAPI,
};