import { X, LogOut } from 'lucide-react';

function LogoutDialog({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Cerrar Sesión
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 text-center mb-2">
            ¿Estás seguro de que deseas cerrar sesión?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Tendrás que iniciar sesión nuevamente para acceder al chat.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 rounded-xl font-medium transition-all duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutDialog;