// src/components/profile/AppearanceTab.jsx

import { Sun, Moon, Monitor, Check } from 'lucide-react';

const AppearanceTab = ({ currentTheme, onThemeChange }) => {
  // Opciones de tema
  const themeOptions = [
    { id: 'light', label: 'Claro', icon: Sun, description: 'Tema claro' },
    { id: 'dark', label: 'Oscuro', icon: Moon, description: 'Tema oscuro' },
    { id: 'system', label: 'Sistema', icon: Monitor, description: 'Según tu sistema' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Apariencia
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Personaliza cómo se ve la aplicación
        </p>
      </div>

      {/* Selector de Tema */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = currentTheme === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => onThemeChange(option.id)}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-200
                  ${isActive
                    ? 'border-red-600 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className="flex flex-col items-center text-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-3
                    ${isActive
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                    }
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className={`
                    font-semibold mb-1
                    ${isActive
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-900 dark:text-white'
                    }
                  `}>
                    {option.label}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vista previa */}
      <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Vista Previa
        </h3>
        <div className="space-y-3">
          <div className="p-4 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
            <p className="text-gray-900 dark:text-white font-medium mb-2">
              Mensaje de ejemplo
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Así se verán tus mensajes con el tema seleccionado
            </p>
          </div>
          <div className="p-4 bg-red-600 rounded-lg">
            <p className="text-white font-medium mb-2">
              Tu mensaje
            </p>
            <p className="text-red-100 text-sm">
              Así se verán los mensajes que envíes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceTab;