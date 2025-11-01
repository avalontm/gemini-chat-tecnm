// src/hooks/useAssistantActions.js

import { useCallback } from 'react';
import { useAssistantContext } from '@context/AssistantContext';

export const useAssistantActions = () => {
  const assistant = useAssistantContext();

  const onSuccess = useCallback((message = null) => {
    assistant.reactToEvent('success', { message });
  }, [assistant]);

  const onError = useCallback((message = null) => {
    assistant.reactToEvent('error', { message });
  }, [assistant]);

  const onLoading = useCallback(() => {
    assistant.reactToEvent('loading');
  }, [assistant]);

  const onUploadStart = useCallback(() => {
    assistant.reactToEvent('uploadStart');
  }, [assistant]);

  const onUploadSuccess = useCallback(() => {
    assistant.reactToEvent('uploadSuccess');
  }, [assistant]);

  const onUploadError = useCallback(() => {
    assistant.reactToEvent('uploadError');
  }, [assistant]);

  const showTourButton = useCallback(() => {
    const path = window.location.pathname.split('/')[1] || 'home';
    assistant.startTour(path);
  }, [assistant]);

  const highlightButton = useCallback((selector, message) => {
    assistant.pointToElement(selector, message);
  }, [assistant]);

  const celebrate = useCallback(() => {
    assistant.celebrate();
  }, [assistant]);

  const askHelp = useCallback((message = null) => {
    assistant.showHelp(message);
  }, [assistant]);

  const giveTip = useCallback((tip) => {
    assistant.showTip(tip);
  }, [assistant]);

  return {
    onSuccess,
    onError,
    onLoading,
    onUploadStart,
    onUploadSuccess,
    onUploadError,
    showTourButton,
    highlightButton,
    celebrate,
    askHelp,
    giveTip,
  };
};