// src/utils/helpers/dateHelpers.js

import { format, formatDistance, formatRelative, isToday, isYesterday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

// Formatear fecha a formato legible
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: es });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return '';
  }
};

// Formatear fecha y hora
export const formatDateTime = (date, formatStr = 'dd/MM/yyyy HH:mm') => {
  return formatDate(date, formatStr);
};

// Formatear solo hora
export const formatTime = (date, formatStr = 'HH:mm') => {
  return formatDate(date, formatStr);
};

// Formatear fecha con hora en formato 12h
export const formatDateTime12h = (date) => {
  return formatDate(date, 'dd/MM/yyyy hh:mm a');
};

// Formatear fecha relativa (hace 2 horas, ayer, etc)
export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatRelative(dateObj, new Date(), { locale: es });
  } catch (error) {
    console.error('Error formateando fecha relativa:', error);
    return '';
  }
};

// Formatear distancia de tiempo (hace 2 horas, en 3 dias)
export const formatTimeDistance = (date, addSuffix = true) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { 
      locale: es, 
      addSuffix 
    });
  } catch (error) {
    console.error('Error formateando distancia de tiempo:', error);
    return '';
  }
};

// Formatear fecha inteligente (hoy: hora, ayer: ayer, otro: fecha completa)
export const formatSmartDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (isToday(dateObj)) {
      return formatTime(dateObj);
    }
    
    if (isYesterday(dateObj)) {
      return 'Ayer';
    }
    
    const daysDiff = Math.floor((new Date() - dateObj) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 7) {
      return format(dateObj, 'EEEE', { locale: es });
    }
    
    return formatDate(dateObj);
  } catch (error) {
    console.error('Error formateando fecha inteligente:', error);
    return '';
  }
};

// Formatear fecha para chat (Hoy 10:30, Ayer 15:45, 01/01/2024)
export const formatChatDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (isToday(dateObj)) {
      return `Hoy ${formatTime(dateObj)}`;
    }
    
    if (isYesterday(dateObj)) {
      return `Ayer ${formatTime(dateObj)}`;
    }
    
    return formatDate(dateObj, 'dd/MM/yyyy');
  } catch (error) {
    console.error('Error formateando fecha de chat:', error);
    return '';
  }
};

// Obtener timestamp actual
export const getCurrentTimestamp = () => {
  return new Date().getTime();
};

// Obtener fecha ISO actual
export const getCurrentISODate = () => {
  return new Date().toISOString();
};

// Verificar si una fecha es hoy
export const isTodayDate = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isToday(dateObj);
  } catch (error) {
    return false;
  }
};

// Verificar si una fecha es ayer
export const isYesterdayDate = (date) => {
  if (!date) return false;
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return isYesterday(dateObj);
  } catch (error) {
    return false;
  }
};

// Calcular diferencia en dias
export const getDaysDifference = (date1, date2 = new Date()) => {
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    console.error('Error calculando diferencia de dias:', error);
    return 0;
  }
};

// Calcular diferencia en horas
export const getHoursDifference = (date1, date2 = new Date()) => {
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    
    const diffTime = Math.abs(d2 - d1);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    return diffHours;
  } catch (error) {
    console.error('Error calculando diferencia de horas:', error);
    return 0;
  }
};

// Calcular diferencia en minutos
export const getMinutesDifference = (date1, date2 = new Date()) => {
  try {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    
    const diffTime = Math.abs(d2 - d1);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    return diffMinutes;
  } catch (error) {
    console.error('Error calculando diferencia de minutos:', error);
    return 0;
  }
};

// Verificar si una fecha es valida
export const isValidDate = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return dateObj instanceof Date && !isNaN(dateObj);
  } catch (error) {
    return false;
  }
};

// Parsear fecha desde string
export const parseDate = (dateString) => {
  try {
    return parseISO(dateString);
  } catch (error) {
    console.error('Error parseando fecha:', error);
    return null;
  }
};

// Agregar dias a una fecha
export const addDays = (date, days) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    const result = new Date(dateObj);
    result.setDate(result.getDate() + days);
    return result;
  } catch (error) {
    console.error('Error agregando dias:', error);
    return null;
  }
};

// Restar dias a una fecha
export const subtractDays = (date, days) => {
  return addDays(date, -days);
};

// Obtener inicio del dia
export const getStartOfDay = (date = new Date()) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    return dateObj;
  } catch (error) {
    console.error('Error obteniendo inicio del dia:', error);
    return null;
  }
};

// Obtener fin del dia
export const getEndOfDay = (date = new Date()) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
    dateObj.setHours(23, 59, 59, 999);
    return dateObj;
  } catch (error) {
    console.error('Error obteniendo fin del dia:', error);
    return null;
  }
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatDateTime12h,
  formatRelativeDate,
  formatTimeDistance,
  formatSmartDate,
  formatChatDate,
  getCurrentTimestamp,
  getCurrentISODate,
  isTodayDate,
  isYesterdayDate,
  getDaysDifference,
  getHoursDifference,
  getMinutesDifference,
  isValidDate,
  parseDate,
  addDays,
  subtractDays,
  getStartOfDay,
  getEndOfDay,
};