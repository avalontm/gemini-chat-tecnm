import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        
        {/* 404 Animado */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4">
            404
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
            <Search className="w-6 h-6" />
            <p className="text-xl">Página no encontrada</p>
          </div>
        </div>

        {/* Mensaje */}
        <div className="mb-8 space-y-4">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Verifica la URL o regresa al inicio para continuar navegando.
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Ir al Inicio
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl font-semibold shadow-md hover:shadow-lg border-2 border-gray-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver Atrás
          </button>
        </div>

        {/* Ilustración decorativa */}
        <div className="mt-12 opacity-50">
          <svg
            className="w-64 h-64 mx-auto text-gray-300 dark:text-slate-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default NotFound;