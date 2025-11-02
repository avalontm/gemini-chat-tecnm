// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@api/axios.config';
import toast from 'react-hot-toast';
import { API_CONFIG } from '@config/api.config';
import { getStorageKey } from '@config/app.config';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Inicializar autenticacion desde localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem(getStorageKey('token'));
        const storedUser = localStorage.getItem(getStorageKey('user'));

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);

          // Verificar token con el servidor (opcional)
          // await verifyToken(storedToken);
        }
      } catch (error) {
        console.error('[AUTH] Error inicializando autenticacion:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Verificar token con el servidor
  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await api.get(API_CONFIG.endpoints.auth.verifyToken, {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      if (response.data.valid) {
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('[AUTH] Error verificando token:', error);
      logout();
      return false;
    }
  };

  // Login
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);

      const response = await api.post(
        API_CONFIG.endpoints.auth.login,
        { email, password }
      );

      console.log('[AUTH] Response completa:', response.data);

      // El backend devuelve: { success, message, data: { token, user } }
      // Extraer token y user del objeto data
      const responseData = response.data.data || response.data;
      const { token: newToken, user: newUser } = responseData;

      console.log('[AUTH] Token extraido:', newToken?.substring(0, 20) + '...');
      console.log('[AUTH] User extraido:', newUser);

      if (!newToken || !newUser) {
        throw new Error('Token o usuario no encontrado en la respuesta');
      }

      // IMPORTANTE: Guardar en localStorage PRIMERO
      localStorage.setItem(getStorageKey('token'), newToken);
      localStorage.setItem(getStorageKey('user'), JSON.stringify(newUser));
      
      if (rememberMe) {
        localStorage.setItem(getStorageKey('rememberMe'), 'true');
      }

      console.log('[AUTH] Token guardado en localStorage');
      console.log('[AUTH] Verificando token guardado:', localStorage.getItem(getStorageKey('token'))?.substring(0, 20) + '...');

      // Luego actualizar estado
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      toast.success('Inicio de sesion exitoso');

      return { success: true, user: newUser, token: newToken };
    } catch (error) {
      console.error('[AUTH] Error en login:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Error al iniciar sesion';
      
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register
  const register = async (username, email, password) => {
    try {
      setLoading(true);

      const response = await api.post(
        API_CONFIG.endpoints.auth.register,
        { username, email, password }
      );

      // El backend devuelve: { success, message, data: { token, user } }
      const responseData = response.data.data || response.data;
      const { token: newToken, user: newUser } = responseData;

      if (!newToken || !newUser) {
        throw new Error('Token o usuario no encontrado en la respuesta');
      }

      // Guardar en localStorage
      localStorage.setItem(getStorageKey('token'), newToken);
      localStorage.setItem(getStorageKey('user'), JSON.stringify(newUser));

      // Actualizar estado
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      toast.success('Registro exitoso');

      return { success: true, user: newUser };
    } catch (error) {
      console.error('[AUTH] Error en registro:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Error al registrarse';
      
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Intentar hacer logout en el servidor
      if (token) {
        await api.post(API_CONFIG.endpoints.auth.logout);
      }
    } catch (error) {
      console.error('[AUTH] Error en logout:', error);
    } finally {
      // Limpiar estado
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      // Limpiar localStorage
      localStorage.removeItem(getStorageKey('token'));
      localStorage.removeItem(getStorageKey('user'));
      localStorage.removeItem(getStorageKey('rememberMe'));
      localStorage.removeItem(getStorageKey('refreshToken'));

      toast.success('Sesion cerrada');
    }
  };

  // Obtener perfil del usuario
  const getProfile = async () => {
    try {
      const response = await api.get(API_CONFIG.endpoints.auth.profile);

      // Manejar respuesta del backend
      const responseData = response.data.data || response.data;
      const updatedUser = responseData.user || responseData;
      
      setUser(updatedUser);
      localStorage.setItem(getStorageKey('user'), JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('[AUTH] Error obteniendo perfil:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        'Error al obtener perfil';
      
      return { success: false, error: errorMessage };
    }
  };

  // Actualizar usuario en el contexto
  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    setUser(updatedUser);
    localStorage.setItem(getStorageKey('user'), JSON.stringify(updatedUser));
  };

  // Cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.post(
        API_CONFIG.endpoints.auth.changePassword,
        { currentPassword, newPassword }
      );

      toast.success('Contraseña actualizada exitosamente');

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('[AUTH] Error cambiando contraseña:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        'Error al cambiar contraseña';
      
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    }
  };

  // Solicitar reset de contraseña
  const forgotPassword = async (email) => {
    try {
      const response = await api.post(
        API_CONFIG.endpoints.auth.forgotPassword,
        { email }
      );

      toast.success('Se ha enviado un correo para restablecer tu contraseña');

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('[AUTH] Error en forgot password:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        'Error al solicitar restablecimiento de contraseña';
      
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    }
  };

  // Resetear contraseña con token
  const resetPassword = async (resetToken, newPassword) => {
    try {
      const response = await api.post(
        API_CONFIG.endpoints.auth.resetPassword,
        { token: resetToken, newPassword }
      );

      toast.success('Contraseña restablecida exitosamente');

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('[AUTH] Error en reset password:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        'Error al restablecer contraseña';
      
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    }
  };

  // Verificar email
  const verifyEmail = async (verificationToken) => {
    try {
      const response = await api.post(
        API_CONFIG.endpoints.auth.verifyEmail,
        { token: verificationToken }
      );

      toast.success('Email verificado exitosamente');

      // Actualizar usuario si esta logueado
      if (user) {
        await getProfile();
      }

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('[AUTH] Error verificando email:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        'Error al verificar email';
      
      toast.error(errorMessage);

      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
    updateUser,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyEmail,
    verifyToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

export { AuthContext };
export default AuthContext;