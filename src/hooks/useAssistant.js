// src/hooks/useAssistant.js

import { useState, useCallback, useEffect } from 'react';

export const useAssistant = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('welcome');
  const [currentAnimation, setCurrentAnimation] = useState('idle');
  const [position, setPosition] = useState('bottom-right');
  const [autoHideTimer, setAutoHideTimer] = useState(null);

  const show = useCallback((message = 'welcome', animation = null, autoHideDelay = null) => {
    setCurrentMessage(message);
    
    if (animation) {
      setCurrentAnimation(animation);
    }
    
    setIsVisible(true);

    if (autoHideDelay) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setCurrentAnimation('idle');
      }, autoHideDelay);
      setAutoHideTimer(timer);
    }
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    setCurrentAnimation('idle');
    
    if (autoHideTimer) {
      clearTimeout(autoHideTimer);
      setAutoHideTimer(null);
    }
  }, [autoHideTimer]);

  const showWelcome = useCallback(() => {
    show('welcome', 'wave', 5000);
  }, [show]);

  const showHelp = useCallback(() => {
    show('help', 'talk');
  }, [show]);

  const showThinking = useCallback(() => {
    show('thinking', 'think', 5000);
  }, [show]);

  const showWorking = useCallback(() => {
    show('working', 'work');
  }, [show]);

  const showError = useCallback(() => {
    show('error', 'sad', 8000);
  }, [show]);

  const showSuccess = useCallback(() => {
    show('success', 'happy', 4000);
  }, [show]);

  const showAngry = useCallback(() => {
    show('angry', 'angry', 5000);
  }, [show]);

  const showLaugh = useCallback(() => {
    show('laugh', 'laugh', 4000);
  }, [show]);

  const showConfused = useCallback(() => {
    show('confused', 'confused', 6000);
  }, [show]);

  const showExcited = useCallback(() => {
    show('firstVisit', 'excited', 8000);
  }, [show]);

  const showSleeping = useCallback(() => {
    show('sleeping', 'sleep', 5000);
  }, [show]);

  const playAnimation = useCallback((animationName, duration = 3000) => {
    setCurrentAnimation(animationName);
    
    const timer = setTimeout(() => {
      setCurrentAnimation('idle');
    }, duration);
    
    return () => clearTimeout(timer);
  }, []);

  const changePosition = useCallback((newPosition) => {
    setPosition(newPosition);
  }, []);

  const changeBubbleMessage = useCallback((message) => {
    setCurrentMessage(message);
  }, []);

  useEffect(() => {
    return () => {
      if (autoHideTimer) {
        clearTimeout(autoHideTimer);
      }
    };
  }, [autoHideTimer]);

  return {
    isVisible,
    currentMessage,
    currentAnimation,
    position,
    show,
    hide,
    showWelcome,
    showHelp,
    showThinking,
    showWorking,
    showError,
    showSuccess,
    showAngry,
    showLaugh,
    showConfused,
    showExcited,
    showSleeping,
    playAnimation,
    changePosition,
    changeBubbleMessage,
  };
};