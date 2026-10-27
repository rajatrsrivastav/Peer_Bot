#!/usr/bin/env bash

set -euo pipefail

if ! command -v mongod >/dev/null 2>&1; then
  echo "MongoDB is required for demo mode. Install mongod, then run npm run demo again."
  exit 1
fi

DEMO_DB_DIR="$(mktemp -d /tmp/peerbot-demo.XXXXXX)"
DEMO_DB_LOG="$DEMO_DB_DIR/mongod.log"
DEMO_DB_PORT=27018
DEMO_DB_PID=""

cleanup() {
  if [[ -n "$DEMO_DB_PID" ]] && kill -0 "$DEMO_DB_PID" 2>/dev/null; then
    kill "$DEMO_DB_PID"
    wait "$DEMO_DB_PID" 2>/dev/null || true
  fi
  rm -rf "$DEMO_DB_DIR"
}

trap cleanup EXIT INT TERM

mongod \
  --dbpath "$DEMO_DB_DIR" \
  --port "$DEMO_DB_PORT" \
  --bind_ip 127.0.0.1 \
  --nounixsocket \
  --quiet \
  >"$DEMO_DB_LOG" 2>&1 &
DEMO_DB_PID=$!

for _ in {1..50}; do
  if ! kill -0 "$DEMO_DB_PID" 2>/dev/null; then
    echo "MongoDB failed to start. Log: $DEMO_DB_LOG"
    exit 1
  fi
  if nc -z 127.0.0.1 "$DEMO_DB_PORT" 2>/dev/null; then
    break
  fi
  sleep 0.1
done

if ! nc -z 127.0.0.1 "$DEMO_DB_PORT" 2>/dev/null; then
  echo "MongoDB did not become ready. Log: $DEMO_DB_LOG"
  exit 1
fi

echo "Starting PeerBot demo with an isolated temporary database."
MONGO_URL="mongodb://127.0.0.1:$DEMO_DB_PORT/peerbot" npm run dev
