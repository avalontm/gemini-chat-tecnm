// src/components/Chat/ChatHeader.jsx

import { 
  Menu, 
  MessageSquare, 
  Settings, 
  StopCircle,
  Thermometer
} from 'lucide-react';
import { useState } from 'react';

function ChatHeader({ 
  isSidebarOpen, 
  setIsSidebarOpen,
  currentConversation,
  temperature,
  setTemperature,
  isStreaming,
  onCancelStreaming
}) {
  const [showSettings, setShowSettings] = useState(false);

  const handleTemperatureChange = (e) => {
    const value = parseFloat(e.target.value);
    setTemperature(value);
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Left: Toggle sidebar + Conversation title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              title="Abrir sidebar"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}
          
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {currentConversation?.title || 'Nueva conversación'}
              </h1>
              {currentConversation && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(currentConversation.createdAt).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Streaming indicator + Settings */}
        <div className="flex items-center gap-2">
          
          {/* Indicador de streaming */}
          {isStreaming && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Generando respuesta...
              </span>
            </div>
          )}

          {/* Botón cancelar streaming */}
          {isStreaming && onCancelStreaming && (
            <button
              onClick={onCancelStreaming}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Cancelar generación"
            >
              <StopCircle className="w-5 h-5" />
            </button>
          )}

          {/* Botón settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' 
                  : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300'
              }`}
              title="Configuración"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Dropdown de configuración */}
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Configuración del Modelo
                  </h3>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  
                  {/* Temperature control */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-gray-500" />
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Temperatura
                        </label>
                      </div>
                      <span className="text-sm font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                        {temperature.toFixed(1)}
                      </span>
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={temperature}
                      onChange={handleTemperatureChange}
                      className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Preciso (0.0)
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Creativo (2.0)
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {temperature < 0.5 && 'Respuestas más deterministas y precisas'}
                      {temperature >= 0.5 && temperature < 1.0 && 'Balance entre creatividad y precisión'}
                      {temperature >= 1.0 && temperature < 1.5 && 'Respuestas más creativas y variadas'}
                      {temperature >= 1.5 && 'Máxima creatividad (puede ser impredecible)'}
                    </p>
                  </div>

                  {/* Info adicional */}
                  <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="w-1 h-1 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <p>
                        La temperatura controla la aleatoriedad de las respuestas. 
                        Valores bajos son mejores para tareas que requieren precisión, 
                        mientras que valores altos son útiles para tareas creativas.
                      </p>
                    </div>
                  </div>

                  {/* Modelo info */}
                  <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Modelo
                      </span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Gemini Pro
                      </span>
                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSettings(false)}
        />
      )}
    </header>
  );
}

export default ChatHeader;