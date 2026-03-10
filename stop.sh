#!/bin/bash
echo "⏹ Parando TechNova..."
export PM2_HOME="/var/www/.pm2"
umask 0002
pm2 stop technova-api 2>/dev/null && echo "  ✅ Backend parado" || echo "  ⚠️  Backend no estaba corriendo"
echo "123" | sudo -S systemctl stop nginx 2>/dev/null && echo "  ✅ Nginx parado" || echo "  ⚠️  Nginx no se pudo parar"
echo "🔴 TechNova detenido."
