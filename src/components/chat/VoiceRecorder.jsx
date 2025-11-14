// src/components/Chat/VoiceRecorder.jsx

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, AlertCircle } from 'lucide-react';
import { geminiAPI } from '@api/endpoints/gemini.api';

function VoiceRecorder({ onTranscript, disabled = false }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const errorTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      stopRecording();
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    if (disabled) return;

    try {
      setError(null);
      audioChunksRef.current = [];
      setRecordingDuration(0);

      console.log('[VOICE] Solicitando acceso al microfono...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';

      console.log('[VOICE] Usando formato:', mimeType);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('[VOICE] Chunk de audio recibido:', event.data.size, 'bytes');
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('[VOICE] Grabacion detenida, procesando audio...');
        
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }

        if (audioChunksRef.current.length === 0) {
          console.error('[VOICE] No se grabaron chunks de audio');
          setError('No se pudo grabar audio');
          setIsRecording(false);
          setIsProcessing(false);
          return;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('[VOICE] Blob creado:', audioBlob.size, 'bytes', audioBlob.type);

        if (audioBlob.size < 1000) {
          console.error('[VOICE] Audio muy corto');
          setError('Audio demasiado corto. Intenta de nuevo.');
          setIsRecording(false);
          setIsProcessing(false);
          
          errorTimeoutRef.current = setTimeout(() => {
            setError(null);
          }, 3000);
          return;
        }

        await transcribeAudio(audioBlob);
      };

      mediaRecorder.onerror = (event) => {
        console.error('[VOICE] Error en MediaRecorder:', event.error);
        setError('Error al grabar audio');
        setIsRecording(false);
        setIsProcessing(false);
        
        errorTimeoutRef.current = setTimeout(() => {
          setError(null);
        }, 3000);
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      console.log('[VOICE] Grabacion iniciada');

      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('[VOICE] Error al iniciar grabacion:', err);
      
      let errorMessage = 'No se pudo acceder al microfono';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = 'Permiso de microfono denegado';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage = 'No se encontro microfono';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage = 'Microfono en uso por otra aplicacion';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Configuracion de audio no soportada';
      } else if (err.name === 'TypeError') {
        errorMessage = 'Navegador no soporta grabacion de audio';
      }
      
      setError(errorMessage);
      setIsRecording(false);
      setIsProcessing(false);
      
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('[VOICE] Deteniendo grabacion...');
      setIsProcessing(true);
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const transcribeAudio = async (audioBlob) => {
    setIsProcessing(true);
    
    try {
      console.log('[VOICE] Enviando audio al servidor para transcribir...');
      
      const response = await geminiAPI.transcribeAudio(audioBlob);
      
      if (response.data && response.data.data && response.data.data.transcription) {
        const transcription = response.data.data.transcription.trim();
        
        console.log('[VOICE] Transcripcion recibida:', transcription);
        
        if (transcription) {
          onTranscript(transcription);
          setError(null);
        } else {
          setError('No se detecto voz en el audio');
          
          errorTimeoutRef.current = setTimeout(() => {
            setError(null);
          }, 3000);
        }
      } else {
        throw new Error('Respuesta invalida del servidor');
      }
      
    } catch (err) {
      console.error('[VOICE] Error al transcribir:', err);
      
      let errorMessage = 'Error al transcribir audio';
      
      if (err.response) {
        const status = err.response.status;
        const serverMessage = err.response.data?.message;
        
        if (status === 400) {
          errorMessage = serverMessage || 'Formato de audio no valido';
        } else if (status === 401) {
          errorMessage = 'Sesion expirada. Inicia sesion nuevamente';
        } else if (status === 413) {
          errorMessage = 'Audio muy largo (max 25MB)';
        } else if (status === 429) {
          errorMessage = 'Demasiadas solicitudes. Espera un momento';
        } else if (status >= 500) {
          errorMessage = 'Error del servidor. Intenta mas tarde';
        } else if (serverMessage) {
          errorMessage = serverMessage;
        }
      } else if (err.message === 'Network Error') {
        errorMessage = 'Sin conexion a internet';
      }
      
      setError(errorMessage);
      
      errorTimeoutRef.current = setTimeout(() => {
        setError(null);
      }, 5000);
      
    } finally {
      setIsRecording(false);
      setIsProcessing(false);
      setRecordingDuration(0);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getButtonColor = () => {
    if (error) return 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
    if (isRecording) return 'bg-red-500 text-white animate-pulse';
    return 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700';
  };

  const getTooltipText = () => {
    if (error) return error;
    if (isProcessing) return 'Transcribiendo audio...';
    if (isRecording) return `Grabando... ${formatDuration(recordingDuration)} (click para detener)`;
    return 'Grabar mensaje de voz';
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleRecording}
        disabled={disabled || isProcessing}
        className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group relative ${getButtonColor()}`}
        title={getTooltipText()}
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
        
        {!isRecording && !error && !isProcessing && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            Grabar voz
          </span>
        )}
      </button>

      {isRecording && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      )}

      {isRecording && recordingDuration > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap z-50 animate-in fade-in slide-in-from-bottom-2">
          {formatDuration(recordingDuration)}
        </div>
      )}

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