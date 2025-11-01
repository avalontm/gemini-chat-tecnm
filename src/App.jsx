// src/App.jsx

import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, AssistantProvider } from '@context';
import { AppRoutes } from './routes';
import ThemeToggle from './components/common/ThemeToggle';
import InteractiveAssistant from './components/common/AssistantWidget/InteractiveAssistant';
import AssistantToggleButton from './components/common/AssistantToggleButton';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AssistantProvider>
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>

          <AppRoutes />

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

          <InteractiveAssistant />
        </AssistantProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;