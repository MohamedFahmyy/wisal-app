#!/usr/bin/env bash
# ==============================================================================
# Wisal Backend - Quick Update & Redeploy Script
# Pulls latest changes from Git, runs migrations, and restarts the service
# ==============================================================================

set -e

GREEN='\033[0;32m'
GOLD='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GOLD}Updating Wisal Backend...${NC}"

# 1. Pull latest code if running in git repo
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo -e "${BLUE}1. Pulling latest git commits...${NC}"
  git pull origin main
fi

# 2. Sync to /var/www/wisal-backend if running outside it
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="/var/www/wisal-backend"

if [ "${SCRIPT_DIR}" != "${TARGET_DIR}" ] && [ -d "${TARGET_DIR}" ]; then
  echo -e "${BLUE}2. Syncing files to ${TARGET_DIR}...${NC}"
  cp -u -r "${SCRIPT_DIR}"/* "${TARGET_DIR}/"
  cd "${TARGET_DIR}"
fi

# 3. Install any new dependencies
echo -e "${BLUE}3. Installing dependencies...${NC}"
npm install --production

# 4. Run database migrations
echo -e "${BLUE}4. Running migrations...${NC}"
node migrate.js

# 5. Restart service
echo -e "${BLUE}5. Restarting wisal-backend service...${NC}"
sudo systemctl restart wisal-backend

# 6. Verify health
sleep 1
HEALTH=$(curl -s http://127.0.0.1:8585/health || echo "FAILED")
echo -e "${GREEN}✓ Update complete! Service Health:${NC} ${HEALTH}"
