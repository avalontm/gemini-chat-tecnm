import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, ArrowLeft, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@context/AuthContext';
import { SITE_CONFIG } from '@config/constants';

function Login() {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validaciones básicas
    if (!formData.email || !formData.password) {
      toast.error('Por favor, completa todos los campos');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Por favor, ingresa un email válido');
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      console.log('[LOGIN] Iniciando proceso de login...');
      console.log('Email:', formData.email);
      console.log('Remember Me:', formData.rememberMe);
      
      // Llamar al login del AuthContext
      const result = await login(
        formData.email, 
        formData.password,
        formData.rememberMe
      );

      console.log('[LOGIN] Resultado recibido:', result);

      // Verificar si el login fue exitoso
      if (result && result.success) {
        console.log('[LOGIN] Login exitoso!');
        console.log('Usuario:', result.user);
        
        // Pequeño delay para asegurar que el estado se actualice
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Verificar localStorage
        const storedToken = localStorage.getItem('gemini_chat_token');
        const storedUser = localStorage.getItem('gemini_chat_user');
        console.log('Token en localStorage:', storedToken ? 'SI' : 'NO');
        console.log('User en localStorage:', storedUser ? 'SI' : 'NO');
        
        // Redirigir al chat
        console.log('[LOGIN] Redirigiendo a /chat...');
        navigate(SITE_CONFIG.routes.chat, { replace: true });
        
      } else {
        console.error('[LOGIN] Login falló');
        console.error('Error:', result?.error);
        
        // Si el resultado no tiene success, mostrar error genérico
        if (!result || !result.error) {
          toast.error('Error al iniciar sesión. Intenta de nuevo.');
        }
      }
    } catch (error) {
      console.error('[LOGIN] Error inesperado:', error);
      console.error('Stack:', error.stack);
      toast.error('Error inesperado. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Combinar loading del componente y del contexto
  const isButtonDisabled = isLoading || authLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center p-4">
      
      {/* Botón de regresar */}
      <Link 
        to={SITE_CONFIG.routes.home}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver al inicio</span>
      </Link>

      {/* Card de Login */}
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          
          {/* Header con branding TecNM */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              TecNM Campus Ensenada
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm">
              <Mail className="w-4 h-4" />
              <span>Correo institucional</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* Email */}
            <div>
              <label 
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isButtonDisabled}
                  autoComplete="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="al23760194@ite.edu.mx"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label 
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isButtonDisabled}
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Recordarme / Olvidé contraseña */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isButtonDisabled}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Recordarme
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isButtonDisabled}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isButtonDisabled ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Iniciar sesión</span>
                </>
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
                ¿No tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link a Registro */}
          <div className="mt-6 text-center">
            <Link
              to={SITE_CONFIG.routes.register}
              className="text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              Crear cuenta estudiantil
            </Link>
          </div>
        </div>

        {/* Ayuda adicional */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>¿Problemas para acceder?</p>
          <p className="mt-1">Contacta a servicios escolares del TecNM Campus Ensenada</p>
        </div>
      </div>
    </div>
  );
}

export default Login;