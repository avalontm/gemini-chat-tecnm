// src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { SITE_CONFIG } from '@config/constants';

// Importar páginas
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Chat from '@pages/Chat';
import Profile from '@pages/Profile';
import Terms from '@pages/Terms';
import Privacy from '@pages/Privacy';
import NotFound from '@pages/NotFound';

// Importar componente de protección
import PrivateRoute from '@components/auth/PrivateRoute';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route 
        path={SITE_CONFIG.routes.home} 
        element={
          isAuthenticated ? (
            <Navigate to={SITE_CONFIG.routes.chat} replace />
          ) : (
            <Home />
          )
        } 
      />
      
      <Route 
        path={SITE_CONFIG.routes.login} 
        element={
          isAuthenticated ? (
            <Navigate to={SITE_CONFIG.routes.chat} replace />
          ) : (
            <Login />
          )
        } 
      />
      
      <Route 
        path={SITE_CONFIG.routes.register} 
        element={
          isAuthenticated ? (
            <Navigate to={SITE_CONFIG.routes.chat} replace />
          ) : (
            <Register />
          )
        } 
      />

      {/* Rutas de Información Legal - Públicas */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />

      {/* Rutas Protegidas */}
      <Route
        path={SITE_CONFIG.routes.chat}
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />

      <Route
        path={SITE_CONFIG.routes.profile}
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      <Route
        path="/chat/:conversationId"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />

      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;