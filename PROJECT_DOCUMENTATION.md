# TechNova LYNX Platform - Documentación Técnica Completa

## 📋 Resumen Ejecutivo

**TechNova** es una plataforma de simulación para la evaluación de seguridad de usuarios en la plataforma **LYNX**. La aplicación está diseñada como un estudio que guía a los participantes a través de múltiples escenarios de seguridad (phishing, gestión de contraseñas, MFA, cookies, etc.) y registra métricas de comportamiento para análisis posterior.

---

## 🏗️ Arquitectura General

El proyecto sigue una **arquitectura separada Frontend/Backend**:

```
TechNova/
├── backend/              # Servidor Node.js/Express con SQLite
├── frontend/             # Aplicación Vite (JS Vanilla)
├── package.json          # Scripts raíz para desarrollo
├── .env                  # Variables de entorno
└── main.html             # [Legacy] Archivo principal alternativo
```

### Diagrama de Arquitectura

```mermaid
flowchart TB
    subgraph Frontend["Frontend (Vite - Puerto 5173)"]
        UI[Interfaz de Usuario]
        Handlers[Handlers por Escenario]
        Services[Servicios API]
        Utils[Utilidades]
    end

    subgraph Backend["Backend (Express - Puerto 3000)"]
        Server[server.js]
        Routes[Rutas API]
        DB[(SQLite Database)]
    end

    subgraph External["Servicios Externos"]
        HIBP[Have I Been Pwned API]
    end

    UI --> Handlers
    Handlers --> Services
    Services --> Routes
    Routes --> DB
    Routes --> HIBP
```

---

## 🔧 Backend - Servidor Express

### Archivo Principal: `backend/server.js`

El servidor Express configura:

- **CORS** habilitado para peticiones cross-origin
- **JSON parsing** para body de requests
- **Puerto**: Configurable via `.env`, por defecto `3000`
- **Base de datos**: SQLite local (`lynx-study.db`)

```javascript
import express from 'express';
import cors from 'cors';
import { setupSessionRoutes } from './routes/sessions.js';
import { setupQuestionnaireRoutes } from './routes/questionnaire.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/sessions', setupSessionRoutes());
app.use('/api/questionnaire', setupQuestionnaireRoutes());
```

---

### Base de Datos: `backend/database.js`

Utiliza **better-sqlite3** con modo WAL para mejor rendimiento. Define 4 tablas principales:

| Tabla                     | Propósito                             |
| ------------------------- | ------------------------------------- |
| `registrations`           | Sesiones de usuarios/participantes    |
| `breach_checks`           | Resultados de verificación de brechas |
| `questionnaire_responses` | Respuestas del cuestionario final     |
| `session_metrics`         | Métricas detalladas por escenario     |

#### Esquema de `registrations`

```sql
CREATE TABLE registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    service TEXT NOT NULL,
    password_strength TEXT,
    mfa_enabled INTEGER DEFAULT 0,
    participant_id TEXT NOT NULL UNIQUE,
    password_reuse_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT
);
```

#### Esquema de `session_metrics`

```sql
CREATE TABLE session_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    scenario TEXT,
    metric_name TEXT NOT NULL,
    metric_value TEXT,
    recorded_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(session_id) REFERENCES registrations(id)
);
```

---

### Rutas API

#### 1. Sessions (`/api/sessions`)

| Método | Endpoint              | Descripción                            |
| ------ | --------------------- | -------------------------------------- |
| `POST` | `/start`              | Inicia o recupera una sesión existente |
| `POST` | `/complete`           | Marca una sesión como completada       |
| `POST` | `/metrics`            | Guarda métricas de un escenario        |
| `GET`  | `/all`                | Obtiene todas las sesiones (Admin)     |
| `GET`  | `/:sessionId/metrics` | Obtiene métricas de una sesión         |

**Ejemplo de `/start`:**

```javascript
// Request
{
  "userIdentifier": "P001",
  "service": "mail",
  "participantId": "P001",
  "passwordStrength": "strong"
}

// Response
{
  "success": true,
  "session": { "id": 1, "username": "P001", ... },
  "created": true
}
```

#### 3. Questionnaire (`/api/questionnaire`)

| Método | Endpoint  | Descripción                       |
| ------ | --------- | --------------------------------- |
| `POST` | `/submit` | Envía respuestas del cuestionario |
| `GET`  | `/all`    | Obtiene todas las respuestas      |

---

## 🎨 Frontend - Aplicación Vite

### Configuración: `frontend/vite.config.js`

```javascript
export default defineConfig({
  server: {
    host: '0.0.0.0', // Accesible desde LAN
    port: 5173,
    open: true, // Abre navegador automáticamente
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
```

---

### Estructura de Archivos Frontend

```
frontend/src/
├── main.js                    # Punto de entrada principal
├── components/
│   ├── scenarios.js           # Templates HTML de escenarios
│   ├── popups.js              # Ventanas emergentes
│   ├── taskbar.js             # Barra de tareas simulada
│   ├── BreachChecker.jsx      # Componente de verificación
│   └── LynxMailForm.jsx       # Formulario de correo
├── handlers/
│   ├── scenario1.js           # Registro inicial
│   ├── scenario2.js           # Gestión de contraseñas
│   ├── scenario3.js           # Phishing simulation
│   ├── scenario4.js           # Configuración cookies
│   ├── scenario5.js           # Wi-Fi público
│   ├── scenario6.js           # Descargas sospechosas
│   ├── scenario7.js           # MFA setup
│   ├── scenario8.js           # Breach check
│   ├── scenario9.js           # Cuestionario final
│   ├── mfa-flow.js            # Flujo completo MFA
│   └── taskbar-handler.js     # Eventos de taskbar
├── services/
│   ├── api.js                 # Comunicación con backend
│   └── breach-checker.js      # Servicio de verificación
├── utils/
│   ├── emails.js              # Gestión de emails
│   ├── metrics.js             # Sistema de métricas
│   ├── participant.js         # ID del participante
│   ├── session.js             # Gestión de sesión
│   └── validation.js          # Validaciones
└── styles/                    # CSS modular
```

---

### Servicios API (Frontend)

El archivo `services/api.js` centraliza todas las comunicaciones:

| Función                                    | Propósito                               |
| ------------------------------------------ | --------------------------------------- |
| `startSession(userIdentifier)`             | Inicia sesión al aceptar políticas      |
| `createRegistration(...)`                  | Registra servicio (mail, drive, events) |
| `saveMetrics(sessionId, metricsObject)`    | Guarda métricas de cualquier escenario  |
| `completeRegistration(sessionId, patch)`   | Actualiza estado de sesión              |
| `saveQuestionnaire(data)`                  | Envía cuestionario final                |
| `completeSession(sessionId, consentEmail)` | Finaliza sesión                         |

**Ejemplo de uso:**

```javascript
import { saveMetrics } from './services/api.js';

// Guardar métricas del escenario de Wi-Fi
await saveMetrics(sessionId, {
  'wifi.network_selected': 'FreeWiFi',
  'wifi.accepted_terms': true,
  'wifi.time_spent_seconds': 45,
});
```

---

### Handlers de Escenarios

Cada escenario tiene su propio handler que gestiona:

- **Eventos de UI** (clicks, formularios)
- **Recolección de métricas**
- **Navegación entre pasos**

| Handler | Escenario |
| --- | --- |
| `scenario1.js` | Account Creation (Incluye Wi-Fi y configuración de MFA) |
| `scenario2.js` | Interruptions & Peripherals |
| `scenario3.js` | Email & Communications |
| `scenario4.js` | Web Browsing |
| `scenario5.js` | Social Media / Chat AI |
| `scenario6.js` | File Cleanup |
| `scenario7.js` | Downloads & Recycle Bin |
| `scenario9.js` | AI Assistant |
| `mfa-flow.js` | Flujo completo de MFA (TOTP) |
| `taskbar-handler.js` | Eventos de Taskbar (Actualizaciones) |


---

## 🚀 Scripts de Ejecución

### Desde la raíz del proyecto

| Comando               | Descripción                                |
| --------------------- | ------------------------------------------ |
| `npm run install:all` | Instala dependencias en frontend y backend |
| `npm run start`       | Ejecuta frontend y backend simultáneamente |
| `npm run dev`         | Solo frontend (Vite dev server)            |
| `npm run backend`     | Solo backend (Express)                     |
| `npm run build`       | Build de producción del frontend           |

### Arquitectura de puertos

| Servicio          | Puerto | URL                         |
| ----------------- | ------ | --------------------------- |
| Frontend (Vite)   | 5173   | `http://localhost:5173`     |
| Backend (Express) | 3000   | `http://localhost:3000/api` |

---

## 📊 Sistema de Métricas

El sistema de métricas registra:

- **Decisiones del usuario** (qué red Wi-Fi elige, si activa MFA, etc.)
- **Tiempo de respuesta** por escenario
- **Patrones de comportamiento** (reutilización de contraseñas, clics en phishing)

Las métricas se guardan con el formato: `escenario.nombre_metrica`

**Ejemplo de métricas registradas:**

```javascript
{
  "password.strength": "weak",
  "password.reuse_count": 3,
  "phishing.clicked_link": true,
  "mfa.enabled": false,
  "cookies.accepted_all": true
}
```

### Catalogo de metricas (fuente: `frontend/src/utils/metrics.js`)

| Clave | Tipo | Qué mide |
| --- | --- | --- |
| `simulation.total_time_seconds` | `INT` | Tiempo total de la simulación (segundos) |
| `scenario0.policy_acceptance_time_seconds` | `INT` | Tiempo de aceptación de políticas (segundos) |
| `scenario1.time_seconds` | `INT` | Tiempo acumulado en escenario 1 (segundos) |
| `scenario1.wifi_public` | `INT (0/1)` | `1` = usó red pública, `0` = usó red corporativa |
| `scenario1.mail_password_strength` | `TEXT` | Fortaleza de contraseña: 'Weak', 'Medium', 'Strong' |
| `scenario1.default_password_flag` | `INT (0/1)` | `1` = deja la contraseña preestablecida, `0` = la cambia |
| `scenario1.drive_password_strength` | `TEXT` | Fortaleza de contraseña en Drive |
| `scenario1.events_password_strength` | `TEXT` | Fortaleza de contraseña en Events |
| `scenario1.password_reused` | `REAL` | Similitud promedio entre pares de contraseñas (0.0-1.0) |
| `scenario1.mfa_usage` | `INT (0/1)` | `1` = usó MFA, `0` = no |
| `scenario1.mfa_method_primary` | `TEXT` | Método MFA principal ('SMS', 'App', 'Email', 'None') |
| `scenario1.mfa_method_backup` | `TEXT` | Método MFA de respaldo ('SMS', 'App', 'Email', 'None') |
| `scenario1.mfa_email_alternative` | `INT (0/1)` | `1` = configuró email alternativo, `0` = no |
| `scenario1.teams_camera_permission` | `INT (0/1)` | `1` = concedió cámara, `0` = denegó |
| `scenario1.teams_microphone_permission` | `INT (0/1)` | `1` = concedió micrófono, `0` = denegó |
| `scenario2.time_seconds` | `INT` | Tiempo acumulado en escenario 2 (segundos) |
| `scenario2.manual_lock_screen` | `INT (0/1)` | `1` = bloqueó manualmente la pantalla, `0` = no |
| `scenario3.time_seconds` | `INT` | Tiempo acumulado en escenario 3 (segundos) |
| `scenario3.phishing_clicked` | `REAL` | % de enlaces phishing clicados (0.0-1.0) |
| `scenario3.phishing_reported` | `REAL` | % de phishing reportados correctamente (0.0-1.0) |
| `scenario3.phishing_false_positives` | `INT` | Nº de correos legítimos reportados como phishing |
| `scenario3.phishing_report_reasons` | `TEXT(JSON)` | Razones de reporte de phishing |
| `scenario3.credential_exposure` | `INT (0/1)` | `1` = introdujo credenciales en página falsa, `0` = no |
| `scenario3.secure_data_transmission` | `INT (0/1)` | `1` = transmitió datos cifrados, `0` = no |
| `scenario4.time_seconds` | `INT` | Tiempo acumulado en escenario 4 (segundos) |
| `scenario4.response_to_browser_warnings` | `TEXT` | Respuestas: 'Ignored', 'Heeded', 'Not Encountered' |
| `scenario4.cookie_consent` | `TEXT` | 'Accepted All', 'Rejected' o 'Customized' |
| `scenario4.clicked_dangerous_link` | `INT (0/1)` | `1` = clic en enlace peligroso, `0` = no |
| `scenario4.extensions_disabled_pct` | `REAL` | % de extensiones sospechosas desactivadas |
| `scenario4.warnings_heeded_pct` | `REAL` | % de avisos de seguridad atendidos |
| `scenario4.cookie_accepted_pct` | `REAL` | % de banners donde aceptó todas cookies |
| `scenario4.cookie_consent_by_site` | `TEXT(JSON)` | Consentimiento de cookies por sitio |
| `scenario4.cookie_risk_score` | `REAL` | Score de riesgo de consentimiento cookies (0-100) |
| `scenario4.dangerous_links_clicked_pct`| `REAL` | % de enlaces peligrosos clicados |
| `scenario5.time_seconds` | `INT` | Tiempo acumulado en escenario 5 (segundos) |
| `scenario5.personal_data_disclosure_rate` | `INT` | Nº de campos de datos personales revelados |
| `scenario5.third_party_app_authorization` | `INT (0/1)` | `1` = autorizó aplicación, `0` = rechazó |
| `scenario5.ai_used` | `TEXT` | 'Yes' o 'No' |
| `scenario5.ai_prompt_text` | `TEXT` | Prompt libre escrito por el usuario |
| `scenario5.ai_trap_value` | `TEXT` | Dato trampa inyectado |
| `scenario5.ai_trap_repeated` | `TEXT` | 'Yes' o 'No' (si repite el dato trampa) |
| `scenario5.ai_user_edited` | `TEXT` | 'Yes' o 'No' (si el usuario edita la respuesta IA) |
| `scenario5.ai_reaction_time_seconds` | `REAL` | Tiempo entre respuesta de IA y envío |
| `scenario6.time_seconds` | `INT` | Tiempo acumulado en escenario 6 (segundos) |
| `scenario6.data_encryption_usage` | `INT (0/1)` | `1` = usó cifrado, `0` = no |
| `scenario6.secure_data_disposal` | `INT (0/1)` | `1` = borrado seguro, `0` = no |
| `scenario6.deleted_final_report` | `INT (0/1)` | `1` = eliminó el informe final, `0` = no |
| `scenario7.time_seconds` | `INT` | Tiempo acumulado en escenario 7 (segundos) |
| `scenario7.document_deleted` | `INT (0/1)` | `1` = eliminó documento sensible de Descargas, `0` = no |
| `scenario7.recycle_bin_emptied` | `INT (0/1)` | `1` = vació la papelera, `0` = no |
| `scenario9.time_seconds` | `INT` | Tiempo acumulado en escenario 9 (segundos) |
| `scenario9.proactive_ai_usage` | `TEXT` | Descripción de uso proactivo de IA |
| `scenario9.shadow_ai_leak` | `INT (0/1)` | `1` = filtración vía shadow AI, `0` = no |
| `scenario9.blind_trust` | `INT (0/1)` | `1` = confió ciegamente en IA, `0` = no |
| `scenario9.hallucination_detected` | `INT (0/1)` | `1` = detectó alucinación, `0` = no |
| `scenario9.reaction_time` | `INT` | Segundos de reacción |
| `scenario10.time_seconds` | `INT` | Tiempo acumulado en escenario 10 (segundos) |
| `unexpected.update_compliance_rate` | `INT (0/1)` | `1` = aceptó actualización falsa, `0` = rechazó |
| `unexpected.teams_password_reused` | `INT (0/1)` | `1` = reutilizó contraseña en Teams, `0` = no |
| `taskbar.update_user_action` | `TEXT` | Respuesta dada (e.g. 'Restart', 'Ignored', 'Dismissed') |
| `taskbar.update_response_time_seconds` | `INT` | Segundos hasta la acción del usuario |

---

## 📁 Archivos HTML Principales

| Archivo                        | Propósito                      |
| ------------------------------ | ------------------------------ |
| `frontend/index.html`          | Entry point de Vite            |
| `frontend/admin.html`          | Dashboard de administración    |
| `frontend/breach-results.html` | Resultados de brechas de datos |
| `main.html`                    | Versión legacy/standalone      |

---

## 🔐 Variables de Entorno

El archivo `.env` en la raíz contiene:

```env
PORT=3000                    # Puerto del backend
```

---

## 🗃️ Scripts de Base de Datos

El backend incluye scripts útiles:

| Script             | Propósito                    |
| ------------------ | ---------------------------- |
| `view-database.js` | Visualiza contenido de la DB |
| `reset-db.js`      | Reinicia la base de datos    |
| `export-data.js`   | Exporta datos a formato JSON |
| `run-query.js`     | Ejecuta queries manuales     |
| `migrate-*.js`     | Scripts de migración         |

---

## 🔄 Flujo de Usuario

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant B as Backend
    participant DB as SQLite

    U->>F: Acepta políticas
    F->>B: POST /sessions/start
    B->>DB: INSERT registration
    B-->>F: session_id

    loop Por cada escenario
        U->>F: Completa escenario
        F->>B: POST /sessions/metrics
        B->>DB: INSERT metrics
    end

    U->>F: Completa cuestionario
    F->>B: POST /questionnaire/submit
    B->>DB: INSERT responses

    F->>B: POST /sessions/complete
    B->>DB: UPDATE completed_at
```

---

## 📝 Notas Adicionales

- El proyecto usa **ES Modules** (`"type": "module"` en package.json)
- **ESLint** y **Prettier** configurados para consistencia de código
- La base de datos SQLite usa **WAL mode** para mejor concurrencia
- El frontend es **vanilla JavaScript** sin frameworks como React/Vue
