// src/pages/Profile/Profile.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Bell,
  Palette,
  Globe,
  Shield,
  Trash2,
  Save,
  Moon,
  Sun,
  Monitor,
  Check,
  UserCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@context/AuthContext';
import { useTheme } from '@context/ThemeContext';
import { SITE_CONFIG } from '@config/constants';

function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, changePassword } = useAuth();
  const { theme, setTheme } = useTheme();

  // Estados
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado del perfil
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  // Estado de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Estado de notificaciones
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    tips: true,
  });

  // Tabs de configuración
  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'language', label: 'Idioma', icon: Globe },
  ];

  // Opciones de tema
  const themeOptions = [
    { id: 'light', label: 'Claro', icon: Sun, description: 'Tema claro' },
    { id: 'dark', label: 'Oscuro', icon: Moon, description: 'Tema oscuro' },
    { id: 'system', label: 'Sistema', icon: Monitor, description: 'Según tu sistema' },
  ];

  // Manejar cambio de tema
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Tema cambiado a ${themeOptions.find(t => t.id === newTheme)?.label}`);
  };

  // Guardar perfil
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
      updateUser(profileData);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  // Cambiar contraseña
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsSaving(true);
    try {
      const result = await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (result.success) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Guardar notificaciones
  const handleSaveNotifications = () => {
    toast.success('Preferencias de notificaciones guardadas');
  };

  // Renderizar contenido según tab activo
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Información del Perfil
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Actualiza tu información personal
              </p>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Foto de Perfil
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  JPG, PNG o GIF. Máximo 2MB
                </p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                  Cambiar foto
                </button>
              </div>
            </div>

            {/* Formulario */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Biografía
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar cambios
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Seguridad y Contraseña
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Mantén tu cuenta segura
              </p>
            </div>

            {/* Cambiar Contraseña */}
            <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cambiar Contraseña
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contraseña actual
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nueva contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmar nueva contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full pl-10 pr-12 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cambiar contraseña
              </button>
            </div>

            {/* Zona de peligro */}
            <div className="p-6 bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-800 rounded-xl">
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
                Zona de Peligro
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, está seguro.
              </p>
              <button
                onClick={() => toast.error('Funcionalidad próximamente')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar cuenta
              </button>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Apariencia
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Personaliza cómo se ve la aplicación
              </p>
            </div>

            {/* Selector de Tema */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleThemeChange(option.id)}
                      className={`
                        relative p-6 rounded-xl border-2 transition-all duration-200
                        ${isActive
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className="flex flex-col items-center text-center">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center mb-3
                          ${isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                          }
                        `}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h4 className={`
                          font-semibold mb-1
                          ${isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-900 dark:text-white'
                          }
                        `}>
                          {option.label}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vista previa */}
            <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Vista Previa
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                  <p className="text-gray-900 dark:text-white font-medium mb-2">
                    Mensaje de ejemplo
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Así se verán tus mensajes con el tema seleccionado
                  </p>
                </div>
                <div className="p-4 bg-blue-600 rounded-lg">
                  <p className="text-white font-medium mb-2">
                    Tu mensaje
                  </p>
                  <p className="text-blue-100 text-sm">
                    Así se verán los mensajes que envíes
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Notificaciones
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configura cómo quieres recibir notificaciones
              </p>
            </div>

            <div className="space-y-4">
              {[
                { key: 'email', label: 'Notificaciones por email', description: 'Recibe actualizaciones importantes por correo' },
                { key: 'push', label: 'Notificaciones push', description: 'Notificaciones en tiempo real en tu navegador' },
                { key: 'updates', label: 'Actualizaciones del producto', description: 'Entérate de nuevas funcionalidades' },
                { key: 'tips', label: 'Consejos y trucos', description: 'Aprende a usar mejor la aplicación' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors
                      ${notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'}
                    `}
                  >
                    <div
                      className={`
                        absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform
                        ${notifications[item.key] ? 'translate-x-6' : 'translate-x-0'}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotifications}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                Guardar preferencias
              </button>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Idioma y Región
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Configura tu idioma preferido
              </p>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Idioma de la interfaz
              </label>
              <select className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                💡 La función de cambio de idioma estará disponible próximamente
              </p>
            </div>
          </div>
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
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-white" />
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
          <aside className="lg:col-span-1">
            <nav className="space-y-1 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors
                      ${activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

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