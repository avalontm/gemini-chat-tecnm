// src/components/profile/LanguageTab.jsx

import { AlertCircle } from 'lucide-react';

const LanguageTab = ({ currentLanguage, onLanguageChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Idioma y Región
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configura tu idioma preferido
        </p>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Idioma de la interfaz
        </label>
        <select 
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            La función de cambio de idioma estará disponible próximamente. Por ahora, la aplicación está disponible en español.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LanguageTab;