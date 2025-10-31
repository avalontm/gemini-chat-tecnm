// src/utils/helpers/storageHelpers.js

import { getStorageKey } from '@config/app.config';

// Verificar si localStorage esta disponible
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};

// Guardar en localStorage
export const setStorage = (key, value, usePrefix = true) => {
  if (!isStorageAvailable()) {
    console.warn('localStorage no esta disponible');
    return false;
  }
  
  try {
    const storageKey = usePrefix ? getStorageKey(key) : key;
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(storageKey, serializedValue);
    return true;
  } catch (error) {
    console.error('Error guardando en localStorage:', error);
    return false;
  }
};

// Obtener de localStorage
export const getStorage = (key, defaultValue = null, usePrefix = true) => {
  if (!isStorageAvailable()) {
    console.warn('localStorage no esta disponible');
    return defaultValue;
  }
  
  try {
    const storageKey = usePrefix ? getStorageKey(key) : key;
    const item = localStorage.getItem(storageKey);
    
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item);
  } catch (error) {
    console.error('Error leyendo de localStorage:', error);
    return defaultValue;
  }
};

// Eliminar de localStorage
export const removeStorage = (key, usePrefix = true) => {
  if (!isStorageAvailable()) {
    console.warn('localStorage no esta disponible');
    return false;
  }
  
  try {
    const storageKey = usePrefix ? getStorageKey(key) : key;
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Error eliminando de localStorage:', error);
    return false;
  }
};

// Limpiar todo el localStorage
export const clearStorage = () => {
  if (!isStorageAvailable()) {
    console.warn('localStorage no esta disponible');
    return false;
  }
  
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
    return false;
  }
};

// Limpiar items con prefijo especifico
export const clearStorageByPrefix = (prefix = null) => {
  if (!isStorageAvailable()) {
    console.warn('localStorage no esta disponible');
    return false;
  }
  
  try {
    const keys = Object.keys(localStorage);
    const targetPrefix = prefix || getStorageKey('');
    
    keys.forEach(key => {
      if (key.startsWith(targetPrefix)) {
        localStorage.removeItem(key);
      }
    });
    
    return true;
  } catch (error) {
    console.error('Error limpiando localStorage por prefijo:', error);
    return false;
  }
};

// Verificar si una clave existe
export const hasStorage = (key, usePrefix = true) => {
  if (!isStorageAvailable()) {
    return false;
  }
  
  const storageKey = usePrefix ? getStorageKey(key) : key;
  return localStorage.getItem(storageKey) !== null;
};

// Obtener todas las claves almacenadas
export const getStorageKeys = (usePrefix = true) => {
  if (!isStorageAvailable()) {
    return [];
  }
  
  try {
    const keys = Object.keys(localStorage);
    
    if (usePrefix) {
      const prefix = getStorageKey('');
      return keys
        .filter(key => key.startsWith(prefix))
        .map(key => key.replace(prefix, ''));
    }
    
    return keys;
  } catch (error) {
    console.error('Error obteniendo claves de localStorage:', error);
    return [];
  }
};

// Obtener tamaño usado del localStorage
export const getStorageSize = () => {
  if (!isStorageAvailable()) {
    return 0;
  }
  
  try {
    let size = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length + key.length;
      }
    }
    return size;
  } catch (error) {
    console.error('Error calculando tamaño de localStorage:', error);
    return 0;
  }
};

// Guardar con expiracion
export const setStorageWithExpiry = (key, value, ttl, usePrefix = true) => {
  if (!isStorageAvailable()) {
    console.warn('localStorage no esta disponible');
    return false;
  }
  
  try {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    
    const storageKey = usePrefix ? getStorageKey(key) : key;
    localStorage.setItem(storageKey, JSON.stringify(item));
    return true;
  } catch (error) {
    console.error('Error guardando con expiracion:', error);
    return false;
  }
};

// Obtener con verificacion de expiracion
export const getStorageWithExpiry = (key, defaultValue = null, usePrefix = true) => {
  if (!isStorageAvailable()) {
    console.warn('localStorage no esta disponible');
    return defaultValue;
  }
  
  try {
    const storageKey = usePrefix ? getStorageKey(key) : key;
    const itemStr = localStorage.getItem(storageKey);
    
    if (!itemStr) {
      return defaultValue;
    }
    
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(storageKey);
      return defaultValue;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error leyendo con expiracion:', error);
    return defaultValue;
  }
};

// Limpiar items expirados
export const cleanExpiredStorage = () => {
  if (!isStorageAvailable()) {
    return 0;
  }
  
  try {
    let cleaned = 0;
    const keys = Object.keys(localStorage);
    const now = new Date();
    
    keys.forEach(key => {
      try {
        const itemStr = localStorage.getItem(key);
        const item = JSON.parse(itemStr);
        
        if (item && item.expiry && now.getTime() > item.expiry) {
          localStorage.removeItem(key);
          cleaned++;
        }
      } catch (error) {
        // Ignorar items que no tienen estructura de expiracion
      }
    });
    
    return cleaned;
  } catch (error) {
    console.error('Error limpiando items expirados:', error);
    return 0;
  }
};

// Guardar multiples items
export const setMultipleStorage = (items, usePrefix = true) => {
  if (!isStorageAvailable()) {
    console.warn('localStorage no esta disponible');
    return false;
  }
  
  try {
    Object.entries(items).forEach(([key, value]) => {
      setStorage(key, value, usePrefix);
    });
    return true;
  } catch (error) {
    console.error('Error guardando multiples items:', error);
    return false;
  }
};

// Obtener multiples items
export const getMultipleStorage = (keys, usePrefix = true) => {
  if (!isStorageAvailable()) {
    return {};
  }
  
  try {
    const result = {};
    keys.forEach(key => {
      result[key] = getStorage(key, null, usePrefix);
    });
    return result;
  } catch (error) {
    console.error('Error obteniendo multiples items:', error);
    return {};
  }
};

// Exportar localStorage completo
export const exportStorage = () => {
  if (!isStorageAvailable()) {
    return null;
  }
  
  try {
    const data = {};
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      data[key] = localStorage.getItem(key);
    });
    
    return data;
  } catch (error) {
    console.error('Error exportando localStorage:', error);
    return null;
  }
};

// Importar localStorage desde objeto
export const importStorage = (data, clearBefore = false) => {
  if (!isStorageAvailable()) {
    console.warn('localStorage no esta disponible');
    return false;
  }
  
  try {
    if (clearBefore) {
      localStorage.clear();
    }
    
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
    
    return true;
  } catch (error) {
    console.error('Error importando localStorage:', error);
    return false;
  }
};

// Guardar en sessionStorage
export const setSessionStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error guardando en sessionStorage:', error);
    return false;
  }
};

// Obtener de sessionStorage
export const getSessionStorage = (key, defaultValue = null) => {
  try {
    const item = sessionStorage.getItem(key);
    
    if (item === null) {
      return defaultValue;
    }
    
    return JSON.parse(item);
  } catch (error) {
    console.error('Error leyendo de sessionStorage:', error);
    return defaultValue;
  }
};

// Eliminar de sessionStorage
export const removeSessionStorage = (key) => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error eliminando de sessionStorage:', error);
    return false;
  }
};

// Limpiar sessionStorage
export const clearSessionStorage = () => {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Error limpiando sessionStorage:', error);
    return false;
  }
};

export default {
  isStorageAvailable,
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  clearStorageByPrefix,
  hasStorage,
  getStorageKeys,
  getStorageSize,
  setStorageWithExpiry,
  getStorageWithExpiry,
  cleanExpiredStorage,
  setMultipleStorage,
  getMultipleStorage,
  exportStorage,
  importStorage,
  setSessionStorage,
  getSessionStorage,
  removeSessionStorage,
  clearSessionStorage,
};