# TechNova — Simulacion de Ciberseguridad

Simulacion interactiva de entorno laboral para medir comportamientos de ciberseguridad en empleados nuevos. Desarrollada como parte de un estudio academico en la Universidad de Murcia.

---

## Descripcion

TechNova simula el primer dia de trabajo de un empleado en una empresa ficticia. A lo largo de la simulacion, el participante se enfrenta a escenarios reales de seguridad: configuracion de cuentas, correos de phishing, uso de un asistente IA con datos sensibles, gestion de perfil publico, limpieza de archivos y un evento inesperado de actualizacion del sistema.

Todas las acciones del participante se registran como metricas y son accesibles desde el panel de administracion.

---

## Requisitos

- Node.js >= 18
- npm
- API key de OpenAI (para el escenario 5)

---

## Instalacion y arranque

```bash
# Instalar dependencias (frontend + backend)
npm run install:all

# Arrancar frontend y backend simultaneamente
npm start
```

O por separado:

```bash
# Backend (puerto 3000)
cd backend && npm start

# Frontend (puerto 5173)
cd frontend && npm run dev
```

### Configuracion del backend

Crear `backend/.env` con:

```
OPENAI_API_KEY=tu_api_key_de_openai
OPENAI_MODEL=gpt-4o-mini
```

Sin la API key el escenario 5 usa respuestas de fallback controladas.

---

## Acceso

| URL | Descripcion |
|-----|-------------|
| `http://localhost:5173` | Simulacion para participantes |
| `http://localhost:5173/admin.html` | Panel de administracion |
| `http://localhost:5173/?debug=true` | Modo debug (saltar escenarios) |

---

## Estructura del proyecto

```
TechNova/
├── backend/
│   ├── routes/
│   │   ├── ai.js            # Escenario IA: OpenAI, trampa salarial, metricas
│   │   ├── sessions.js      # Gestion de sesiones y guardado de metricas
│   │   ├── breach.js        # Verificacion de contrasenas comprometidas (HaveIBeenPwned)
│   │   ├── questionnaire.js # Cuestionario post-simulacion
│   │   └── auth.js          # Autenticacion admin
│   ├── database.js          # Esquema y migraciones SQLite
│   └── server.js            # Servidor Express
├── frontend/
│   ├── src/
│   │   ├── handlers/        # Logica de cada escenario
│   │   │   ├── scenario1.js   # Cuentas y seguridad
│   │   │   ├── scenario2.js   # Bloqueo de pantalla
│   │   │   ├── scenario3.js   # Phishing en correos
│   │   │   ├── scenario4.js   # Navegacion web
│   │   │   ├── scenario5.js   # Asistente IA para RRHH
│   │   │   ├── scenario6.js   # Perfil profesional
│   │   │   ├── scenario7.js   # Limpieza de archivos
│   │   │   ├── scenario9.js   # Cuestionario
│   │   │   └── taskbar-handler.js  # Evento inesperado (actualizacion)
│   │   ├── components/      # HTML de escenarios y taskbar
│   │   ├── utils/
│   │   │   ├── metrics.js   # Definicion de todas las metricas
│   │   │   ├── emails.js    # Correos del escenario de phishing
│   │   │   └── validation.js
│   │   └── services/api.js  # Llamadas al backend
│   └── admin.html           # Panel de administracion
├── docs/
│   └── METRICS.md           # Documentacion completa de metricas
└── TEST_DATABASE.md         # Guia para verificar la base de datos
```

---

## Escenarios

| # | Nombre en Admin | Descripcion |
|---|-----------------|-------------|
| 1 | Cuentas y Seguridad | Configuracion de correo, Drive y calendario corporativo. Mide fortaleza de contrasenas, reutilizacion, MFA y uso de red WiFi |
| 2 | Interrupciones & Elementos Externos | El participante debe decidir si bloquea la pantalla al alejarse del equipo |
| 3 | Email y Comunicaciones | Bandeja con correos legítimos y de phishing. Mide deteccion, reporte y exposicion de credenciales |
| 4 | Navegacion Web | Navegador simulado con sitios seguros, sospechosos y maliciosos. Mide cookies, extensiones y enlaces peligrosos |
| 5 | Uso del Asistente IA para RRHH | Chat de RRHH con asistente IA. Mide si el participante pasa datos sensibles a la IA y si detecta el dato trampa |
| 6 | Configuracion del Perfil Profesional | Formulario de perfil publico y autorizacion de app de terceros. Mide datos personales revelados |
| 7 | Limpieza y Gestion de Archivos | Escritorio con archivos sensibles. Mide borrado seguro y vaciado de papelera |
| 9 | Realizacion del Cuestionario | Cuestionario post-simulacion con tiempo minimo de 4 minutos |

Adicionalmente, durante la simulacion aparece un **evento inesperado**: notificacion de actualizacion falsa del sistema (Windows Update) en la barra de tareas.

---

## Modo Debug

Accede con `?debug=true`. Permite:
- Saltar a cualquier escenario sin completar los anteriores
- Ver el escenario actual en el panel lateral
- Finalizar la sesion desde el panel

Las sesiones de debug usan el ID de participante `P001-DEBUG` y quedan registradas en la base de datos como cualquier otra sesion.

---

## Panel de Administracion

Requiere login con credenciales de administrador. Muestra:

- Estadísticas generales: sesiones totales, completadas, activas
- Lista de todas las sesiones con metricas detalladas
- Metricas agrupadas por escenario con nombres descriptivos
- Timestamps en hora local española (CEST/CET)

---

## API Endpoints principales

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/sessions/start` | Inicia una nueva sesion |
| POST | `/api/sessions/metrics` | Guarda metricas de una sesion |
| POST | `/api/sessions/complete` | Marca sesion como completada |
| GET | `/api/sessions/all` | Lista todas las sesiones (admin) |
| GET | `/api/sessions/:id/metrics` | Metricas de una sesion |
| POST | `/api/ai/summarize` | Llamada al asistente IA |
| POST | `/api/ai/finalize` | Finaliza interaccion IA y registra trampa |
| POST | `/api/breach/check` | Verifica si una contrasena esta comprometida |

---

## Documentacion adicional

- [Metricas completas](docs/METRICS.md) — descripcion de todas las metricas por escenario
- [Verificar base de datos](TEST_DATABASE.md) — como consultar los datos SQLite
