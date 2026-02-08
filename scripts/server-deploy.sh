#!/bin/bash
set -e

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
