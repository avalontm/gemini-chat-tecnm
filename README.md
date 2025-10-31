# 🤖 Gemini Chat - TecNM Campus Ensenada

> Plataforma de chat con IA generativa powered by Google Gemini AI para la comunidad del Tecnológico Nacional de México Campus Ensenada.

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.16-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![Gemini Chat Preview](https://via.placeholder.com/1200x600/0ea5e9/ffffff?text=Gemini+Chat+TecNM)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Arquitectura](#-arquitectura)
- [Componentes Principales](#-componentes-principales)
- [Variables de Entorno](#-variables-de-entorno)
- [Rutas](#-rutas)
- [API Integration](#-api-integration)
- [Deployment](#-deployment)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### 🎯 Funcionalidades Principales

- **Chat Inteligente**: Conversaciones naturales con Google Gemini AI
- **Respuestas Contextuales**: IA que entiende el contexto de la conversación
- **Análisis Multimodal**: Soporte para texto, imágenes, audio y documentos
- **Historial de Conversaciones**: Guarda y gestiona múltiples chats
- **Interfaz Moderna**: UI/UX diseñada con Tailwind CSS v4
- **Modo Oscuro**: Theme switcher con soporte completo dark/light mode
- **Responsive Design**: Adaptable a cualquier dispositivo
- **Autenticación Segura**: Sistema completo de login/registro
- **Upload de Archivos**: Sube imágenes, PDFs y audio
- **Grabación de Voz**: Graba y envía mensajes de voz
- **Exportación**: Exporta conversaciones a PDF o TXT

### 🔒 Seguridad

- Autenticación JWT
- Rutas protegidas con PrivateRoute
- Validación de formularios client-side
- Sanitización de inputs
- Manejo seguro de tokens

### 🎨 UI/UX

- Diseño moderno y profesional
- Animaciones suaves y transiciones
- Loading states y feedback visual
- Toast notifications para acciones
- Skeleton loaders
- Error boundaries

---

## 🛠 Tecnologías

### Core

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **React** | 19.1.1 | Biblioteca UI principal |
| **Vite** | 7.1.7 | Build tool y dev server |
| **React Router** | 7.9.5 | Routing y navegación |

### Styling

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Tailwind CSS** | 4.1.16 | Framework CSS utility-first |
| **Lucide React** | 0.548.0 | Iconos modernos |
| **clsx** | 2.1.1 | Utilidad para clases condicionales |
| **tailwind-merge** | 3.3.1 | Merge inteligente de clases |

### State Management & Data

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **Axios** | 1.13.1 | Cliente HTTP |
| **date-fns** | 4.1.0 | Manejo de fechas |
| **react-hot-toast** | 2.6.0 | Sistema de notificaciones |

### Development Tools

| Herramienta | Versión | Descripción |
|-------------|---------|-------------|
| **ESLint** | 9.36.0 | Linter de código |
| **Prettier** | 3.6.2 | Formateador de código |
| **Prettier Plugin Tailwind** | 0.7.1 | Ordenar clases Tailwind |

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 16.x
- **npm** >= 8.x (o **yarn** >= 1.22.x)
- **Git**

Verifica tus versiones:

```bash
node --version
npm --version
git --version
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/gemini-chat-tecnm.git
cd gemini-chat-tecnm
```

### 2. Instalar dependencias

```bash
npm install
```

O con yarn:

```bash
yarn install
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus valores:

```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_APP_NAME=Gemini Chat TecNM
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## ⚙️ Configuración

### Tailwind CSS v4

El proyecto usa Tailwind CSS v4 con la nueva sintaxis `@import`. Configuración en `src/index.css`:

```css
@import "tailwindcss";

@layer base {
  /* Estilos base */
}

@layer utilities {
  /* Utilidades personalizadas */
}

@custom-variant dark (&:where(.dark, .dark *));
```

### Vite Configuration

Configuración con aliases para imports limpios:

```javascript
// vite.config.js
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@context': path.resolve(__dirname, './src/context'),
      '@api': path.resolve(__dirname, './src/api'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
    }
  }
})
```

### Constantes del Sitio

Todos los textos y configuraciones están centralizados en `src/config/constants.js`:

```javascript
import { SITE_CONFIG } from '@config/constants';

// Usar en componentes
<h1>{SITE_CONFIG.home.hero.title}</h1>
```

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| **Desarrollo** | `npm run dev` | Inicia servidor de desarrollo |
| **Build** | `npm run build` | Genera build de producción |
| **Preview** | `npm run preview` | Preview del build de producción |
| **Lint** | `npm run lint` | Ejecuta ESLint |
| **Lint Fix** | `npm run lint:fix` | Corrige errores de ESLint |
| **Format** | `npm run format` | Formatea código con Prettier |
| **Format Check** | `npm run format:check` | Verifica formateo |

### Ejemplos de uso

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Verificar y corregir código
npm run lint:fix
npm run format

# Preview de producción local
npm run preview
```

---

## 📁 Estructura del Proyecto

```
gemini-client/
│
├── public/                          # Archivos estáticos
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── api/                         # Configuración de API
│   │   ├── axios.config.js
│   │   ├── interceptors.js
│   │   └── endpoints/
│   │       ├── auth.api.js
│   │       ├── gemini.api.js
│   │       └── conversation.api.js
│   │
│   ├── assets/                      # Recursos estáticos
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │
│   ├── components/                  # Componentes React
│   │   ├── common/                  # Componentes reutilizables
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   └── ...
│   │   │
│   │   ├── layout/                  # Componentes de layout
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   └── MainLayout/
│   │   │
│   │   ├── auth/                    # Componentes de autenticación
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   └── PrivateRoute/
│   │   │
│   │   ├── chat/                    # Componentes de chat
│   │   │   ├── ChatInput/
│   │   │   ├── MessageList/
│   │   │   ├── Message/
│   │   │   ├── FileUpload/
│   │   │   └── VoiceRecorder/
│   │   │
│   │   └── conversation/            # Gestión de conversaciones
│   │       ├── ConversationList/
│   │       └── ConversationItem/
│   │
│   ├── config/                      # Archivos de configuración
│   │   ├── constants.js             # ✨ Constantes globales del sitio
│   │   ├── api.config.js
│   │   └── app.config.js
│   │
│   ├── context/                     # React Context API
│   │   ├── AuthContext.jsx
│   │   ├── ChatContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── index.js
│   │
│   ├── hooks/                       # Custom React Hooks
│   │   ├── useAuth.js
│   │   ├── useChat.js
│   │   ├── useConversation.js
│   │   ├── useFileUpload.js
│   │   ├── useVoiceRecorder.js
│   │   └── useTheme.js
│   │
│   ├── pages/                       # Páginas de la aplicación
│   │   ├── Home/
│   │   │   ├── Home.jsx             # ✨ Usa SITE_CONFIG
│   │   │   └── index.js
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Chat/
│   │   ├── Profile/
│   │   └── NotFound/
│   │
│   ├── routes/                      # Configuración de rutas
│   │   ├── AppRoutes.jsx
│   │   └── routes.config.js
│   │
│   ├── utils/                       # Utilidades y helpers
│   │   ├── validators/
│   │   ├── helpers/
│   │   └── errorMessages.js
│   │
│   ├── App.jsx                      # Componente raíz
│   ├── main.jsx                     # Entry point
│   └── index.css                    # ✨ Estilos globales con Tailwind v4
│
├── .env.example                     # Ejemplo de variables de entorno
├── .env                             # Variables de entorno (gitignored)
├── .gitignore
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── vite.config.js                   # ✨ Configuración con aliases
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
├── package.json
└── README.md
```

### 📂 Componentes por Categoría

#### Common Components (Reutilizables)
- Button, Input, Textarea, Select
- Modal, Toast, Spinner
- Card, Avatar, Badge

#### Layout Components
- Header (con theme switcher)
- Sidebar (navegación)
- Footer
- MainLayout (wrapper principal)

#### Auth Components
- LoginForm
- RegisterForm
- PrivateRoute (protección de rutas)

#### Chat Components
- ChatInput (input de mensajes)
- MessageList (lista de mensajes)
- Message (mensaje individual)
- FileUpload (subir archivos)
- ImagePreview (preview de imágenes)
- VoiceRecorder (grabar voz)
- TypingIndicator (indicador de escritura)

#### Conversation Components
- ConversationList (lista de chats)
- ConversationItem (item individual)
- ConversationHeader (header del chat)
- NewConversationButton

---

## 🏗 Arquitectura

### Context API Structure

```
App
├── AuthContext (usuario, token, login, logout)
│   ├── ChatContext (conversación activa, mensajes)
│   │   └── ThemeContext (dark/light mode)
│   │       └── ToastContext (notificaciones)
```

### Component Architecture

```
Page Component
├── Layout Component
│   ├── Header
│   ├── Sidebar
│   ├── Main Content
│   │   ├── Feature Component
│   │   │   ├── Common Components
│   │   │   └── Custom Hooks
│   │   └── ...
│   └── Footer
```

### Data Flow

```
User Action → Component → Hook → API Call → Context Update → Re-render
```

---

## 🧩 Componentes Principales

### Home Page

Landing page del sitio con:
- Hero section con call-to-action
- Features section con iconos
- Stats section (usuarios, mensajes, uptime)
- CTA section con botón de registro
- Footer institucional

**Ubicación**: `src/pages/Home/Home.jsx`

**Uso de constantes**:
```javascript
import { SITE_CONFIG } from '@config/constants';

// Título dinámico desde constantes
<h1>{SITE_CONFIG.home.hero.title}</h1>

// Features desde configuración
{SITE_CONFIG.home.features.items.map(feature => (
  <FeatureCard {...feature} />
))}
```

### Authentication

Sistema completo de autenticación con:
- Formulario de login
- Formulario de registro
- Validación de campos
- Manejo de errores
- Redirect después de login

### Chat Interface

Interfaz principal de chat con:
- Sidebar con lista de conversaciones
- Área principal de mensajes
- Input de mensajes con opciones
- Upload de archivos
- Grabación de voz
- Preview de imágenes

### Theme Switcher

Toggle entre modo claro y oscuro:
- Guardado en localStorage
- Persistente entre sesiones
- Smooth transitions

---

## 🔐 Variables de Entorno

### Archivo .env.example

```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000

# Application
VITE_APP_NAME=Gemini Chat TecNM
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_VOICE_RECORDING=true
VITE_ENABLE_IMAGE_UPLOAD=true
VITE_ENABLE_PDF_UPLOAD=true

# File Upload Limits (bytes)
VITE_MAX_FILE_SIZE=10485760        # 10MB
VITE_MAX_IMAGE_SIZE=5242880        # 5MB
VITE_MAX_AUDIO_SIZE=10485760       # 10MB
VITE_MAX_PDF_SIZE=10485760         # 10MB

# Analytics
VITE_ENABLE_ANALYTICS=false
```

### Ambientes

**Desarrollo** (`.env.development`):
```env
VITE_API_URL=http://localhost:5000
VITE_ENABLE_ANALYTICS=false
```

**Producción** (`.env.production`):
```env
VITE_API_URL=https://api.tu-dominio.com
VITE_ENABLE_ANALYTICS=true
```

> **⚠️ Importante**: Todas las variables deben comenzar con `VITE_` para ser accesibles en el cliente.

---

## 🛣 Rutas

### Rutas Públicas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Home | Landing page |
| `/login` | Login | Inicio de sesión |
| `/register` | Register | Registro de usuario |

### Rutas Protegidas (requieren autenticación)

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/chat` | Chat | Chat principal |
| `/chat/:id` | Chat | Conversación específica |
| `/conversations` | Conversations | Lista de conversaciones |
| `/profile` | Profile | Perfil de usuario |
| `/settings` | Settings | Configuración |

### Rutas de Error

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/404` | NotFound | Página no encontrada |
| `*` | NotFound | Wildcard redirect |

### Protección de Rutas

```javascript
// Uso de PrivateRoute
<Route 
  path="/chat" 
  element={
    <PrivateRoute>
      <Chat />
    </PrivateRoute>
  } 
/>
```

---

## 🔌 API Integration

### Configuración de Axios

```javascript
// src/api/axios.config.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Endpoints

#### Auth API

```javascript
// src/api/endpoints/auth.api.js
import api from '../axios.config';

export const authAPI = {
  login: (email, password) => 
    api.post('/api/auth/login', { email, password }),
  
  register: (username, email, password) => 
    api.post('/api/auth/register', { username, email, password }),
  
  logout: () => 
    api.post('/api/auth/logout'),
  
  getProfile: () => 
    api.get('/api/auth/profile'),
};
```

#### Gemini API

```javascript
// src/api/endpoints/gemini.api.js
import api from '../axios.config';

export const geminiAPI = {
  sendText: (prompt, conversationId, temperature = 0.7) =>
    api.post('/api/gemini/text', { prompt, conversationId, temperature }),
  
  sendImage: (formData) =>
    api.post('/api/gemini/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  sendVoice: (formData) =>
    api.post('/api/gemini/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};
```

---

## 🎨 Estilos y Theming

### Tailwind CSS v4

**Nueva sintaxis con `@import`**:

```css
/* src/index.css */
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@layer base {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: 'Inter', system-ui, sans-serif;
  }
}

@layer utilities {
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
}
```

### Dark Mode

Implementado con clases y variables CSS:

```javascript
// ThemeContext
const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', newTheme);
};
```

### Color Palette

```
Primary: Blue (bg-blue-600, text-blue-600)
Secondary: Indigo (bg-indigo-600)
Success: Green (bg-green-600)
Warning: Yellow (bg-yellow-600)
Error: Red (bg-red-600)
Gray Scale: slate-50 to slate-900
```

---

## 📱 Responsive Design

### Breakpoints

| Breakpoint | Min Width | Target |
|------------|-----------|--------|
| `sm` | 640px | Tablets pequeños |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile First

Todos los estilos se escriben mobile-first:

```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```

---

## 🚀 Deployment

### Build para Producción

```bash
npm run build
```

Genera archivos optimizados en `/dist`.

### Deploy en Vercel

1. Instalar Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configurar variables de entorno en Vercel dashboard.

### Deploy en Netlify

1. Conectar repositorio en Netlify
2. Configurar build:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Configurar variables de entorno
4. Deploy automático en cada push

### Deploy con Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🧪 Testing (Próximamente)

### Unit Tests

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### E2E Tests

```bash
npm install -D cypress
```

---

## 🤝 Contribuir

### Cómo Contribuir

1. **Fork** el repositorio
2. Crea una **branch** para tu feature:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** tus cambios:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** a tu branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Abre un **Pull Request**

### Coding Standards

- Usar ESLint y Prettier
- Nombres descriptivos para variables y funciones
- Comentarios en código complejo
- Componentes pequeños y reutilizables
- Props documentadas
- Commits descriptivos

### Commit Convention

```
feat: Nueva característica
fix: Corrección de bug
docs: Cambios en documentación
style: Cambios de formato (no afectan código)
refactor: Refactorización de código
test: Agregar o modificar tests
chore: Tareas de mantenimiento
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autores

**Tecnológico Nacional de México - Campus Ensenada**

- Website: [https://ensenada.tecnm.mx](https://ensenada.tecnm.mx)
- Email: soporte@ensenada.tecnm.mx

---

## 🙏 Agradecimientos

- [Google Gemini AI](https://ai.google.dev/) - IA generativa
- [React Team](https://react.dev/) - Framework UI
- [Vite Team](https://vitejs.dev/) - Build tool
- [Tailwind Labs](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Hosting y deployment
- Comunidad TecNM Campus Ensenada

---

## 📞 Soporte

¿Necesitas ayuda? Contacta con nosotros:

- 📧 Email: soporte@ensenada.tecnm.mx
- 📱 Teléfono: +52 (646) 123-4567
- 🌐 Website: [https://ensenada.tecnm.mx](https://ensenada.tecnm.mx)
- 💬 Issues: [GitHub Issues](https://github.com/tu-usuario/gemini-chat-tecnm/issues)

---

## 🗺 Roadmap

### v1.0 (Actual)
- ✅ Autenticación de usuarios
- ✅ Chat con Gemini AI
- ✅ Modo oscuro
- ✅ Responsive design
- ✅ Sistema de constantes globalizado

### v1.1 (Próximamente)
- 🔄 Upload de archivos mejorado
- 🔄 Grabación de voz
- 🔄 Exportar conversaciones
- 🔄 Búsqueda en conversaciones

### v2.0 (Futuro)
- 📅 Análisis de imágenes con IA
- 📅 Procesamiento de PDFs
- 📅 Comandos de voz
- 📅 Integración con Google Workspace
- 📅 Multi-idioma (Español/Inglés)
- 📅 Modo offline

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ por el TecNM Campus Ensenada

</div>