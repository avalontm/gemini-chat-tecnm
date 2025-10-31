// src/utils/helpers/stringHelpers.js

// Capitalizar primera letra
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Capitalizar cada palabra
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

// Convertir a mayusculas
export const toUpperCase = (str) => {
  if (!str) return '';
  return str.toUpperCase();
};

// Convertir a minusculas
export const toLowerCase = (str) => {
  if (!str) return '';
  return str.toLowerCase();
};

// Truncar texto
export const truncate = (str, maxLength, suffix = '...') => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - suffix.length) + suffix;
};

// Truncar texto por palabras
export const truncateWords = (str, maxWords, suffix = '...') => {
  if (!str) return '';
  
  const words = str.split(' ');
  if (words.length <= maxWords) return str;
  
  return words.slice(0, maxWords).join(' ') + suffix;
};

// Slugify (convertir a URL friendly)
export const slugify = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .trim()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Generar ID aleatorio
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Generar UUID v4
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Extraer iniciales
export const getInitials = (str, maxLength = 2) => {
  if (!str) return '';
  
  const words = str.trim().split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return '';
  if (words.length === 1) return words[0].substring(0, maxLength).toUpperCase();
  
  return words
    .slice(0, maxLength)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

// Limpiar espacios extras
export const cleanSpaces = (str) => {
  if (!str) return '';
  return str.trim().replace(/\s+/g, ' ');
};

// Remover acentos
export const removeAccents = (str) => {
  if (!str) return '';
  
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// Contar palabras
export const countWords = (str) => {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
};

// Contar caracteres sin espacios
export const countCharacters = (str, includeSpaces = true) => {
  if (!str) return 0;
  return includeSpaces ? str.length : str.replace(/\s/g, '').length;
};

// Verificar si es un string vacio
export const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

// Verificar si contiene solo numeros
export const isNumeric = (str) => {
  if (!str) return false;
  return /^\d+$/.test(str);
};

// Verificar si contiene solo letras
export const isAlpha = (str) => {
  if (!str) return false;
  return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(str);
};

// Verificar si contiene solo letras y numeros
export const isAlphanumeric = (str) => {
  if (!str) return false;
  return /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(str);
};

// Escapar HTML
export const escapeHtml = (str) => {
  if (!str) return '';
  
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  };
  
  return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
};

// Unescapar HTML
export const unescapeHtml = (str) => {
  if (!str) return '';
  
  const htmlEntities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/',
  };
  
  return str.replace(/&[^;]+;/g, (entity) => htmlEntities[entity] || entity);
};

// Extraer numeros de un string
export const extractNumbers = (str) => {
  if (!str) return '';
  return str.replace(/\D/g, '');
};

// Extraer letras de un string
export const extractLetters = (str) => {
  if (!str) return '';
  return str.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g, '');
};

// Formatear numero de telefono
export const formatPhoneNumber = (str) => {
  if (!str) return '';
  
  const cleaned = extractNumbers(str);
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return str;
};

// Formatear nombre completo
export const formatFullName = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  if (!firstName) return capitalizeWords(lastName);
  if (!lastName) return capitalizeWords(firstName);
  
  return `${capitalizeWords(firstName)} ${capitalizeWords(lastName)}`;
};

// Abreviar nombre
export const abbreviateName = (fullName) => {
  if (!fullName) return '';
  
  const parts = fullName.trim().split(' ').filter(part => part.length > 0);
  
  if (parts.length === 0) return '';
  if (parts.length === 1) return capitalizeWords(parts[0]);
  
  const firstName = parts[0];
  const lastNameInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  
  return `${capitalizeWords(firstName)} ${lastNameInitial}.`;
};

// Ocultar parte de un string (para emails, etc)
export const maskString = (str, visibleStart = 3, visibleEnd = 3, maskChar = '*') => {
  if (!str) return '';
  
  const length = str.length;
  
  if (length <= visibleStart + visibleEnd) return str;
  
  const start = str.substring(0, visibleStart);
  const end = str.substring(length - visibleEnd);
  const masked = maskChar.repeat(length - visibleStart - visibleEnd);
  
  return start + masked + end;
};

// Ocultar email parcialmente
export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;
  
  const [username, domain] = email.split('@');
  const maskedUsername = maskString(username, 2, 1);
  
  return `${maskedUsername}@${domain}`;
};

// Pluralizar palabra simple
export const pluralize = (count, singular, plural = null) => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

// Generar string aleatorio
export const randomString = (length = 10, charset = 'alphanumeric') => {
  const charsets = {
    alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    alpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    numeric: '0123456789',
    hex: '0123456789abcdef',
  };
  
  const chars = charsets[charset] || charsets.alphanumeric;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Reemplazar multiples espacios por uno solo
export const normalizeSpaces = (str) => {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
};

// Remover caracteres especiales
export const removeSpecialChars = (str, keep = '') => {
  if (!str) return '';
  const pattern = `[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s${keep}]`;
  return str.replace(new RegExp(pattern, 'g'), '');
};

export default {
  capitalize,
  capitalizeWords,
  toUpperCase,
  toLowerCase,
  truncate,
  truncateWords,
  slugify,
  generateId,
  generateUUID,
  getInitials,
  cleanSpaces,
  removeAccents,
  countWords,
  countCharacters,
  isEmpty,
  isNumeric,
  isAlpha,
  isAlphanumeric,
  escapeHtml,
  unescapeHtml,
  extractNumbers,
  extractLetters,
  formatPhoneNumber,
  formatFullName,
  abbreviateName,
  maskString,
  maskEmail,
  pluralize,
  randomString,
  normalizeSpaces,
  removeSpecialChars,
};