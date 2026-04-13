@echo off
REM Start both frontend and ML service for Windows

echo Starting SpendSmart with ML Service...
echo ========================================

REM Start ML Service
echo Starting ML Service on port 5000...
start cmd /k "cd ml_service && venv\Scripts\activate && python app.py"

REM Wait a moment
timeout /t 2

REM Start Frontend dev server
echo Starting Frontend on port 5173...
start cmd /k "npm run dev"

REM Start API server
echo Starting API server on port 3001...
start cmd /k "npm run dev:api"

echo ========================================
echo SpendSmart is running!
echo Frontend: http://localhost:5173
echo API: http://localhost:3001
echo ML Service: http://localhost:5000
echo ========================================

timeout /t 999999
