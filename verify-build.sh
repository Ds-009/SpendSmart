#!/bin/bash
# Quick verification script

echo "============================================="
echo "SpendSmart Build Verification"
echo "============================================="

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_V=$(node -v)
    echo "✓ $NODE_V"
else
    echo "✗ Node.js not found"
    exit 1
fi

# Check npm
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_V=$(npm -v)
    echo "✓ $NPM_V"
else
    echo "✗ npm not found"
    exit 1
fi

# Check Python
echo -n "Checking Python... "
if command -v python3 &> /dev/null; then
    PY_V=$(python3 --version)
    echo "✓ $PY_V"
else
    echo "✗ Python 3 not found"
    exit 1
fi

# Check dependencies
echo -n "Checking npm dependencies... "
if [ -d "node_modules" ]; then
    echo "✓ Installed"
else
    echo "✗ Not installed. Run: npm install"
    exit 1
fi

# Check ML service
echo -n "Checking ML service structure... "
if [ -d "ml_service" ] && [ -f "ml_service/app.py" ] && [ -f "ml_service/ml_models.py" ]; then
    echo "✓ Present"
else
    echo "✗ Missing ML service files"
    exit 1
fi

# Check setup scripts
echo -n "Checking setup scripts... "
if [ -f "setup-ml.sh" ] && [ -f "start-all.sh" ]; then
    echo "✓ Present"
else
    echo "✗ Missing setup scripts"
    exit 1
fi

echo ""
echo "============================================="
echo "✓ All checks passed!"
echo "============================================="
echo ""
echo "Next steps:"
echo "1. Setup ML Service:"
echo "   chmod +x setup-ml.sh && ./setup-ml.sh"
echo ""
echo "2. Run everything:"
echo "   chmod +x start-all.sh && ./start-all.sh"
echo ""
echo "3. Or run manually in separate terminals:"
echo "   Terminal 1: cd ml_service && source venv/bin/activate && python app.py"
echo "   Terminal 2: npm run dev"
echo "   Terminal 3: npm run dev:api"
echo ""
