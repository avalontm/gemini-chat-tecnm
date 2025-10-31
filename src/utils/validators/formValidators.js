// src/utils/validators/formValidators.js

import { VALIDATION_ERRORS } from '../errorMessages';

// Validar campo requerido
export const validateRequired = (value) => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  if (typeof value === 'string' && value.trim() === '') {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  return { valid: true, message: '' };
};

// Validar email
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, message: VALIDATION_ERRORS.emailFormat };
  }
  
  return { valid: true, message: '' };
};

// Validar email institucional
export const validateInstitutionalEmail = (email) => {
  const emailValidation = validateEmail(email);
  
  if (!emailValidation.valid) {
    return emailValidation;
  }
  
  const institutionalDomain = '@ensenada.tecnm.mx';
  
  if (!email.toLowerCase().endsWith(institutionalDomain)) {
    return { valid: false, message: VALIDATION_ERRORS.emailInstitutional };
  }
  
  return { valid: true, message: '' };
};

// Validar contraseña
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  if (password.length < 8) {
    return { valid: false, message: VALIDATION_ERRORS.password };
  }
  
  if (password.length > 128) {
    return { valid: false, message: VALIDATION_ERRORS.maxLength(128) };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return { valid: false, message: VALIDATION_ERRORS.passwordRequirements };
  }
  
  return { valid: true, message: '' };
};

// Validar que las contraseñas coincidan
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  if (password !== confirmPassword) {
    return { valid: false, message: VALIDATION_ERRORS.passwordMatch };
  }
  
  return { valid: true, message: '' };
};

// Validar nombre de usuario
export const validateUsername = (username) => {
  if (!username) {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  if (username.length < 3 || username.length > 30) {
    return { valid: false, message: VALIDATION_ERRORS.username };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  
  if (!usernameRegex.test(username)) {
    return { valid: false, message: VALIDATION_ERRORS.usernameFormat };
  }
  
  return { valid: true, message: '' };
};

// Validar longitud minima
export const validateMinLength = (value, minLength) => {
  if (!value) {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  if (value.length < minLength) {
    return { valid: false, message: VALIDATION_ERRORS.minLength(minLength) };
  }
  
  return { valid: true, message: '' };
};

// Validar longitud maxima
export const validateMaxLength = (value, maxLength) => {
  if (!value) {
    return { valid: true, message: '' };
  }
  
  if (value.length > maxLength) {
    return { valid: false, message: VALIDATION_ERRORS.maxLength(maxLength) };
  }
  
  return { valid: true, message: '' };
};

// Validar rango de longitud
export const validateLength = (value, minLength, maxLength) => {
  const minValidation = validateMinLength(value, minLength);
  if (!minValidation.valid) return minValidation;
  
  const maxValidation = validateMaxLength(value, maxLength);
  if (!maxValidation.valid) return maxValidation;
  
  return { valid: true, message: '' };
};

// Validar URL
export const validateUrl = (url) => {
  if (!url) {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  try {
    new URL(url);
    return { valid: true, message: '' };
  } catch (error) {
    return { valid: false, message: VALIDATION_ERRORS.invalidUrl };
  }
};

// Validar numero de telefono
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  
  if (!phoneRegex.test(phone)) {
    return { valid: false, message: VALIDATION_ERRORS.invalidPhone };
  }
  
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { valid: false, message: VALIDATION_ERRORS.invalidPhone };
  }
  
  return { valid: true, message: '' };
};

// Validar fecha
export const validateDate = (date) => {
  if (!date) {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return { valid: false, message: VALIDATION_ERRORS.invalidDate };
  }
  
  return { valid: true, message: '' };
};

// Validar fecha futura
export const validateFutureDate = (date) => {
  const dateValidation = validateDate(date);
  if (!dateValidation.valid) return dateValidation;
  
  const dateObj = new Date(date);
  const now = new Date();
  
  if (dateObj <= now) {
    return { valid: false, message: VALIDATION_ERRORS.futureDateRequired };
  }
  
  return { valid: true, message: '' };
};

// Validar fecha pasada
export const validatePastDate = (date) => {
  const dateValidation = validateDate(date);
  if (!dateValidation.valid) return dateValidation;
  
  const dateObj = new Date(date);
  const now = new Date();
  
  if (dateObj >= now) {
    return { valid: false, message: VALIDATION_ERRORS.pastDateRequired };
  }
  
  return { valid: true, message: '' };
};

// Validar numero
export const validateNumber = (value) => {
  if (value === null || value === undefined || value === '') {
    return { valid: false, message: VALIDATION_ERRORS.required };
  }
  
  if (isNaN(Number(value))) {
    return { valid: false, message: VALIDATION_ERRORS.invalidFormat };
  }
  
  return { valid: true, message: '' };
};

// Validar rango de numeros
export const validateNumberRange = (value, min, max) => {
  const numberValidation = validateNumber(value);
  if (!numberValidation.valid) return numberValidation;
  
  const num = Number(value);
  
  if (num < min) {
    return { valid: false, message: VALIDATION_ERRORS.minValue(min) };
  }
  
  if (num > max) {
    return { valid: false, message: VALIDATION_ERRORS.maxValue(max) };
  }
  
  return { valid: true, message: '' };
};

// Validar formulario completo
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(field => {
    const rules = validationRules[field];
    const value = formData[field];
    
    for (const rule of rules) {
      const result = rule(value);
      
      if (!result.valid) {
        errors[field] = result.message;
        isValid = false;
        break;
      }
    }
  });
  
  return { isValid, errors };
};

// Validar campo individual
export const validateField = (value, rules) => {
  for (const rule of rules) {
    const result = rule(value);
    
    if (!result.valid) {
      return result;
    }
  }
  
  return { valid: true, message: '' };
};

export default {
  validateRequired,
  validateEmail,
  validateInstitutionalEmail,
  validatePassword,
  validatePasswordMatch,
  validateUsername,
  validateMinLength,
  validateMaxLength,
  validateLength,
  validateUrl,
  validatePhone,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateNumber,
  validateNumberRange,
  validateForm,
  validateField,
};