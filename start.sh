#!/bin/bash
echo "[INFO] Iniciando TechNova..."
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

export PM2_HOME="/var/www/.pm2"
umask 0002

# Kill any process listening on port 3000
echo "  [INFO] Limpiando procesos en el puerto 3000..."
fuser -k 3000/tcp 2>/dev/null || true

cd /var/www/TechNova/backend
pm2 start server.js --name "technova-api" 2>/dev/null || pm2 restart technova-api
echo "  [OK] Backend iniciado (puerto 3000)"

echo "123" | sudo -S systemctl start nginx 2>/dev/null && echo "  [OK] Nginx iniciado (puerto 80 y 443)" || echo "  [WARN] Nginx ya estaba corriendo"

sleep 1
HEALTH=$(curl -s -k http://localhost:3000/api/health)
if echo "$HEALTH" | grep -q "ok"; then
    echo "[OK] TechNova funcionando en https://$(hostname -I | awk '{print $1}')"
else
    echo "[ERROR] el backend no responde. Revisa: pm2 logs technova-api"
fi
