# Estructura del Cliente React - Gemini API Project
### Con React + Vite, JavaScript y Tailwind CSS

## Estructura de Carpetas

```
gemini-client/
│
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   │
│   ├── api/
│   │   ├── axios.config.js             # Configuración de Axios
│   │   ├── interceptors.js             # Interceptores de request/response
│   │   │
│   │   ├── endpoints/
│   │   │   ├── auth.api.js             # Endpoints de autenticación
│   │   │   ├── gemini.api.js           # Endpoints de Gemini
│   │   │   ├── conversation.api.js     # Endpoints de conversaciones
│   │   │   ├── user.api.js             # Endpoints de usuario
│   │   │   └── export.api.js           # Endpoints de exportación
│   │   │
│   │   └── index.js                    # Exporta todas las APIs
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   └── placeholder.png
│   │   │
│   │   ├── icons/
│   │   │   └── index.js                # Exporta todos los iconos
│   │   │
│   │   └── styles/
│   │       └── index.css               # Estilos globales y Tailwind
│   │
│   ├── components/
│   │   │
│   │   ├── common/
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Input/
│   │   │   │   ├── Input.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Textarea/
│   │   │   │   ├── Textarea.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Select/
│   │   │   │   ├── Select.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Modal/
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Toast/
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Spinner/
│   │   │   │   ├── Spinner.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Card/
│   │   │   │   ├── Card.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Avatar/
│   │   │   │   ├── Avatar.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js                # Exporta todos los componentes comunes
│   │   │
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── MainLayout/
│   │   │   │   ├── MainLayout.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js                # Exporta componentes de layout
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── RegisterForm/
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── PrivateRoute/
│   │   │   │   ├── PrivateRoute.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatInput/
│   │   │   │   ├── ChatInput.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── MessageList/
│   │   │   │   ├── MessageList.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── Message/
│   │   │   │   ├── Message.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── FileUpload/
│   │   │   │   ├── FileUpload.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── ImagePreview/
│   │   │   │   ├── ImagePreview.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── VoiceRecorder/
│   │   │   │   ├── VoiceRecorder.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── TypingIndicator/
│   │   │   │   ├── TypingIndicator.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── conversation/
│   │   │   ├── ConversationList/
│   │   │   │   ├── ConversationList.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── ConversationItem/
│   │   │   │   ├── ConversationItem.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── ConversationHeader/
│   │   │   │   ├── ConversationHeader.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── NewConversationButton/
│   │   │   │   ├── NewConversationButton.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileCard/
│   │   │   │   ├── ProfileCard.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── ProfileForm/
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── AvatarUpload/
│   │   │   │   ├── AvatarUpload.jsx
│   │   │   │   └── index.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   └── index.js                    # Exporta todos los componentes
│   │
│   ├── hooks/
│   │   ├── useAuth.js                  # Hook para autenticación
│   │   ├── useChat.js                  # Hook para chat
│   │   ├── useConversation.js          # Hook para conversaciones
│   │   ├── useFileUpload.js            # Hook para subida de archivos
│   │   ├── useVoiceRecorder.js         # Hook para grabación de voz
│   │   ├── useToast.js                 # Hook para notificaciones
│   │   ├── useDebounce.js              # Hook para debounce
│   │   ├── useLocalStorage.js          # Hook para localStorage
│   │   ├── useMediaQuery.js            # Hook para responsive
│   │   └── index.js                    # Exporta todos los hooks
│   │
│   ├── context/
│   │   ├── AuthContext.jsx             # Context de autenticación
│   │   ├── ChatContext.jsx             # Context de chat
│   │   ├── ThemeContext.jsx            # Context de tema
│   │   ├── ToastContext.jsx            # Context de notificaciones
│   │   └── index.js                    # Exporta todos los contexts
│   │
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── Login/
│   │   │   ├── Login.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── Register/
│   │   │   ├── Register.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── Chat/
│   │   │   ├── Chat.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── Profile/
│   │   │   ├── Profile.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── Conversations/
│   │   │   ├── Conversations.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── NotFound/
│   │   │   ├── NotFound.jsx
│   │   │   └── index.js
│   │   │
│   │   └── index.js                    # Exporta todas las páginas
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx               # Definición de rutas
│   │   ├── routes.config.js            # Configuración de rutas
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── validators/
│   │   │   ├── authValidator.js        # Validaciones de auth
│   │   │   ├── fileValidator.js        # Validaciones de archivos
│   │   │   └── index.js
│   │   │
│   │   ├── helpers/
│   │   │   ├── formatters.js           # Funciones de formateo
│   │   │   ├── dateHelpers.js          # Helpers de fechas
│   │   │   ├── fileHelpers.js          # Helpers de archivos
│   │   │   ├── stringHelpers.js        # Helpers de strings
│   │   │   └── index.js
│   │   │
│   │   ├── constants.js                # Constantes globales
│   │   ├── errorMessages.js            # Mensajes de error
│   │   └── index.js
│   │
│   ├── config/
│   │   ├── api.config.js               # Configuración de API
│   │   ├── app.config.js               # Configuración de la app
│   │   └── index.js
│   │
│   ├── store/
│   │   ├── slices/                     # Slices de Redux (opcional)
│   │   │   ├── authSlice.js
│   │   │   ├── chatSlice.js
│   │   │   └── conversationSlice.js
│   │   │
│   │   ├── store.js                    # Configuración de Redux store
│   │   └── index.js
│   │
│   ├── App.jsx                         # Componente principal
│   ├── main.jsx                        # Entry point
│   └── index.css                       # Estilos globales con Tailwind
│
├── .env.example                        # Ejemplo de variables de entorno
├── .env                                # Variables de entorno REAL (gitignored)
├── .env.development                    # Variables de desarrollo
├── .env.production                     # Variables de producción
├── .gitignore                          # Archivos ignorados por Git
├── .eslintrc.cjs                       # Configuración ESLint
├── .prettierrc                         # Configuración Prettier
├── index.html                          # HTML principal
├── vite.config.js                      # Configuración de Vite
├── tailwind.config.js                  # Configuración de Tailwind
├── postcss.config.js                   # Configuración de PostCSS
├── jsconfig.json                       # Configuración de paths
├── package.json                        # Dependencias y scripts
├── package-lock.json
└── README.md                           # Documentación del proyecto
```

---

## Descripción de Carpetas Principales

### api/
Configuración de Axios y todos los endpoints organizados por funcionalidad. Incluye interceptores para manejo de tokens y errores.

### assets/
Recursos estáticos como imágenes, iconos y estilos globales.

### components/
Componentes React organizados por funcionalidad:
- `common/` - Componentes reutilizables (botones, inputs, modales)
- `layout/` - Componentes de estructura (header, sidebar, footer)
- `auth/` - Componentes de autenticación
- `chat/` - Componentes del chat
- `conversation/` - Componentes de gestión de conversaciones
- `profile/` - Componentes de perfil de usuario

### hooks/
Custom hooks para lógica reutilizable:
- Autenticación
- Chat y mensajería
- Upload de archivos
- Grabación de voz
- Notificaciones
- Utilidades generales

### context/
Context API de React para estado global:
- Autenticación
- Chat activo
- Tema de la aplicación
- Sistema de notificaciones

### pages/
Páginas principales de la aplicación. Cada página es una vista completa.

### routes/
Configuración y definición de rutas de React Router.

### utils/
Funciones utilitarias, validadores, helpers y constantes.

### config/
Archivos de configuración centralizada.

### store/
Redux store y slices (opcional, si decides usar Redux en lugar de Context API).

---

## Dependencias

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "lucide-react": "^0.294.0",
    "react-hot-toast": "^2.4.1",
    "zustand": "^4.4.7",
    "date-fns": "^3.0.6"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "postcss": "^8.4.32",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "prettier": "^3.1.1",
    "prettier-plugin-tailwindcss": "^0.5.9"
  }
}
```

---

## Variables de Entorno

### .env.example

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000

# Application
VITE_APP_NAME=Gemini Chat
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_VOICE_RECORDING=true
VITE_ENABLE_IMAGE_UPLOAD=true
VITE_ENABLE_PDF_UPLOAD=true

# File Upload Limits
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_IMAGE_SIZE=5242880
VITE_MAX_AUDIO_SIZE=10485760
VITE_MAX_PDF_SIZE=10485760

# Other
VITE_ENABLE_ANALYTICS=false
```

### .env.development

```env
VITE_API_URL=http://localhost:5000
VITE_ENABLE_ANALYTICS=false
```

### .env.production

```env
VITE_API_URL=https://api.production.com
VITE_ENABLE_ANALYTICS=true
```

---

## Archivos de Configuración

### vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@api': path.resolve(__dirname, './src/api'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@config': path.resolve(__dirname, './src/config'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### jsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@hooks/*": ["src/hooks/*"],
      "@context/*": ["src/context/*"],
      "@api/*": ["src/api/*"],
      "@utils/*": ["src/utils/*"],
      "@assets/*": ["src/assets/*"],
      "@config/*": ["src/config/*"]
    }
  },
  "include": ["src"]
}
```

### .eslintrc.cjs

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'no-unused-vars': 'warn',
  },
};
```

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## Scripts NPM

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,css}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,css}\""
  }
}
```

---

## Instalación y Configuración

### Paso 1: Crear proyecto con Vite

```bash
npm create vite@latest gemini-client -- --template react
cd gemini-client
```

### Paso 2: Instalar dependencias base

```bash
npm install
```

### Paso 3: Instalar Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Paso 4: Instalar dependencias adicionales

```bash
# Dependencias de producción
npm install react-router-dom axios clsx tailwind-merge lucide-react react-hot-toast zustand date-fns

# Dependencias de desarrollo
npm install -D prettier prettier-plugin-tailwindcss eslint-plugin-react eslint-plugin-react-hooks
```

### Paso 5: Crear estructura de carpetas

```bash
# En Linux/Mac
mkdir -p src/{api/endpoints,assets/{images,icons,styles},components/{common/{Button,Input,Textarea,Select,Modal,Toast,Spinner,Card,Avatar},layout/{Header,Sidebar,Footer,Navbar,MainLayout},auth/{LoginForm,RegisterForm,PrivateRoute},chat/{ChatInput,MessageList,Message,FileUpload,ImagePreview,VoiceRecorder,TypingIndicator},conversation/{ConversationList,ConversationItem,ConversationHeader,NewConversationButton},profile/{ProfileCard,ProfileForm,AvatarUpload}},hooks,context,pages/{Home,Login,Register,Chat,Profile,Conversations,NotFound},routes,utils/{validators,helpers},config,store/slices}

# En Windows (PowerShell)
New-Item -ItemType Directory -Force -Path src/api/endpoints,src/assets/images,src/assets/icons,src/assets/styles,src/components/common/Button,src/components/common/Input,src/components/common/Textarea,src/components/common/Select,src/components/common/Modal,src/components/common/Toast,src/components/common/Spinner,src/components/common/Card,src/components/common/Avatar,src/components/layout/Header,src/components/layout/Sidebar,src/components/layout/Footer,src/components/layout/Navbar,src/components/layout/MainLayout,src/components/auth/LoginForm,src/components/auth/RegisterForm,src/components/auth/PrivateRoute,src/components/chat/ChatInput,src/components/chat/MessageList,src/components/chat/Message,src/components/chat/FileUpload,src/components/chat/ImagePreview,src/components/chat/VoiceRecorder,src/components/chat/TypingIndicator,src/components/conversation/ConversationList,src/components/conversation/ConversationItem,src/components/conversation/ConversationHeader,src/components/conversation/NewConversationButton,src/components/profile/ProfileCard,src/components/profile/ProfileForm,src/components/profile/AvatarUpload,src/hooks,src/context,src/pages/Home,src/pages/Login,src/pages/Register,src/pages/Chat,src/pages/Profile,src/pages/Conversations,src/pages/NotFound,src/routes,src/utils/validators,src/utils/helpers,src/config,src/store/slices
```

### Paso 6: Configurar Tailwind

Actualizar `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Paso 7: Crear archivos de configuración

Crear los siguientes archivos:
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `jsconfig.json`
- `.eslintrc.cjs`
- `.prettierrc`

### Paso 8: Crear archivo .gitignore

```bash
# .gitignore
node_modules
dist
dist-ssr
*.local
.env
.env.local
.env.*.local
.DS_Store
```

### Paso 9: Configurar variables de entorno

```bash
# Copiar ejemplo
cp .env.example .env

# Editar con tus valores
nano .env
```

### Paso 10: Crear archivos index.js para exportaciones

En cada carpeta de componentes, crear un `index.js` que exporte los componentes:

```javascript
// Ejemplo: src/components/common/index.js
export { default as Button } from './Button/Button';
export { default as Input } from './Input/Input';
export { default as Modal } from './Modal/Modal';
// ... etc
```

### Paso 11: Actualizar main.jsx

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Paso 12: Crear App.jsx básico

```javascript
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
```

### Paso 13: Iniciar servidor de desarrollo

```bash
npm run dev
```

El cliente debería iniciar en `http://localhost:5173`

### Paso 14: Build para producción

```bash
npm run build
```

Los archivos optimizados se generan en `/dist`

### Paso 15: Preview de producción

```bash
npm run preview
```

---

## Estructura de Componentes

### Componentes Comunes
Componentes reutilizables como botones, inputs, modales, etc. Siguen un patrón consistente de diseño.

### Componentes de Layout
Estructuran la aplicación: header, sidebar, footer, navbar, layout principal.

### Componentes de Autenticación
Formularios de login y registro, rutas protegidas.

### Componentes de Chat
Todo lo relacionado con la interfaz de chat: input, lista de mensajes, mensajes individuales, upload de archivos, preview de imágenes, grabación de voz.

### Componentes de Conversaciones
Gestión de conversaciones: lista, items individuales, headers, botón de nueva conversación.

### Componentes de Perfil
Gestión de perfil de usuario: card, formulario, upload de avatar.

---

## Sistema de Rutas

### Rutas Públicas
- `/` - Home/Landing page
- `/login` - Login
- `/register` - Registro

### Rutas Protegidas
- `/chat` - Chat principal
- `/chat/:conversationId` - Conversación específica
- `/conversations` - Lista de conversaciones
- `/profile` - Perfil de usuario

### Rutas de Error
- `/404` - Página no encontrada
- `*` - Redirect a 404

---

## Hooks Personalizados

### useAuth
Maneja autenticación: login, logout, registro, estado del usuario.

### useChat
Maneja lógica del chat: enviar mensajes, recibir respuestas, historial.

### useConversation
Maneja conversaciones: listar, crear, eliminar, actualizar.

### useFileUpload
Maneja upload de archivos: validación, preview, envío.

### useVoiceRecorder
Maneja grabación de voz: iniciar, detener, enviar audio.

### useToast
Sistema de notificaciones toast.

### useDebounce
Debounce para inputs de búsqueda.

### useLocalStorage
Persistencia en localStorage.

### useMediaQuery
Detección responsive.

---

## Context API

### AuthContext
Estado global de autenticación:
- Usuario actual
- Token
- Estado de carga
- Funciones de auth

### ChatContext
Estado global del chat:
- Conversación activa
- Mensajes
- Estado de escritura
- Funciones de chat

### ThemeContext
Tema de la aplicación:
- Light/Dark mode
- Preferencias de usuario

### ToastContext
Sistema de notificaciones:
- Mostrar toast
- Tipos: success, error, warning, info

---

## API Client

### Configuración de Axios
- Interceptores para tokens
- Manejo de errores automático
- Refresh de tokens
- Cancelación de requests
- Transformación de respuestas

### Endpoints Organizados

#### auth.api.js
- `login(email, password)`
- `register(username, email, password)`
- `logout()`
- `getProfile()`
- `updateProfile(data)`

#### gemini.api.js
- `sendText(prompt, temperature)`
- `sendImage(formData)`
- `sendVoice(formData)`
- `sendMultimodal(formData)`
- `sendPDF(formData)`

#### conversation.api.js
- `getConversations()`
- `getConversation(id)`
- `createConversation(title)`
- `updateConversation(id, data)`
- `deleteConversation(id)`

#### user.api.js
- `getUserProfile()`
- `updateUserProfile(data)`
- `uploadAvatar(file)`

#### export.api.js
- `exportConversationPDF(conversationId)`
- `exportConversationTXT(conversationId)`

---

## Estilos y Diseño

### Tailwind CSS
Sistema de diseño basado en Tailwind con clases utilitarias.

### Sistema de Colores
- Primary: Azul (personalizable en tailwind.config.js)
- Secondary: Gris
- Success: Verde
- Warning: Amarillo
- Error: Rojo
- Info: Azul claro

### Responsive Design
- Mobile first
- Breakpoints: sm, md, lg, xl, 2xl
- Sidebar colapsable en mobile
- Chat adaptable

### Dark Mode
Soporte para tema oscuro con switch en header.

---

## Validaciones

### Client-side Validation
- Email válido
- Password mínimo 8 caracteres
- Username mínimo 3 caracteres
- Validación de archivos (tipo y tamaño)
- Validación de formularios en tiempo real

### Validadores
- `authValidator.js` - Email, password, username
- `fileValidator.js` - Tipo, tamaño, extensión de archivos

---

## Manejo de Errores

### Toast Notifications
Notificaciones para:
- Errores de red
- Errores de autenticación
- Errores de validación
- Mensajes de éxito
- Información general

### Error Boundaries
Componentes que capturan errores de React y muestran UI de fallback.

### Retry Logic
Reintentos automáticos para requests fallidos.

---

## Optimizaciones

### Code Splitting
Carga lazy de páginas y componentes pesados:
```javascript
const Chat = lazy(() => import('@pages/Chat'));
```

### Image Optimization
- Lazy loading de imágenes
- Placeholders
- Compresión antes de upload

### Memoization
- useMemo para cálculos costosos
- useCallback para funciones
- React.memo para componentes

### Debouncing
Debounce en inputs de búsqueda y filtros.

---

## Testing (Opcional)

### Herramientas
- Vitest para unit tests
- React Testing Library para componentes
- MSW para mock de API

### Comandos
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom msw
```

### Scripts adicionales
```json
{
  "test": "vitest",
  "test:ui": "vitest --ui",
  "coverage": "vitest --coverage"
}
```

---

## Deployment

### Build
```bash
npm run build
```

### Variables de Entorno en Producción
Asegurar que todas las variables `VITE_*` estén configuradas en el servidor de producción.

### Opciones de Deploy
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Docker

### Configuración Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Configuración Netlify
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Flujo de Autenticación

### Login
1. Usuario ingresa credenciales
2. Request a `/api/auth/login`
3. Recibe token JWT
4. Guarda token en localStorage
5. Actualiza contexto de autenticación
6. Redirect a `/chat`

### Registro
1. Usuario completa formulario
2. Validación client-side
3. Request a `/api/auth/register`
4. Recibe token JWT
5. Auto-login
6. Redirect a `/chat`

### Logout
1. Usuario hace clic en logout
2. Request a `/api/auth/logout`
3. Elimina token de localStorage
4. Limpia contexto de autenticación
5. Redirect a `/login`

### Protección de Rutas
- Componente `PrivateRoute` verifica autenticación
- Si no está autenticado, redirect a `/login`
- Si está autenticado, renderiza componente

---

## Flujo de Chat

### Enviar Mensaje de Texto
1. Usuario escribe mensaje
2. Click en enviar
3. Muestra mensaje en UI inmediatamente
4. Request a `/api/gemini/text`
5. Muestra indicador de "escribiendo"
6. Recibe respuesta
7. Agrega respuesta a la UI
8. Guarda conversación en backend

### Upload de Imagen
1. Usuario selecciona imagen
2. Preview local de la imagen
3. Validación de tipo y tamaño
4. FormData con imagen y prompt
5. Request a `/api/gemini/image`
6. Muestra indicador de procesamiento
7. Recibe análisis de imagen
8. Muestra resultado en chat

### Grabación de Voz
1. Usuario hace clic en micrófono
2. Solicita permisos de micrófono
3. Inicia grabación
4. Muestra indicador de grabación activa
5. Usuario detiene grabación
6. Convierte audio a formato compatible
7. Request a `/api/gemini/voice`
8. Transcripción y respuesta
9. Muestra en chat

---

## Gestión de Conversaciones

### Listar Conversaciones
1. Request a `/api/conversations`
2. Muestra lista en sidebar
3. Click en conversación
4. Carga mensajes de esa conversación
5. Cambia contexto activo

### Nueva Conversación
1. Click en "Nueva Conversación"
2. Request a `/api/conversations` (POST)
3. Crea conversación vacía
4. Redirect a nueva conversación
5. Usuario puede empezar a chatear

### Eliminar Conversación
1. Click en botón eliminar
2. Modal de confirmación
3. Request a `/api/conversations/:id` (DELETE)
4. Elimina de lista
5. Si era la activa, redirect a `/chat`

---

## Performance

### Lazy Loading
- Páginas cargadas bajo demanda
- Componentes pesados con lazy loading
- Imágenes con loading="lazy"

### Virtualization
- Lista de conversaciones virtualizada (react-window)
- Lista de mensajes virtualizada para chats largos

### Caching
- Cache de conversaciones en memoria
- Cache de respuestas en localStorage (opcional)
- Cache HTTP con service workers (opcional)

### Optimistic Updates
- Actualización optimista de UI antes de confirmación del servidor
- Rollback en caso de error

---

## Accesibilidad

### ARIA Labels
- Todos los botones tienen aria-labels descriptivos
- Inputs tienen labels asociados
- Modales tienen aria-modal y role="dialog"

### Keyboard Navigation
- Tab navigation funcional
- Enter para enviar mensajes
- Esc para cerrar modales
- Atajos de teclado para funciones comunes

### Screen Readers
- Textos alternativos en imágenes
- Mensajes de estado para acciones
- Estructura semántica HTML

### Contraste
- Ratios de contraste WCAG AA mínimo
- Modo oscuro con contraste adecuado

---

## Seguridad

### XSS Prevention
- Sanitización de inputs
- Escape de contenido HTML
- CSP headers

### CSRF Protection
- Tokens CSRF en formularios críticos
- Validación de origen

### Secure Storage
- Tokens en localStorage (o httpOnly cookies si el backend lo soporta)
- No almacenar datos sensibles en localStorage
- Limpiar datos al logout

### API Security
- Tokens enviados en headers Authorization
- Refresh tokens manejados automáticamente
- Expiración de sesión

---

## Monitoreo y Analytics

### Error Tracking
- Sentry para tracking de errores (opcional)
- Console logs en desarrollo
- Error boundaries

### Analytics
- Google Analytics (opcional)
- Tracking de eventos importantes:
  - Login/Registro
  - Mensajes enviados
  - Conversaciones creadas
  - Errores

---

## Buenas Prácticas

### Componentes
- Un componente por archivo
- Componentes pequeños y reutilizables
- Props documentadas
- Export default al final del archivo

### Hooks
- Custom hooks para lógica reutilizable
- Prefijo "use" en nombres
- Documentar dependencias

### Estado
- Elevar estado solo cuando necesario
- Context para estado global
- Zustand para estado complejo (alternativa a Redux)

### Styling
- Tailwind para estilos
- Componentes con clases utilitarias
- Evitar inline styles
- Sistema de diseño consistente

### Code Organization
- Imports ordenados (externos, internos, relativos)
- Exportaciones centralizadas con index.js
- Estructura de carpetas consistente

---

## Comandos Útiles

### Desarrollo
```bash
npm run dev                  # Iniciar servidor de desarrollo
npm run build               # Build para producción
npm run preview             # Preview del build
npm run lint                # Ejecutar linter
npm run lint:fix            # Corregir errores de linting
npm run format              # Formatear código con Prettier
npm run format:check        # Verificar formateo
```

### Limpieza
```bash
rm -rf node_modules dist    # Limpiar dependencias y build
npm install                 # Reinstalar dependencias
```

---

## Troubleshooting

### Puerto ocupado
Si el puerto 5173 está ocupado:
```bash
# Cambiar puerto en vite.config.js
server: {
  port: 3000
}
```

### CORS errors
Verificar configuración de proxy en `vite.config.js` y configuración CORS en el servidor.

### Build errors
- Verificar variables de entorno
- Limpiar node_modules y reinstalar
- Verificar versiones de dependencias

### Imports no resueltos
Verificar configuración de aliases en `jsconfig.json` y `vite.config.js`.

---

## Recursos Adicionales

### Documentación Oficial
- React: https://react.dev
- Vite: https://vitejs.dev
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Axios: https://axios-http.com

### Librerías Útiles
- lucide-react: Iconos
- react-hot-toast: Notificaciones
- zustand: Estado global
- date-fns: Manejo de fechas
- clsx + tailwind-merge: Clases condicionales

### Componentes UI (Opcional)
- shadcn/ui: https://ui.shadcn.com
- Headless UI: https://headlessui.com
- Radix UI: https://www.radix-ui.com

---

## Próximos Pasos

1. Implementar API client con Axios
2. Crear sistema de autenticación completo
3. Implementar Context API para estado global
4. Crear componentes comunes reutilizables
5. Implementar páginas principales
6. Crear componentes de chat
7. Implementar sistema de rutas
8. Integrar con API del servidor
9. Optimizar performance
10. Testing y debugging
11. Deploy a producción

---

## Notas Importantes

### Variables de Entorno
- Todas las variables deben empezar con `VITE_`
- NO subir archivo `.env` al repositorio
- Crear `.env.example` con ejemplos

### Compatibilidad
- Node.js >= 16
- NPM >= 8
- Navegadores modernos (Chrome, Firefox, Safari, Edge)

### Performance
- Build size objetivo: < 500KB (gzipped)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s

### Mantenimiento
- Actualizar dependencias regularmente
- Revisar vulnerabilidades: `npm audit`
- Mantener documentación actualizada
- Code reviews antes de merge