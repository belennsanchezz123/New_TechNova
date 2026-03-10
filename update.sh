#!/bin/bash
echo "🔄 Actualizando TechNova..."

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

export PM2_HOME="/var/www/.pm2"
umask 0002
cd /var/www/TechNova
git pull origin main && echo "  ✅ Código actualizado" || { echo "  🔴 Error al hacer git pull"; exit 1; }
npm run install:all && echo "  ✅ Dependencias instaladas"
npm run build && echo "  ✅ Frontend reconstruido"
cd backend
pm2 restart technova-api --update-env && echo "  ✅ Backend reiniciado"

sleep 3
HEALTH=$(curl -s -k http://localhost:3000/api/health)
if echo "$HEALTH" | grep -q "ok"; then
    echo "🟢 Actualización completada. TechNova funcionando."
else
    echo "🔴 Error tras actualizar. Revisa: pm2 logs technova-api"
fi
