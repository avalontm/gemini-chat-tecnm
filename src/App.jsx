import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@context';
import { AppRoutes } from './routes';
import ThemeToggle from './components/common/ThemeToggle';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        {/* Botón de tema flotante */}
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        {/* Sistema de rutas */}
        <AppRoutes />

        {/* Sistema de notificaciones toast */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;