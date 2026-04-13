@echo off
REM Quick verification script for Windows

echo =============================================
echo SpendSmart Build Verification
echo =============================================

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js not found
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_V=%%i
    echo [OK] %NODE_V%
)

REM Check npm
echo Checking npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo X npm not found
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_V=%%i
    echo [OK] %NPM_V%
)

REM Check Python
echo Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python not found
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version') do set PY_V=%%i
    echo [OK] %PY_V%
)

REM Check dependencies
echo Checking npm dependencies...
if exist "node_modules" (
    echo [OK] Installed
) else (
    echo X Not installed. Run: npm install
    exit /b 1
)

REM Check ML service
echo Checking ML service structure...
if exist "ml_service\app.py" if exist "ml_service\ml_models.py" (
    echo [OK] Present
) else (
    echo X Missing ML service files
    exit /b 1
)

echo.
echo =============================================
echo [OK] All checks passed!
echo =============================================
echo.
echo Next steps:
echo 1. Setup ML Service:
echo    setup-ml.cmd
echo.
echo 2. Run everything:
echo    start-all.cmd
echo.
echo 3. Or run manually in separate terminals:
echo    Terminal 1: cd ml_service ^& venv\Scripts\activate ^& python app.py
echo    Terminal 2: npm run dev
echo    Terminal 3: npm run dev:api
echo.

pause
