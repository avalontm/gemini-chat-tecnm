// src/utils/validators/index.js

// Exportar validadores de formularios
export {
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
} from './formValidators';

// Exportar validadores de archivos
export {
  validateFileRequired,
  validateFileSize,
  validateFileType,
  validateFileExtension,
  validateImage,
  validateAudio,
  validatePDF,
  validateDocument,
  validateMultipleFiles,
  validateImageWithDimensions,
  validateImageAspectRatio,
  getFileInfo,
  isImage,
  isAudio,
  isPDF,
  isDocument,
} from './fileValidators';

// Exportar todo el modulo de formValidators
export * as formValidators from './formValidators';

// Exportar todo el modulo de fileValidators
export * as fileValidators from './fileValidators';