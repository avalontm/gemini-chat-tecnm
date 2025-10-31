// src/config/constants.js

export const SITE_CONFIG = {
  // Información institucional
  institution: {
    name: 'Tecnológico Nacional de México',
    campus: 'Campus Ensenada',
    fullName: 'Tecnológico Nacional de México - Campus Ensenada',
    shortName: 'TecNM Ensenada',
    location: 'Ensenada, Baja California',
  },

  // Información del producto
  product: {
    name: 'Gemini Chat TecNM',
    tagline: 'Powered by Google Gemini AI',
    description: 'Plataforma de IA para la comunidad del TecNM Campus Ensenada',
  },

  // Textos de la página principal
  home: {
    badge: 'Powered by Google Gemini AI',
    
    hero: {
      title: 'Conversa con',
      titleHighlight: 'Inteligencia',
      subtitle: 'Experimenta el poder de la IA generativa con Gemini Chat.',
      subtitleSecondary: 'Chat inteligente, análisis de imágenes y más.',
      ctaPrimary: 'Comenzar Gratis',
      ctaSecondary: 'Iniciar Sesión',
    },

    stats: [
      { value: '10K+', label: 'Usuarios' },
      { value: '1M+', label: 'Mensajes' },
      { value: '99.9%', label: 'Uptime' },
    ],

    features: {
      title: 'Todo lo que necesitas',
      subtitle: 'Funcionalidades diseñadas para potenciar tu productividad',
      items: [
        {
          title: 'Chat Inteligente',
          description: 'Conversa naturalmente con Gemini AI. Respuestas contextuales y precisas.',
        },
        {
          title: 'Respuestas Rápidas',
          description: 'Obtén respuestas instantáneas gracias a la potencia de Google Gemini.',
        },
        {
          title: 'Seguro y Privado',
          description: 'Tus conversaciones están protegidas con autenticación segura.',
        },
        {
          title: 'Multimodal',
          description: 'Sube imágenes, documentos y audio para análisis completo.',
        },
      ],
    },

    cta: {
      title: '¿Listo para empezar?',
      subtitle: 'Únete a miles de usuarios que ya están usando Gemini Chat',
      button: 'Crear Cuenta Gratis',
    },
  },

  // Textos del footer
  footer: {
    title: 'Gemini Chat TecNM',
    subtitle: 'Tecnológico Nacional de México - Campus Ensenada',
    copyright: '© 2025 TecNM Campus Ensenada. Todos los derechos reservados.',
    socialLinks: {
      github: '#',
      twitter: '#',
      facebook: '#',
      instagram: '#',
    },
  },

  // Mensajes de autenticación
  auth: {
    login: {
      title: 'Iniciar Sesión',
      subtitle: 'Accede a tu cuenta del TecNM',
      emailLabel: 'Correo Electrónico',
      emailPlaceholder: 'tu-email@ensenada.tecnm.mx',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: '••••••••',
      submitButton: 'Iniciar Sesión',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes cuenta?',
      registerLink: 'Regístrate aquí',
    },
    register: {
      title: 'Crear Cuenta',
      subtitle: 'Únete a la comunidad del TecNM',
      nameLabel: 'Nombre Completo',
      namePlaceholder: 'Juan Pérez González',
      emailLabel: 'Correo Institucional',
      emailPlaceholder: 'tu-email@ensenada.tecnm.mx',
      passwordLabel: 'Contraseña',
      passwordPlaceholder: '••••••••',
      confirmPasswordLabel: 'Confirmar Contraseña',
      confirmPasswordPlaceholder: '••••••••',
      submitButton: 'Crear Cuenta',
      hasAccount: '¿Ya tienes cuenta?',
      loginLink: 'Inicia sesión',
      terms: 'Al registrarte, aceptas nuestros',
      termsLink: 'Términos y Condiciones',
      and: 'y',
      privacyLink: 'Política de Privacidad',
    },
  },

  // Mensajes del chat
  chat: {
    welcome: '¡Bienvenido a Gemini Chat!',
    welcomeMessage: 'Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?',
    inputPlaceholder: 'Escribe tu mensaje aquí...',
    sendButton: 'Enviar',
    newChat: 'Nueva Conversación',
    deleteChat: 'Eliminar Chat',
    exportChat: 'Exportar Conversación',
    attachFile: 'Adjuntar Archivo',
    uploadImage: 'Subir Imagen',
    recording: 'Grabando audio...',
    thinking: 'Pensando...',
    typing: 'Escribiendo...',
  },

  // Mensajes de error
  errors: {
    generic: 'Algo salió mal. Por favor, intenta de nuevo.',
    network: 'Error de conexión. Verifica tu internet.',
    auth: 'Error de autenticación. Por favor, inicia sesión nuevamente.',
    fileSize: 'El archivo es demasiado grande. Máximo 10MB.',
    fileType: 'Tipo de archivo no permitido.',
    required: 'Este campo es obligatorio.',
    invalidEmail: 'Correo electrónico inválido.',
    passwordMismatch: 'Las contraseñas no coinciden.',
    weakPassword: 'La contraseña debe tener al menos 8 caracteres.',
  },

  // Mensajes de éxito
  success: {
    loginSuccess: '¡Bienvenido de vuelta!',
    registerSuccess: '¡Cuenta creada exitosamente!',
    messageSent: 'Mensaje enviado',
    fileSaved: 'Archivo guardado correctamente',
    settingsSaved: 'Configuración guardada',
    passwordChanged: 'Contraseña actualizada',
  },

  // Configuración de la aplicación
  app: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocTypes: ['application/pdf', 'text/plain', 'application/msword'],
    maxMessageLength: 4000,
    chatHistoryLimit: 50,
  },

  // URLs y navegación
  routes: {
    home: '/',
    login: '/login',
    register: '/register',
    chat: '/chat',
    profile: '/profile',
    settings: '/settings',
    about: '/about',
    contact: '/contact',
    terms: '/terms',
    privacy: '/privacy',
  },

  // Contacto
  contact: {
    email: 'soporte@ensenada.tecnm.mx',
    phone: '+52 (646) 123-4567',
    address: 'Boulevard Tecnológico S/N, Ensenada, B.C.',
    website: 'https://ensenada.tecnm.mx',
  },

  // Redes sociales
  social: {
    facebook: 'https://facebook.com/tecnmensenada',
    twitter: 'https://twitter.com/tecnmensenada',
    instagram: 'https://instagram.com/tecnmensenada',
    linkedin: 'https://linkedin.com/school/tecnm-ensenada',
    youtube: 'https://youtube.com/@tecnmensenada',
  },
};

// Utilidad para obtener textos anidados de forma segura
export const getText = (path, defaultValue = '') => {
  return path.split('.').reduce((obj, key) => obj?.[key], SITE_CONFIG) || defaultValue;
};

export default SITE_CONFIG;