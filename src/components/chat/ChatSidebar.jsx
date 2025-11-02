// src/components/Chat/ChatSidebar.jsx

import { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Clock, 
  MessageSquare, 
  Sparkles,
  User,
  UserCircle,
  LogOut,
  Loader2,
  ChevronLeft,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function LogoutDialog({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fadeIn">
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

        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 text-center mb-2">
            ¿Estás seguro de que deseas cerrar sesión?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Tendrás que iniciar sesión nuevamente para acceder al chat.
          </p>
        </div>

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

function ChatSidebar({ 
  isSidebarOpen, 
  setIsSidebarOpen,
  conversations, 
  isLoadingConversations,
  currentConversation,
  onNewConversation,
  onDeleteConversation,
  user,
  onLogout,
  formatRelativeTime
}) {
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
    
    // Limpiar localStorage
    localStorage.clear();
    
    // Llamar a la función de logout del contexto
    if (onLogout) {
      onLogout();
    }
    
    // Redirigir al home
    navigate('/', { replace: true });
  };

  const handleLogoutCancel = () => {
    setShowLogoutDialog(false);
  };

  return (
    <>
      <aside className={`
        ${isSidebarOpen ? 'w-80' : 'w-0'} 
        bg-white dark:bg-slate-800 
        border-r border-gray-200 dark:border-slate-700 
        transition-all duration-300 ease-in-out
        flex flex-col
        relative
        ${!isSidebarOpen && 'overflow-hidden'}
      `}>
        <div className="flex flex-col h-full">
          
          <div className="p-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">Gemini Chat</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">TecNM Ensenada</p>
                </div>
              </div>
            </div>

            <button 
              onClick={onNewConversation}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              Nueva Conversacion
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="flex items-center justify-between px-3 py-2 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Conversaciones
              </h3>
              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                {conversations.length}
              </span>
            </div>

            {isLoadingConversations ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conv) => {
                const convId = conv.id || conv._id;
                const isActive = currentConversation && (currentConversation.id === convId || currentConversation._id === convId);
                
                return (
                  <div
                    key={convId}
                    onClick={() => navigate(`/chat/${convId}`)}
                    className={`
                      group relative p-3 rounded-xl cursor-pointer transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800' 
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <MessageSquare className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate mb-1">
                          {conv.title || 'Nueva conversacion'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {conv.lastMessage || 'Sin mensajes'}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {formatRelativeTime(conv.updatedAt || conv.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(convId);
                      }}
                      className="absolute top-3 right-3 p-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100 dark:hover:bg-red-900/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No hay conversaciones
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
            <div className="bg-white dark:bg-slate-700 rounded-xl p-3 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.username || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => navigate('/profile')}
                  className="py-2 px-3 bg-gray-100 dark:bg-slate-600 hover:bg-gray-200 dark:hover:bg-slate-500 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <UserCircle className="w-4 h-4" />
                  Perfil
                </button>
                <button 
                  onClick={handleLogoutClick}
                  className="py-2 px-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-4 top-6 w-8 h-8 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 z-10"
        >
          <ChevronLeft className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform duration-300 ${!isSidebarOpen && 'rotate-180'}`} />
        </button>
      </aside>

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

export default ChatSidebar;
