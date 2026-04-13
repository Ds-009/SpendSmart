#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

FRONTEND_PID=""
API_PID=""

pick_npm_cmd() {
  if command -v npm >/dev/null 2>&1; then
    printf '%s\n' "npm"
    return
  fi

  if command -v npm.cmd >/dev/null 2>&1; then
    printf '%s\n' "npm.cmd"
    return
  fi

  echo "Error: npm was not found. Install Node.js first." >&2
  exit 1
}

NPM_CMD="$(pick_npm_cmd)"

cleanup() {
  local exit_code=$?

  if [[ -n "${FRONTEND_PID}" ]] && kill -0 "${FRONTEND_PID}" 2>/dev/null; then
    kill "${FRONTEND_PID}" 2>/dev/null || true
  fi

  if [[ -n "${API_PID}" ]] && kill -0 "${API_PID}" 2>/dev/null; then
    kill "${API_PID}" 2>/dev/null || true
  fi

  wait 2>/dev/null || true
  exit "${exit_code}"
}

trap cleanup EXIT INT TERM

echo "Checking Node.js tooling..."
command -v node >/dev/null 2>&1 || {
  echo "Error: node was not found. Install Node.js first." >&2
  exit 1
}

if [[ ! -d node_modules ]]; then
  echo "Installing project dependencies..."
  "${NPM_CMD}" install
else
  echo "Dependencies already installed."
fi

if [[ ! -f .env ]]; then
  if [[ -f .env.example ]]; then
    cp .env.example .env
    echo "Created .env from .env.example. Review database and Supabase values before relying on the API."
  else
    echo "Warning: .env is missing and no .env.example was found."
  fi
fi

for required_var in MYSQL_HOST MYSQL_PORT MYSQL_USER MYSQL_PASSWORD MYSQL_DATABASE API_PORT; do
  if ! grep -q "^${required_var}=" .env 2>/dev/null; then
    echo "Warning: ${required_var} is not set in .env. The API may fail until it is configured."
  fi
done

echo "Starting backend API on http://localhost:3001 ..."
"${NPM_CMD}" run dev:api &
API_PID=$!

sleep 2

echo "Starting frontend on http://localhost:8080/pixie-fin-pal/ ..."
"${NPM_CMD}" run dev &
FRONTEND_PID=$!

echo
echo "SpendSmart is launching."
echo "Frontend: http://localhost:8080/pixie-fin-pal/"
echo "Backend:  http://localhost:3001"
echo "Press Ctrl+C to stop both processes."
echo

wait "${API_PID}" "${FRONTEND_PID}"
