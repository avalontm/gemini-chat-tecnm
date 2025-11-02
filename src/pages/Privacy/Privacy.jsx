import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, FileText, AlertCircle, CheckCircle, GraduationCap } from 'lucide-react';
import { APP_CONFIG } from '@config/app.config';

function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 rounded-full mb-6">
            <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Política de Privacidad
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
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              Compromiso con tu Privacidad
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              En el Tecnológico Nacional de México Campus Ensenada, nos tomamos muy en serio la protección 
              de tus datos personales. Esta política explica cómo recopilamos, usamos, protegemos y 
              compartimos tu información al utilizar {APP_CONFIG.app.name}.
            </p>
          </section>

          {/* Información que Recopilamos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-red-600 dark:text-red-400" />
              1. Información que Recopilamos
            </h2>
            <div className="space-y-4">
              
              {/* Información de Registro */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Información de Registro
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-400 ml-4">
                  <li>Nombre completo</li>
                  <li>Correo electrónico institucional (@ite.edu.mx)</li>
                  <li>Número de control (extraído del correo)</li>
                  <li>Contraseña (encriptada)</li>
                  <li>Fecha de registro</li>
                </ul>
              </div>

              {/* Información de Uso */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Información de Uso
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-400 ml-4">
                  <li>Historial de conversaciones con la IA</li>
                  <li>Archivos cargados (imágenes, PDFs)</li>
                  <li>Fecha y hora de las interacciones</li>
                  <li>Configuraciones de preferencias</li>
                  <li>Estadísticas de uso (agregadas y anónimas)</li>
                </ul>
              </div>

              {/* Información Técnica */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Información Técnica
                </h3>
                <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-400 ml-4">
                  <li>Dirección IP</li>
                  <li>Tipo de navegador y dispositivo</li>
                  <li>Sistema operativo</li>
                  <li>Cookies y tokens de sesión</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cómo Usamos tu Información */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              2. Cómo Usamos tu Información
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>Utilizamos la información recopilada para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Proporcionar el servicio:</strong> Procesar tus consultas y generar respuestas personalizadas</li>
                <li><strong>Mejorar la experiencia:</strong> Optimizar la plataforma según el uso y feedback</li>
                <li><strong>Seguridad:</strong> Detectar y prevenir fraudes, abusos o uso no autorizado</li>
                <li><strong>Comunicación:</strong> Enviarte notificaciones importantes sobre el servicio</li>
                <li><strong>Investigación:</strong> Análisis agregado y anónimo para mejorar la educación con IA</li>
                <li><strong>Cumplimiento:</strong> Cumplir con requisitos legales y regulatorios</li>
              </ul>
            </div>
          </section>

          {/* Google Gemini AI */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              3. Integración con Google Gemini AI
            </h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-900 dark:text-yellow-300 leading-relaxed mb-3">
                <strong>Importante:</strong> Esta plataforma utiliza Google Gemini AI para procesar tus consultas. 
                Al utilizar el servicio:
              </p>
              <ul className="list-disc list-inside space-y-2 text-yellow-800 dark:text-yellow-400 ml-4">
                <li>Tus mensajes son enviados a los servidores de Google para procesamiento</li>
                <li>Google puede almacenar y procesar tus consultas según su propia política de privacidad</li>
                <li>No compartimos tu información personal identificable con Google</li>
                <li>Las conversaciones son anonimizadas antes de ser procesadas</li>
                <li>Recomendamos no compartir información sensible o confidencial</li>
              </ul>
              <p className="mt-3 text-sm text-yellow-700 dark:text-yellow-500">
                Consulta la{' '}
                <a 
                  href="https://policies.google.com/privacy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-yellow-900 dark:hover:text-yellow-300"
                >
                  Política de Privacidad de Google
                </a>
                {' '}para más información.
              </p>
            </div>
          </section>

          {/* Protección de Datos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
              4. Cómo Protegemos tus Datos
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>Implementamos medidas de seguridad técnicas y organizativas:</p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Seguridad Técnica</h3>
                  <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-400 text-sm ml-2">
                    <li>Encriptación de contraseñas</li>
                    <li>HTTPS/SSL en todas las conexiones</li>
                    <li>Tokens de autenticación seguros</li>
                    <li>Firewalls y protección DDoS</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">Seguridad Operativa</h3>
                  <ul className="list-disc list-inside space-y-1 text-green-800 dark:text-green-400 text-sm ml-2">
                    <li>Acceso restringido a datos</li>
                    <li>Auditorías de seguridad regulares</li>
                    <li>Backups encriptados</li>
                    <li>Monitoreo de actividad sospechosa</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Compartir Información */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              5. Compartir tu Información
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>NO vendemos ni alquilamos tu información personal. Solo compartimos datos en estos casos:</p>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mt-3">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Con Google Gemini:</strong> Para procesar tus consultas (anonimizadas)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Con el TecNM:</strong> Estadísticas agregadas para evaluar el programa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Por obligación legal:</strong> Cuando sea requerido por ley</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Con tu consentimiento:</strong> Cualquier otro caso requiere tu autorización expresa</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Tus Derechos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              6. Tus Derechos
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>Tienes derecho a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Acceso:</strong> Solicitar una copia de tus datos personales</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta o desactualizada</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de tu cuenta y datos</li>
                <li><strong>Portabilidad:</strong> Exportar tus conversaciones en formato legible</li>
                <li><strong>Oposición:</strong> Oponerte al procesamiento de tus datos</li>
                <li><strong>Limitación:</strong> Solicitar restricción del procesamiento</li>
              </ul>
              <p className="mt-4">
                Para ejercer estos derechos, contacta a: <strong>soporte@ite.edu.mx</strong>
              </p>
            </div>
          </section>

          {/* Retención de Datos */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-red-600 dark:text-red-400" />
              7. Retención de Datos
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Conservamos tus datos personales mientras tu cuenta esté activa y por un período adicional 
              según sea necesario para cumplir obligaciones legales. Las conversaciones se mantienen mientras 
              no las elimines. Puedes eliminar conversaciones individuales o tu cuenta completa en cualquier momento.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-red-600 dark:text-red-400" />
              8. Cookies y Tecnologías Similares
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              Utilizamos cookies para mantener tu sesión activa y mejorar tu experiencia:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
              <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del servicio</li>
              <li><strong>Cookies de preferencia:</strong> Guardan tus configuraciones (tema, idioma)</li>
              <li><strong>Tokens de sesión:</strong> Mantienen tu sesión segura</li>
            </ul>
          </section>

          {/* Menores de Edad */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              9. Protección de Menores
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Aunque la plataforma está diseñada para uso académico, sabemos que algunos usuarios pueden ser 
              menores de 18 años. Los padres o tutores pueden solicitar acceso, modificación o eliminación 
              de los datos de sus hijos contactando a soporte@ite.edu.mx.
            </p>
          </section>

          {/* Cambios a la Política */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
              10. Cambios a esta Política
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos 
              a través de la plataforma o por correo electrónico. La fecha de última actualización siempre 
              estará visible al inicio de este documento.
            </p>
          </section>

          {/* Contacto */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              11. Contacto
            </h2>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                Para preguntas sobre esta política de privacidad o ejercer tus derechos:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Institución:</strong> Tecnológico Nacional de México Campus Ensenada</li>
                <li><strong>Dirección:</strong> Blvd. Tecnológico #150, Ensenada, B.C., México</li>
                <li><strong>Email:</strong> soporte@ite.edu.mx</li>
                <li><strong>Responsable de Datos:</strong> Departamento de Sistemas</li>
                <li><strong>Desarrollador:</strong> <a href="https://github.com/avalontm" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 hover:underline">@avalontm</a></li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Link
            to="/terms"
            className="px-6 py-3 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg font-medium border-2 border-gray-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 text-center"
          >
            Ver Términos y Condiciones
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

export default Privacy;