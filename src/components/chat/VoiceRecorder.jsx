// src/components/Chat/VoiceRecorder.jsx

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';

function VoiceRecorder({ onTranscript, disabled = false }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    // Verificar si el navegador soporta Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    // Inicializar reconocimiento de voz
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-MX';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('[VOICE] Grabación iniciada');
      setIsRecording(true);
      setError(null);
      setRetryCount(0);
      
      // Timeout de seguridad (30 segundos máximo)
      timeoutRef.current = setTimeout(() => {
        console.log('[VOICE] Timeout alcanzado, deteniendo grabación');
        recognition.stop();
      }, 30000);
    };

    recognition.onresult = (event) => {
      console.log('[VOICE] Resultado recibido');
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;
      console.log('[VOICE] Transcripción:', transcript, 'Confianza:', confidence);
      
      if (transcript && transcript.trim()) {
        onTranscript(transcript.trim());
        setError(null);
        setRetryCount(0);
      }
    };

    recognition.onerror = (event) => {
      console.error('[VOICE] Error:', event.error);
      
      let errorMessage = 'Error en el reconocimiento de voz';
      let shouldRetry = false;
      
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No se detectó voz. Intenta de nuevo.';
          break;
        case 'audio-capture':
          errorMessage = 'No se pudo acceder al micrófono';
          break;
        case 'not-allowed':
          errorMessage = 'Permiso de micrófono denegado';
          break;
        case 'network':
          errorMessage = 'Error de conexión. Verifica tu internet.';
          shouldRetry = retryCount < 2;
          if (shouldRetry) {
            errorMessage = `Error de red. Reintentando... (${retryCount + 1}/3)`;
          }
          break;
        case 'aborted':
          errorMessage = 'Grabación cancelada';
          break;
        case 'service-not-allowed':
          errorMessage = 'Servicio de reconocimiento no disponible';
          break;
        default:
          errorMessage = `Error: ${event.error}`;
      }
      
      // SIEMPRE restaurar el estado del botón
      setIsRecording(false);
      setIsProcessing(false);
      setError(errorMessage);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Auto-reintentar en errores de red
      if (shouldRetry) {
        console.log('[VOICE] Reintentando en 1 segundo...');
        setRetryCount(prev => prev + 1);
        
        errorTimeoutRef.current = setTimeout(() => {
          setError(null);
          startRecording();
        }, 1000);
      } else {
        // Limpiar error después de 5 segundos y resetear contador
        errorTimeoutRef.current = setTimeout(() => {
          setError(null);
          setRetryCount(0);
        }, 5000);
      }
    };

    recognition.onend = () => {
      console.log('[VOICE] Grabación finalizada');
      
      // SIEMPRE restaurar el estado del botón
      setIsRecording(false);
      setIsProcessing(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [onTranscript, retryCount]);

  const startRecording = () => {
    if (!recognitionRef.current || disabled) return;
    
    try {
      setError(null);
      recognitionRef.current.start();
    } catch (err) {
      console.error('[VOICE] Error al iniciar:', err);
      
      // Si ya está grabando, ignorar el error
      if (err.name === 'InvalidStateError') {
        console.log('[VOICE] Ya está grabando, ignorando');
        return;
      }
      
      setError('No se pudo iniciar la grabación');
      
      // Limpiar error después de 3 segundos
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const stopRecording = () => {
    if (!recognitionRef.current) return;
    
    try {
      setIsProcessing(true);
      recognitionRef.current.stop();
    } catch (err) {
      console.error('[VOICE] Error al detener:', err);
      
      // Forzar restauración del estado en caso de error
      setIsRecording(false);
      setIsProcessing(false);
      setError('Error al detener grabación');
      
      // Auto-limpiar error
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Limpiar error después de cierto tiempo
  useEffect(() => {
    if (error && !isRecording && !isProcessing) {
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
        setRetryCount(0);
      }, 5000);
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [error, isRecording, isProcessing]);

  const getButtonColor = () => {
    if (error) return 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
    if (isRecording) return 'bg-red-500 text-white animate-pulse';
    return 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700';
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled || isProcessing}
        className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group relative ${getButtonColor()}`}
        title={
          error
            ? error
            : isRecording
            ? 'Detener grabación (click)'
            : 'Grabar mensaje de voz'
        }
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : error && !isRecording ? (
          <AlertCircle className="w-5 h-5" />
        ) : isRecording ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
        
        {!isRecording && !error && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            Grabar voz (requiere internet)
          </span>
        )}
      </button>

      {/* Indicador de grabación activa */}
      {isRecording && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      )}

      {/* Mensaje de error flotante */}
      {error && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-red-500 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-50 animate-in fade-in slide-in-from-bottom-2"
          style={{ maxWidth: '200px', whiteSpace: 'normal' }}
        >
          {error}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45" />
        </div>
      )}
    </div>
  );
}

export default VoiceRecorder;