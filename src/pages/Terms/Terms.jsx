import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, AlertCircle, GraduationCap } from 'lucide-react';
import { APP_CONFIG } from '@config/app.config';

function Terms() {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al inicio</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                TecNM Campus Ensenada
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        
        {/* Hero */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 rounded-full mb-6">
            <FileText className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {APP_CONFIG.app.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Última actualización: Noviembre 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          
          {/* Introducción */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              1. Aceptación de los Términos
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Al acceder y utilizar {APP_CONFIG.app.name}, aceptas estar sujeto a estos términos y condiciones. 
              Esta plataforma es exclusiva para estudiantes, docentes y personal del Tecnológico Nacional de México 
              Campus Ensenada. Si no estás de acuerdo con estos términos, no debes utilizar este servicio.
            </p>
          </section>

          {/* Elegibilidad */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-red-600 dark:text-red-400" />
              2. Elegibilidad y Registro
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>Para utilizar esta plataforma debes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ser estudiante activo, docente o personal del TecNM Campus Ensenada</li>
                <li>Proporcionar un correo electrónico institucional válido (@ite.edu.mx)</li>
                <li>Ser mayor de 18 años o contar con autorización de un tutor legal</li>
                <li>Proporcionar información veraz y actualizada durante el registro</li>
                <li>Mantener la confidencialidad de tu cuenta y contraseña</li>
              </ul>
            </div>
          </section>

          {/* Uso Aceptable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              3. Uso Aceptable
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>Te comprometes a utilizar la plataforma de manera responsable y ética:</p>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 my-4">
                <p className="font-semibold text-green-800 dark:text-green-300 mb-2">✓ Está permitido:</p>
                <ul className="list-disc list-inside space-y-1 text-green-700 dark:text-green-400 ml-4">
                  <li>Realizar consultas académicas y educativas</li>
                  <li>Solicitar ayuda con tareas y proyectos escolares</li>
                  <li>Investigar temas relacionados con tus estudios</li>
                  <li>Compartir conocimientos con otros estudiantes</li>
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="font-semibold text-red-800 dark:text-red-300 mb-2">✗ Está prohibido:</p>
                <ul className="list-disc list-inside space-y-1 text-red-700 dark:text-red-400 ml-4">
                  <li>Utilizar la plataforma para actividades ilegales o no éticas</li>
                  <li>Compartir contenido ofensivo, discriminatorio o inapropiado</li>
                  <li>Intentar acceder a cuentas de otros usuarios</li>
                  <li>Realizar ingeniería inversa o intentar vulnerar el sistema</li>
                  <li>Usar bots o automatización no autorizada</li>
                  <li>Hacer mal uso de la información obtenida</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Propiedad Intelectual */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              4. Propiedad Intelectual
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              El contenido generado por la IA es proporcionado por Google Gemini. Los usuarios son responsables 
              del uso que le den a la información obtenida. El TecNM Campus Ensenada no se hace responsable del 
              contenido generado por la inteligencia artificial. Los trabajos académicos son responsabilidad 
              exclusiva del estudiante.
            </p>
          </section>

          {/* Privacidad */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              5. Privacidad y Datos
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Tus conversaciones y datos personales están protegidos según nuestra{' '}
              <Link to="/privacy" className="text-red-600 dark:text-red-400 hover:underline font-medium">
                Política de Privacidad
              </Link>
              . No compartimos tu información con terceros sin tu consentimiento. Las conversaciones 
              pueden ser almacenadas para mejorar el servicio, pero siempre de forma anónima y agregada.
            </p>
          </section>

          {/* Limitación de Responsabilidad */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              6. Limitación de Responsabilidad
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>El servicio se proporciona "tal cual" sin garantías de ningún tipo:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No garantizamos la exactitud, fiabilidad o completitud de la información generada</li>
                <li>La IA puede cometer errores - verifica siempre la información importante</li>
                <li>No somos responsables de decisiones académicas basadas en las respuestas de la IA</li>
                <li>El servicio puede interrumpirse temporalmente por mantenimiento o causas técnicas</li>
                <li>No nos hacemos responsables por el uso indebido o interpretación incorrecta del contenido</li>
              </ul>
            </div>
          </section>

          {/* Uso Académico */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-red-600 dark:text-red-400" />
              7. Integridad Académica
            </h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-900 dark:text-yellow-300 leading-relaxed">
                <strong>Importante:</strong> Esta herramienta es un complemento educativo, no un sustituto del 
                aprendizaje. Los estudiantes deben cumplir con el código de ética académica del TecNM. El plagio 
                o uso indebido de la IA para completar trabajos académicos puede resultar en sanciones según el 
                reglamento institucional.
              </p>
            </div>
          </section>

          {/* Modificaciones */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              8. Modificaciones
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios 
              serán notificados a través de la plataforma. El uso continuado del servicio después de 
              las modificaciones constituye tu aceptación de los nuevos términos.
            </p>
          </section>

          {/* Terminación */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              9. Terminación de Cuenta
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Podemos suspender o terminar tu cuenta si violas estos términos o si tu estatus como 
              estudiante/personal del TecNM Campus Ensenada cambia. Puedes cancelar tu cuenta en 
              cualquier momento desde la configuración de tu perfil.
            </p>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              10. Contacto
            </h2>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Si tienes preguntas sobre estos términos, puedes contactarnos:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Institución:</strong> Tecnológico Nacional de México Campus Ensenada</li>
                <li><strong>Email:</strong> soporte@ite.edu.mx</li>
                <li><strong>Desarrollador:</strong> <a href="https://github.com/avalontm" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 hover:underline">@avalontm</a></li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Link
            to="/privacy"
            className="px-6 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg font-medium border-2 border-gray-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 text-center"
          >
            Ver Política de Privacidad
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 text-center"
          >
            Continuar con el Registro
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Terms;