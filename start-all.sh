#!/bin/bash

# Start both frontend and backend
echo "Starting SpendSmart with ML Service..."
echo "========================================"

# Start ML Service in background
echo "Starting ML Service on port 5000..."
cd ml_service
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate
python3 app.py &
ML_PID=$!
cd ..

# Wait a moment for ML service to start
sleep 2

# Start Node.js frontend dev server in one terminal
echo "Starting Frontend on port 5173..."
npm run dev &
FRONTEND_PID=$!

# Start Node.js API server in another terminal (optional)
echo "Starting API server on port 3001..."
npm run dev:api &
API_PID=$!

echo "========================================"
echo "SpendSmart is running!"
echo "Frontend: http://localhost:5173"
echo "API: http://localhost:3001"
echo "ML Service: http://localhost:5000"
echo "========================================"

# Handle cleanup
trap "kill $ML_PID $FRONTEND_PID $API_PID 2>/dev/null" EXIT

# Keep script running
wait
