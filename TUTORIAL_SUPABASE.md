# Tutorial: Conectar Frontend con Supabase paso a paso

## Lo que acabamos de hacer

### 1. Creaste la tabla en Supabase

```sql
create table registrations (
  id bigint generated always as identity primary key,
  username text not null,
  service text not null,
  password_strength text,
  mfa_enabled boolean default false,
  created_at timestamp with time zone default now()
);

-- Políticas de seguridad
alter table registrations enable row level security;

create policy "Allow public insert"
  on registrations
  for insert
  to anon
  with check (true);

create policy "Allow public select"
  on registrations
  for select
  to anon
  using (true);
```

### 2. Instalamos Supabase en el Frontend

```bash
cd frontend
npm install @supabase/supabase-js
```

### 3. Creamos un servicio de Supabase (`frontend/src/services/supabase.js`)

Este archivo:
- Configura el cliente de Supabase con tus credenciales del `.env`
- Tiene funciones para guardar y leer registros:
  - `saveRegistration()` - Guarda un registro en la tabla
  - `getAllRegistrations()` - Lee todos los registros

### 4. Modificamos el handler del Escenario 1 (`frontend/src/handlers/scenario1.js`)

**Cambios realizados:**

1. **Importamos el servicio de Supabase:**
```javascript
import { saveRegistration } from '../services/supabase.js';
```

2. **Guardamos cada registro al crear cuenta:**
```javascript
export async function registerService(service) {
    // ... código existente para obtener username y password ...

    // Guardamos en Supabase
    await saveRegistration(username, `lynx_${service}`, strength, false);

    // ... resto del código ...
}
```

3. **Actualizamos MFA si se activa:**
```javascript
export async function handleMFA(activated) {
    if (activated) {
        // Guardamos otro registro con MFA activado
        await saveRegistration(
            registrations['drive'].username,
            registrations['drive'].service,
            registrations['drive'].password_strength,
            true
        );
    }
}
```

## Cómo verificar que funciona

### Opción 1: Desde la consola del navegador

1. Ejecuta el frontend:
```bash
npm run dev
```

2. Abre la consola del navegador (F12)

3. Completa el registro de Lynx Mail y verás en la consola:
```
Registration saved: [objeto con los datos]
```

### Opción 2: Desde Supabase Dashboard

1. Ve a tu proyecto en https://supabase.com
2. Navega a: **Table Editor** → **registrations**
3. Verás los registros que se van guardando

### Opción 3: Crear una página de administración

Puedes crear un archivo `frontend/registrations-admin.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Registros Admin</title>
    <script type="module">
        import { getAllRegistrations } from './src/services/supabase.js';

        async function loadRegistrations() {
            const result = await getAllRegistrations();
            if (result.success) {
                console.table(result.data);
                // Aquí puedes mostrarlos en una tabla HTML
            }
        }

        loadRegistrations();
    </script>
</head>
<body>
    <h1>Ver registros en la consola</h1>
</body>
</html>
```

## Siguiente paso: Agregar más tablas

Para conectar otros escenarios, sigue el mismo patrón:

### Ejemplo para el Escenario 3 (Phishing):

1. **Crea la tabla en Supabase:**
```sql
create table phishing_actions (
  id bigint generated always as identity primary key,
  session_id text,
  email_id int,
  action_type text, -- 'clicked', 'reported', 'ignored'
  email_type text, -- 'legitimate', 'phishing'
  created_at timestamp with time zone default now()
);

alter table phishing_actions enable row level security;
create policy "Allow public insert" on phishing_actions for insert to anon with check (true);
create policy "Allow public select" on phishing_actions for select to anon using (true);
```

2. **Agrega función en `supabase.js`:**
```javascript
export async function savePhishingAction(sessionId, emailId, actionType, emailType) {
    const { data, error } = await supabase
        .from('phishing_actions')
        .insert({ session_id: sessionId, email_id: emailId, action_type: actionType, email_type: emailType })
        .select();

    if (error) return { success: false, error };
    return { success: true, data };
}
```

3. **Usa en `scenario3.js`:**
```javascript
import { savePhishingAction } from '../services/supabase.js';

export function reportEmail(id, type) {
    // ... código existente ...
    await savePhishingAction(getSessionId(), id, 'reported', email.type);
}
```

## Resumen de archivos modificados

- ✅ `frontend/src/services/supabase.js` - Nuevo servicio de Supabase
- ✅ `frontend/src/handlers/scenario1.js` - Modificado para guardar registros
- ✅ `.env` - Ya tiene las credenciales configuradas
- ✅ `frontend/package.json` - Añadida dependencia de Supabase

## Ventajas de este enfoque

1. **Datos persistentes**: Todo se guarda en la base de datos
2. **Análisis posterior**: Puedes hacer queries SQL para analizar comportamientos
3. **Escalable**: Fácil agregar más tablas para otros escenarios
4. **Seguro**: Las políticas RLS controlan el acceso
5. **Tiempo real**: Supabase ofrece subscripciones en tiempo real si las necesitas
