// src/components/common/AssistantWidget/AssistantWidget.jsx

import { useState, useEffect, useRef } from 'react';

const DEFAULT_ASSISTANT_GIFS = {
  idle: '/assets/assistant/idle.gif',
  talk: '/assets/assistant/talk.gif',
  laugh: '/assets/assistant/laugh.gif',
  angry: '/assets/assistant/angry.gif',
  think: '/assets/assistant/think.gif',
  wave: '/assets/assistant/wave.gif',
  happy: '/assets/assistant/happy.gif',
  sad: '/assets/assistant/sad.gif',
  confused: '/assets/assistant/confused.gif',
  excited: '/assets/assistant/excited.gif',
  sleep: '/assets/assistant/sleep.gif',
  work: '/assets/assistant/work.gif',
  coverEyes: '/assets/assistant/cover-eyes.gif',
};

const ASSISTANT_MESSAGES = {
  welcome: {
    text: 'Hola! Soy Gemini Assistant. Estoy aqui para ayudarte con cualquier cosa que necesites.',
    animation: 'wave',
    duration: 5000,
    sound: 'welcome',
  },
  firstVisit: {
    text: 'Bienvenido a Gemini Chat! Soy tu asistente personal. Haz clic en mi si necesitas ayuda!',
    animation: 'excited',
    duration: 8000,
    sound: 'welcome',
  },
  idle: {
    text: 'Tienes alguna pregunta? Estoy aqui para ayudarte!',
    animation: 'idle',
    duration: 6000,
  },
  typing: {
    text: 'Veo que estas escribiendo... Recuerda ser claro y especifico en tu pregunta!',
    animation: 'think',
    duration: 7000,
  },
  error: {
    text: 'Oh no! Parece que algo salio mal. No te preocupes, intentemos de nuevo.',
    animation: 'sad',
    duration: 8000,
    sound: 'error',
  },
  success: {
    text: 'Excelente! Todo funciono perfectamente!',
    animation: 'happy',
    duration: 4000,
    sound: 'success',
  },
  help: {
    text: 'Puedo ayudarte con: Crear conversaciones, enviar mensajes, subir imagenes, y mucho mas! Solo preguntame!',
    animation: 'talk',
    duration: 10000,
  },
  thinking: {
    text: 'Dejame pensar un momento...',
    animation: 'think',
    duration: 5000,
  },
  laugh: {
    text: 'Jaja! Eso fue divertido!',
    animation: 'laugh',
    duration: 4000,
  },
  angry: {
    text: 'Esto no esta bien! Vamos a solucionarlo.',
    animation: 'angry',
    duration: 5000,
  },
  confused: {
    text: 'Hmm... no estoy seguro de entender. Puedes explicarlo de otra forma?',
    animation: 'confused',
    duration: 6000,
  },
  working: {
    text: 'Estoy trabajando en ello, dame un momento...',
    animation: 'work',
    duration: 7000,
  },
  sleeping: {
    text: 'Zzz... Estaba tomando una siesta. Que necesitas?',
    animation: 'sleep',
    duration: 5000,
  },
  coverEyes: {
    text: 'No te preocupes! No estoy mirando tu contrasena!',
    animation: 'coverEyes',
    duration: 0,
  },
};

const AssistantCharacter = ({ 
  animation, 
  onClick, 
  customGifs = {},
  size = 'normal',
  showShadow = true,
  onDragStart,
}) => {
  const gifs = { ...DEFAULT_ASSISTANT_GIFS, ...customGifs };
  const currentGif = gifs[animation] || gifs.idle;

  const sizeClasses = {
    small: 'w-12 h-16 sm:w-16 sm:h-20',
    normal: 'w-20 h-28 sm:w-28 sm:h-36 md:w-32 md:h-44 lg:w-36 lg:h-48',
    large: 'w-28 h-36 sm:w-36 sm:h-44 md:w-40 md:h-52 lg:w-48 lg:h-60',
  };

  return (
    <div 
      onClick={onClick}
      onMouseDown={onDragStart}
      className="cursor-move transform hover:scale-105 transition-all duration-300 relative"
    >
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={currentGif}
            alt={`Assistant ${animation}`}
            className="w-full h-full object-contain drop-shadow-2xl pointer-events-none"
            style={{ imageRendering: 'crisp-edges' }}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="40" fill="%234F46E5"/%3E%3Ccircle cx="35" cy="40" r="5" fill="white"/%3E%3Ccircle cx="65" cy="40" r="5" fill="white"/%3E%3Cpath d="M 30 60 Q 50 70 70 60" stroke="white" stroke-width="3" fill="none"/%3E%3C/svg%3E';
            }}
            draggable="false"
          />
        </div>

        {showShadow && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 sm:w-20 sm:h-3 md:w-24 md:h-3 bg-black/30 rounded-full blur-md pointer-events-none"></div>
        )}
      </div>
    </div>
  );
};

const SpeechBubble = ({ text, position = 'top', assistantPosition }) => {
  const [bubblePosition, setBubblePosition] = useState('top');
  const [horizontalAlign, setHorizontalAlign] = useState('center');
  const [isMobile, setIsMobile] = useState(false);
  const bubbleRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (bubbleRef.current && assistantPosition) {
      const bubbleRect = bubbleRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const assistantX = assistantPosition.x;
      const assistantY = assistantPosition.y;
      
      let newPosition = position;
      let newHorizontalAlign = 'center';
      
      if (assistantY < bubbleRect.height + 100) {
        newPosition = 'bottom';
      } else if (assistantY > viewportHeight - 200) {
        newPosition = 'top';
      }
      
      if (assistantX < 200) {
        newHorizontalAlign = 'left';
      } else if (assistantX > viewportWidth - 200) {
        newHorizontalAlign = 'right';
      }
      
      setBubblePosition(newPosition);
      setHorizontalAlign(newHorizontalAlign);
    }
  }, [assistantPosition, position]);

  const getPositionClasses = () => {
    const positions = {
      top: 'bottom-full mb-4',
      bottom: 'top-full mt-4',
      left: 'right-full mr-4',
      right: 'left-full ml-4',
    };
    return positions[bubblePosition];
  };

  const getHorizontalAlignClasses = () => {
    const aligns = {
      left: 'left-0',
      center: 'left-1/2 -translate-x-1/2',
      right: 'right-0',
    };
    return aligns[horizontalAlign];
  };

  const getArrowClasses = () => {
    const arrows = {
      top: 'absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full',
      bottom: 'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full rotate-180',
      left: 'absolute right-0 top-1/2 -translate-y-1/2 translate-x-full rotate-90',
      right: 'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full -rotate-90',
    };
    return arrows[bubblePosition];
  };

  return (
    <div 
      ref={bubbleRef}
      className={`absolute ${getPositionClasses()} ${getHorizontalAlignClasses()} ${isMobile ? 'w-72' : 'w-96'} max-w-[90vw] animate-bubble-pop z-50 pointer-events-none`}
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-5 md:p-6 border-2 border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="shrink-0 text-lg sm:text-xl md:text-2xl animate-float">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-200 leading-relaxed flex-1">
            {text}
          </p>
        </div>

        <div className={getArrowClasses()}>
          <div className="w-0 h-0 border-l-[8px] sm:border-l-[10px] md:border-l-[12px] border-r-[8px] sm:border-r-[10px] md:border-r-[12px] border-t-[8px] sm:border-t-[10px] md:border-t-[12px] border-transparent border-t-white dark:border-t-slate-800"></div>
          <div className="w-0 h-0 border-l-[8px] sm:border-l-[10px] md:border-l-[12px] border-r-[8px] sm:border-r-[10px] md:border-r-[12px] border-t-[8px] sm:border-t-[10px] md:border-t-[12px] border-transparent border-t-blue-200 dark:border-t-blue-700 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5"></div>
        </div>
      </div>
    </div>
  );
};

const AssistantWidget = ({ 
  initialMessage = 'welcome',
  position = 'bottom-right',
  autoShow = true,
  showDelay = 500,
  customGifs = {},
  characterSize = 'normal',
  bubblePosition = 'top',
  enableSound = false,
}) => {
  const [showBubble, setShowBubble] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(initialMessage);
  const [currentAnimation, setCurrentAnimation] = useState('wave');
  const [soundEnabled, setSoundEnabled] = useState(enableSound);
  const [position2, setPosition2] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const initialPositions = {
      'bottom-right': { 
        x: isMobile ? window.innerWidth - 100 : window.innerWidth - 160, 
        y: isMobile ? window.innerHeight - 140 : window.innerHeight - 220 
      },
      'bottom-left': { 
        x: isMobile ? 20 : 24, 
        y: isMobile ? window.innerHeight - 140 : window.innerHeight - 220 
      },
      'top-right': { 
        x: isMobile ? window.innerWidth - 100 : window.innerWidth - 160, 
        y: isMobile ? 80 : 96 
      },
      'top-left': { 
        x: isMobile ? 20 : 24, 
        y: isMobile ? 80 : 96 
      },
    };
    setPosition2(initialPositions[position] || initialPositions['bottom-right']);
  }, [position, isMobile]);

  useEffect(() => {
    const handlePasswordFocus = (e) => {
      if (e.target.type === 'password') {
        setIsPasswordFocused(true);
        setCurrentMessage('coverEyes');
        setCurrentAnimation('coverEyes');
        setShowBubble(true);
      }
    };

    const handlePasswordBlur = (e) => {
      if (e.target.type === 'password') {
        setIsPasswordFocused(false);
        setShowBubble(false);
        setTimeout(() => {
          setCurrentAnimation('idle');
        }, 300);
      }
    };

    document.addEventListener('focus', handlePasswordFocus, true);
    document.addEventListener('blur', handlePasswordBlur, true);

    return () => {
      document.removeEventListener('focus', handlePasswordFocus, true);
      document.removeEventListener('blur', handlePasswordBlur, true);
    };
  }, []);

  useEffect(() => {
    if (autoShow) {
      const timer = setTimeout(() => {
        setShowBubble(true);
        setCurrentAnimation(ASSISTANT_MESSAGES[initialMessage]?.animation || 'wave');
      }, showDelay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, showDelay, initialMessage]);

  useEffect(() => {
    if (showBubble && currentMessage && !isPasswordFocused) {
      const message = ASSISTANT_MESSAGES[currentMessage];
      if (message) {
        setCurrentAnimation(message.animation);
        
        if (soundEnabled && message.sound) {
          playSound(message.sound);
        }

        if (message.duration > 0) {
          const timer = setTimeout(() => {
            setShowBubble(false);
            setTimeout(() => setCurrentAnimation('idle'), 300);
          }, message.duration);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [showBubble, currentMessage, soundEnabled, isPasswordFocused]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        const widgetWidth = isMobile ? 80 : 144;
        const widgetHeight = isMobile ? 112 : 192;
        
        const maxX = window.innerWidth - widgetWidth;
        const maxY = window.innerHeight - widgetHeight;
        
        setPosition2({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchMove = (e) => {
      if (isDragging && e.touches[0]) {
        const touch = e.touches[0];
        const newX = touch.clientX - dragOffset.x;
        const newY = touch.clientY - dragOffset.y;
        
        const widgetWidth = isMobile ? 80 : 144;
        const widgetHeight = isMobile ? 112 : 192;
        
        const maxX = window.innerWidth - widgetWidth;
        const maxY = window.innerHeight - widgetHeight;
        
        setPosition2({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragOffset, isMobile]);

  const playSound = (soundType) => {
    const audio = new Audio(`/assets/sounds/${soundType}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(() => {
      console.log('Sound playback failed');
    });
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
      
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleCharacterClick = (e) => {
    if (!isDragging) {
      if (!showBubble) {
        setShowBubble(true);
        setCurrentMessage('help');
      } else {
        setShowBubble(false);
      }
    }
  };

  const message = ASSISTANT_MESSAGES[currentMessage] || ASSISTANT_MESSAGES.welcome;

  return (
    <>
      <div 
        ref={widgetRef}
        className="fixed z-40 select-none"
        style={{
          left: `${position2.x}px`,
          top: `${position2.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <div className="relative">
          {showBubble && (
            <SpeechBubble 
              text={message.text}
              position={bubblePosition}
              assistantPosition={position2}
            />
          )}

          <AssistantCharacter 
            animation={currentAnimation}
            onClick={handleCharacterClick}
            customGifs={customGifs}
            size={characterSize}
            onDragStart={handleDragStart}
          />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes bubble-pop {
          0% { 
            opacity: 0;
            transform: translateX(-50%) scale(0.8) translateY(10px);
          }
          100% { 
            opacity: 1;
            transform: translateX(-50%) scale(1) translateY(0);
          }
        }

        .animate-float {
          animation: float 2s ease-in-out infinite;
        }

        .animate-bubble-pop {
          animation: bubble-pop 0.3s ease-out;
        }

        img {
          -webkit-user-drag: none;
          user-select: none;
        }
      `}</style>
    </>
  );
};

export default AssistantWidget;