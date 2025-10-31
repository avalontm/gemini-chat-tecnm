// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_CONFIG } from '@config/api.config';
import { APP_CONFIG, getStorageKey } from '@config/app.config';

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

          // Verificar token con el servidor
          await verifyToken(storedToken);
        }
      } catch (error) {
        console.error('Error inicializando autenticacion:', error);
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
      const response = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.verifyToken}`,
        {
          headers: {
            Authorization: `Bearer ${tokenToVerify}`,
          },
        }
      );

      if (response.data.valid) {
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      logout();
      return false;
    }
  };

  // Login
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.login}`,
        { email, password },
        {
          headers: API_CONFIG.headers,
          timeout: API_CONFIG.timeout,
        }
      );

      const { token: newToken, user: newUser } = response.data;

      // Guardar en estado
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      // Guardar en localStorage
      localStorage.setItem(getStorageKey('token'), newToken);
      localStorage.setItem(getStorageKey('user'), JSON.stringify(newUser));
      
      if (rememberMe) {
        localStorage.setItem(getStorageKey('rememberMe'), 'true');
      }

      toast.success('Inicio de sesion exitoso');

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error en login:', error);
      
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

      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.register}`,
        { username, email, password },
        {
          headers: API_CONFIG.headers,
          timeout: API_CONFIG.timeout,
        }
      );

      const { token: newToken, user: newUser } = response.data;

      // Guardar en estado
      setToken(newToken);
      setUser(newUser);
      setIsAuthenticated(true);

      // Guardar en localStorage
      localStorage.setItem(getStorageKey('token'), newToken);
      localStorage.setItem(getStorageKey('user'), JSON.stringify(newUser));

      toast.success('Registro exitoso');

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error en registro:', error);
      
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
        await axios.post(
          `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.logout}`,
          {},
          {
            headers: {
              ...API_CONFIG.headers,
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error('Error en logout:', error);
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
      const response = await axios.get(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.profile}`,
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem(getStorageKey('user'), JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      
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
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.changePassword}`,
        { currentPassword, newPassword },
        {
          headers: {
            ...API_CONFIG.headers,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success('Contraseña actualizada exitosamente');

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      
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
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.forgotPassword}`,
        { email },
        {
          headers: API_CONFIG.headers,
        }
      );

      toast.success('Se ha enviado un correo para restablecer tu contraseña');

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error en forgot password:', error);
      
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
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.resetPassword}`,
        { token: resetToken, newPassword },
        {
          headers: API_CONFIG.headers,
        }
      );

      toast.success('Contraseña restablecida exitosamente');

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error en reset password:', error);
      
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
      const response = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.auth.verifyEmail}`,
        { token: verificationToken },
        {
          headers: API_CONFIG.headers,
        }
      );

      toast.success('Email verificado exitosamente');

      // Actualizar usuario si esta logueado
      if (user) {
        await getProfile();
      }

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Error verificando email:', error);
      
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

export default AuthContext;