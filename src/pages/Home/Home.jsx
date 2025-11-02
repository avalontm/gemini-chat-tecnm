import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Zap, Shield, Sparkles, ArrowRight, Github, Activity, AlertCircle, CheckCircle, GraduationCap, BookOpen, Award, Server, Database, Cpu, HardDrive } from 'lucide-react';
import { useTheme } from '@context';
import { API_CONFIG } from '@config/api.config';
import { APP_CONFIG } from '@config/app.config';

function Home() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(null);
  const [serverHealth, setServerHealth] = useState(null);
  const [error, setError] = useState(null);
  const currentYear = new Date().getFullYear();

  // Verificar estado del servidor
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        // Verificar salud básica
        const healthResponse = await fetch(`${API_CONFIG.baseURL}/api/health`);
        const healthData = await healthResponse.json();
        setServerHealth(healthData);

        // Verificar estado completo
        const statusResponse = await fetch(`${API_CONFIG.baseURL}/api/health/status`);
        const statusData = await statusResponse.json();
        setServerStatus(statusData);
        
        setError(null);
      } catch (err) {
        console.error('Error al verificar el estado del servidor:', err);
        setError('No se pudo conectar con el servidor');
        setServerStatus(null);
        setServerHealth(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkServerHealth();

    // Verificar cada 30 segundos
    const interval = setInterval(checkServerHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  // Formatear uptime
  const formatUptime = (seconds) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // Componente de skeleton loader
  const SkeletonCard = () => (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 animate-pulse">
      <div className="w-12 h-12 bg-gray-300 dark:bg-slate-700 rounded-xl mb-4"></div>
      <div className="h-6 bg-gray-300 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-full mb-1"></div>
      <div className="h-4 bg-gray-300 dark:bg-slate-700 rounded w-5/6"></div>
    </div>
  );

  // Componente de estado del servidor
  const ServerStatus = () => {
    if (!serverHealth && !serverStatus && !error) return null;

    const isHealthy = serverHealth?.success && serverStatus?.success;
    const isDatabaseConnected = serverStatus?.database?.status === 'connected';

    return (
      <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-4 duration-500">
        <div className={`
          px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm border
          ${isHealthy && isDatabaseConnected
            ? 'bg-green-100/90 dark:bg-green-900/50 border-green-300 dark:border-green-700'
            : error
            ? 'bg-red-100/90 dark:bg-red-900/50 border-red-300 dark:border-red-700'
            : 'bg-yellow-100/90 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700'
          }
        `}>
          <div className="flex items-center gap-2">
            {isHealthy && isDatabaseConnected ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 animate-in zoom-in duration-300" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Servidor operativo
                </span>
              </>
            ) : error ? (
              <>
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  Servidor desconectado
                </span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 text-yellow-600 dark:text-yellow-400 animate-pulse" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Verificando servidor...
                </span>
              </>
            )}
          </div>

          {/* Detalles del servidor (visible al hover) */}
          {serverStatus && (
            <div className="mt-2 pt-2 border-t border-current/20 text-xs space-y-1 opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                <Server className="w-3 h-3" />
                <span>Uptime: {formatUptime(serverStatus.uptime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-3 h-3" />
                <span>DB: {serverStatus.database?.status || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-3 h-3" />
                <span>Memoria: {serverStatus.memory?.heapUsed || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3 h-3" />
                <span>Node: {serverStatus.node?.version || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      
      {/* Estado del servidor */}
      <ServerStatus />

      {/* Hero Section con branding TecNM */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          
          {/* Logo y branding TecNM */}
          <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-top-2 duration-700">
            <div className="flex items-center gap-4 mb-6">
              {/* Logo TecNM */}
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-3 border-2 border-red-600 dark:border-red-500">
                <img 
                  src="/logo-tecnm.png" 
                  alt="TecNM"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center">
                  <GraduationCap className="w-12 h-12 text-red-600 dark:text-red-500" />
                </div>
              </div>
              
              {/* Logo ITE */}
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-3 border-2 border-blue-600 dark:border-blue-500">
                <img 
                  src="/logo-ite.png" 
                  alt="Instituto Tecnológico de Ensenada"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center">
                  <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Tecnológico Nacional de México
              </h2>
              <h3 className="text-xl font-bold text-red-600 dark:text-red-500">
                Campus Ensenada
              </h3>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 text-red-700 dark:text-red-300 text-sm font-medium mb-8 transition-colors animate-in fade-in slide-in-from-top-2 duration-700 delay-100">
            <Sparkles className="w-4 h-4 animate-pulse" />
            Plataforma Oficial de IA
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Asistente de IA
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600 dark:from-red-400 dark:to-blue-400">
              para Estudiantes
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 max-w-3xl mx-auto">
            {APP_CONFIG.app.description}
            <br />
            <span className="text-lg text-gray-500 dark:text-gray-400">
              Impulsado por Google Gemini AI
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            <button
              onClick={() => navigate('/register')}
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
            >
              Crear cuenta estudiantil
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-slate-700 hover:border-red-500 dark:hover:border-red-500 transition-all duration-300 hover:scale-105"
            >
              Iniciar sesión
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-in fade-in zoom-in duration-700 delay-500">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 text-transparent bg-clip-text mb-1 transition-transform hover:scale-110">
                24/7
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Disponibilidad
              </div>
            </div>
            
            <div className="text-center animate-in fade-in zoom-in duration-700 delay-600">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 text-transparent bg-clip-text mb-1 transition-transform hover:scale-110">
                100%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Gratuito
              </div>
            </div>
            
            <div className="text-center animate-in fade-in zoom-in duration-700 delay-700">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-blue-600 text-transparent bg-clip-text mb-1 transition-transform hover:scale-110">
                Gemini
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Google AI
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Capacidades del Asistente
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 transition-colors">
            Herramientas avanzadas para tu aprendizaje
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {isLoading ? (
            Array(4).fill(0).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : (
            [
              {
                icon: MessageSquare,
                title: 'Chat Inteligente',
                description: 'Conversaciones naturales con IA avanzada para resolver tus dudas académicas'
              },
              {
                icon: BookOpen,
                title: 'Análisis de Documentos',
                description: 'Sube PDFs y obtén resúmenes, explicaciones y análisis detallados'
              },
              {
                icon: Sparkles,
                title: 'Multimodal',
                description: 'Combina texto, imágenes y voz para una experiencia completa'
              },
              {
                icon: Shield,
                title: 'Seguro y Privado',
                description: 'Tus conversaciones están protegidas y son completamente privadas'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-2 animate-in fade-in zoom-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-blue-100 dark:from-red-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 transition-colors">
                    {feature.description}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-red-600 via-red-700 to-blue-700 dark:from-red-700 dark:via-red-800 dark:to-blue-800 rounded-3xl p-12 shadow-2xl transition-colors animate-in fade-in zoom-in duration-700">
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <Award className="w-16 h-16 animate-pulse" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Únete a la comunidad estudiantil
            </h2>
            <p className="text-xl mb-8 text-red-100">
              Exclusivo para estudiantes del TecNM Campus Ensenada
            </p>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-red-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Registrarse ahora
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-slate-800 transition-colors">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
                {APP_CONFIG.app.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors mb-2">
                Tecnológico Nacional de México
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Campus Ensenada - {APP_CONFIG.app.version}
              </p>
            </div>

            <div className="flex gap-6">
              <a
                href="https://github.com/avalontm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.tecnm.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-110 hover:rotate-12"
                aria-label="TecNM"
              >
                <GraduationCap className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
              &copy; {currentYear} {APP_CONFIG.app.name} - Todos los derechos reservados
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Desarrollado por {APP_CONFIG.app.author} | Powered by Google Gemini AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;