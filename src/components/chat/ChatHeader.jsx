// src/components/Chat/ChatHeader.jsx

import { 
  Menu, 
  MessageSquare, 
  Settings, 
  StopCircle,
  Thermometer,
  Download,
  FileText,
  FileCode,
  FileJson,
  BookOpen,
  Loader2
} from 'lucide-react';
import { useState } from 'react';
import { exportAPI } from '@api/endpoints/export.api';
import { reportsAPI } from '@api/endpoints/reports.api';
import ReportDialog from './ReportDialog';
import toast from 'react-hot-toast';

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
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentOperation, setCurrentOperation] = useState('');
  const [reportDialog, setReportDialog] = useState({
    isOpen: false,
    templateType: null
  });

  const handleTemperatureChange = (e) => {
    const value = parseFloat(e.target.value);
    setTemperature(value);
  };

  const handleExport = async (format) => {
    if (!currentConversation?.id) {
      toast.error('No hay conversación para exportar');
      return;
    }

    setIsExporting(true);
    setCurrentOperation(`Exportando a ${format.toUpperCase()}...`);
    
    try {
      let blob;
      
      switch (format) {
        case 'pdf':
          blob = await exportAPI.exportToPDF(currentConversation.id);
          break;
        case 'txt':
          blob = await exportAPI.exportToTXT(currentConversation.id);
          break;
        case 'json':
          blob = await exportAPI.exportToJSON(currentConversation.id);
          break;
        default:
          throw new Error('Formato no soportado');
      }

      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversacion-${currentConversation.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Conversación exportada como ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error exportando:', error);
      toast.error('Error al exportar la conversación');
    } finally {
      setIsExporting(false);
      setCurrentOperation('');
      setShowExportMenu(false);
    }
  };

const handleGenerateReport = async (reportData) => {
  setIsGeneratingReport(true);
  setCurrentOperation(`Generando reporte ${reportData.templateId}...`);
  
  try {
    console.log('[ChatHeader] Iniciando generación de reporte...');
    
    const blob = await reportsAPI.generateReportFromTemplate(reportData);

    // Verificar el blob antes de crear la URL
    if (!blob || blob.size === 0) {
      throw new Error('El archivo generado está vacío');
    }

    console.log('[ChatHeader] Blob recibido:', {
      size: blob.size,
      type: blob.type
    });

    // Crear URL para descarga
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Nombre de archivo más descriptivo
    const fileName = `reporte-${reportData.templateId}-${reportData.topic.substring(0, 20)}-${Date.now()}.docx`;
    a.download = fileName.replace(/[^a-z0-9]/gi, '_');
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Limpiar URL después de la descarga
    setTimeout(() => window.URL.revokeObjectURL(url), 100);

    toast.success('Reporte generado y descargado exitosamente');
    
  } catch (error) {
    console.error('[ChatHeader] Error generando reporte:', error);
    
    // Mensajes de error más específicos
    if (error.message.includes('400')) {
      toast.error('Datos inválidos para generar el reporte. Verifica la información.');
    } else if (error.message.includes('500')) {
      toast.error('Error del servidor al generar el reporte. Intenta más tarde.');
    } else if (error.message.includes('network') || error.message.includes('conectar')) {
      toast.error('Error de conexión. Verifica tu internet.');
    } else {
      toast.error(error.message || 'Error al generar el reporte');
    }
  } finally {
    setIsGeneratingReport(false);
    setCurrentOperation('');
  }
};

  const openReportDialog = (templateType) => {
    setReportDialog({
      isOpen: true,
      templateType
    });
    setShowReportMenu(false);
  };

  const closeReportDialog = () => {
    setReportDialog({
      isOpen: false,
      templateType: null
    });
  };

  const hasConversation = !!currentConversation?.id;
  const isProcessing = isExporting || isGeneratingReport;

  return (
    <>
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

          {/* Right: Processing indicator + Export buttons + Streaming indicator + Settings */}
          <div className="flex items-center gap-2">
            
            {/* Indicador de procesamiento */}
            {isProcessing && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {currentOperation}
                </span>
              </div>
            )}

            {/* Botón de Reportes (siempre visible) */}
            <div className="relative">
              <button
                onClick={() => setShowReportMenu(!showReportMenu)}
                disabled={isGeneratingReport}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                  showReportMenu 
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' 
                    : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300'
                } ${isGeneratingReport ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Generar reporte"
              >
                <BookOpen className="w-5 h-5" />
              </button>

              {/* Dropdown de Reportes */}
              {showReportMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                  
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/10">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Generar Reporte
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-2">
                    <button
                      onClick={() => openReportDialog('academic')}
                      disabled={isGeneratingReport}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3 disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Documento de Investigación
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Paper de investigación académico
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => openReportDialog('research')}
                      disabled={isGeneratingReport}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3 disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Reporte de Investigación
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Para proyectos y tesis avanzadas
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => openReportDialog('technical')}
                      disabled={isGeneratingReport}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3 disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4 text-orange-600" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Reporte Técnico
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Documentación técnica especializada
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-3 py-2 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Generado con Gemini AI
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botón de Exportación (solo si hay conversación) */}
            {hasConversation && !isProcessing && (
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting}
                  className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                    showExportMenu 
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' 
                      : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300'
                  } ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Exportar conversación"
                >
                  <Download className="w-5 h-5" />
                </button>

                {/* Dropdown de Exportación */}
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/10">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Exportar Conversación
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-2">
                      <button
                        onClick={() => handleExport('pdf')}
                        disabled={isExporting}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3 disabled:opacity-50"
                      >
                        <FileText className="w-4 h-4 text-red-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            PDF Document
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Formato imprimible
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleExport('txt')}
                        disabled={isExporting}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3 disabled:opacity-50"
                      >
                        <FileCode className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Texto Plano
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Archivo .txt simple
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => handleExport('json')}
                        disabled={isExporting}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3 disabled:opacity-50"
                      >
                        <FileJson className="w-4 h-4 text-yellow-600" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            JSON Data
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Datos estructurados
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Indicador de streaming */}
            {isStreaming && !isProcessing && (
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
            {isStreaming && onCancelStreaming && !isProcessing && (
              <button
                onClick={onCancelStreaming}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Cancelar generación"
              >
                <StopCircle className="w-5 h-5" />
              </button>
            )}

            {/* Botón settings */}
            {!isProcessing && (
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
            )}
          </div>
        </div>

        {/* Click outside to close dropdowns */}
        {(showSettings || showExportMenu || showReportMenu) && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => {
              setShowSettings(false);
              setShowExportMenu(false);
              setShowReportMenu(false);
            }}
          />
        )}
      </header>

      {/* Diálogo de Reporte */}
      <ReportDialog
        isOpen={reportDialog.isOpen}
        onClose={closeReportDialog}
        templateType={reportDialog.templateType}
        onGenerateReport={handleGenerateReport}
      />
    </>
  );
}

export default ChatHeader;