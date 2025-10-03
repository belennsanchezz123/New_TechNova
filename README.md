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
- **Backend con Express**: Servidor básico listo para extensión con API REST
- **Integración Supabase**: Configurado para usar base de datos Supabase
- **CSS organizado**: Estilos divididos por responsabilidad (layout, components, email, browser)
- **Manejadores por escenario**: Lógica de cada escenario en archivos separados para mejor mantenibilidad

## Estructura de Archivos Frontend

- `components/scenarios.js` - Plantillas HTML de cada escenario
- `components/popups.js` - HTML de ventanas emergentes
- `handlers/scenario[1-7].js` - Lógica de eventos de cada escenario
- `utils/metrics.js` - Sistema de métricas y resultados
- `utils/emails.js` - Gestión de emails de simulación
- `utils/validation.js` - Funciones de validación
- `styles/` - CSS dividido en módulos temáticos
