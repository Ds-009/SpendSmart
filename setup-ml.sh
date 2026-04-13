#!/bin/bash

# ML Service Setup Script
echo "Setting up ML Service..."

# Create venv
cd ml_service
python3 -m venv venv

# Activate venv (Windows)
if [[ "$OS" == "Windows_NT" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install requirements
pip install -r requirements.txt

# Return to root
cd ..

echo "ML Service setup complete!"
echo "To start the ML service, run: cd ml_service && python3 app.py"
