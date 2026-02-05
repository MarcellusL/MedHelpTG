#!/bin/bash
# Start both backend and frontend in separate terminals
# Usage: ./start_all.sh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Starting MedState Application"
echo ""
echo "This will start:"
echo "  1. Backend server (http://localhost:5001)"
echo "  2. Frontend dev server (http://localhost:5173)"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}
trap cleanup INT TERM

# Start backend
echo "Starting backend..."
cd "$SCRIPT_DIR/backend"
./run_backend.sh &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
echo "Starting frontend..."
cd "$SCRIPT_DIR/frontend"
./run_frontend.sh &
FRONTEND_PID=$!

# Wait for both
wait
