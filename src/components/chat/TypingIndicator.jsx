// src/components/Chat/TypingIndicator.jsx

import { Sparkles } from 'lucide-react';
import { useTheme } from '@context/ThemeContext';

function TypingIndicator() {
  const { theme } = useTheme();

  return (
    <div className="flex gap-4 animate-fadeIn">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md overflow-hidden">
        {/* Logo del ITE que cambia según el tema */}
        <div className="w-8 h-8 flex items-center justify-center">
          <img 
            src={theme === 'dark' ? '/ite_dark.svg' : '/ite_light.svg'}
            alt="Instituto Tecnológico de Ensenada"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          {/* Fallback icon */}
          <div className="hidden w-full h-full items-center justify-center">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-5 py-3 rounded-2xl shadow-sm">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;