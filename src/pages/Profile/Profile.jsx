// src/pages/Profile/Profile.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';
import { SITE_CONFIG } from '@config/constants';
import { userAPI } from '@api';

// Importar componentes
import {
  ProfileSidebar,
  ProfileTab,
  SecurityTab,
  AppearanceTab,
  NotificationsTab,
  LanguageTab
} from '@components/profile';

function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, changePassword } = useAuth();
  const { theme, setTheme } = useTheme();

  // Estados
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado del perfil
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: '',
  });

  // Estado de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Estado de preferencias
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'es',
    notifications: {
      email: true,
      push: false,
      updates: true,
      tips: true,
    }
  });

  // Cargar datos del perfil al montar
  useEffect(() => {
    loadProfileData();
  }, []);

  // Cargar datos del perfil desde la API
  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await userAPI.getProfile();
      
      console.log('[Profile] Response completa:', response);
      
      if (response.success && response.data?.user) {
        const userData = response.data.user;
        
        console.log('[Profile] Usuario cargado:', {
          username: userData.username,
          email: userData.email,
          hasAvatar: !!userData.avatar,
          avatarLength: userData.avatar?.length
        });
        
        // CRITICAL FIX: Incluir el avatar en profileData
        setProfileData({
          username: userData.username || '',
          email: userData.email || '',
          bio: userData.bio || '',
          avatar: userData.avatar || '', // IMPORTANTE: Cargar el avatar
        });
        
        if (userData.preferences) {
          setPreferences({
            theme: userData.preferences.theme || 'system',
            language: userData.preferences.language || 'es',
            notifications: userData.preferences.notifications || {
              email: true,
              push: false,
              updates: true,
              tips: true,
            }
          });
          
          // Sincronizar el tema con el contexto
          if (userData.preferences.theme) {
            setTheme(userData.preferences.theme);
          }
        }
      }
    } catch (error) {
      console.error('[Profile] Error al cargar perfil:', error);
      toast.error('Error al cargar los datos del perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (data) => {
    setIsSaving(true);
    try {
      console.log('[Profile] Guardando perfil con datos:', {
        keys: Object.keys(data),
        hasAvatar: !!data.avatar,
        avatarLength: data.avatar?.length
      });
      
      const response = await userAPI.updateProfile(data);
      
      console.log('[Profile] Respuesta del servidor:', response);
      
      if (response.success && response.data?.user) {
        // CRITICAL FIX: Actualizar profileData incluyendo el avatar
        setProfileData({
          username: response.data.user.username,
          email: response.data.user.email,
          bio: response.data.user.bio || '',
          avatar: response.data.user.avatar || '',
        });
        
        updateUser(response.data.user);
        toast.success('Perfil actualizado correctamente');
      } else {
        toast.error('Error inesperado al actualizar el perfil');
      }
    } catch (error) {
      console.error('[Profile] Error al actualizar perfil:', error);
      
      // Manejar diferentes tipos de errores
      if (error.errors && Array.isArray(error.errors)) {
        console.error('[Profile] Errores de validación:', error.errors);
        
        error.errors.forEach((err, index) => {
          const field = err.field || err.param || 'Campo';
          const message = err.message || err.msg || 'Error de validación';
          
          setTimeout(() => {
            toast.error(`${field}: ${message}`, {
              duration: 5000,
              id: `validation-error-${index}`
            });
          }, index * 100);
        });
        
        toast.error(`Se encontraron ${error.errors.length} error(es) de validación`, {
          duration: 6000
        });
      } else if (error.message) {
        toast.error(error.message);
      } else if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('Error al actualizar el perfil. Por favor intenta de nuevo.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async (currentPassword, newPassword) => {
    setIsSaving(true);
    try {
      // Usar directamente userAPI en lugar del contexto
      const response = await userAPI.changePassword(currentPassword, newPassword);
      
      if (response.success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        toast.success(response.message || 'Contraseña cambiada correctamente');
        return true;
      } else {
        toast.error(response.message || 'Error al cambiar la contraseña');
        return false;
      }
    } catch (error) {
      console.error('[Profile] Error al cambiar contraseña:', error);
      
      // Manejar errores específicos
      if (error.message) {
        toast.error(error.message);
      } else if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('Error al cambiar la contraseña. Verifica que la contraseña actual sea correcta.');
      }
      
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Cambiar tema
  const handleThemeChange = async (newTheme) => {
    try {
      setTheme(newTheme);
      
      const updatedPreferences = {
        ...preferences,
        theme: newTheme
      };
      
      const response = await userAPI.updatePreferences(updatedPreferences);
      
      if (response.success) {
        setPreferences(updatedPreferences);
        toast.success('Tema actualizado correctamente');
      }
    } catch (error) {
      console.error('Error al cambiar tema:', error);
      toast.error('Error al actualizar el tema');
    }
  };

  // Guardar preferencias de notificaciones
  const handleSaveNotifications = async (notificationSettings) => {
    try {
      const updatedPreferences = {
        ...preferences,
        notifications: notificationSettings
      };
      
      const response = await userAPI.updatePreferences(updatedPreferences);
      
      if (response.success) {
        setPreferences(updatedPreferences);
        toast.success('Preferencias de notificaciones guardadas');
      }
    } catch (error) {
      console.error('Error al guardar notificaciones:', error);
      toast.error('Error al guardar preferencias');
    }
  };

  // Cambiar idioma
  const handleLanguageChange = async (newLanguage) => {
    try {
      const updatedPreferences = {
        ...preferences,
        language: newLanguage
      };
      
      const response = await userAPI.updatePreferences(updatedPreferences);
      
      if (response.success) {
        setPreferences(updatedPreferences);
        toast.success('Idioma actualizado correctamente');
      }
    } catch (error) {
      console.error('Error al cambiar idioma:', error);
      toast.error('Error al actualizar el idioma');
    }
  };

  // Renderizar contenido según tab activo
  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab
            profileData={profileData}
            setProfileData={setProfileData}
            onSave={handleSaveProfile}
            isSaving={isSaving}
          />
        );

      case 'security':
        return (
          <SecurityTab
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            onChangePassword={handleChangePassword}
            isSaving={isSaving}
          />
        );

      case 'appearance':
        return (
          <AppearanceTab
            currentTheme={theme}
            onThemeChange={handleThemeChange}
          />
        );

      case 'notifications':
        return (
          <NotificationsTab
            notifications={preferences.notifications}
            onSave={handleSaveNotifications}
          />
        );

      case 'language':
        return (
          <LanguageTab
            currentLanguage={preferences.language}
            onLanguageChange={handleLanguageChange}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(SITE_CONFIG.routes.chat)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-blue-600 rounded-xl flex items-center justify-center overflow-hidden">
                  {profileData.avatar ? (
                    <img 
                      src={profileData.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Mi Perfil
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar de Tabs */}
          <ProfileSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Contenido Principal */}
          <main className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
              {renderTabContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile;