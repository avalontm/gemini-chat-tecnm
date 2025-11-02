import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ArrowLeft, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@api';
import { APP_CONFIG } from '@config/app.config';

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
  const [emailValidation, setEmailValidation] = useState({
    isValid: false,
    message: '',
    isInstitutional: false,
  });

  // Validar correo institucional en tiempo real
  const validateInstitutionalEmail = (email) => {
    if (!email) {
      return {
        isValid: false,
        message: '',
        isInstitutional: false,
      };
    }

    // Patrón para correo institucional: al########@ite.edu.mx
    const institucionalPattern = /^al\d{8}@ite\.edu\.mx$/i;
    
    // Patrón general de email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (institucionalPattern.test(email)) {
      return {
        isValid: true,
        message: 'Correo institucional válido',
        isInstitutional: true,
      };
    } else if (emailPattern.test(email)) {
      if (email.toLowerCase().includes('@ite.edu.mx')) {
        return {
          isValid: false,
          message: 'El formato debe ser: al########@ite.edu.mx (8 dígitos)',
          isInstitutional: false,
        };
      }
      return {
        isValid: false,
        message: 'Debes usar tu correo institucional @ite.edu.mx',
        isInstitutional: false,
      };
    } else {
      return {
        isValid: false,
        message: 'Formato de correo inválido',
        isInstitutional: false,
      };
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Actualizar datos del formulario
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Validar email en tiempo real
    if (name === 'email') {
      const validation = validateInstitutionalEmail(value);
      setEmailValidation(validation);
    }
  };

  const validateForm = () => {
    // Validar campos vacíos
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Todos los campos son obligatorios');
      return false;
    }

    // Validar nombre de usuario mínimo 3 caracteres
    if (formData.username.length < 3) {
      toast.error('El nombre debe tener al menos 3 caracteres');
      return false;
    }

    // Validar correo institucional
    if (!emailValidation.isValid || !emailValidation.isInstitutional) {
      toast.error('Debes usar tu correo institucional del TecNM (al########@ite.edu.mx)');
      return false;
    }

    // Validar contraseña mínimo 8 caracteres
    if (formData.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }

    // Validar términos y condiciones
    if (!formData.acceptTerms) {
      toast.error('Debes aceptar los términos y condiciones');
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
      
      // Mostrar mensaje de éxito
      toast.success('¡Cuenta creada exitosamente! Bienvenido al TecNM Chat');

      // Redirigir al chat
      navigate('/chat');
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Mostrar mensaje de error
      const errorMessage = error.message || 'Error al crear la cuenta. Intenta de nuevo.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Extraer número de control del email
  const getControlNumber = () => {
    if (emailValidation.isInstitutional) {
      const match = formData.email.match(/al(\d{8})@/);
      return match ? match[1] : '';
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center p-4">
      
      {/* Botón de regresar */}
      <Link 
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver al inicio</span>
      </Link>

      {/* Card de Registro */}
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          
          {/* Header con branding TecNM */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Crear Cuenta Estudiantil
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              TecNM Campus Ensenada
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm">
              <Mail className="w-4 h-4" />
              <span>Correo institucional requerido</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre completo
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Juan Pérez García"
                />
              </div>
            </div>

            {/* Email Institucional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo institucional
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
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    formData.email && emailValidation.isValid
                      ? 'border-green-500 focus:ring-green-500'
                      : formData.email && !emailValidation.isValid
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-slate-600 focus:ring-red-500'
                  }`}
                  placeholder="al23760194@ite.edu.mx"
                />
                {formData.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {emailValidation.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              
              {/* Mensajes de validación */}
              {formData.email && (
                <div className={`mt-2 text-xs flex items-start gap-2 ${
                  emailValidation.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {emailValidation.isValid ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{emailValidation.message}</span>
                </div>
              )}
              
              {!formData.email && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span>Formato: <code className="bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">al########@ite.edu.mx</code></span>
                </p>
              )}

              {emailValidation.isInstitutional && (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-300">
                    <GraduationCap className="w-4 h-4" />
                    <span className="font-medium">Número de control: {getControlNumber()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Mínimo 8 caracteres
              </p>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar contraseña
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-4 h-4 mt-1 text-red-600 border-gray-300 rounded focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Acepto los{' '}
                <Link to="/terms" className="text-red-600 dark:text-red-400 hover:underline">
                  términos y condiciones
                </Link>{' '}
                y la{' '}
                <Link to="/privacy" className="text-red-600 dark:text-red-400 hover:underline">
                  política de privacidad
                </Link>
              </label>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading || !emailValidation.isInstitutional}
              className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creando cuenta...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Crear cuenta estudiantil</span>
                </>
              )}
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Solo estudiantes activos del TecNM Campus Ensenada pueden registrarse usando su correo institucional.</span>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link a Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-red-600 dark:text-red-400 hover:underline font-medium"
            >
              Inicia sesión aquí
            </Link>
          </div>
        </div>

        {/* Ayuda adicional */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>¿No tienes correo institucional?</p>
          <p className="mt-1">Contacta a servicios escolares del TecNM Campus Ensenada</p>
        </div>
      </div>
    </div>
  );
}

export default Register;