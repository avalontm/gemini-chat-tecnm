// src/context/AssistantContext.jsx

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AssistantContext = createContext(undefined);

const ASSISTANT_TOURS = {
  home: [
    {
      target: '.hero-section',
      message: 'Esta es la pagina principal. Desde aqui puedes registrarte o iniciar sesion!',
      animation: 'talk',
      duration: 6000,
    },
    {
      target: '.features-section',
      message: 'Aqui puedes ver todas las caracteristicas increibles de Gemini Chat!',
      animation: 'excited',
      duration: 5000,
    },
  ],
  chat: [
    {
      target: '.chat-input',
      message: 'Escribe tu mensaje aqui! Puedes preguntarme cualquier cosa.',
      animation: 'talk',
      duration: 6000,
    },
    {
      target: '.sidebar',
      message: 'Aqui encontraras todas tus conversaciones anteriores.',
      animation: 'wave',
      duration: 5000,
    },
    {
      target: '.file-upload-button',
      message: 'Puedes subir imagenes, PDFs o grabar audio!',
      animation: 'excited',
      duration: 6000,
    },
  ],
  login: [
    {
      target: '.login-form',
      message: 'Ingresa tus credenciales aqui para acceder a tu cuenta.',
      animation: 'talk',
      duration: 5000,
    },
  ],
  register: [
    {
      target: '.register-form',
      message: 'Completa este formulario para crear tu cuenta. Es rapido y facil!',
      animation: 'happy',
      duration: 6000,
    },
  ],
};

export const AssistantProvider = ({ children }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('welcome');
  const [currentAnimation, setCurrentAnimation] = useState('wave');
  const [position, setPosition] = useState('bottom-right');
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [tourActive, setTourActive] = useState(false);
  const [tourSteps, setTourSteps] = useState([]);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [interactions, setInteractions] = useState({
    clicks: 0,
    formSubmits: 0,
    errors: 0,
    successes: 0,
  });

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('assistant_welcome_shown');
    
    setIsVisible(true);
    
    if (!hasSeenWelcome) {
      setTimeout(() => {
        show('firstVisit', 'excited');
        localStorage.setItem('assistant_welcome_shown', 'true');
      }, 2000);
    } else {
      setTimeout(() => {
        show('welcome', 'wave');
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'home';
    
    const messages = {
      '': 'Bienvenido a Gemini Chat! Te gustaria un tour?',
      home: 'Bienvenido a Gemini Chat! Te gustaria un tour?',
      chat: 'Aqui puedes chatear con la IA. Necesitas ayuda?',
      login: 'Ingresa tus credenciales para comenzar!',
      register: 'Crea tu cuenta y empieza a usar Gemini Chat!',
      profile: 'Aqui puedes ver y editar tu perfil.',
    };

    if (messages[path]) {
      setTimeout(() => {
        setCurrentMessage(messages[path]);
        show('custom', 'wave');
      }, 1000);
    }
  }, [location]);

  const show = useCallback((message = 'welcome', animation = 'idle', duration = null) => {
    setCurrentMessage(message);
    setCurrentAnimation(animation);
    setIsVisible(true);

    if (duration) {
      setTimeout(() => {
        setCurrentAnimation('idle');
      }, duration);
    }
  }, []);

  const hide = useCallback(() => {
    setCurrentAnimation('idle');
    setHighlightedElement(null);
  }, []);

  const startTour = useCallback((tourName) => {
    const tour = ASSISTANT_TOURS[tourName];
    
    if (!tour) {
      console.warn(`Tour "${tourName}" no encontrado`);
      return;
    }

    setTourSteps(tour);
    setCurrentTourStep(0);
    setTourActive(true);
    setIsVisible(true);

    const firstStep = tour[0];
    setCurrentMessage(firstStep.message);
    setCurrentAnimation(firstStep.animation);
    
    if (firstStep.target) {
      highlightElement(firstStep.target);
    }
  }, []);

  const nextTourStep = useCallback(() => {
    if (currentTourStep < tourSteps.length - 1) {
      const nextStep = currentTourStep + 1;
      setCurrentTourStep(nextStep);
      
      const step = tourSteps[nextStep];
      setCurrentMessage(step.message);
      setCurrentAnimation(step.animation);
      
      if (step.target) {
        highlightElement(step.target);
      }

      setTimeout(() => {
        setCurrentAnimation('idle');
      }, step.duration);
    } else {
      endTour();
    }
  }, [currentTourStep, tourSteps]);

  const previousTourStep = useCallback(() => {
    if (currentTourStep > 0) {
      const prevStep = currentTourStep - 1;
      setCurrentTourStep(prevStep);
      
      const step = tourSteps[prevStep];
      setCurrentMessage(step.message);
      setCurrentAnimation(step.animation);
      
      if (step.target) {
        highlightElement(step.target);
      }
    }
  }, [currentTourStep, tourSteps]);

  const endTour = useCallback(() => {
    setTourActive(false);
    setTourSteps([]);
    setCurrentTourStep(0);
    setHighlightedElement(null);
    setCurrentAnimation('happy');
    setCurrentMessage('Genial! Terminamos el tour. Si necesitas mas ayuda, solo haz clic en mi!');
    
    setTimeout(() => {
      setCurrentAnimation('idle');
    }, 5000);
  }, []);

  const highlightElement = useCallback((selector) => {
    const element = document.querySelector(selector);
    
    if (element) {
      setHighlightedElement(selector);
      
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      element.classList.add('assistant-highlight');
      
      setTimeout(() => {
        element.classList.remove('assistant-highlight');
      }, 6000);
    }
  }, []);

  const pointToElement = useCallback((selector, message, animation = 'talk', duration = 6000) => {
    highlightElement(selector);
    show('custom', animation, duration);
    setCurrentMessage(message);
  }, [highlightElement, show]);

  const reactToEvent = useCallback((eventType, data = {}) => {
    switch (eventType) {
      case 'click':
        setInteractions(prev => ({ ...prev, clicks: prev.clicks + 1 }));
        break;
        
      case 'formSubmit':
        setInteractions(prev => ({ ...prev, formSubmits: prev.formSubmits + 1 }));
        show('working', 'work', 5000);
        setCurrentMessage('Enviando formulario...');
        break;
        
      case 'error':
        setInteractions(prev => ({ ...prev, errors: prev.errors + 1 }));
        show('error', 'sad', 8000);
        setCurrentMessage(data.message || 'Oh no! Algo salio mal. Intentemos de nuevo.');
        break;
        
      case 'success':
        setInteractions(prev => ({ ...prev, successes: prev.successes + 1 }));
        show('success', 'happy', 5000);
        setCurrentMessage(data.message || 'Excelente! Todo funciono perfectamente!');
        break;
        
      case 'typing':
        show('typing', 'think', 7000);
        setCurrentMessage('Veo que estas escribiendo... Recuerda ser claro!');
        break;
        
      case 'idle':
        if (interactions.clicks === 0 && isVisible) {
          setTimeout(() => {
            show('idle', 'wave', 6000);
            setCurrentMessage('Necesitas ayuda con algo?');
          }, 30000);
        }
        break;
        
      case 'loading':
        show('working', 'work');
        setCurrentMessage('Cargando... dame un momento!');
        break;
        
      case 'uploadStart':
        show('working', 'work');
        setCurrentMessage('Subiendo archivo... no te preocupes, estoy en ello!');
        break;
        
      case 'uploadSuccess':
        show('success', 'happy', 4000);
        setCurrentMessage('Archivo subido exitosamente!');
        break;
        
      case 'uploadError':
        show('error', 'sad', 6000);
        setCurrentMessage('No pude subir el archivo. Intentemos de nuevo.');
        break;
        
      case 'firstMessage':
        show('excited', 'excited', 6000);
        setCurrentMessage('Genial! Tu primer mensaje! Estoy procesandolo...');
        break;
        
      case 'longWait':
        show('sleep', 'sleep', 5000);
        setCurrentMessage('Zzz... parece que me dormi. Sigues ahi?');
        break;
        
      case 'passwordFocus':
        show('coverEyes', 'coverEyes');
        setCurrentMessage('No te preocupes! No estoy mirando tu contrasena!');
        break;
        
      case 'passwordBlur':
        hide();
        break;

      default:
        console.log(`Evento no manejado: ${eventType}`);
    }
  }, [interactions, isVisible, show]);

  const celebrate = useCallback(() => {
    show('success', 'laugh', 5000);
    setCurrentMessage('Woohoo! Lo lograste!');
  }, [show]);

  const showHelp = useCallback((helpMessage = null) => {
    show('help', 'talk', 10000);
    setCurrentMessage(
      helpMessage || 
      'Puedo ayudarte con: Crear conversaciones, enviar mensajes, subir archivos, y mucho mas!'
    );
  }, [show]);

  const showTip = useCallback((tip) => {
    show('custom', 'think', 8000);
    setCurrentMessage(`Tip: ${tip}`);
  }, [show]);

  const askQuestion = useCallback((question, onYes, onNo) => {
    show('custom', 'confused', null);
    setCurrentMessage(question);
  }, [show]);

  const value = {
    isVisible,
    currentMessage,
    currentAnimation,
    position,
    highlightedElement,
    tourActive,
    tourSteps,
    currentTourStep,
    interactions,
    show,
    hide,
    startTour,
    nextTourStep,
    previousTourStep,
    endTour,
    highlightElement,
    pointToElement,
    reactToEvent,
    celebrate,
    showHelp,
    showTip,
    askQuestion,
    setPosition,
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistantContext = () => {
  const context = useContext(AssistantContext);
  
  if (context === undefined) {
    throw new Error('useAssistantContext debe ser usado dentro de un AssistantProvider');
  }
  
  return context;
};

export { AssistantContext };
export default AssistantContext;