# Changelog

## [1.0.0] — 2026-06-08

### Añadido
- Proyecto base con React 19 + Vite 5 + Tailwind CSS 3
- Autenticación con Firebase (email/contraseña + Google)
- Base de datos Firestore con reglas por usuario
- CRUD completo de tareas (crear, editar, eliminar, completar)
- Subtareas dentro de cada tarea
- Tareas recurrentes (diarias, semanales, mensuales)
- Dashboard con resumen diario y semanal
- Vista de calendario con FullCalendar
- Filtros por estado, prioridad, categoría y búsqueda
- Estadísticas con gráficas (Recharts)
- Multi-idioma: español, inglés, portugués
- Modo oscuro/claro
- PWA instalable (service worker + manifest)
- Recordatorios por Gmail vía Cloud Functions
- Diseño responsive mobile-first
- Iconos SVG personalizados (reemplazo de emojis)
- Navegación inferior en móvil y superior en escritorio

### Configuración
- Variables de entorno para Firebase
- Configuración de Vercel para SPA routing
- Firestore rules e índices
- Cloud Functions para recordatorios
- .gitignore para entorno seguro
