// src/components/Chat/ChatInput.jsx

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image as ImageIcon, Loader2, X, FileText } from 'lucide-react';

function ChatInput({ 
  onSendMessage, 
  isLoading,
  selectedFiles = [],
  onFileSelect,
  onRemoveFile,
  disabled = false
}) {
  const [inputMessage, setInputMessage] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  console.log('[CHAT INPUT] Estado:', {
    inputMessage: inputMessage.substring(0, 50),
    messageLength: inputMessage.length,
    selectedFilesCount: selectedFiles.length,
    isLoading,
    disabled
  });

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  // Focus automático al montar
  useEffect(() => {
    if (textareaRef.current && !isLoading && !disabled) {
      textareaRef.current.focus();
    }
  }, [isLoading, disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('[CHAT INPUT] 🚀 Submit disparado');
    console.log('[CHAT INPUT] Input message:', inputMessage);
    console.log('[CHAT INPUT] Input trimmed:', inputMessage.trim());
    console.log('[CHAT INPUT] Files:', selectedFiles.length);
    
    const trimmedMessage = inputMessage.trim();
    
    if (!trimmedMessage && selectedFiles.length === 0) {
      console.warn('[CHAT INPUT] ⚠️ No hay mensaje ni archivos para enviar');
      return;
    }

    if (isLoading || disabled) {
      console.warn('[CHAT INPUT] ⚠️ Bloqueado - isLoading:', isLoading, 'disabled:', disabled);
      return;
    }

    console.log('[CHAT INPUT] ✅ Enviando mensaje:', trimmedMessage);
    console.log('[CHAT INPUT] Llamando onSendMessage...');
    
    // Enviar mensaje
    onSendMessage(trimmedMessage);
    
    // Limpiar input
    setInputMessage('');
    console.log('[CHAT INPUT] ✅ Input limpiado');
    
    // Reset altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      console.log('[CHAT INPUT] Enter presionado (sin Shift)');
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    console.log('[CHAT INPUT] Input change, nueva longitud:', newValue.length);
    setInputMessage(newValue);
  };

  const handleFileButtonClick = (type) => {
    console.log('[CHAT INPUT] Botón de archivo clickeado:', type);
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (e, type) => {
    console.log('[CHAT INPUT] Archivos seleccionados:', e.target.files.length, 'tipo:', type);
    if (onFileSelect) {
      onFileSelect(e, type);
    }
  };

  const handleRemoveFileClick = (index) => {
    console.log('[CHAT INPUT] Removiendo archivo en índice:', index);
    if (onRemoveFile) {
      onRemoveFile(index);
    }
  };

  const canSubmit = (inputMessage.trim() || selectedFiles.length > 0) && !isLoading && !disabled;

  console.log('[CHAT INPUT] Can submit:', canSubmit);

  return (
    <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {/* Preview archivos */}
        {selectedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFileClick(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  disabled={isLoading || disabled}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3">
          {/* Botones adjuntar */}
          <div className="flex gap-2 items-center pb-3">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileInputChange(e, 'image')}
              disabled={isLoading || disabled}
            />
            <button
              type="button"
              onClick={() => handleFileButtonClick('image')}
              disabled={isLoading || disabled}
              className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Adjuntar imagen"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileInputChange(e, 'file')}
              disabled={isLoading || disabled}
            />
            <button
              type="button"
              onClick={() => handleFileButtonClick('file')}
              disabled={isLoading || disabled}
              className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Adjuntar archivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>

          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "Esperando respuesta..." : "Escribe tu mensaje..."}
              disabled={isLoading || disabled}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '200px' }}
              maxLength={2000}
            />
          </div>

          {/* Botón enviar */}
          <div className="pb-3">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0 shadow-md transform ${
                canSubmit
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
              title={
                !canSubmit && !isLoading
                  ? 'Escribe un mensaje o adjunta un archivo'
                  : isLoading
                  ? 'Esperando respuesta...'
                  : 'Enviar mensaje'
              }
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Ayuda y contador */}
        <div className="flex items-center justify-between mt-2 px-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <span className="hidden sm:inline">
              Presiona <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs font-mono">Enter</kbd> para enviar, 
              <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs font-mono ml-1">Shift + Enter</kbd> para nueva línea
            </span>
            <span className="sm:hidden">Enter: enviar • Shift+Enter: línea</span>
          </p>
          <span className={`text-xs ${inputMessage.length > 1800 ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
            {inputMessage.length} / 2000
          </span>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;