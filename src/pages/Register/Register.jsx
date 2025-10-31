import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@api';
import { SITE_CONFIG } from '@config/constants';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    // Validar campos vacios
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error(SITE_CONFIG.errors.required);
      return false;
    }

    // Validar nombre de usuario minimo 3 caracteres
    if (formData.username.length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres');
      return false;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(SITE_CONFIG.errors.invalidEmail);
      return false;
    }

    // Validar contraseña minimo 8 caracteres
    if (formData.password.length < 8) {
      toast.error(SITE_CONFIG.errors.weakPassword);
      return false;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast.error(SITE_CONFIG.errors.passwordMismatch);
      return false;
    }

    // Validar terminos y condiciones
    if (!formData.acceptTerms) {
      toast.error('Debes aceptar los terminos y condiciones');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Llamar a la API de registro
      const response = await authAPI.register(
        formData.username,
        formData.email,
        formData.password
      );
      
      // Mostrar mensaje de exito
      toast.success(SITE_CONFIG.success.registerSuccess);

      // Redirigir al chat
      navigate(SITE_CONFIG.routes.chat);
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Mostrar mensaje de error
      const errorMessage = error.message || SITE_CONFIG.errors.generic;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center p-4">
      
      {/* Boton de regresar */}
      <Link 
        to={SITE_CONFIG.routes.home}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver al inicio</span>
      </Link>

      {/* Card de Registro */}
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {SITE_CONFIG.auth.register.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {SITE_CONFIG.auth.register.subtitle}
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {SITE_CONFIG.auth.register.nameLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={SITE_CONFIG.auth.register.namePlaceholder}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {SITE_CONFIG.auth.register.emailLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={SITE_CONFIG.auth.register.emailPlaceholder}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {SITE_CONFIG.auth.register.passwordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={SITE_CONFIG.auth.register.passwordPlaceholder}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Minimo 8 caracteres
              </p>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {SITE_CONFIG.auth.register.confirmPasswordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={SITE_CONFIG.auth.register.confirmPasswordPlaceholder}
                />
              </div>
            </div>

            {/* Terminos y condiciones */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {SITE_CONFIG.auth.register.terms}{' '}
                <Link to={SITE_CONFIG.routes.terms} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {SITE_CONFIG.auth.register.termsLink}
                </Link>{' '}
                {SITE_CONFIG.auth.register.and}{' '}
                <Link to={SITE_CONFIG.routes.privacy} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {SITE_CONFIG.auth.register.privacyLink}
                </Link>
              </label>
            </div>

            {/* Boton Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <span>{SITE_CONFIG.auth.register.submitButton}</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                {SITE_CONFIG.auth.register.hasAccount}
              </span>
            </div>
          </div>

          {/* Link a Login */}
          <div className="mt-6 text-center">
            <Link
              to={SITE_CONFIG.routes.login}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {SITE_CONFIG.auth.register.loginLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;