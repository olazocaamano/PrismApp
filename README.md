# Prism ◇

> Organiza tus tareas, cumple tus metas.

Prism es una aplicación web progresiva (PWA) para gestión de tareas con calendario, recordatorios por correo y estadísticas. Diseñada con un enfoque minimalista y responsive.

## ✨ Características

- **Gestión de tareas** — CRUD completo con título, descripción, fecha límite, prioridad y categoría
- **Calendario interactivo** — Vista mensual con tareas marcadas por prioridad
- **Subtareas** — Divide tareas complejas en pasos más pequeños
- **Tareas recurrentes** — Diarias, semanales o mensuales
- **Filtros y búsqueda** — Encuentra tareas por estado, prioridad, categoría o texto
- **Estadísticas** — Gráficas de progreso semanal, distribución por categoría y prioridad
- **Multi-idioma** — Español, English, Português
- **Modo oscuro** — Alternancia entre tema claro y oscuro
- **Autenticación** — Registro e inicio de sesión con email/contraseña o Google
- **Recordatorios por Gmail** — Cloud Function que envía correos antes del vencimiento
- **PWA** — Instalable en Android y escritorio
- **Responsive** — Diseño mobile-first adaptado a cualquier pantalla

## 🛠 Stack

| Frontend | Backend | Infra |
|---|---|---|
| React 19 | Firebase Auth | Vercel |
| Vite 5 | Cloud Firestore | GitHub |
| Tailwind CSS 3 | Cloud Functions | PWA |
| FullCalendar 6 | Firebase Hosting | Capacitor (futuro) |
| Recharts | Nodemailer | |
| react-i18next | | |
| react-router-dom 6 | | |

## 📁 Estructura

```
src/
├── components/     # UI reutilizable (Navbar, TaskCard, TaskModal, Icons)
├── pages/          # Login, Register, Dashboard, Tasks, Calendar, Stats, Settings
├── context/        # AuthContext, ThemeContext
├── hooks/          # useTasks (Firestore en tiempo real)
├── lib/            # firebase.js, i18n.js
└── locales/        # es.json, en.json, pt.json
functions/
├── index.js        # Cloud Function para recordatorios Gmail
└── package.json
```

## 🚀 Inicio rápido

```bash
# Clonar
git clone https://github.com/tuusuario/PrismApp.git
cd PrismApp

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Firebase

# Iniciar en desarrollo
npm run dev

# Build producción
npm run build
```

## 🔥 Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita **Authentication** (Email/Password + Google)
3. Crea **Cloud Firestore** (reglas por usuario autenticado)
4. (Opcional) Despliega Cloud Functions para recordatorios:
   ```bash
   cd functions
   npm install
   firebase deploy --only functions
   firebase functions:config:set gmail.email="tu@email.com" gmail.password="tucontraseña"
   ```

## 🌐 Deploy en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tuusuario/PrismApp)

1. Conecta tu repositorio de GitHub
2. Vercel detecta automáticamente Vite
3. Agrega las variables de entorno de Firebase
4. ¡Listo!

## 📱 APK Android (futuro)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap open android
```

## 📄 Licencia

MIT
