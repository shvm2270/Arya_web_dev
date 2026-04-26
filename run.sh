#!/bin/bash

# Define directories
BASE_DIR="$(pwd)"
BACKEND_DIR="$BASE_DIR/finance-tracker-backend"
FRONTEND_DIR="$BASE_DIR/finance-tracker-frontend"

echo "====================================="
echo " Starting Finance Tracker Backend... "
echo "====================================="
cd "$BACKEND_DIR"
# Start backend in the background
node server.js &
BACKEND_PID=$!

echo "====================================="
echo " Starting Finance Tracker Frontend..."
echo "====================================="
cd "$FRONTEND_DIR"
# Start frontend
npm run dev

# If frontend is stopped (Ctrl+C), kill backend too
kill $BACKEND_PID
