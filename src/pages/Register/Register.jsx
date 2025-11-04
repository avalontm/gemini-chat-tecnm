import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Lock, User, ArrowLeft, GraduationCap, AlertCircle, CheckCircle, BookOpen, Phone, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../../api/endpoints/auth.api';

// Importar las carreras del TecNM desde constants (asumiendo que las tienes en tu config)
const CARRERAS = [
  'Ingeniería en Innovación Agrícola Sustentable',
  'Ingeniería Electromecánica',
  'Ingeniería Electrónica',
  'Ingeniería en Gestión Empresarial',
  'Ingeniería Industrial',
  'Ingeniería Mecatrónica',
  'Ingeniería en Sistemas Computacionales',
  'Licenciatura en Administración',
  'Ingeniería Industrial TecNM-Virtual',
  'Ingeniería en Sistemas Computacionales TecNM-Virtual',
  'Ingeniería Electromecánica en Playas de Rosarito',
  'Ingeniería Industrial en Playas de Rosarito',
  'Ingeniería en Sistemas Computacionales en Playas de Rosarito',
  'Licenciatura en Administración en Playas de Rosarito',
  'Ingeniería en Sistemas Computacionales en Tecate',
  'Ingeniería Industrial en Tecate',
  'Licenciatura en Administración en Tecate',
  'Especialización en Industria Aeroespacial',
  'Maestría en Ingeniería Aeroespacial',
  'Maestría en Ciencias en Ingeniería Mecatrónica',
  'Doctorado en Ciencias en Ingeniería Mecatrónica',
];

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numeroControl: '',
    password: '',
    confirmPassword: '',
    nombreCompleto: '',
    carrera: '',
    semestre: '',
    telefono: '',
    avatar: null,
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [numeroControlValidation, setNumeroControlValidation] = useState({
    isValid: false,
    message: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Validar número de control en tiempo real
  const validateNumeroControl = (numeroControl) => {
    if (!numeroControl) {
      return {
        isValid: false,
        message: '',
      };
    }

    // Debe ser exactamente 8 dígitos
    const pattern = /^\d{8}$/;

    if (pattern.test(numeroControl)) {
      return {
        isValid: true,
        message: 'Número de control válido',
      };
    } else if (numeroControl.length > 0 && numeroControl.length < 8) {
      return {
        isValid: false,
        message: `Faltan ${8 - numeroControl.length} dígitos`,
      };
    } else if (numeroControl.length > 8) {
      return {
        isValid: false,
        message: 'El número de control debe tener exactamente 8 dígitos',
      };
    } else {
      return {
        isValid: false,
        message: 'Solo se permiten números',
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

    // Validar número de control en tiempo real
    if (name === 'numeroControl') {
      const validation = validateNumeroControl(value);
      setNumeroControlValidation(validation);
    }
  };

  // Manejar carga de avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }

    // Validar tamaño (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen no debe superar 10MB');
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        avatar: reader.result,
      }));
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    // Validar número de control
    if (!numeroControlValidation.isValid) {
      toast.error('El número de control debe tener 8 dígitos');
      return false;
    }

    // Validar nombre completo
    if (!formData.nombreCompleto || formData.nombreCompleto.trim().length < 3) {
      toast.error('El nombre completo debe tener al menos 3 caracteres');
      return false;
    }

    // Validar carrera
    if (!formData.carrera) {
      toast.error('Debes seleccionar una carrera');
      return false;
    }

    // Validar semestre
    const semestre = parseInt(formData.semestre);
    if (!semestre || semestre < 1 || semestre > 12) {
      toast.error('El semestre debe estar entre 1 y 12');
      return false;
    }

    // Validar contraseña mínimo 6 caracteres
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }

    // Validar teléfono si se proporciona
    if (formData.telefono && !/^\d{10}$/.test(formData.telefono)) {
      toast.error('El teléfono debe tener 10 dígitos');
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
      // Preparar datos para enviar
      const registerData = {
        numeroControl: formData.numeroControl,
        password: formData.password,
        nombreCompleto: formData.nombreCompleto.trim(),
        carrera: formData.carrera,
        semestre: parseInt(formData.semestre),
      };

      // Agregar campos opcionales solo si tienen valor
      if (formData.telefono) {
        registerData.telefono = formData.telefono;
      }

      if (formData.avatar) {
        registerData.avatar = formData.avatar;
      }

      console.log('Enviando datos de registro:', {
        ...registerData,
        avatar: registerData.avatar ? 'Base64 image...' : undefined,
      });

      // Llamar a la API de registro
      const response = await authAPI.register(registerData);
      
      // Mostrar mensaje de éxito
      toast.success('¡Cuenta creada exitosamente! Bienvenido al TecNM Chat');

      // Redirigir al chat
      navigate('/chat');
    } catch (error) {
      console.error('Error en registro:', error);
      
      // Mostrar mensaje de error específico
      let errorMessage = 'Error al crear la cuenta. Intenta de nuevo.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Errores específicos
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors) && errors.length > 0) {
          errorMessage = errors[0].msg || errors[0].message || errorMessage;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Generar email institucional
  const getInstitutionalEmail = () => {
    if (numeroControlValidation.isValid) {
      return `al${formData.numeroControl}@ite.edu.mx`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center p-4">
      
      {/* Botón de regresar */}
      <Link 
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver al inicio</span>
      </Link>

      {/* Card de Registro */}
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700 transition-all duration-300">
          
          {/* Header con branding TecNM */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Crear Cuenta Estudiantil
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              TecNM Campus Ensenada
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grid de 2 columnas para campos principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Número de Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Número de Control *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="numeroControl"
                    value={formData.numeroControl}
                    onChange={handleChange}
                    maxLength={8}
                    required
                    disabled={isLoading}
                    className={`block w-full px-3 py-3 border rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      formData.numeroControl && numeroControlValidation.isValid
                        ? 'border-green-500 focus:ring-green-500'
                        : formData.numeroControl && !numeroControlValidation.isValid
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 dark:border-slate-600 focus:ring-red-500'
                    }`}
                    placeholder="23760194"
                  />
                  {formData.numeroControl && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {numeroControlValidation.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                
                {formData.numeroControl && (
                  <div className={`mt-2 text-xs flex items-start gap-2 ${
                    numeroControlValidation.isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    <span>{numeroControlValidation.message}</span>
                  </div>
                )}

                {numeroControlValidation.isValid && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300">
                      <span className="font-medium">Email: {getInstitutionalEmail()}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Juan Pérez López"
                  />
                </div>
              </div>
            </div>

            {/* Grid para Carrera y Semestre */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Carrera */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Carrera *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Selecciona tu carrera</option>
                    {CARRERAS.map((carrera) => (
                      <option key={carrera} value={carrera}>
                        {carrera}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Semestre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Semestre *
                </label>
                <select
                  name="semestre"
                  value={formData.semestre}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="block w-full px-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Sem.</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Teléfono (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono (opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  maxLength={10}
                  disabled={isLoading}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="6461234567"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                10 dígitos sin espacios
              </p>
            </div>

            {/* Avatar (opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foto de perfil (opcional)
              </label>
              <div className="flex items-center gap-4">
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg hover:border-red-500 transition-colors">
                    <Image className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {avatarPreview ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Máximo 10MB (JPG, PNG, GIF, WebP)
              </p>
            </div>

            {/* Grid para Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contraseña *
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
                  Mínimo 6 caracteres
                </p>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar contraseña *
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
              disabled={isLoading || !numeroControlValidation.isValid}
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
              <span>Solo estudiantes activos del TecNM Campus Ensenada pueden registrarse. Tu email se generará automáticamente: al[numeroControl]@ite.edu.mx</span>
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
          <p>¿No tienes número de control?</p>
          <p className="mt-1">Contacta a servicios escolares del TecNM Campus Ensenada</p>
        </div>
      </div>
    </div>
  );
}

export default Register;