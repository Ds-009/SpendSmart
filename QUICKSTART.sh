#!/bin/bash
# Comprehensive QuickStart Guide for SpendSmart with ML

echo "======================================================================"
echo "    SpendSmart - Complete Setup & Run Guide"
echo "======================================================================"
echo ""
echo "This script will guide you through setting up the complete system."
echo ""

# Check OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "Windows detected - Please use setup-ml.cmd and start-all.cmd instead"
    echo ""
    echo "Quick Start for Windows:"
    echo "1. setup-ml.cmd          (Setup Python ML service)"
    echo "2. start-all.cmd         (Start everything)"
    exit 0
fi

# Linux/Mac setup
echo "STEP 1: Verify Prerequisites"
echo "======================================================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✓ Node.js: $NODE_VERSION"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo "✓ Python: $PYTHON_VERSION"

echo ""
echo "STEP 2: Install Node.js Dependencies"
echo "======================================================================"
echo ""

if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
else
    echo "✓ npm packages already installed"
fi

echo ""
echo "STEP 3: Setup Python ML Service"
echo "======================================================================"
echo ""

if [ ! -d "ml_service/venv" ]; then
    echo "Setting up Python virtual environment..."
    cd ml_service
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing ML dependencies (this may take a few minutes)..."
    pip install -r requirements.txt
    cd ..
    echo "✓ ML Service setup complete"
else
    echo "✓ ML Service venv already exists"
fi

echo ""
echo "STEP 4: Configuration"
echo "======================================================================"
echo ""

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << 'EOF'
# Database Configuration
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD="your_password_here"
MYSQL_DATABASE="budget_calculator"

# API Configuration
API_PORT="3001"

# Optional: ML Service URL (uncomment to use custom ML service)
# ML_SERVICE_URL="http://localhost:5000"

# Supabase Configuration (optional)
VITE_SUPABASE_URL="your_supabase_url"
VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_key"
EOF
    echo "✓ .env created - Edit with your configuration"
else
    echo "✓ .env already exists"
fi

echo ""
echo "======================================================================"
echo "✓ Setup Complete!"
echo "======================================================================"
echo ""
echo "To start the application:"
echo ""
echo "Option A: Auto-Start Everything"
echo "  chmod +x start-all.sh && ./start-all.sh"
echo ""
echo "Option B: Manual Start (recommended for development)"
echo "  Terminal 1: cd ml_service && source venv/bin/activate && python app.py"
echo "  Terminal 2: npm run dev        (Frontend)"
echo "  Terminal 3: npm run dev:api    (API Server)"
echo ""
echo "Access the app at:"
echo "  • Frontend: http://localhost:5173"
echo "  • API: http://localhost:3001"
echo "  • ML Service: http://localhost:5000"
echo ""
echo "For more information, see ML_SERVICE_README.md"
echo ""
