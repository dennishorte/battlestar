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

FORCE=0
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    *) echo "Unknown argument: $arg" >&2; exit 1 ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJ_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJ_DIR"

if [ "$FORCE" -ne 1 ] && [ -n "$(git status --porcelain)" ]; then
  echo "Error: working tree has uncommitted changes. Commit, stash, or pass --force to override." >&2
  exit 1
fi

echo "=== Pushing latest changes ==="
git push

echo "=== Updating version on server ==="
ssh "$SSH_HOST" "cd $REMOTE_DIR && bash scripts/updateVersion.sh"

echo "=== Fetching version from server ==="
scp "$SSH_HOST:$REMOTE_DIR/app/src/assets/version.js" "$PROJ_DIR/app/src/assets/version.js"

echo "=== Building app locally ==="
npm run build -w app

echo "=== Syncing built files to server ==="
rsync -avz --delete app/dist/ "$SSH_HOST:$REMOTE_DIR/app/dist/"

echo "=== Running server deploy script ==="
ssh "$SSH_HOST" "cd $REMOTE_DIR && ./scripts/server-deploy.sh"

echo "=== Deploy complete ==="

echo "=== Updating location versions ==="
bash ./scripts/updateVersion.sh
