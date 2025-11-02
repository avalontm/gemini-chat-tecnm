// src/components/profile/NotificationsTab.jsx

import { useState } from 'react';
import { Save } from 'lucide-react';

const NotificationsTab = ({ notifications, onSave }) => {
  const [localNotifications, setLocalNotifications] = useState(notifications);

  const handleToggle = (key) => {
    setLocalNotifications({
      ...localNotifications,
      [key]: !localNotifications[key]
    });
  };

  const handleSave = () => {
    onSave(localNotifications);
  };

  const notificationOptions = [
    { 
      key: 'email', 
      label: 'Notificaciones por email', 
      description: 'Recibe actualizaciones importantes por correo' 
    },
    { 
      key: 'push', 
      label: 'Notificaciones push', 
      description: 'Notificaciones en tiempo real en tu navegador' 
    },
    { 
      key: 'updates', 
      label: 'Actualizaciones del producto', 
      description: 'Entérate de nuevas funcionalidades' 
    },
    { 
      key: 'tips', 
      label: 'Consejos y trucos', 
      description: 'Aprende a usar mejor la aplicación' 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Notificaciones
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configura cómo quieres recibir notificaciones
        </p>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700"
          >
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {item.label}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
            <button
              onClick={() => handleToggle(item.key)}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${localNotifications[item.key] ? 'bg-red-600' : 'bg-gray-300 dark:bg-slate-600'}
              `}
            >
              <div
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform
                  ${localNotifications[item.key] ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          <Save className="w-5 h-5" />
          Guardar preferencias
        </button>
      </div>
    </div>
  );
};

export default NotificationsTab;