// src/pages/VerifyEmail.jsx

import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, GraduationCap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@api/endpoints/auth.api';
import { SITE_CONFIG } from '@config/constants';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [verificationState, setVerificationState] = useState('verifying');
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current || !token) {
      if (!token) {
        toast.error('Token de verificacion invalido');
        setVerificationState('error');
        setErrorMessage('Token de verificacion invalido');
      }
      return;
    }

    hasVerified.current = true;
    verifyEmailToken();
  }, [token]);

  useEffect(() => {
    if (verificationState === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (verificationState === 'success' && countdown === 0) {
      navigate(SITE_CONFIG.routes.login);
    }
  }, [verificationState, countdown, navigate]);

  const verifyEmailToken = async () => {
    try {
      const response = await authAPI.verifyEmail(token);

      if (response.success) {
        setVerificationState('success');
        toast.success('Cuenta verificada exitosamente');
      } else {
        setVerificationState('error');
        const message = response.message || 'Error al verificar la cuenta';
        setErrorMessage(message);
        toast.error(message);
      }
    } catch (error) {
      setVerificationState('error');
      
      const errorMsg = error.response?.data?.message || 
                       'Token invalido o expirado. Por favor registrate nuevamente.';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (verificationState === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700 transition-all duration-300">
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-full mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Verificando tu cuenta
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Por favor espera mientras verificamos tu correo electronico...
              </p>

              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (verificationState === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center p-4">
        
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700 transition-all duration-300">
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-full mb-4 animate-pulse">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Cuenta Verificada
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Tu correo electronico ha sido verificado exitosamente.
              </p>
              
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                  Ya puedes iniciar sesion en Gemini Chat TecNM
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <p>
                  Seras redirigido al inicio de sesion en <span className="font-bold text-red-600 dark:text-red-400">{countdown}</span> segundos...
                </p>
              </div>

              <Link
                to={SITE_CONFIG.routes.login}
                className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Ir al inicio de sesion
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Bienvenido a</p>
            <p className="mt-1 font-semibold">TecNM Campus Ensenada</p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationState === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center p-4">
        
        <Link 
          to={SITE_CONFIG.routes.register}
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al registro</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-slate-700 transition-all duration-300">
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Verificacion Fallida
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No pudimos verificar tu cuenta.
              </p>

              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {errorMessage}
                  </p>
                </div>
              )}
              
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-2">
                  Posibles razones:
                </p>
                <ul className="text-xs text-red-700 dark:text-red-400 text-left space-y-1">
                  <li>El enlace de verificacion ha expirado (valido por 24 horas)</li>
                  <li>El enlace ya fue utilizado anteriormente</li>
                  <li>El enlace es invalido o fue modificado</li>
                </ul>
              </div>

              <div className="space-y-3 mb-6">
                <Link
                  to={SITE_CONFIG.routes.register}
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Registrarse nuevamente
                </Link>

                <Link
                  to={SITE_CONFIG.routes.login}
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-white dark:bg-slate-700 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300"
                >
                  Ir al inicio de sesion
                </Link>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Si acabas de registrarte, revisa tu bandeja de entrada y spam para encontrar el correo de verificacion.
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Problemas para verificar tu cuenta</p>
            <p className="mt-1">Contacta a servicios escolares del TecNM Campus Ensenada</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default VerifyEmail;