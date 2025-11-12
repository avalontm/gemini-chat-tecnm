// src/components/Chat/ChatInput.jsx

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2, X, FileText, Upload } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

function ChatInput({ 
  onSendMessage, 
  isLoading,
  selectedFiles = [],
  onFileSelect,
  onRemoveFile,
  disabled = false
}) {
  const [inputMessage, setInputMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isStackExpanded, setIsStackExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const stackRef = useRef(null);
  const isSubmittingRef = useRef(false);

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

  useEffect(() => {
    if (textareaRef.current && !isLoading && !disabled) {
      textareaRef.current.focus();
    }
    
    if (!isLoading && !disabled) {
      isSubmittingRef.current = false;
    }
  }, [isLoading, disabled]);

  useEffect(() => {
    return () => {
      isSubmittingRef.current = false;
    };
  }, []);

  useEffect(() => {
    const newPreviews = [];
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    imageFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews[index] = reader.result;
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
    
    if (imageFiles.length === 0) {
      setImagePreviews([]);
    }
  }, [selectedFiles]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading && !disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isLoading || disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const mockEvent = {
        target: {
          files: files,
          value: ''
        }
      };
      handleFileInputChange(mockEvent, 'file');
    }
  };

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    dropZone.addEventListener('dragenter', handleDragEnter);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragenter', handleDragEnter);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, [isLoading, disabled, selectedFiles]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stackRef.current && !stackRef.current.contains(e.target) && isStackExpanded) {
        setIsStackExpanded(false);
      }
    };

    if (isStackExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStackExpanded]);

  const sendMessage = () => {
    if (isSubmittingRef.current) {
      console.warn('[ChatInput] Envío bloqueado - isSubmittingRef es true');
      return false;
    }
    
    const trimmedMessage = inputMessage.trim();
    
    if (!trimmedMessage && selectedFiles.length === 0) {
      return false;
    }

    if (isLoading || disabled) {
      return false;
    }

    isSubmittingRef.current = true;
    console.log('[ChatInput] Enviando mensaje desde:', new Error().stack.split('\n')[2]);
    
    onSendMessage(trimmedMessage);
    setInputMessage('');
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    setTimeout(() => {
      isSubmittingRef.current = false;
      console.log('[ChatInput] Lock liberado');
    }, 2000);

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('[ChatInput] handleSubmit llamado');
    sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      console.log('[ChatInput] handleKeyDown Enter detectado');
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleFileButtonClick = (type) => {
    if (type === 'image') {
      imageInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileInputChange = (e, type) => {
    if (onFileSelect) {
      onFileSelect(e, type);
    }
  };

  const handleRemoveFileClick = (index) => {
    if (onRemoveFile) {
      onRemoveFile(index);
    }
    if (selectedFiles.length === 1) {
      setIsStackExpanded(false);
    }
  };

  const handleVoiceTranscript = (transcript) => {
    const newValue = inputMessage ? `${inputMessage} ${transcript}` : transcript;
    setInputMessage(newValue);
    
    if (textareaRef.current) {
      textareaRef.current.focus();
      setTimeout(() => {
        textareaRef.current.selectionStart = newValue.length;
        textareaRef.current.selectionEnd = newValue.length;
      }, 0);
    }
  };

  const toggleStack = () => {
    setIsStackExpanded(!isStackExpanded);
  };

  const getItemScale = (index) => {
    if (!isStackExpanded || hoveredIndex === null) return 1;
    
    const distance = Math.abs(hoveredIndex - index);
    if (distance === 0) return 1.4;
    if (distance === 1) return 1.2;
    if (distance === 2) return 1.1;
    return 1;
  };

  const getItemTranslateY = (index) => {
    if (!isStackExpanded || hoveredIndex === null) return 0;
    
    const distance = Math.abs(hoveredIndex - index);
    if (distance === 0) return -16;
    if (distance === 1) return -8;
    if (distance === 2) return -4;
    return 0;
  };

  const canSubmit = (inputMessage.trim() || selectedFiles.length > 0) && !isLoading && !disabled;

  return (
    <div 
      ref={dropZoneRef}
      className={`bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 shadow-lg transition-all duration-300 relative ${
        isDragging ? 'border-blue-500 border-4 bg-blue-50 dark:bg-blue-900/20' : 'p-4'
      }`}
      style={{ paddingTop: isDragging ? '1rem' : undefined }}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm z-10 flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border-4 border-blue-500 border-dashed">
            <Upload className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-bounce" />
            <p className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Suelta tus archivos aqui
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              Imagenes y PDFs soportados
            </p>
          </div>
        </div>
      )}

      <div className={isDragging ? 'p-4' : ''}>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {selectedFiles.length > 0 && (
            <div className="mb-4 relative" ref={stackRef}>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={toggleStack}
                  className="group relative"
                >
                  <div className="relative w-20 h-20 cursor-pointer">
                    {selectedFiles.slice(0, 3).map((file, index) => {
                      const isImage = file.type.startsWith('image/');
                      const preview = imagePreviews[selectedFiles.filter(f => f.type.startsWith('image/')).indexOf(file)];
                      const rotation = index === 0 ? '-6deg' : index === 1 ? '0deg' : '6deg';
                      const translateY = index * 2;
                      
                      return (
                        <div
                          key={index}
                          className="absolute inset-0 rounded-xl overflow-hidden border-2 border-white dark:border-slate-600 shadow-lg transition-all duration-300 group-hover:shadow-2xl"
                          style={{
                            transform: `rotate(${rotation}) translateY(-${translateY}px)`,
                            zIndex: 3 - index,
                          }}
                        >
                          {isImage && preview ? (
                            <img
                              src={preview}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                              <FileText className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10 group-hover:scale-110 transition-transform">
                      {selectedFiles.length}
                    </div>
                  </div>
                </button>
                
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-3">
                  {selectedFiles.length} archivo{selectedFiles.length !== 1 ? 's' : ''} - Click para {isStackExpanded ? 'contraer' : 'expandir'}
                </span>
              </div>

              {isStackExpanded && (
                <div 
                  className="absolute left-0 bottom-full mb-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
                  style={{
                    transformOrigin: 'bottom left',
                  }}
                >
                  <div className="relative pt-3 px-3">
                    <div 
                      className="inline-flex items-end gap-3 px-4 py-3 rounded-2xl border shadow-2xl"
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(40px) saturate(180%)',
                        borderColor: 'rgba(200, 200, 200, 0.5)',
                      }}
                    >
                      <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 dark:via-slate-600 to-transparent opacity-50 mr-1" />
                      
                      {selectedFiles.map((file, index) => {
                        const isImage = file.type.startsWith('image/');
                        const preview = imagePreviews[selectedFiles.filter(f => f.type.startsWith('image/')).indexOf(file)];
                        const scale = getItemScale(index);
                        const translateY = getItemTranslateY(index);
                        const isActive = hoveredIndex !== null && Math.abs(hoveredIndex - index) <= 2;
                        
                        return (
                          <div
                            key={index}
                            className="relative flex flex-col items-center flex-shrink-0"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                              transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              transform: `scale(${scale}) translateY(${translateY}px)`,
                              zIndex: hoveredIndex === index ? 50 : isActive ? 40 : 20,
                              minWidth: '56px',
                            }}
                          >
                            <div 
                              className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                              style={{
                                boxShadow: scale > 1.1 ? '0 12px 40px rgba(0,0,0,0.25)' : '0 4px 12px rgba(0,0,0,0.1)',
                              }}
                            >
                              {isImage && preview ? (
                                <img
                                  src={preview}
                                  alt={file.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                  <FileText className="w-6 h-6 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFileClick(index);
                              }}
                              disabled={isLoading || disabled}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-lg ring-2 ring-white dark:ring-slate-800"
                              style={{
                                opacity: hoveredIndex === index ? 1 : 0,
                                transform: hoveredIndex === index ? 'scale(1)' : 'scale(0.8)',
                                pointerEvents: hoveredIndex === index ? 'auto' : 'none',
                              }}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            
                            <div 
                              className="mt-1 w-1 h-1 rounded-full bg-gray-400 dark:bg-slate-500 transition-all"
                              style={{
                                transform: `scale(${scale})`,
                                opacity: scale > 1.1 ? 1 : 0.5,
                              }}
                            />
                            
                            {hoveredIndex === index && (
                              <div 
                                className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/90 backdrop-blur-sm text-white text-xs rounded-lg whitespace-nowrap shadow-xl pointer-events-none"
                                style={{
                                  animation: 'fadeIn 0.2s ease-out',
                                  zIndex: 60,
                                }}
                              >
                                {file.name}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900/90 rotate-45" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      
                      <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 dark:via-slate-600 to-transparent opacity-50 ml-1" />
                    </div>

                    <div className="absolute -bottom-2 left-10 w-4 h-4 rotate-45" style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      borderRight: '1px solid rgba(200, 200, 200, 0.5)',
                      borderBottom: '1px solid rgba(200, 200, 200, 0.5)',
                    }} />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex gap-2 items-center pb-3">
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
                className="p-2.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                title="Adjuntar archivos"
              >
                <Paperclip className="w-5 h-5" />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Imagenes y PDFs
                </span>
              </button>

              <VoiceRecorder 
                onTranscript={handleVoiceTranscript}
                disabled={isLoading || disabled}
              />
            </div>

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

          <div className="flex items-center justify-between mt-2 px-2">
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="hidden sm:inline">
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs font-mono">Enter</kbd> enviar - 
                  <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-slate-700 rounded text-xs font-mono ml-1">Shift + Enter</kbd> linea
                </span>
                <span className="sm:hidden">Enter: enviar - Shift+Enter: linea</span>
              </p>
              
              {!isDragging && (
                <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span className="hidden md:inline">Arrastra archivos aqui</span>
                  <span className="md:hidden">Drag & drop</span>
                </p>
              )}
            </div>
            
            <span className={`text-xs ${inputMessage.length > 1800 ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {inputMessage.length} / 2000
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInput;