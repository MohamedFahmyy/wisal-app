#!/usr/bin/env bash
# ==============================================================================
# Wisal Digital Invitations - Server Deployment & Setup Script
# Ubuntu / Debian Linux Server Setup for Node.js + MySQL + Systemd + UFW (Port 8585)
# ==============================================================================

set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
GOLD='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GOLD}===================================================================${NC}"
echo -e "${GOLD}          وِصال — WISAL DIGITAL INVITATIONS SERVER SETUP          ${NC}"
echo -e "${GOLD}===================================================================${NC}"

# 1. Check Root Privileges
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}[Error] Please run this script with sudo or as root.${NC}"
  echo -e "Usage: sudo bash setup-server.sh"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="/var/www/wisal-backend"

echo -e "\n${BLUE}[1/8] Updating server packages & installing dependencies...${NC}"
apt-get update -y
apt-get install -y curl ufw git openssl

# Install Node.js 20 if not present
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d'.' -f1 | tr -d 'v')" -lt 18 ]; then
  echo -e "${BLUE}Installing Node.js 20.x LTS...${NC}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo -e "${GREEN}✓ Node.js $(node -v) and npm $(npm -v) ready.${NC}"

# Install MySQL Server if not present
if ! command -v mysql >/dev/null 2>&1; then
  echo -e "${BLUE}Installing MySQL Server...${NC}"
  DEBIAN_FRONTEND=noninteractive apt-get install -y mysql-server
  systemctl enable mysql
  systemctl start mysql
fi
echo -e "${GREEN}✓ MySQL server ready.${NC}"

# 2. Deploy directory setup
echo -e "\n${BLUE}[2/8] Setting up deployment directory at ${TARGET_DIR}...${NC}"
mkdir -p "${TARGET_DIR}"

# If running inside git repo clone, copy files to /var/www/wisal-backend
if [ "${SCRIPT_DIR}" != "${TARGET_DIR}" ]; then
  echo -e "Copying backend files from ${SCRIPT_DIR} to ${TARGET_DIR}..."
  cp -r "${SCRIPT_DIR}"/* "${TARGET_DIR}/"
  if [ -f "${SCRIPT_DIR}/.env.example" ] && [ ! -f "${TARGET_DIR}/.env.example" ]; then
    cp "${SCRIPT_DIR}/.env.example" "${TARGET_DIR}/.env.example"
  fi
fi

cd "${TARGET_DIR}"

# 3. Database Credentials & .env Configuration
echo -e "\n${BLUE}[3/8] Configuring environment and database...${NC}"

DB_NAME="wisal_rsvp"
DB_USER="wisal_user"

if [ -f "${TARGET_DIR}/.env" ]; then
  echo -e "${GOLD}Existing .env file found. Preserving current credentials...${NC}"
  # Source existing env vars
  set -a
  source "${TARGET_DIR}/.env"
  set +a
else
  echo -e "Generating secure random credentials for new setup..."
  DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 20)
  ADMIN_TOKEN=$(openssl rand -hex 32)

  cat > "${TARGET_DIR}/.env" <<EOF
PORT=8585
ADMIN_TOKEN=${ADMIN_TOKEN}
ALLOWED_ORIGIN=https://wisal-app-six.vercel.app
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
EOF
  chmod 600 "${TARGET_DIR}/.env"
  echo -e "${GREEN}✓ Created secure ${TARGET_DIR}/.env file.${NC}"
fi

# Ensure MySQL Database and User exist
echo -e "Configuring MySQL database [${DB_NAME}] and user [${DB_USER}]..."
mysql -u root <<EOSQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOSQL
echo -e "${GREEN}✓ MySQL database and permissions configured successfully.${NC}"

# 4. Install NPM Dependencies
echo -e "\n${BLUE}[4/8] Installing production NPM packages...${NC}"
npm install --production

# 5. Database Migration
echo -e "\n${BLUE}[5/8] Running database migrations (schema.sql)...${NC}"
node migrate.js

# 6. Configure Systemd Service
echo -e "\n${BLUE}[6/8] Configuring systemd service...${NC}"

# Ensure www-data owns the directory
chown -R www-data:www-data "${TARGET_DIR}"

NODE_BIN=$(which node)

cat > /etc/systemd/system/wisal-backend.service <<EOF
[Unit]
Description=Wisal RSVP Backend Service
After=network.target mysql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=${TARGET_DIR}
ExecStart=${NODE_BIN} ${TARGET_DIR}/server.js
Restart=always
RestartSec=5
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=wisal-backend
EnvironmentFile=${TARGET_DIR}/.env

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable wisal-backend
systemctl restart wisal-backend
echo -e "${GREEN}✓ wisal-backend service enabled and restarted.${NC}"

# 7. Configure Firewall (Port 8585)
echo -e "\n${BLUE}[7/8] Configuring UFW firewall for port 8585...${NC}"
if command -v ufw >/dev/null 2>&1; then
  ufw allow 8585/tcp comment 'Wisal RSVP API Port'
  ufw reload || true
  echo -e "${GREEN}✓ Port 8585/tcp allowed in UFW.${NC}"
fi

# 8. Verification & Self-Test
echo -e "\n${BLUE}[8/8] Testing backend health endpoint...${NC}"
sleep 2

HEALTH_RESPONSE=$(curl -s http://127.0.0.1:8585/health || echo "FAILED")

if [[ "${HEALTH_RESPONSE}" == *"healthy"* ]]; then
  echo -e "${GREEN}✓ Self-test passed! Health response:${NC} ${HEALTH_RESPONSE}"
else
  echo -e "${RED}✗ Warning: Health endpoint returned:${NC} ${HEALTH_RESPONSE}"
  echo -e "Check service logs using: journalctl -u wisal-backend -n 50"
fi

echo -e "\n${GOLD}===================================================================${NC}"
echo -e "${GREEN}🎉 CONGRATULATIONS! WISAL BACKEND IS LIVE & CONNECTED!${NC}"
echo -e "${GOLD}===================================================================${NC}"
echo -e "Server Directory : ${TARGET_DIR}"
echo -e "Service Status   : systemctl status wisal-backend"
echo -e "Logs             : journalctl -u wisal-backend -f"
echo -e "Port             : 8585"
echo -e "Allowed Origin   : https://wisal-app-six.vercel.app"
echo -e "-------------------------------------------------------------------"
echo -e "${GOLD}ADMIN TOKEN (Keep this safe for generating invitations):${NC}"
echo -e "${GREEN}${ADMIN_TOKEN}${NC}"
echo -e "-------------------------------------------------------------------"
echo -e "Test creating an invitation via curl:"
echo -e "curl -i -X POST http://127.0.0.1:8585/api/admin/invitations \\"
echo -e "  -H \"Authorization: Bearer ${ADMIN_TOKEN}\" \\"
echo -e "  -H \"Content-Type: application/json\" \\"
echo -e "  -d '{\"invitationId\": \"inv_sage_garden\"}'"
echo -e "${GOLD}===================================================================${NC}"
