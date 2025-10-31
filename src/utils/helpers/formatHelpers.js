// src/utils/helpers/formatHelpers.js

// Formatear numero con separadores de miles
export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined || isNaN(number)) return '0';
  
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
};

// Formatear moneda
export const formatCurrency = (amount, currency = 'MXN', decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

// Formatear moneda compacta (1K, 1M, 1B)
export const formatCurrencyCompact = (amount, currency = 'MXN') => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0';
  
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    notation: 'compact',
    compactDisplay: 'short',
  }).format(amount);
};

// Formatear porcentaje
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  return new Intl.NumberFormat('es-MX', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
};

// Formatear bytes a formato legible
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes || isNaN(bytes)) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Formatear numero compacto (1K, 1M, 1B)
export const formatNumberCompact = (number) => {
  if (number === null || number === undefined || isNaN(number)) return '0';
  
  return new Intl.NumberFormat('es-MX', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};

// Formatear duracion en segundos a formato legible
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  
  return `${secs}s`;
};

// Formatear duracion en milisegundos
export const formatDurationMs = (milliseconds) => {
  if (!milliseconds || isNaN(milliseconds)) return '0ms';
  
  const seconds = Math.floor(milliseconds / 1000);
  const ms = milliseconds % 1000;
  
  if (seconds > 0) {
    return formatDuration(seconds);
  }
  
  return `${ms}ms`;
};

// Formatear coordenadas geograficas
export const formatCoordinates = (lat, lng, decimals = 6) => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return 'N/A';
  }
  
  const latFormatted = lat.toFixed(decimals);
  const lngFormatted = lng.toFixed(decimals);
  
  return `${latFormatted}, ${lngFormatted}`;
};

// Formatear lista de items
export const formatList = (items, conjunction = 'y') => {
  if (!items || items.length === 0) return '';
  
  if (items.length === 1) return items[0];
  
  if (items.length === 2) {
    return `${items[0]} ${conjunction} ${items[1]}`;
  }
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1).join(', ');
  
  return `${otherItems} ${conjunction} ${lastItem}`;
};

// Formatear numero de telefono
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

// Formatear numero de tarjeta de credito
export const formatCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  
  return groups ? groups.join(' ') : cardNumber;
};

// Ocultar numero de tarjeta (mostrar solo ultimos 4 digitos)
export const maskCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (cleaned.length < 4) return cardNumber;
  
  const lastFour = cleaned.slice(-4);
  const masked = '*'.repeat(cleaned.length - 4);
  
  return formatCreditCard(masked + lastFour);
};

// Formatear RFC
export const formatRFC = (rfc) => {
  if (!rfc) return '';
  
  return rfc.toUpperCase().replace(/\s/g, '');
};

// Formatear CURP
export const formatCURP = (curp) => {
  if (!curp) return '';
  
  return curp.toUpperCase().replace(/\s/g, '');
};

// Formatear codigo postal
export const formatPostalCode = (postalCode) => {
  if (!postalCode) return '';
  
  const cleaned = postalCode.replace(/\D/g, '');
  
  return cleaned.slice(0, 5);
};

// Formatear distancia en metros
export const formatDistance = (meters) => {
  if (!meters || isNaN(meters)) return '0 m';
  
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  
  return `${(meters / 1000).toFixed(2)} km`;
};

// Formatear velocidad
export const formatSpeed = (metersPerSecond) => {
  if (!metersPerSecond || isNaN(metersPerSecond)) return '0 km/h';
  
  const kmPerHour = metersPerSecond * 3.6;
  
  return `${kmPerHour.toFixed(1)} km/h`;
};

// Formatear temperatura
export const formatTemperature = (celsius, unit = 'C') => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return 'N/A';
  
  if (unit === 'F') {
    const fahrenheit = (celsius * 9/5) + 32;
    return `${fahrenheit.toFixed(1)}°F`;
  }
  
  return `${celsius.toFixed(1)}°C`;
};

// Formatear peso
export const formatWeight = (grams) => {
  if (!grams || isNaN(grams)) return '0 g';
  
  if (grams < 1000) {
    return `${Math.round(grams)} g`;
  }
  
  return `${(grams / 1000).toFixed(2)} kg`;
};

// Formatear rating con estrellas
export const formatRating = (rating, maxRating = 5) => {
  if (rating === null || rating === undefined || isNaN(rating)) return '0/5';
  
  return `${rating.toFixed(1)}/${maxRating}`;
};

// Formatear rating con estrellas visuales
export const formatStarRating = (rating, maxRating = 5) => {
  if (rating === null || rating === undefined || isNaN(rating)) return '☆☆☆☆☆';
  
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = maxRating - fullStars - halfStar;
  
  return '★'.repeat(fullStars) + (halfStar ? '⯨' : '') + '☆'.repeat(emptyStars);
};

// Formatear version (semantic versioning)
export const formatVersion = (major, minor, patch) => {
  return `v${major}.${minor}.${patch}`;
};

// Formatear hash corto (primeros 7 caracteres)
export const formatShortHash = (hash) => {
  if (!hash) return '';
  return hash.substring(0, 7);
};

// Formatear UUID corto (primeros 8 caracteres)
export const formatShortUUID = (uuid) => {
  if (!uuid) return '';
  return uuid.split('-')[0];
};

// Formatear JSON pretty
export const formatJSON = (obj, indent = 2) => {
  try {
    return JSON.stringify(obj, null, indent);
  } catch (error) {
    console.error('Error formateando JSON:', error);
    return '';
  }
};

// Formatear boolean a texto
export const formatBoolean = (value, trueText = 'Si', falseText = 'No') => {
  return value ? trueText : falseText;
};

// Formatear array como string separado por comas
export const formatArray = (array, separator = ', ') => {
  if (!Array.isArray(array)) return '';
  return array.join(separator);
};

// Formatear numero ordinal (1ro, 2do, 3ro)
export const formatOrdinal = (number) => {
  if (!number || isNaN(number)) return '';
  
  const suffixes = {
    1: 'ro',
    2: 'do',
    3: 'ro',
  };
  
  const lastDigit = number % 10;
  const suffix = suffixes[lastDigit] || 'to';
  
  return `${number}${suffix}`;
};

export default {
  formatNumber,
  formatCurrency,
  formatCurrencyCompact,
  formatPercentage,
  formatBytes,
  formatNumberCompact,
  formatDuration,
  formatDurationMs,
  formatCoordinates,
  formatList,
  formatPhone,
  formatCreditCard,
  maskCreditCard,
  formatRFC,
  formatCURP,
  formatPostalCode,
  formatDistance,
  formatSpeed,
  formatTemperature,
  formatWeight,
  formatRating,
  formatStarRating,
  formatVersion,
  formatShortHash,
  formatShortUUID,
  formatJSON,
  formatBoolean,
  formatArray,
  formatOrdinal,
};