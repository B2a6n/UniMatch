#!/bin/bash
set -e

APP_DIR="$HOME/unimatch"
JAR_NAME="unimatch-1.0.0.jar"
LOG_FILE="$APP_DIR/app.log"

echo "=== UniMatch — Configuración EC2 ==="
mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ ! -f "$JAR_NAME" ]; then
    echo "ERROR: No se encontró $APP_DIR/$JAR_NAME"
    echo "Sube el JAR desde tu PC antes de ejecutar este script."
    exit 1
fi

echo "[1/6] Actualizando paquetes..."
sudo apt-get update -y

echo "[2/6] Instalando Java 17..."
if ! java -version 2>&1 | grep -q '17'; then
    sudo apt-get install -y openjdk-17-jdk
fi
java -version

echo "[3/6] Instalando MySQL (si no está)..."
if ! command -v mysql >/dev/null 2>&1; then
    sudo DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
fi
sudo systemctl start mysql
sudo systemctl enable mysql

echo "[4/6] Configurando base de datos unimatchDB..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS unimatchDB;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'Tonagod'@'localhost' IDENTIFIED BY 'UniMatch2026';"
sudo mysql -e "GRANT ALL PRIVILEGES ON unimatchDB.* TO 'Tonagod'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo "[5/6] Deteniendo instancia anterior de UniMatch..."
pkill -f "$JAR_NAME" || true
sleep 2

echo "[6/6] Iniciando Spring Boot..."
nohup java -jar "$JAR_NAME" --spring.profiles.active=aws > "$LOG_FILE" 2>&1 &

echo "Esperando arranque (30 s)..."
sleep 30

if curl -sf "http://localhost:8080" >/dev/null; then
    echo ""
    echo "=== CONFIGURACIÓN COMPLETADA ==="
    echo "App respondiendo en http://localhost:8080"
    echo "Link público: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'TU_IP_PUBLICA'):8080"
    echo "Log: tail -f $LOG_FILE"
else
    echo ""
    echo "=== EL SERVICIO NO RESPONDIÓ AÚN ==="
    echo "Revisa el log:"
    tail -n 40 "$LOG_FILE" || true
    exit 1
fi
