#!/bin/bash
set -e

# Uses SSH config alias "game-center" - configure in ~/.ssh/config:
#
#   Host game-center
#     HostName your-server.amazonaws.com
#     User ubuntu
#     IdentityFile ~/.ssh/your-key.pem

SSH_HOST="game-center"
REMOTE_DIR="code/battlestar"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJ_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJ_DIR"

echo "=== Building app locally ==="
npm run build -w app

echo "=== Syncing built files to server ==="
rsync -avz --delete app/dist/ "$SSH_HOST:$REMOTE_DIR/app/dist/"

echo "=== Running server deploy script ==="
ssh "$SSH_HOST" "cd $REMOTE_DIR && ./scripts/server-deploy.sh"

echo "=== Deploy complete ==="
