@echo off
REM ML Service Setup Script for Windows

echo Setting up ML Service...

cd ml_service

REM Create venv
python -m venv venv

REM Activate venv
call venv\Scripts\activate.bat

REM Install requirements
pip install -r requirements.txt

cd ..

echo ML Service setup complete!
echo To start the ML service, run: cd ml_service ^& python app.py
