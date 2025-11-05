// src/components/profile/ApiKeyTab.jsx

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
  RefreshCw,
  Info,
  Server,
  User
} from 'lucide-react';
import api from '../../api/axios.config';

const ApiKeyTab = () => {
  const [apiKeyInfo, setApiKeyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchApiKeyInfo();
  }, []);

  const fetchApiKeyInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/apikey/info');
      
      if (response.data.success) {
        setApiKeyInfo(response.data.data);
      }
    } catch (err) {
      console.error('[ApiKeyTab] Error al cargar info:', err);
      setError('Error al cargar la información de la API key');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setError('Por favor ingresa una API key');
      return;
    }

    if (!apiKey.startsWith('AIza')) {
      setError('La API key debe comenzar con "AIza"');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.post('/api/apikey/set', {
        apiKey: apiKey.trim()
      });
      
      if (response.data.success) {
        setSuccess('API key configurada exitosamente');
        setApiKey('');
        setShowApiKey(false);
        await fetchApiKeyInfo();
      } else {
        setError(response.data.message || 'Error al guardar la API key');
      }
    } catch (err) {
      console.error('[ApiKeyTab] Error al guardar:', err);
      setError(err.response?.data?.message || 'Error al guardar la API key');
    } finally {
      setSaving(false);
    }
  };

  const handleValidateApiKey = async () => {
    try {
      setValidating(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.post('/api/apikey/validate');
      
      if (response.data.success) {
        if (response.data.data.isValid) {
          setSuccess(`API key válida - Modelo: ${response.data.data.model || 'N/A'}`);
        } else {
          setError('API key inválida');
        }
        await fetchApiKeyInfo();
      } else {
        setError(response.data.message || 'Error al validar');
      }
    } catch (err) {
      console.error('[ApiKeyTab] Error al validar:', err);
      setError(err.response?.data?.message || 'Error al validar la API key');
    } finally {
      setValidating(false);
    }
  };

  const handleToggleUsage = async (usePersonal) => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await api.post('/api/apikey/toggle', {
        usePersonalApiKey: usePersonal
      });
      
      if (response.data.success) {
        setSuccess(response.data.message);
        await fetchApiKeyInfo();
      } else {
        setError(response.data.message || 'Error al cambiar modo');
      }
    } catch (err) {
      console.error('[ApiKeyTab] Error al cambiar modo:', err);
      setError(err.response?.data?.message || 'Error al cambiar el modo');
    }
  };

  const handleDeleteApiKey = async () => {
    if (!window.confirm('¿Estás seguro de eliminar tu API key personal? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.delete('/api/apikey/delete');
      
      if (response.data.success) {
        setSuccess('API key eliminada exitosamente');
        await fetchApiKeyInfo();
      } else {
        setError(response.data.message || 'Error al eliminar');
      }
    } catch (err) {
      console.error('[ApiKeyTab] Error al eliminar:', err);
      setError(err.response?.data?.message || 'Error al eliminar la API key');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          API Key de Gemini
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configura tu propia API key de Google Gemini para usar el servicio
        </p>
      </div>

      {/* Alertas */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 dark:text-green-300">{success}</p>
        </div>
      )}

      {/* Info Card */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">¿Qué es esto?</p>
            <p>
              Puedes usar tu propia API key de Google Gemini en lugar de la del servidor. 
              Esto te permite tener control total sobre tu uso y costos.
            </p>
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Obtener API key gratuita →
            </a>
          </div>
        </div>
      </div>

      {/* Estado Actual */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Estado Actual
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
            <div className="flex items-center gap-3">
              {apiKeyInfo?.isUsingPersonalKey ? (
                <User className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {apiKeyInfo?.isUsingPersonalKey ? 'API Key Personal' : 'API Key del Servidor'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Modo activo actualmente
                </p>
              </div>
            </div>
            {apiKeyInfo?.isUsingPersonalKey ? (
              <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                Personal
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                Servidor
              </span>
            )}
          </div>

          {apiKeyInfo?.hasApiKey && (
            <>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {apiKeyInfo?.apiKeyInfo?.masked || 'API Key Configurada'}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {apiKeyInfo?.apiKeyInfo?.length ? `${apiKeyInfo.apiKeyInfo.length} caracteres` : 'Oculta por seguridad'}
                    </p>
                  </div>
                </div>
                {apiKeyInfo?.isActive ? (
                  <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Activa
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-medium rounded-full flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Inactiva
                  </span>
                )}
              </div>

              {apiKeyInfo?.lastValidated && (
                <p className="text-xs text-gray-500 dark:text-gray-400 pl-3">
                  Última validación: {new Date(apiKeyInfo.lastValidated).toLocaleString('es-MX')}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Configurar/Actualizar API Key */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {apiKeyInfo?.hasApiKey ? 'Actualizar API Key' : 'Configurar API Key'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key de Google Gemini
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Debe comenzar con "AIza". Obtén una gratuita en{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <button
            onClick={handleSaveApiKey}
            disabled={saving || !apiKey.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {apiKeyInfo?.hasApiKey ? 'Actualizar API Key' : 'Guardar API Key'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Acciones de API Key */}
      {apiKeyInfo?.hasApiKey && (
        <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Acciones
          </h3>

          <div className="space-y-3">
            <button
              onClick={handleValidateApiKey}
              disabled={validating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {validating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  Validar API Key
                </>
              )}
            </button>

            {apiKeyInfo?.serverApiKeyAvailable && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cambiar modo de API Key:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleToggleUsage(true)}
                    disabled={!apiKeyInfo?.isActive}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      apiKeyInfo?.isUsingPersonalKey
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <User className="w-5 h-5 mx-auto mb-1" />
                    Personal
                  </button>
                  <button
                    onClick={() => handleToggleUsage(false)}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      !apiKeyInfo?.isUsingPersonalKey
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Server className="w-5 h-5 mx-auto mb-1" />
                    Servidor
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleDeleteApiKey}
              disabled={deleting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-5 h-5" />
                  Eliminar API Key
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Advertencia de seguridad */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-300">
            <p className="font-medium mb-1">Importante</p>
            <p>
              Tu API key se almacena de forma segura y encriptada. Nunca la compartas con nadie.
              Si sospechas que fue comprometida, elimínala inmediatamente y genera una nueva.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyTab;