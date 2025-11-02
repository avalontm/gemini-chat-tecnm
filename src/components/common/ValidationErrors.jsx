// src/components/common/ValidationErrors.jsx

import { AlertCircle, X } from 'lucide-react';

const ValidationErrors = ({ errors, onDismiss }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
            Errores de validación ({errors.length})
          </h3>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <ul className="space-y-2 mt-3">
        {errors.map((error, index) => {
          const field = error.field || error.param || 'Campo';
          const message = error.message || error.msg || 'Error de validación';
          const value = error.value;
          
          return (
            <li key={index} className="text-sm text-red-700 dark:text-red-300">
              <span className="font-medium">{field}:</span> {message}
              {value && value !== 'undefined' && (
                <span className="block ml-4 mt-1 text-xs text-red-600 dark:text-red-400 italic">
                  Valor recibido: "{typeof value === 'string' && value.length > 50 
                    ? value.substring(0, 50) + '...' 
                    : value}"
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ValidationErrors;