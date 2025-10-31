// src/hooks/useFileUpload.js

import { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_CONFIG } from '@config/api.config';
import { APP_CONFIG } from '@config/app.config';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useFileUpload = () => {
  const { token } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const abortControllerRef = useRef(null);

  const validateFile = useCallback((file, type = 'image') => {
    if (!file) {
      return { valid: false, error: 'No se ha seleccionado ningun archivo' };
    }

    const maxSizes = {
      image: parseInt(import.meta.env.VITE_MAX_IMAGE_SIZE) || 5242880,
      audio: parseInt(import.meta.env.VITE_MAX_AUDIO_SIZE) || 10485760,
      pdf: parseInt(import.meta.env.VITE_MAX_PDF_SIZE) || 10485760,
      file: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760,
    };

    const allowedTypes = {
      image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      audio: ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/webm'],
      pdf: ['application/pdf'],
      file: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'audio/wav', 'audio/mp3'],
    };

    if (!allowedTypes[type].includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de archivo no permitido. Permitidos: ${allowedTypes[type].join(', ')}`,
      };
    }

    if (file.size > maxSizes[type]) {
      const maxSizeMB = (maxSizes[type] / (1024 * 1024)).toFixed(2);
      return {
        valid: false,
        error: `El archivo excede el tamano maximo de ${maxSizeMB}MB`,
      };
    }

    return { valid: true };
  }, []);

  const generatePreview = useCallback((file) => {
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({
          type: 'image',
          url: reader.result,
          name: file.name,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setPreview({
        type: 'pdf',
        name: file.name,
        size: file.size,
      });
    } else if (file.type.startsWith('audio/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({
          type: 'audio',
          url: reader.result,
          name: file.name,
          size: file.size,
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const uploadImage = useCallback(async (file, conversationId = null) => {
    const validation = validateFile(file, 'image');
    if (!validation.valid) {
      setError(validation.error);
      toast.error(validation.error);
      return { success: false, error: validation.error };
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      abortControllerRef.current = new AbortController();

      const formData = new FormData();
      formData.append('image', file);
      if (conversationId) {
        formData.append('conversationId', conversationId);
      }

      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.gemini.image}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          signal: abortControllerRef.current.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setUploadedFile(response.data);
      toast.success('Imagen subida exitosamente');
      return { success: true, data: response.data };
    } catch (err) {
      if (axios.isCancel(err)) {
        setError('Subida cancelada');
        toast.error('Subida cancelada');
        return { success: false, error: 'Subida cancelada' };
      }

      console.error('Error subiendo imagen:', err);
      const errorMsg = err.response?.data?.message || 'Error al subir imagen';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  }, [token, validateFile]);

  const uploadAudio = useCallback(async (file, conversationId = null) => {
    const validation = validateFile(file, 'audio');
    if (!validation.valid) {
      setError(validation.error);
      toast.error(validation.error);
      return { success: false, error: validation.error };
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      abortControllerRef.current = new AbortController();

      const formData = new FormData();
      formData.append('audio', file);
      if (conversationId) {
        formData.append('conversationId', conversationId);
      }

      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.gemini.voice}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          signal: abortControllerRef.current.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setUploadedFile(response.data);
      toast.success('Audio subido exitosamente');
      return { success: true, data: response.data };
    } catch (err) {
      if (axios.isCancel(err)) {
        setError('Subida cancelada');
        toast.error('Subida cancelada');
        return { success: false, error: 'Subida cancelada' };
      }

      console.error('Error subiendo audio:', err);
      const errorMsg = err.response?.data?.message || 'Error al subir audio';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  }, [token, validateFile]);

  const uploadPDF = useCallback(async (file, conversationId = null) => {
    const validation = validateFile(file, 'pdf');
    if (!validation.valid) {
      setError(validation.error);
      toast.error(validation.error);
      return { success: false, error: validation.error };
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);

      abortControllerRef.current = new AbortController();

      const formData = new FormData();
      formData.append('pdf', file);
      if (conversationId) {
        formData.append('conversationId', conversationId);
      }

      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.gemini.pdf}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          signal: abortControllerRef.current.signal,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      setUploadedFile(response.data);
      toast.success('PDF subido exitosamente');
      return { success: true, data: response.data };
    } catch (err) {
      if (axios.isCancel(err)) {
        setError('Subida cancelada');
        toast.error('Subida cancelada');
        return { success: false, error: 'Subida cancelada' };
      }

      console.error('Error subiendo PDF:', err);
      const errorMsg = err.response?.data?.message || 'Error al subir PDF';
      setError(errorMsg);
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  }, [token, validateFile]);

  const uploadFile = useCallback(async (file, conversationId = null) => {
    if (!file) {
      toast.error('No se ha seleccionado ningun archivo');
      return { success: false, error: 'No file selected' };
    }

    if (file.type.startsWith('image/')) {
      return uploadImage(file, conversationId);
    } else if (file.type.startsWith('audio/')) {
      return uploadAudio(file, conversationId);
    } else if (file.type === 'application/pdf') {
      return uploadPDF(file, conversationId);
    } else {
      toast.error('Tipo de archivo no soportado');
      return { success: false, error: 'Unsupported file type' };
    }
  }, [uploadImage, uploadAudio, uploadPDF]);

  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setUploading(false);
      setUploadProgress(0);
      toast.success('Subida cancelada');
    }
  }, []);

  const clearPreview = useCallback(() => {
    setPreview(null);
    setUploadedFile(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setUploadProgress(0);
    setUploadedFile(null);
    setError(null);
    setPreview(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }, []);

  const getFileExtension = useCallback((filename) => {
    return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
  }, []);

  const isImageFile = useCallback((file) => {
    return file && file.type.startsWith('image/');
  }, []);

  const isAudioFile = useCallback((file) => {
    return file && file.type.startsWith('audio/');
  }, []);

  const isPDFFile = useCallback((file) => {
    return file && file.type === 'application/pdf';
  }, []);

  return {
    uploading,
    uploadProgress,
    uploadedFile,
    error,
    preview,
    uploadImage,
    uploadAudio,
    uploadPDF,
    uploadFile,
    validateFile,
    generatePreview,
    cancelUpload,
    clearPreview,
    clearError,
    reset,
    formatFileSize,
    getFileExtension,
    isImageFile,
    isAudioFile,
    isPDFFile,
  };
};

export default useFileUpload;