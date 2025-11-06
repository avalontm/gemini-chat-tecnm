// src/routes/AppRoutes.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { SITE_CONFIG } from '@config/constants';

// Importar paginas
import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import ForgotPassword from '@pages/ForgotPassword';
import ResetPassword from '@pages/ResetPassword';
import VerifyEmail from '@pages/VerifyEmail';
import Chat from '@pages/Chat';
import Profile from '@pages/Profile';
import Terms from '@pages/Terms';
import Privacy from '@pages/Privacy';
import NotFound from '@pages/NotFound/index';

// Importar componente de proteccion
import PrivateRoute from '@components/auth/PrivateRoute';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rutas Publicas */}
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

      {/* Rutas de Recuperacion de Contrasena */}
      <Route 
        path={SITE_CONFIG.routes.forgotPassword} 
        element={
          isAuthenticated ? (
            <Navigate to={SITE_CONFIG.routes.chat} replace />
          ) : (
            <ForgotPassword />
          )
        } 
      />

      <Route 
        path="/reset-password/:token" 
        element={
          isAuthenticated ? (
            <Navigate to={SITE_CONFIG.routes.chat} replace />
          ) : (
            <ResetPassword />
          )
        } 
      />

      {/* Ruta de Verificacion de Email - Publica */}
      <Route 
        path="/verify-email/:token" 
        element={
          isAuthenticated ? (
            <Navigate to={SITE_CONFIG.routes.chat} replace />
          ) : (
            <VerifyEmail />
          )
        } 
      />

      {/* Rutas de Informacion Legal - Publicas */}
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