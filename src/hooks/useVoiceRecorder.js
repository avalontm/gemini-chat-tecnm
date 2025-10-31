// src/hooks/useVoiceRecorder.js

import { useState, useRef, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const checkSupport = () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsSupported(false);
        setError('Tu navegador no soporta grabacion de audio');
        return false;
      }
      return true;
    };

    checkSupport();
  }, []);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setRecordingTime(0);
  }, [stopTimer]);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      toast.error('Grabacion de audio no soportada');
      return { success: false, error: 'Not supported' };
    }

    try {
      setError(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/wav';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setError('Error durante la grabacion');
        toast.error('Error durante la grabacion');
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      
      setIsRecording(true);
      setIsPaused(false);
      startTimer();
      
      toast.success('Grabacion iniciada');
      return { success: true };
    } catch (err) {
      console.error('Error starting recording:', err);
      let errorMsg = 'Error al iniciar grabacion';
      
      if (err.name === 'NotAllowedError') {
        errorMsg = 'Permiso de microfono denegado';
      } else if (err.name === 'NotFoundError') {
        errorMsg = 'No se encontro microfono';
      } else if (err.name === 'NotReadableError') {
        errorMsg = 'Microfono en uso por otra aplicacion';
      }
      
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, [isSupported, startTimer]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      stopTimer();
      toast.success('Grabacion pausada');
    }
  }, [isRecording, isPaused, stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      startTimer();
      toast.success('Grabacion reanudada');
    }
  }, [isRecording, isPaused, startTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
      toast.success('Grabacion finalizada');
      return { success: true };
    }
    return { success: false, error: 'No active recording' };
  }, [isRecording, stopTimer]);

  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      if (isRecording) {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      chunksRef.current = [];
      setIsRecording(false);
      setIsPaused(false);
      setAudioBlob(null);
      setAudioURL(null);
      resetTimer();
      
      toast.success('Grabacion cancelada');
    }
  }, [isRecording, resetTimer]);

  const clearRecording = useCallback(() => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    
    setAudioBlob(null);
    setAudioURL(null);
    setError(null);
    resetTimer();
  }, [audioURL, resetTimer]);

  const downloadRecording = useCallback((filename = 'recording.webm') => {
    if (!audioBlob) {
      toast.error('No hay grabacion para descargar');
      return { success: false, error: 'No recording available' };
    }

    try {
      const url = URL.createObjectURL(audioBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Audio descargado');
      return { success: true };
    } catch (err) {
      console.error('Error downloading recording:', err);
      toast.error('Error al descargar audio');
      return { success: false, error: err.message };
    }
  }, [audioBlob]);

  const getRecordingFile = useCallback((filename = 'recording.webm') => {
    if (!audioBlob) {
      return null;
    }

    const extension = audioBlob.type.includes('webm') ? 'webm' : 'wav';
    const finalFilename = filename.endsWith(`.${extension}`) 
      ? filename 
      : `${filename}.${extension}`;

    return new File([audioBlob], finalFilename, { 
      type: audioBlob.type,
      lastModified: Date.now(),
    });
  }, [audioBlob]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getRecordingDuration = useCallback(() => {
    return recordingTime;
  }, [recordingTime]);

  const getRecordingSize = useCallback(() => {
    if (!audioBlob) return 0;
    return audioBlob.size;
  }, [audioBlob]);

  const formatRecordingSize = useCallback(() => {
    const size = getRecordingSize();
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return Math.round((size / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }, [getRecordingSize]);

  const hasRecording = useCallback(() => {
    return audioBlob !== null;
  }, [audioBlob]);

  useEffect(() => {
    return () => {
      stopTimer();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL, stopTimer]);

  return {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioURL,
    error,
    isSupported,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
    clearRecording,
    downloadRecording,
    getRecordingFile,
    formatTime,
    getRecordingDuration,
    getRecordingSize,
    formatRecordingSize,
    hasRecording,
  };
};

export default useVoiceRecorder;