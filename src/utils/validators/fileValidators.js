// src/utils/validators/fileValidators.js

import { FILE_ERRORS } from '../errorMessages';
import { APP_CONFIG, formatBytes } from '@config/app.config';

// Validar que se haya seleccionado un archivo
export const validateFileRequired = (file) => {
  if (!file) {
    return { valid: false, message: FILE_ERRORS.required };
  }
  
  return { valid: true, message: '' };
};

// Validar tamaño de archivo
export const validateFileSize = (file, maxSize) => {
  if (!file) {
    return { valid: false, message: FILE_ERRORS.required };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      message: FILE_ERRORS.tooLarge(formatBytes(maxSize)) 
    };
  }
  
  return { valid: true, message: '' };
};

// Validar tipo de archivo
export const validateFileType = (file, allowedTypes) => {
  if (!file) {
    return { valid: false, message: FILE_ERRORS.required };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: FILE_ERRORS.invalidType(allowedTypes.join(', ')) 
    };
  }
  
  return { valid: true, message: '' };
};

// Validar extension de archivo
export const validateFileExtension = (file, allowedExtensions) => {
  if (!file) {
    return { valid: false, message: FILE_ERRORS.required };
  }
  
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => 
    fileName.endsWith(ext.toLowerCase())
  );
  
  if (!hasValidExtension) {
    return { 
      valid: false, 
      message: FILE_ERRORS.invalidType(allowedExtensions.join(', ')) 
    };
  }
  
  return { valid: true, message: '' };
};

// Validar imagen
export const validateImage = (file) => {
  const requiredValidation = validateFileRequired(file);
  if (!requiredValidation.valid) return requiredValidation;
  
  const typeValidation = validateFileType(
    file, 
    APP_CONFIG.files.allowedImageTypes
  );
  if (!typeValidation.valid) {
    return { valid: false, message: FILE_ERRORS.invalidImage };
  }
  
  const sizeValidation = validateFileSize(
    file, 
    APP_CONFIG.files.maxImageSize
  );
  if (!sizeValidation.valid) {
    return { valid: false, message: FILE_ERRORS.imageTooLarge };
  }
  
  return { valid: true, message: '' };
};

// Validar audio
export const validateAudio = (file) => {
  const requiredValidation = validateFileRequired(file);
  if (!requiredValidation.valid) return requiredValidation;
  
  const typeValidation = validateFileType(
    file, 
    APP_CONFIG.files.allowedAudioTypes
  );
  if (!typeValidation.valid) {
    return { valid: false, message: FILE_ERRORS.invalidAudio };
  }
  
  const sizeValidation = validateFileSize(
    file, 
    APP_CONFIG.files.maxAudioSize
  );
  if (!sizeValidation.valid) {
    return { valid: false, message: FILE_ERRORS.audioTooLarge };
  }
  
  return { valid: true, message: '' };
};

// Validar PDF
export const validatePDF = (file) => {
  const requiredValidation = validateFileRequired(file);
  if (!requiredValidation.valid) return requiredValidation;
  
  const typeValidation = validateFileType(file, ['application/pdf']);
  if (!typeValidation.valid) {
    return { valid: false, message: FILE_ERRORS.invalidPDF };
  }
  
  const sizeValidation = validateFileSize(
    file, 
    APP_CONFIG.files.maxPDFSize
  );
  if (!sizeValidation.valid) {
    return { valid: false, message: FILE_ERRORS.pdfTooLarge };
  }
  
  return { valid: true, message: '' };
};

// Validar documento
export const validateDocument = (file) => {
  const requiredValidation = validateFileRequired(file);
  if (!requiredValidation.valid) return requiredValidation;
  
  const typeValidation = validateFileType(
    file, 
    APP_CONFIG.files.allowedDocTypes
  );
  if (!typeValidation.valid) return typeValidation;
  
  const sizeValidation = validateFileSize(
    file, 
    APP_CONFIG.files.maxFileSize
  );
  if (!sizeValidation.valid) return sizeValidation;
  
  return { valid: true, message: '' };
};

// Validar multiples archivos
export const validateMultipleFiles = (files, validatorFn) => {
  if (!files || files.length === 0) {
    return { valid: false, message: FILE_ERRORS.required };
  }
  
  for (let i = 0; i < files.length; i++) {
    const validation = validatorFn(files[i]);
    if (!validation.valid) {
      return validation;
    }
  }
  
  return { valid: true, message: '' };
};

// Validar imagen con dimensiones
export const validateImageWithDimensions = async (file, minWidth, minHeight, maxWidth, maxHeight) => {
  const imageValidation = validateImage(file);
  if (!imageValidation.valid) return imageValidation;
  
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      if (minWidth && img.width < minWidth) {
        resolve({ 
          valid: false, 
          message: `La imagen debe tener al menos ${minWidth}px de ancho` 
        });
        return;
      }
      
      if (minHeight && img.height < minHeight) {
        resolve({ 
          valid: false, 
          message: `La imagen debe tener al menos ${minHeight}px de alto` 
        });
        return;
      }
      
      if (maxWidth && img.width > maxWidth) {
        resolve({ 
          valid: false, 
          message: `La imagen no debe exceder ${maxWidth}px de ancho` 
        });
        return;
      }
      
      if (maxHeight && img.height > maxHeight) {
        resolve({ 
          valid: false, 
          message: `La imagen no debe exceder ${maxHeight}px de alto` 
        });
        return;
      }
      
      resolve({ valid: true, message: '' });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ valid: false, message: FILE_ERRORS.corruptedFile });
    };
    
    img.src = objectUrl;
  });
};

// Validar relacion de aspecto de imagen
export const validateImageAspectRatio = async (file, aspectRatio, tolerance = 0.1) => {
  const imageValidation = validateImage(file);
  if (!imageValidation.valid) return imageValidation;
  
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      
      const fileAspectRatio = img.width / img.height;
      const difference = Math.abs(fileAspectRatio - aspectRatio);
      
      if (difference > tolerance) {
        resolve({ 
          valid: false, 
          message: `La imagen debe tener una relacion de aspecto de ${aspectRatio}:1` 
        });
        return;
      }
      
      resolve({ valid: true, message: '' });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ valid: false, message: FILE_ERRORS.corruptedFile });
    };
    
    img.src = objectUrl;
  });
};

// Obtener informacion de archivo
export const getFileInfo = (file) => {
  if (!file) return null;
  
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeFormatted: formatBytes(file.size),
    extension: file.name.split('.').pop().toLowerCase(),
    lastModified: new Date(file.lastModified),
  };
};

// Verificar si es imagen
export const isImage = (file) => {
  if (!file) return false;
  return APP_CONFIG.files.allowedImageTypes.includes(file.type);
};

// Verificar si es audio
export const isAudio = (file) => {
  if (!file) return false;
  return APP_CONFIG.files.allowedAudioTypes.includes(file.type);
};

// Verificar si es PDF
export const isPDF = (file) => {
  if (!file) return false;
  return file.type === 'application/pdf';
};

// Verificar si es documento
export const isDocument = (file) => {
  if (!file) return false;
  return APP_CONFIG.files.allowedDocTypes.includes(file.type);
};

export default {
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
};