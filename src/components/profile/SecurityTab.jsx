// src/components/profile/SecurityTab.jsx

import { useState } from 'react';
import { Lock, Eye, EyeOff, Trash2, AlertTriangle } from 'lucide-react';

const SecurityTab = ({ passwordData, setPasswordData, onChangePassword, isSaving }) => {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [validationErrors, setValidationErrors] = useState([]);

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Debe contener al menos una mayúscula');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Debe contener al menos una minúscula');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Debe contener al menos un número');
    }
    
    if (!/[@$!%*?&#]/.test(password)) {
      errors.push('Debe contener al menos un carácter especial (@$!%*?&#)');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors([]);

    // Validar que las contraseñas coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setValidationErrors(['Las contraseñas no coinciden']);
      return;
    }

    // Validar requisitos de la nueva contraseña
    const errors = validatePassword(passwordData.newPassword);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Llamar a la función de cambio de contraseña
    const success = await onChangePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (success) {
      // Limpiar el formulario solo si fue exitoso
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setValidationErrors([]);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Seguridad y Contraseña
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Mantén tu cuenta segura
        </p>
      </div>

      {/* Cambiar Contraseña */}
      <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Cambiar Contraseña
        </h3>
        
        {/* Mensajes de error de validación */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                  Errores de validación:
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-400 list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contraseña actual
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>La contraseña debe cumplir con:</p>
              <ul className="list-disc list-inside pl-2">
                <li>Mínimo 8 caracteres</li>
                <li>Al menos una mayúscula (A-Z)</li>
                <li>Al menos una minúscula (a-z)</li>
                <li>Al menos un número (0-9)</li>
                <li>Al menos un carácter especial (@$!%*?&#)</li>
              </ul>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirmar nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Cambiando contraseña...
              </>
            ) : (
              'Cambiar contraseña'
            )}
          </button>
        </div>
      </div>

      {/* Zona de peligro */}
      <div className="p-6 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
              Zona de Peligro
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Una vez que elimines tu cuenta, no hay vuelta atrás. Se eliminarán permanentemente todas tus conversaciones, mensajes y datos.
            </p>
            <button
              onClick={() => alert('Funcionalidad de eliminación de cuenta próximamente')}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;