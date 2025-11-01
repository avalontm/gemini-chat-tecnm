// src/components/common/AssistantWidget/InteractiveAssistant.jsx

import { useEffect, useState } from 'react';
import AssistantWidget from './AssistantWidget';
import { useAssistantContext } from '@context/AssistantContext';
import { ASSISTANT_CONFIG } from '@config/assistantConfig';

const InteractiveAssistant = () => {
  const assistant = useAssistantContext();
  const [showWidget, setShowWidget] = useState(true);

  useEffect(() => {
    // Asegurar que el widget se muestre al montar
    setShowWidget(true);
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e) => {
      assistant.reactToEvent('click', { target: e.target });
    };

    const handleFormSubmit = (e) => {
      if (e.target.tagName === 'FORM') {
        assistant.reactToEvent('formSubmit');
      }
    };

    const handleError = (e) => {
      assistant.reactToEvent('error', { message: e.message });
    };

    const handlePasswordFocus = (e) => {
      if (e.target.type === 'password') {
        assistant.reactToEvent('passwordFocus');
      }
    };

    const handlePasswordBlur = (e) => {
      if (e.target.type === 'password') {
        assistant.reactToEvent('passwordBlur');
      }
    };

    let typingTimer;
    const handleInput = (e) => {
      if (e.target.type !== 'password') {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          assistant.reactToEvent('typing');
        }, 1000);
      }
    };

    let idleTimer;
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        assistant.reactToEvent('idle');
      }, 60000);
    };

    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('submit', handleFormSubmit);
    document.addEventListener('input', handleInput);
    document.addEventListener('focus', handlePasswordFocus, true);
    document.addEventListener('blur', handlePasswordBlur, true);
    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);
    window.addEventListener('error', handleError);

    resetIdleTimer();

    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('submit', handleFormSubmit);
      document.removeEventListener('input', handleInput);
      document.removeEventListener('focus', handlePasswordFocus, true);
      document.removeEventListener('blur', handlePasswordBlur, true);
      document.removeEventListener('mousemove', resetIdleTimer);
      document.removeEventListener('keypress', resetIdleTimer);
      window.removeEventListener('error', handleError);
      clearTimeout(typingTimer);
      clearTimeout(idleTimer);
    };
  }, [assistant]);

  // Siempre mostrar el widget
  if (!showWidget) return null;

  return (
    <>
      <AssistantWidget
        initialMessage={assistant.currentMessage}
        position={assistant.position}
        autoShow={true}
        showDelay={500}
        customGifs={ASSISTANT_CONFIG?.gifs || {}}
        characterSize="normal"
        bubblePosition="top"
        enableSound={false}
      />

      {assistant.tourActive && (
        <div className="fixed inset-0 bg-black/50 z-30 pointer-events-none">
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-auto">
            <button
              onClick={assistant.previousTourStep}
              disabled={assistant.currentTourStep === 0}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              Anterior
            </button>
            
            <button
              onClick={assistant.nextTourStep}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              {assistant.currentTourStep === assistant.tourSteps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </button>
            
            <button
              onClick={assistant.endTour}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              Saltar Tour
            </button>
          </div>
        </div>
      )}

      <style>{`
        .assistant-highlight {
          position: relative;
          z-index: 1000;
          animation: highlight-pulse 2s ease-in-out infinite;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5),
                      0 0 20px rgba(59, 130, 246, 0.3);
          border-radius: 8px;
        }

        @keyframes highlight-pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5),
                        0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.8),
                        0 0 30px rgba(59, 130, 246, 0.5);
          }
        }
      `}</style>
    </>
  );
};

export default InteractiveAssistant;