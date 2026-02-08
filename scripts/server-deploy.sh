#!/bin/bash
set -e

# Load nvm/node path for non-interactive shells
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use the correct SSH key for GitHub
export GIT_SSH_COMMAND="ssh -i ~/.ssh/github_personal -o IdentitiesOnly=yes"

PROJ_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJ_DIR"

echo "=== Stopping services ==="
forever stopall || true

echo "=== Pulling latest code ==="
git pull

echo "=== Updating version ==="
bash "$PROJ_DIR/scripts/updateVersion.sh"

echo "=== Installing dependencies ==="
npm install

echo "=== Starting server ==="
cd "$PROJ_DIR/api"
forever start server.js

echo "=== Server deploy complete ==="
