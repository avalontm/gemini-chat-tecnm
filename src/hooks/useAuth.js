// src/hooks/useAuth.js

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@context/AuthContext';
import { SITE_CONFIG } from '@config/constants';

// Hook personalizado para autenticacion con funcionalidades adicionales
export const useAuth = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }

  // Login con redireccion automatica
  const loginWithRedirect = async (email, password, rememberMe = false, redirectTo = null) => {
    const result = await context.login(email, password, rememberMe);
    
    if (result.success) {
      const destination = redirectTo || SITE_CONFIG.routes.chat;
      navigate(destination);
    }
    
    return result;
  };

  // Registro con redireccion automatica
  const registerWithRedirect = async (username, email, password, redirectTo = null) => {
    const result = await context.register(username, email, password);
    
    if (result.success) {
      const destination = redirectTo || SITE_CONFIG.routes.chat;
      navigate(destination);
    }
    
    return result;
  };

  // Logout con redireccion automatica
  const logoutWithRedirect = async (redirectTo = null) => {
    await context.logout();
    const destination = redirectTo || SITE_CONFIG.routes.home;
    navigate(destination);
  };

  // Verificar si el usuario esta autenticado
  const checkAuth = () => {
    return context.isAuthenticated && context.user && context.token;
  };

  // Verificar si el usuario tiene un rol especifico
  const hasRole = (role) => {
    if (!context.user || !context.user.role) return false;
    return context.user.role === role;
  };

  // Verificar si el usuario tiene alguno de los roles especificados
  const hasAnyRole = (roles) => {
    if (!context.user || !context.user.role) return false;
    return roles.includes(context.user.role);
  };

  // Verificar si el usuario tiene todos los roles especificados
  const hasAllRoles = (roles) => {
    if (!context.user || !context.user.roles) return false;
    return roles.every(role => context.user.roles.includes(role));
  };

  // Verificar si el usuario tiene un permiso especifico
  const hasPermission = (permission) => {
    if (!context.user || !context.user.permissions) return false;
    return context.user.permissions.includes(permission);
  };

  // Verificar si el usuario tiene alguno de los permisos especificados
  const hasAnyPermission = (permissions) => {
    if (!context.user || !context.user.permissions) return false;
    return permissions.some(permission => context.user.permissions.includes(permission));
  };

  // Verificar si el usuario tiene todos los permisos especificados
  const hasAllPermissions = (permissions) => {
    if (!context.user || !context.user.permissions) return false;
    return permissions.every(permission => context.user.permissions.includes(permission));
  };

  // Obtener informacion del usuario actual
  const getCurrentUser = () => {
    return context.user;
  };

  // Obtener token actual
  const getToken = () => {
    return context.token;
  };

  // Verificar si el email esta verificado
  const isEmailVerified = () => {
    return context.user?.emailVerified || false;
  };

  // Verificar si el usuario esta activo
  const isUserActive = () => {
    return context.user?.isActive !== false;
  };

  // Obtener nombre completo del usuario
  const getUserFullName = () => {
    if (!context.user) return '';
    
    const { firstName, lastName, username } = context.user;
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    
    if (firstName) return firstName;
    if (lastName) return lastName;
    if (username) return username;
    
    return 'Usuario';
  };

  // Obtener iniciales del usuario
  const getUserInitials = () => {
    if (!context.user) return '?';
    
    const { firstName, lastName, username } = context.user;
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (username) return username.substring(0, 2).toUpperCase();
    
    return '?';
  };

  // Verificar si la sesion esta por expirar
  const isSessionExpiring = (thresholdMinutes = 5) => {
    if (!context.user || !context.user.sessionExpiry) return false;
    
    const now = new Date().getTime();
    const expiry = new Date(context.user.sessionExpiry).getTime();
    const threshold = thresholdMinutes * 60 * 1000;
    
    return (expiry - now) <= threshold && (expiry - now) > 0;
  };

  // Renovar sesion
  const refreshSession = async () => {
    try {
      const result = await context.verifyToken(context.token);
      return result;
    } catch (error) {
      console.error('Error renovando sesion:', error);
      return false;
    }
  };

  return {
    // Estado del contexto original
    user: context.user,
    token: context.token,
    loading: context.loading,
    isAuthenticated: context.isAuthenticated,
    
    // Funciones del contexto original
    login: context.login,
    register: context.register,
    logout: context.logout,
    getProfile: context.getProfile,
    updateUser: context.updateUser,
    changePassword: context.changePassword,
    forgotPassword: context.forgotPassword,
    resetPassword: context.resetPassword,
    verifyEmail: context.verifyEmail,
    verifyToken: context.verifyToken,
    
    // Funciones adicionales
    loginWithRedirect,
    registerWithRedirect,
    logoutWithRedirect,
    checkAuth,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getCurrentUser,
    getToken,
    isEmailVerified,
    isUserActive,
    getUserFullName,
    getUserInitials,
    isSessionExpiring,
    refreshSession,
  };
};

export default useAuth;