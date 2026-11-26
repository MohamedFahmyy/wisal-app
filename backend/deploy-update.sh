#!/usr/bin/env bash
# ==============================================================================
# Wisal Backend - Quick Update & Redeploy Script
# Pulls latest changes from Git, syncs files, runs migrations, and restarts service
# ==============================================================================

set -e

GREEN='\033[0;32m'
GOLD='\033[0;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GOLD}=========================================${NC}"
echo -e "${GOLD}  Wisal Backend - Updating & Redeploying ${NC}"
echo -e "${GOLD}=========================================${NC}"

TARGET_DIR="/var/www/wisal-backend"
REPO_URL="https://github.com/MohamedFahmyy/wisal-app.git"

# 1. Locate or clone the git repository
REPO_DIR=""
for candidate in \
  "$(pwd)" \
  "/var/www/wisal-app" \
  "/root/wisal-app" \
  "/var/www/wisal-da3wa" \
  "$HOME/wisal-app" \
  "/var/www/wisal-repo"
do
  if [ -d "$candidate/.git" ]; then
    REPO_DIR="$candidate"
    break
  fi
done

if [ -z "$REPO_DIR" ]; then
  echo -e "${BLUE}1. Git repo not found locally. Cloning to /var/www/wisal-repo...${NC}"
  REPO_DIR="/var/www/wisal-repo"
  mkdir -p "$REPO_DIR"
  git clone "$REPO_URL" "$REPO_DIR"
else
  echo -e "${BLUE}1. Found Git repository at: ${REPO_DIR}${NC}"
  cd "$REPO_DIR"
  echo -e "${BLUE}   Pulling latest commits from origin main...${NC}"
  git pull origin main
fi

# 2. Sync backend files to TARGET_DIR
echo -e "${BLUE}2. Syncing backend files to ${TARGET_DIR}...${NC}"
mkdir -p "${TARGET_DIR}"
if [ -d "${REPO_DIR}/backend" ]; then
  cp -r "${REPO_DIR}/backend"/* "${TARGET_DIR}/"
fi

cd "${TARGET_DIR}"

# 3. Install any new dependencies
echo -e "${BLUE}3. Installing production dependencies...${NC}"
npm install --production

# 4. Run database migrations
echo -e "${BLUE}4. Running database migrations...${NC}"
node migrate.js

# 5. Restart systemd service
echo -e "${BLUE}5. Restarting wisal-backend service...${NC}"
if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl restart wisal-backend
fi

# 6. Verify health
echo -e "${BLUE}6. Verifying service health...${NC}"
sleep 2
HEALTH=$(curl -s http://127.0.0.1:8585/health || echo '{"status":"FAILED"}')
echo -e "${GREEN}✓ Update complete! Service Health:${NC} ${HEALTH}"

