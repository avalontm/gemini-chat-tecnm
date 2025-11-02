// src/components/profile/ProfileSidebar.jsx

import { User, Shield, Palette, Bell, Globe } from 'lucide-react';

const ProfileSidebar = ({ activeTab, onTabChange }) => {
  // Tabs de configuración
  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'language', label: 'Idioma', icon: Globe },
  ];

  return (
    <aside className="lg:col-span-1">
      <nav className="space-y-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                ${activeTab === tab.id
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default ProfileSidebar;