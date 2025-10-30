# Cómo verificar la base de datos SQLite

## 1. Ver datos desde tu ordenador (Windows):

Abre otra terminal PowerShell y ejecuta:

```powershell
cd "C:\Users\Belen Sanchez Pardo\OneDrive - UNIVERSIDAD DE MURCIA\Documentos\Laboratorio\Pruebas_Lab\backend"

# Ver todos los datos
node view-database.js

# Exportar a JSON
node export-data.js
```

## 2. Probar que el servidor recibe datos:

En PowerShell:

```powershell
# Crear un registro de prueba
curl -Method POST -Uri "http://localhost:3000/api/sessions/start" `
  -ContentType "application/json" `
  -Body '{"userIdentifier":"test_participant","service":"lynx_mail","participantId":"P001","passwordStrength":"strong","passwordReuseCount":0}'

# Ver todos los registros
curl http://localhost:3000/api/sessions/all
```

O simplemente visita en tu navegador:
**http://localhost:3000/api/sessions/all**

## 3. Monitorear en tiempo real:

Deja esta terminal abierta para ver logs del servidor:
```
npm start
```

Cuando los participantes usen la aplicación frontend, verás las peticiones aparecer aquí.

## 4. Ubicación de la base de datos:

La base de datos está en:
```
C:\Users\Belen Sanchez Pardo\OneDrive - UNIVERSIDAD DE MURCIA\Documentos\Laboratorio\Pruebas_Lab\backend\lynx-study.db
```

Puedes abrirla con herramientas como:
- DB Browser for SQLite (https://sqlitebrowser.org/)
- DBeaver
- TablePlus

## 5. Verificar que frontend se conecta al backend:

Abre el frontend en: **http://localhost:5173** (si usas Vite)

Y completa un escenario. Deberías ver en la terminal del backend:
```
POST /api/sessions/start 200
```

Luego ejecuta:
```
node view-database.js
```

Y verás el registro guardado.
