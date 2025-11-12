import { useState, useEffect } from 'react';
import { 
  Key, 
  Eye, 
  EyeOff, 
  Save, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trash2,
  Info,
  Server,
  User,
  Cpu,
  Zap,
  Sparkles,
  ChevronDown,
  Check
} from 'lucide-react';
import api from '../../api/axios.config';

const IASettingsTab = () => {
  // Estados para API Key
  const [apiKeyInfo, setApiKeyInfo] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Estados para Modelo
  const [modelsInfo, setModelsInfo] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  
  // Estados UI
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const modelDescriptions = {
    'gemini-2.0-flash-exp': {
      icon: Sparkles,
      color: 'purple',
      speed: 'Muy Rápido',
      quality: 'Experimental',
      bestFor: 'Pruebas y velocidad'
    },
    'gemini-1.5-flash': {
      icon: Zap,
      color: 'green',
      speed: 'Rápido',
      quality: 'Excelente',
      bestFor: 'Análisis de imágenes académicas'
    },
    'gemini-1.5-flash-latest': {
      icon: Zap,
      color: 'blue',
      speed: 'Rápido',
      quality: 'Mejorado',
      bestFor: 'Última versión estable'
    },
    'gemini-1.5-pro': {
      icon: Cpu,
      color: 'indigo',
      speed: 'Moderado',
      quality: 'Superior',
      bestFor: 'Análisis complejos'
    },
    'gemini-1.5-pro-latest': {
      icon: Cpu,
      color: 'violet',
      speed: 'Moderado',
      quality: 'Premium',
      bestFor: 'Máxima calidad'
    },
    'gemini-2.5-flash': {
      icon: Sparkles,
      color: 'pink',
      speed: 'Rápido',
      quality: 'Avanzado',
      bestFor: 'Comprensión mejorada'
    }
  };

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const fetchAllSettings = async () => {
    try {
      setLoading(true);
      const [apiResponse, modelsResponse] = await Promise.all([
        api.get('/api/apikey/info'),
        api.get('/api/user/gemini/models')
      ]);
      
      if (apiResponse.data.success) {
        setApiKeyInfo(apiResponse.data.data);
      }
      
      if (modelsResponse.data.success) {
        setModelsInfo(modelsResponse.data.data);
        setSelectedModel(modelsResponse.data.data.currentModel);
      }
    } catch (err) {
      console.error('Error cargando configuración:', err);
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim() || !apiKey.startsWith('AIza')) {
      setError('API key inválida. Debe comenzar con "AIza"');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const response = await api.post('/api/apikey/set', {
        apiKey: apiKey.trim()
      });
      
      if (response.data.success) {
        setSuccess('✓ API key configurada correctamente');
        setApiKey('');
        setShowApiKey(false);
        await fetchAllSettings();
        
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la API key');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleApiKeyUsage = async (usePersonal) => {
    try {
      setError(null);
      const response = await api.post('/api/apikey/toggle', {
        usePersonalApiKey: usePersonal
      });
      
      if (response.data.success) {
        setSuccess(usePersonal ? '✓ Usando tu API key' : '✓ Usando API key del servidor');
        await fetchAllSettings();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar el modo');
    }
  };

  const handleSelectModel = async (model) => {
    try {
      setError(null);
      const response = await api.put('/api/user/gemini/model', {
        model: model,
        usePersonalModel: true
      });
      
      if (response.data.success) {
        setSelectedModel(model);
        setShowModelSelector(false);
        setSuccess(`✓ Cambiado a ${modelsInfo.models.find(m => m.value === model)?.label}`);
        await fetchAllSettings();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar el modelo');
    }
  };

  const handleUseServerModel = async () => {
    try {
      setError(null);
      const response = await api.put('/api/user/gemini/model', {
        usePersonalModel: false
      });
      
      if (response.data.success) {
        setSelectedModel(null);
        setSuccess('✓ Usando modelo del servidor');
        await fetchAllSettings();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar el modelo');
    }
  };

  const handleDeleteApiKey = async () => {
    if (!window.confirm('¿Eliminar tu API key? Esta acción no se puede deshacer.')) return;

    try {
      const response = await api.delete('/api/apikey/delete');
      if (response.data.success) {
        setSuccess('✓ API key eliminada');
        await fetchAllSettings();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentModelInfo = modelsInfo?.models?.find(m => m.value === selectedModel);
  const usingServerModel = !modelsInfo?.usingPersonalModel;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Configuración de IA
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Personaliza tu experiencia con Gemini
        </p>
      </div>

      {/* Alertas */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm font-medium text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {/* SECCIÓN 1: SELECCIÓN DE FUENTE (API Key) */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Fuente de API Key
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Elige dónde obtener las credenciales para usar Gemini
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Opción: Servidor */}
          <button
            onClick={() => handleToggleApiKeyUsage(false)}
            className={`w-full p-5 rounded-xl border-2 transition-all ${
              !apiKeyInfo?.isUsingPersonalKey
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  !apiKeyInfo?.isUsingPersonalKey
                    ? 'bg-blue-100 dark:bg-blue-900/40'
                    : 'bg-gray-100 dark:bg-slate-700'
                }`}>
                  <Server className={`w-6 h-6 ${
                    !apiKeyInfo?.isUsingPersonalKey
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Usar API del Servidor
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Gratis • Sin configuración • Listo para usar
                  </p>
                </div>
              </div>
              {!apiKeyInfo?.isUsingPersonalKey && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Activo
                </div>
              )}
            </div>
          </button>

          {/* Opción: Personal */}
          <button
            onClick={() => apiKeyInfo?.hasApiKey && handleToggleApiKeyUsage(true)}
            disabled={!apiKeyInfo?.hasApiKey}
            className={`w-full p-5 rounded-xl border-2 transition-all ${
              apiKeyInfo?.isUsingPersonalKey
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : apiKeyInfo?.hasApiKey
                  ? 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                  : 'border-gray-200 dark:border-slate-700 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  apiKeyInfo?.isUsingPersonalKey
                    ? 'bg-green-100 dark:bg-green-900/40'
                    : 'bg-gray-100 dark:bg-slate-700'
                }`}>
                  <User className={`w-6 h-6 ${
                    apiKeyInfo?.isUsingPersonalKey
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Usar mi API Key Personal
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {apiKeyInfo?.hasApiKey 
                      ? `Configurada • ${apiKeyInfo?.apiKeyInfo?.masked || 'Oculta'}`
                      : 'Requiere configuración'}
                  </p>
                </div>
              </div>
              {apiKeyInfo?.isUsingPersonalKey && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Activo
                </div>
              )}
            </div>
          </button>

          {/* Configurar API Key */}
          {!apiKeyInfo?.hasApiKey && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-start gap-3 mb-3">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800 dark:text-yellow-200">
                  <p className="font-medium mb-1">¿Quieres usar tu propia API key?</p>
                  <p>Obtén una gratuita en Google AI Studio</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveApiKey}
                    disabled={saving || !apiKey.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Guardar
                      </>
                    )}
                  </button>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600"
                  >
                    Obtener Key
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Eliminar API Key */}
          {apiKeyInfo?.hasApiKey && (
            <button
              onClick={handleDeleteApiKey}
              className="w-full px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar mi API Key
            </button>
          )}
        </div>
      </div>

      {/* SECCIÓN 2: SELECCIÓN DE MODELO */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <Cpu className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Modelo de IA
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cada modelo tiene diferentes características de velocidad y calidad
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Modelo Actual */}
          <div className={`p-5 rounded-xl border-2 ${
            usingServerModel
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-green-500 bg-green-50 dark:bg-green-900/20'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Modelo Activo
              </p>
              {usingServerModel && (
                <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  Servidor
                </span>
              )}
            </div>
            
            {currentModelInfo && !usingServerModel ? (
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = modelDescriptions[currentModelInfo.value]?.icon || Cpu;
                  return <Icon className="w-8 h-8 text-green-600 dark:text-green-400" />;
                })()}
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    {currentModelInfo.label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentModelInfo.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Server className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    Modelo del Servidor
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {modelsInfo?.serverDefaultModel || 'Configuración automática'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botón Cambiar Modelo */}
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-xl hover:border-gray-300 dark:hover:border-slate-500 transition-colors flex items-center justify-between group"
          >
            <span className="font-medium text-gray-900 dark:text-white">
              Cambiar Modelo
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
              showModelSelector ? 'rotate-180' : ''
            }`} />
          </button>

          {/* Selector de Modelos */}
          {showModelSelector && modelsInfo?.models && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              {/* Opción: Servidor */}
              <button
                onClick={handleUseServerModel}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  usingServerModel
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Modelo del Servidor
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Configuración automática
                      </p>
                    </div>
                  </div>
                  {usingServerModel && <Check className="w-5 h-5 text-blue-600" />}
                </div>
              </button>

              {/* Modelos Disponibles */}
              {modelsInfo.models.map((model) => {
                const meta = modelDescriptions[model.value] || {};
                const Icon = meta.icon || Cpu;
                const isSelected = selectedModel === model.value && !usingServerModel;

                return (
                  <button
                    key={model.value}
                    onClick={() => handleSelectModel(model.value)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-slate-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-6 h-6 ${
                          isSelected ? 'text-green-600' : 'text-gray-400'
                        }`} />
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {model.label}
                            </p>
                            {model.badge && (
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                model.badge === 'Recomendado'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {model.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {model.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-green-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">💡 Recomendación para análisis de imágenes</p>
            <p>
              Si tienes problemas analizando imágenes académicas, prueba con{' '}
              <strong>Gemini 1.5 Flash</strong> o <strong>Gemini 1.5 Pro Latest</strong>.
              Son más flexibles con contenido multimodal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IASettingsTab;