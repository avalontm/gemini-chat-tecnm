// Configuración centralizada de rutas
export const ROUTES = {
  // Públicas
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Protegidas
  CHAT: '/chat',
  CHAT_CONVERSATION: '/chat/:conversationId',
  CONVERSATIONS: '/conversations',
  PROFILE: '/profile',
  
  // Error
  NOT_FOUND: '/404',
};

// Helper para generar rutas dinámicas
export const generateRoute = (route, params = {}) => {
  let path = route;
  Object.keys(params).forEach((key) => {
    path = path.replace(`:${key}`, params[key]);
  });
  return path;
};

// Ejemplo de uso:
// generateRoute(ROUTES.CHAT_CONVERSATION, { conversationId: '123' })
// Resultado: '/chat/123'