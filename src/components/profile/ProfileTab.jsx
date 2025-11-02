// src/components/profile/ProfileTab.jsx

import { useState, useRef, useEffect } from 'react';
import { User, Mail, Save, Upload, X } from 'lucide-react';

const ProfileTab = ({ profileData, setProfileData, onSave, isSaving }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // CRITICAL FIX: Actualizar preview cuando cambie profileData.avatar
  useEffect(() => {
    console.log('[ProfileTab] profileData.avatar cambió:', {
      hasAvatar: !!profileData.avatar,
      avatarLength: profileData.avatar?.length
    });
    
    if (profileData.avatar) {
      setAvatarPreview(profileData.avatar);
    }
  }, [profileData.avatar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // No enviar el email ya que no se puede modificar
    const { email, ...dataToSave } = profileData;
    
    console.log('[ProfileTab] Guardando perfil');
    console.log('[ProfileTab] Datos a guardar:', Object.keys(dataToSave));
    
    try {
      await onSave(dataToSave);
    } catch (error) {
      console.error('[ProfileTab] Error al guardar:', error);
    }
  };

  // Comprimir y redimensionar imagen
  const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        };

        img.onerror = () => reject(new Error('Error al cargar la imagen'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('La imagen no debe superar los 5MB');
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const compressedBase64 = await compressImage(file, 400, 400, 0.8);
      
      const sizeInBytes = (compressedBase64.length * 3) / 4;
      const sizeInKB = sizeInBytes / 1024;
      
      console.log(`Imagen comprimida: ${sizeInKB.toFixed(2)} KB`);

      setAvatarPreview(compressedBase64);
      setProfileData({
        ...profileData,
        avatar: compressedBase64
      });
    } catch (error) {
      console.error('Error al procesar imagen:', error);
      alert('Error al procesar la imagen');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelAvatar = () => {
    setAvatarPreview(profileData.avatar || null);
    setSelectedFile(null);
    setProfileData({
      ...profileData,
      avatar: profileData.avatar || ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setSelectedFile(null);
    setProfileData({
      ...profileData,
      avatar: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickSelectFile = () => {
    fileInputRef.current?.click();
  };

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
      <div className="p-6 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            {selectedFile && (
              <button
                type="button"
                onClick={handleCancelAvatar}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Foto de Perfil
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              JPG, PNG o GIF. Se optimizará automáticamente
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClickSelectFile}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    {selectedFile || avatarPreview ? 'Cambiar foto' : 'Seleccionar foto'}
                  </>
                )}
              </button>

              {(avatarPreview || selectedFile) && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Eliminar
                </button>
              )}
            </div>

            {selectedFile && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Archivo seleccionado: {selectedFile.name}
                  <br />
                  Recuerda hacer clic en "Guardar cambios"
                </p>
              </div>
            )}
          </div>
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
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              required
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
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white opacity-60 cursor-not-allowed"
              disabled
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            El correo institucional no se puede modificar
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Biografía
          </label>
          <textarea
            value={profileData.bio || ''}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            rows="4"
            className="w-full px-4 py-3 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            placeholder="Cuéntanos sobre ti..."
            maxLength="500"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
            {profileData.bio?.length || 0}/500
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving || isProcessing}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
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
    </div>
  );
};

export default ProfileTab;