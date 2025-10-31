import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, Login, Register, NotFound } from '@pages';

function AppRoutes() {
  return (
    <Routes>
      {/* Ruta principal */}
      <Route path="/" element={<Home />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas - Por ahora redirigen a login */}
      <Route path="/chat" element={<Navigate to="/login" replace />} />
      <Route path="/chat/:conversationId" element={<Navigate to="/login" replace />} />
      <Route path="/conversations" element={<Navigate to="/login" replace />} />
      <Route path="/profile" element={<Navigate to="/login" replace />} />

      {/* 404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;