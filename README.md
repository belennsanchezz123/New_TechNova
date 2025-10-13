# LYNX Platform Evaluation

Simulación de evaluación de seguridad de la plataforma LYNX con arquitectura Frontend/Backend separada.

## Estructura del Proyecto

```
project/
├── backend/           # Servidor Node.js/Express
│   ├── server.js      # Punto de entrada del backend
│   └── package.json
│
├── frontend/          # Aplicación Vite
│   ├── src/
│   │   ├── components/    # Componentes HTML reutilizables
│   │   ├── handlers/      # Manejadores de eventos por escenario
│   │   ├── styles/        # Estilos CSS organizados
│   │   ├── utils/         # Utilidades y lógica compartida
│   │   └── main.js        # Punto de entrada principal
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .env               # Variables de entorno
├── .gitignore
└── package.json       # Scripts raíz del proyecto
```

## Instalación

1. Instalar dependencias en ambos proyectos:
```bash
npm run install:all
```

O instalar manualmente:
```bash
cd frontend && npm install
cd ../backend && npm install
```

## Desarrollo

### Ejecutar Frontend (Vite)
```bash
npm run dev
# O desde la carpeta frontend:
cd frontend && npm run dev
```

### Ejecutar Backend
```bash
npm run backend
# O desde la carpeta backend:
cd backend && npm start
```

## Construcción

Para crear una versión de producción del frontend:
```bash
npm run build
# O desde la carpeta frontend:
cd frontend && npm run build
```

## Características

- **Frontend modular**: Código organizado en componentes, handlers, utils y estilos separados
- **Backend con Express**: Servidor API REST con endpoints para gestión de sesiones y métricas
- **Integración Supabase**: Base de datos configurada para almacenar sesiones y métricas de usuarios
- **Registro automático**: Cada sesión de usuario se guarda automáticamente en la base de datos
- **Dashboard de administración**: Panel para visualizar todas las sesiones y métricas registradas
- **CSS organizado**: Estilos divididos por responsabilidad (layout, components, email, browser)
- **Manejadores por escenario**: Lógica de cada escenario en archivos separados para mejor mantenibilidad

## Visualización de Métricas de Usuarios

### Dashboard de Administración

Para ver las métricas registradas de cada usuario, abre el dashboard de administración:

1. Asegúrate de que el backend esté ejecutándose:
```bash
npm run backend
```

2. Abre el archivo `frontend/admin.html` en tu navegador o usa un servidor local:
```bash
cd frontend
python -m http.server 8080
# Luego abre: http://localhost:8080/admin.html
```

El dashboard muestra:
- **Estadísticas generales**: Total de sesiones, completadas, activas y consentimientos
- **Lista de sesiones**: Tabla con todas las sesiones registradas
- **Detalles por sesión**: Click en "Ver Métricas" para ver todas las métricas de un usuario específico

### Base de Datos (Supabase)
Ejecutar el comando npx supabase db pull cada vez que creemos/modifiquemos una tabla en la app. 
Las métricas se almacenan en dos tablas:

- `user_sessions`: Información general de cada sesión (ID, usuario, fechas, email de consentimiento)
- `session_metrics`: Métricas individuales por escenario (contraseñas, phishing, cookies, etc.)

### API Endpoints

El backend expone los siguientes endpoints:

- `POST /api/sessions/start` - Inicia una nueva sesión
- `POST /api/sessions/metrics` - Guarda las métricas de una sesión
- `POST /api/sessions/complete` - Marca una sesión como completada
- `GET /api/sessions/all` - Obtiene todas las sesiones
- `GET /api/sessions/:sessionId/metrics` - Obtiene métricas de una sesión específica

## Estructura de Archivos Frontend

- `components/scenarios.js` - Plantillas HTML de cada escenario
- `components/popups.js` - HTML de ventanas emergentes
- `handlers/scenario[1-7].js` - Lógica de eventos de cada escenario
- `services/api.js` - Comunicación con el backend
- `utils/metrics.js` - Sistema de métricas y resultados
- `utils/emails.js` - Gestión de emails de simulación
- `utils/validation.js` - Funciones de validación
- `styles/` - CSS dividido en módulos temáticos
- `admin.html` - Dashboard de administración

## Estructura de Archivos Backend

- `server.js` - Servidor Express principal
- `routes/sessions.js` - Rutas para gestión de sesiones y métricas
