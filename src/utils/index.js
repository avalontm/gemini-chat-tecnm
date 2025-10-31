// src/utils/index.js

// Exportar mensajes de error
export * from './errorMessages';
export { default as errorMessages } from './errorMessages';

// Exportar todos los validators
export * from './validators';

// Exportar todos los helpers
export * from './helpers';

// Exportar modulos completos para acceso por namespace
import * as validators from './validators';
import * as helpers from './helpers';
import errorMessagesModule from './errorMessages';

export { validators, helpers, errorMessagesModule };