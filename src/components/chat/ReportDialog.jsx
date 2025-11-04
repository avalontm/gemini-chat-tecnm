// src/components/Chat/ReportDialog.jsx

import { 
  X,
  User,
  Book,
  GraduationCap,
  Users,
  Loader2,
  FileText
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@context/AuthContext';
import { reportsAPI } from '@api/endpoints/reports.api';
import toast from 'react-hot-toast';

export default function ReportDialog({ isOpen, onClose, templateType, onGenerateReport }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    topic: '',
    additionalInstructions: '',
    metadata: {
      school: 'Tecnológico Nacional de México - Campus Ensenada',
      faculty: '',
      subject: '',
      student: '',
      studentId: '',
      professor: '',
      group: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mapeo de template types a templateIds del backend
  const templateMap = {
    academic: 'research_paper', 
    research: 'research_paper', 
    technical: 'technical_report'
  };

  // CARRERAS disponibles del TecNM
  const CARRERAS = [
    'Ingeniería en Sistemas Computacionales',
    'Ingeniería Industrial',
    'Ingeniería Electromecánica',
    'Ingeniería Bioquímica',
    'Ingeniería en Gestión Empresarial',
    'Licenciatura en Administración',
    'Ingeniería en Tecnologías de la Información y Comunicaciones'
  ];

  const templateTitles = {
    academic: 'Documento de Investigación',
    research: 'Documento de Investigación', 
    technical: 'Reporte Técnico'
  };

  const templateDescriptions = {
    academic: 'Paper de investigación académico con formato universitario',
    research: 'Para proyectos de investigación y tesis',
    technical: 'Documentación técnica detallada'
  };

  // Autocompletar datos del usuario cuando se abre el diálogo
  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          student: user.nombreCompleto || '',
          studentId: user.numeroControl || '',
          faculty: user.carrera || ''
        }
      }));
    }
  }, [isOpen, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.topic.trim()) {
      toast.error('El tema del reporte es requerido');
      return;
    }

    setIsSubmitting(true);
    try {
      const reportData = {
        templateId: templateMap[templateType],
        topic: formData.topic,
        additionalInstructions: formData.additionalInstructions,
        metadata: {
          ...formData.metadata,
          studentId: formData.metadata.studentId
        }
      };

      // DEBUG: Mostrar datos que se enviarán
      console.log('🔍 DEBUG - Datos que se enviarán al servidor:');
      console.log('Template ID:', reportData.templateId);
      console.log('Topic:', reportData.topic);
      console.log('Additional Instructions:', reportData.additionalInstructions);
      console.log('Metadata:', reportData.metadata);

      const blob = await reportsAPI.generateReportFromTemplate(reportData);

      // Crear URL para descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${templateType}-${Date.now()}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Reporte generado exitosamente');
      onClose();
      
      // Reset form
      setFormData({
        topic: '',
        additionalInstructions: '',
        metadata: {
          school: 'Tecnológico Nacional de México - Campus Ensenada',
          faculty: '',
          subject: '',
          student: '',
          studentId: '',
          professor: '',
          group: ''
        }
      });
    } catch (error) {
      console.error('Error generando reporte:', error);
      toast.error(error.message || 'Error al generar el reporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    if (isSubmitting) return; // Bloquear cambios durante envío
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMetadataChange = (field, value) => {
    if (isSubmitting) return; // Bloquear cambios durante envío
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={isSubmitting ? undefined : onClose} // Solo permitir cerrar si no está procesando
      />
      
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden animate-fadeIn">
        
        {/* Overlay de procesamiento - REDISEÑADO */}
        {isSubmitting && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 z-10 flex flex-col items-center justify-center rounded-2xl">
            <div className="text-center p-8 w-full max-w-lg">
              
              {/* Logo del ITE - MÁS GRANDE */}
              <div className="mb-10 mt-2 transform hover:scale-105 transition-transform duration-300">
                {/* Logo para tema claro */}
                <img 
                  src="/ite_light.svg" 
                  alt="ITE Logo" 
                  className="h-24 mx-auto dark:hidden drop-shadow-lg"
                />
                {/* Logo para tema oscuro */}
                <img 
                  src="/ite_dark.svg" 
                  alt="ITE Logo" 
                  className="h-24 mx-auto hidden dark:block drop-shadow-lg"
                />
              </div>
              
              {/* Animación de documento con efectos visuales mejorados */}
              <div className="relative mb-10 flex items-center justify-center">
                {/* Círculo de fondo pulsante */}
                <div className="absolute w-40 h-40 bg-blue-500/10 dark:bg-blue-400/10 rounded-full animate-ping"></div>
                <div className="absolute w-32 h-32 bg-blue-500/20 dark:bg-blue-400/20 rounded-full animate-pulse"></div>
                
                {/* Círculo principal con gradiente */}
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 shadow-2xl flex items-center justify-center">
                  {/* Documento animado */}
                  <FileText className="w-14 h-14 text-white animate-pulse" />
                  
                  {/* Anillo giratorio exterior */}
                  <svg className="absolute w-32 h-32 animate-spin" style={{ animationDuration: '3s' }}>
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-blue-400 dark:text-blue-300"
                      strokeDasharray="30 10"
                    />
                  </svg>
                  
                  {/* Anillo giratorio interior (dirección opuesta) */}
                  <svg className="absolute w-24 h-24" style={{ animation: 'spin 2s linear infinite reverse' }}>
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-blue-300 dark:text-blue-400"
                      strokeDasharray="20 15"
                    />
                  </svg>
                </div>
              </div>
              
              {/* Textos con animación de entrada */}
              <div className="space-y-3 animate-fadeIn">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                  Generando Reporte
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                  Estamos creando tu documento profesional
                </p>
              </div>
              
              {/* Barra de progreso animada */}
              <div className="mt-8 mb-6 w-full max-w-xs mx-auto">
                <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-full animate-pulse" 
                       style={{ 
                         width: '100%',
                         animation: 'shimmer 1.5s infinite'
                       }}>
                  </div>
                </div>
              </div>
              
              {/* Indicador de puntos con mejor diseño */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium mb-8">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></span>
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1s' }}></span>
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1s' }}></span>
                </div>
                <span className="ml-1">Procesando contenido</span>
              </div>
              
              {/* Card de información del reporte - Mejorado */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-blue-100 dark:border-slate-700 p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      Plantilla
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {templateTitles[templateType]}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 dark:border-slate-700 pt-3">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Tema
                  </p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">
                    {formData.topic}
                  </p>
                </div>
              </div>
              
              {/* Mensaje de advertencia - Rediseñado */}
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <div className="flex items-center justify-center gap-2 text-amber-800 dark:text-amber-300">
                  <span className="text-lg">⏱️</span>
                  <p className="text-sm font-medium">
                    Esto puede tomar unos segundos. Por favor no cierres esta ventana.
                  </p>
                </div>
              </div>
            </div>

            {/* CSS personalizado para animaciones */}
            <style>{`
              @keyframes shimmer {
                0%, 100% { transform: translateX(-100%); }
                50% { transform: translateX(100%); }
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.5s ease-out;
              }
              .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
            `}</style>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {templateTitles[templateType]}
                </h3>
                <p className="text-blue-100 text-sm">
                  {templateDescriptions[templateType]}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className={`text-white/80 hover:text-white transition-colors ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="space-y-6">
            {/* Tema principal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tema del Reporte *
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                placeholder="Ej: Impacto del Machine Learning en la Medicina Moderna"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                  isSubmitting 
                    ? 'border-gray-200 dark:border-slate-600 opacity-50 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-slate-600'
                }`}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Instrucciones adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instrucciones Adicionales
              </label>
              <textarea
                value={formData.additionalInstructions}
                onChange={(e) => handleChange('additionalInstructions', e.target.value)}
                placeholder="Ej: Incluye casos de estudio recientes y estadísticas, enfócate en aplicaciones prácticas..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none ${
                  isSubmitting 
                    ? 'border-gray-200 dark:border-slate-600 opacity-50 cursor-not-allowed' 
                    : 'border-gray-300 dark:border-slate-600'
                }`}
                disabled={isSubmitting}
              />
            </div>

            {/* Metadatos */}
            <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-600" />
                Información Académica
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institución */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Institución
                  </label>
                  <input
                    type="text"
                    value={formData.metadata.school}
                    onChange={(e) => handleMetadataChange('school', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                      isSubmitting 
                        ? 'border-gray-200 dark:border-slate-600 opacity-50 cursor-not-allowed' 
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Carrera/Facultad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Carrera/Facultad
                  </label>
                  <select
                    value={formData.metadata.faculty}
                    onChange={(e) => handleMetadataChange('faculty', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                      isSubmitting 
                        ? 'border-gray-200 dark:border-slate-600 opacity-50 cursor-not-allowed' 
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona una carrera</option>
                    {CARRERAS.map((carrera) => (
                      <option key={carrera} value={carrera}>
                        {carrera}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Materia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Materia/Asignatura
                  </label>
                  <input
                    type="text"
                    value={formData.metadata.subject}
                    onChange={(e) => handleMetadataChange('subject', e.target.value)}
                    placeholder="Ej: Inteligencia Artificial"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                      isSubmitting 
                        ? 'border-gray-200 dark:border-slate-600 opacity-50 cursor-not-allowed' 
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Grupo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Grupo
                  </label>
                  <input
                    type="text"
                    value={formData.metadata.group}
                    onChange={(e) => handleMetadataChange('group', e.target.value)}
                    placeholder="Ej: 7SC-A"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                      isSubmitting 
                        ? 'border-gray-200 dark:border-slate-600 opacity-50 cursor-not-allowed' 
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Estudiante */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Estudiante
                  </label>
                  <input
                    type="text"
                    value={formData.metadata.student}
                    onChange={(e) => handleMetadataChange('student', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                      isSubmitting 
                        ? 'border-gray-200 dark:border-slate-600 opacity-50 cursor-not-allowed' 
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Número de Control */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Número de Control
                  </label>
                  <input
                    type="text"
                    value={formData.metadata.studentId}
                    onChange={(e) => handleMetadataChange('studentId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                      isSubmitting 
                        ? 'border-gray-200 dark:border-slate-600 opacity-50 cursor-not-allowed' 
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Profesor */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Profesor/Asesor
                  </label>
                  <input
                    type="text"
                    value={formData.metadata.professor}
                    onChange={(e) => handleMetadataChange('professor', e.target.value)}
                    placeholder="Ej: Dr. Juan Pérez Hernández"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white ${
                      isSubmitting 
                        ? 'border-gray-200 dark:border-slate-600 opacity-50 cursor-not-allowed' 
                        : 'border-gray-300 dark:border-slate-600'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-slate-600">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                isSubmitting
                  ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-[1.02] hover:shadow-xl'
              } text-white`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <Book className="w-5 h-5" />
                  Generar Reporte
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}