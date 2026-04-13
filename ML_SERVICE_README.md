# ML Service Setup & Integration

This document explains how to set up and run the ML service for SpendSmart's advanced AI features.

## Overview

SpendSmart now integrates with a Python-based ML service that provides advanced analytics:

| Feature | Model | Location |
|---------|-------|----------|
| **Monthly Report** | Prophet (Time Series) | `/api/monthly-report` |
| **Overspending Detection** | Isolation Forest (Anomaly) | `/api/detect-overspending` |
| **Savings Planner** | Linear Regression | `/api/savings-plan` |
| **AI Tips** | Random Forest | `/api/ai-tips` |

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│ React Frontend (Port 5173)                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│ Node.js API Server (Port 3001)                      │
│ - Hybrid fallback logic                             │
│ - Database integration                              │
└──────────────────────┬──────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           ↓                       ↓
    ┌──────────────────┐   ┌─────────────────────┐
    │ Local JavaScript │   │ Python ML Service   │
    │ (Fallback)       │   │ (Port 5000)         │
    │                  │   │ - Flask API         │
    │ - Basic stats    │   │ - ML Models         │
    │ - Aggregations   │   │ - Advanced Analytics│
    └──────────────────┘   └─────────────────────┘
                               ↓
                           MySQL Database
```

The system uses a **hybrid approach**:
- Primary: Call ML Service (if available)
- Fallback: Use local JavaScript logic
- Result: Always provides insights, whether ML service is running or not

## Installation

### Prerequisites
- Python 3.8+
- pip
- Node.js + npm (for main app)

### Windows Setup

1. **Setup ML Service (Windows)**
   ```cmd
   setup-ml.cmd
   ```
   This will:
   - Create a Python virtual environment in `ml_service/venv`
   - Install all ML dependencies
   
   Or manually:
   ```cmd
   cd ml_service
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Start ML Service**
   ```cmd
   cd ml_service
   venv\Scripts\activate
   python app.py
   ```
   Expected output:
   ```
   * Running on http://localhost:5000
   ```

### Linux/Mac Setup

1. **Setup ML Service**
   ```bash
   chmod +x setup-ml.sh
   ./setup-ml.sh
   ```
   
   Or manually:
   ```bash
   cd ml_service
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Start ML Service**
   ```bash
   cd ml_service
   source venv/bin/activate
   python3 app.py
   ```

## Running the Application

### Option 1: Start Everything at Once

**Windows:**
```cmd
start-all.cmd
```

**Linux/Mac:**
```bash
chmod +x start-all.sh
./start-all.sh
```

### Option 2: Manual Startup

**Terminal 1 - ML Service:**
```bash
cd ml_service
source venv/bin/activate  # or venv\Scripts\activate on Windows
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - API Server (Optional):**
```bash
npm run dev:api
```

## Environment Configuration

The system looks for ML service at `http://localhost:5000` by default.

To change the ML service URL, set in `.env`:
```env
ML_SERVICE_URL=http://your-ml-server:5000
```

## API Endpoints

All endpoints require authentication (Bearer token).

### 1. Monthly Report with ML Forecast
```bash
GET /api/ai/monthly-report
```
Response includes:
- Local calculations (current month stats)
- ML forecast (next 30 days prediction via Prophet)
- Trend analysis

### 2. Overspending Detection
```bash
GET /api/ai/overspending-alerts
```
Response includes:
- Anomaly detection via Isolation Forest
- Severity levels (high/medium)
- Z-score confidence metrics

### 3. Savings Plan Optimization
```bash
POST /api/ai/savings-plan
Body: {
  "goalAmount": 100000,
  "goalMonths": 12
}
```
Response includes:
- Optimized monthly savings target
- Goal achievability (based on income/expense trends)
- Personalized recommendations

### 4. AI Tips
```bash
GET /api/ai/tips
```
Response includes:
- Category-specific recommendations
- Weekend vs weekday spending insights
- Confidence scores

## Troubleshooting

### ML Service Won't Start
```
Error: No module named 'prophet'
```
Solution: Ensure virtual environment is activated and requirements installed:
```bash
pip install -r requirements.txt
```

### ML Service Connection Failing
```
Warning: ML Service connection error
```
The system automatically falls back to local logic. To debug:
1. Verify ML service is running: `curl http://localhost:5000/health`
2. Check logs in ML service terminal
3. Verify `ML_SERVICE_URL` is correct in `.env`

### Port Already in Use
```
Error: Address already in use
```
Change ports in environment or kill existing processes:

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -i :5000
kill -9 <PID>
```

## Performance Notes

- **First request**: May take 2-3 seconds (model initialization)
- **Subsequent requests**: <200ms average response
- **Min data requirement**: 
  - Monthly Report: 10+ transactions
  - Overspending Detection: 20+ transactions
  - Savings Plan: 5+ transactions with income/expense mix
  - AI Tips: 10+ transactions

## Data Input Format

All ML endpoints expect transactions in this format:
```json
{
  "transactions": [
    {
      "id": "1",
      "description": "Coffee",
      "amount": 150.50,
      "category": "Food & Dining",
      "date": "2024-04-10",
      "type": "expense"
    },
    {
      "id": "2",
      "description": "Salary",
      "amount": 50000,
      "category": "Income",
      "date": "2024-04-01",
      "type": "income"
    }
  ]
}
```

## ML Model Details

### Prophet (Monthly Report)
- **Use**: Time series forecasting
- **Advantage**: Handles seasonality, trends, holidays
- **Min data**: 10 data points
- **Forecast window**: 30 days

### Isolation Forest (Overspending)
- **Use**: Anomaly detection
- **Advantage**: Works without labeled data, fast
- **Contamination**: 10% (top 10% anomalies detected)
- **Per category**: Separate models for each category

### Linear Regression (Savings Plan)
- **Use**: Trend estimation for spending forecast
- **Advantage**: Simple, interpretable, fast
- **Input validation**: Checks for unrealistic goals
- **Max goal**: INR 100 crore
- **Max duration**: 600 months

### Random Forest (AI Tips)
- **Use**: Pattern recognition and classification
- **Advantage**: Feature importance, non-linear patterns
- **N estimators**: 10 trees
- **Max depth**: 5 (prevents overfitting)
- **Features**: Day of week, day of month, weekend flag

## Production Deployment

For production, consider:

1. **ML Service Deployment**
   - Use Gunicorn instead of Flask development server
   - Run behind Nginx reverse proxy
   - Use `.env` for ML_SERVICE_URL

2. **Environment Variables**
   ```env
   FLASK_ENV=production
   FLASK_DEBUG=False
   ML_SERVICE_URL=https://ml.yourdomain.com
   ```

3. **Monitoring**
   - Monitor `/health` endpoint
   - Log all errors
   - Track response times
   - Set up alerts for ML service downtime

## Support

For issues or questions:
1. Check logs in ML service terminal
2. Ensure internet connection (for package installation)
3. Verify Python and Node versions
4. Review error messages in browser console
