#!/usr/bin/env bash
# Refresh Magic sets + cards in prod's MongoDB by tunneling SSH.
#
# Opens an SSH tunnel to the prod host's local MongoDB, points the worker's
# MONGODB_URI through that tunnel, and runs the worker. The tunnel is torn
# down on exit (success, failure, or Ctrl-C).
#
# Configuration (override via api/.env or shell env):
#   MAGIC_UPDATE_SSH_HOST   ssh-config alias for prod (default: vue)
#   MAGIC_UPDATE_LOCAL_PORT local port to bind for the tunnel (default: 27018)
#   MAGIC_UPDATE_REMOTE_PORT remote MongoDB port on the prod host (default: 27017)
#   MONGODB_URI             full mongo URI (default: mongodb://localhost:<LOCAL_PORT>/game-center)
#                           — set this in api/.env if prod Mongo requires auth.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Source api/.env if present so MONGODB_URI etc. can be set without exporting
# them in the user's shell.
if [ -f "$API_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  source "$API_DIR/.env"
  set +a
fi

SSH_HOST="${MAGIC_UPDATE_SSH_HOST:-vue}"
LOCAL_PORT="${MAGIC_UPDATE_LOCAL_PORT:-27018}"
REMOTE_PORT="${MAGIC_UPDATE_REMOTE_PORT:-27017}"

export MONGODB_URI="${MONGODB_URI:-mongodb://localhost:${LOCAL_PORT}/game-center}"

# Sanity: refuse to run against the default-port localhost — that's almost
# certainly the user's local Mongo, not a tunneled connection.
if [[ "$MONGODB_URI" == *"localhost:27017"* ]] || [[ "$MONGODB_URI" == *"127.0.0.1:27017"* ]]; then
  echo "Refusing to run: MONGODB_URI points at localhost:27017 (your local Mongo)."
  echo "Either change LOCAL_PORT or set MONGODB_URI in api/.env."
  exit 1
fi

echo "Opening SSH tunnel ${SSH_HOST}:${REMOTE_PORT} -> localhost:${LOCAL_PORT}..."
ssh -N \
  -o ExitOnForwardFailure=yes \
  -o ServerAliveInterval=30 \
  -L "${LOCAL_PORT}:localhost:${REMOTE_PORT}" \
  "${SSH_HOST}" &
TUNNEL_PID=$!

# Always kill the tunnel on exit, regardless of how we got here.
cleanup() {
  if kill -0 "$TUNNEL_PID" 2>/dev/null; then
    kill "$TUNNEL_PID" 2>/dev/null || true
    wait "$TUNNEL_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

# Wait for the tunneled port to become reachable.
for _ in $(seq 1 30); do
  if (echo > "/dev/tcp/127.0.0.1/${LOCAL_PORT}") 2>/dev/null; then
    break
  fi
  if ! kill -0 "$TUNNEL_PID" 2>/dev/null; then
    echo "Tunnel exited before becoming reachable. See ssh output above."
    exit 1
  fi
  sleep 0.5
done

echo "Tunnel up. Running worker against ${MONGODB_URI}..."
node "$SCRIPT_DIR/update_scryfall.js"
