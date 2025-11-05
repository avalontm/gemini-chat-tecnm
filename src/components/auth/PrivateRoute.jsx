// src/components/auth/PrivateRoute.jsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { SITE_CONFIG } from '@config/constants';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loader mientras se verifica la autenticacion
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no esta autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={SITE_CONFIG.routes.login} replace />;
  }

  // Si esta autenticado, mostrar el componente hijo
  return children;
}

export default PrivateRoute;