#!/bin/bash
#
# Start MedState: backend, frontend, and optionally the Telegram bot.
# Usage: ./start_all.sh [--no-bot]
#
# Services:
#   Backend:  http://localhost:5001
#   Frontend: http://localhost:8080
#

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
LOG_DIR="${TMPDIR:-/tmp}"
BACKEND_LOG="$LOG_DIR/medstate_backend.log"
FRONTEND_LOG="$LOG_DIR/medstate_frontend.log"
BOT_LOG="$LOG_DIR/medstate_bot.log"

START_BOT=true
if [[ "$1" == "--no-bot" ]]; then
  START_BOT=false
fi

cleanup() {
  echo ""
  echo "Stopping services..."
  [[ -n "$BACKEND_PID" ]] && kill "$BACKEND_PID" 2>/dev/null || true
  [[ -n "$FRONTEND_PID" ]] && kill "$FRONTEND_PID" 2>/dev/null || true
  [[ -n "$BOT_PID" ]] && kill "$BOT_PID" 2>/dev/null || true
  pkill -f "backend/app.py" 2>/dev/null || true
  pkill -f "backend/script.py" 2>/dev/null || true
  pkill -f "vite" 2>/dev/null || true
  echo "Done."
  exit 0
}

trap cleanup INT TERM

echo "MedState - Starting services"
echo ""

# --- Backend ---
echo "[1/3] Backend (Flask)"
cd "$BACKEND_DIR"

if [[ ! -d "venv" ]]; then
  echo "  Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate
pip install -q --upgrade pip 2>/dev/null || true
pip install -q -r requirements.txt 2>/dev/null || true

if [[ ! -f "wound_classifier.joblib" ]] || [[ ! -f "class_names.pkl" ]]; then
  echo "  Warning: Model files not found. Run 'cd backend && python3 train_model.py' first."
  echo "  Backend will start but wound classification may fail."
fi

python3 app.py >> "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo "  Started (PID $BACKEND_PID)"
echo "  Logs: tail -f $BACKEND_LOG"

sleep 2

# --- Frontend ---
echo ""
echo "[2/3] Frontend (Vite)"
cd "$FRONTEND_DIR"

if [[ ! -d "node_modules" ]]; then
  echo "  Installing dependencies..."
  if command -v bun &>/dev/null; then
    bun install >> "$FRONTEND_LOG" 2>&1 || true
  else
    npm install >> "$FRONTEND_LOG" 2>&1 || true
  fi
fi

if [[ ! -f ".env" ]] && [[ ! -f ".env.local" ]]; then
  echo "VITE_BACKEND_URL=http://localhost:5001" > .env
  echo "  Created .env"
fi

if command -v bun &>/dev/null; then
  bun run dev >> "$FRONTEND_LOG" 2>&1 &
elif command -v npm &>/dev/null; then
  npm run dev >> "$FRONTEND_LOG" 2>&1 &
elif command -v pnpm &>/dev/null; then
  pnpm dev >> "$FRONTEND_LOG" 2>&1 &
elif command -v yarn &>/dev/null; then
  yarn dev >> "$FRONTEND_LOG" 2>&1 &
else
  echo "  Error: bun, npm, pnpm, or yarn required"
  cleanup
fi

FRONTEND_PID=$!
echo "  Started (PID $FRONTEND_PID)"
echo "  Logs: tail -f $FRONTEND_LOG"

sleep 3

# --- Telegram bot (optional) ---
if [[ "$START_BOT" == "true" ]]; then
  echo ""
  echo "[3/3] Telegram bot"
  cd "$BACKEND_DIR"
  source venv/bin/activate 2>/dev/null || true

  if [[ -f "$SCRIPT_DIR/.env" ]] && grep -q "TELEGRAM_BOT_TOKEN" "$SCRIPT_DIR/.env" 2>/dev/null; then
    python3 script.py >> "$BOT_LOG" 2>&1 &
    BOT_PID=$!
    echo "  Started (PID $BOT_PID)"
    echo "  Logs: tail -f $BOT_LOG"
  else
    echo "  Skipped (TELEGRAM_BOT_TOKEN not set in .env)"
  fi
else
  echo ""
  echo "[3/3] Telegram bot: skipped (--no-bot)"
fi

echo ""
echo "Services running:"
echo "  Backend:  http://localhost:5001"
echo "  Frontend: http://localhost:8080"
echo ""
echo "Logs:"
echo "  Backend:  tail -f $BACKEND_LOG"
echo "  Frontend: tail -f $FRONTEND_LOG"
if [[ -n "$BOT_PID" ]]; then
  echo "  Bot:      tail -f $BOT_LOG"
fi
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

wait 2>/dev/null || true
