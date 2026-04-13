# SpendSmart

SpendSmart is an AI-assisted personal finance web app for tracking transactions, analyzing spending trends, and generating actionable saving insights.

## Current Project Status

### Implemented
- Dashboard with total balance, monthly income, monthly expenses.
- Add transaction flow with local-date default and instant UI updates.
- Edit and delete transaction actions from recent transactions.
- Spending-by-category visualization.
- **AI modules (with ML models):**
  - Monthly AI Report Generator (**Prophet** - Time Series Forecasting)
  - Personalized Savings Goal Planner (**Linear Regression** - Optimization)
  - Overspending Alerts (**Isolation Forest** - Anomaly Detection)
  - AI Assistant insights (**Random Forest** - Pattern Recognition)
- Auth UI:
  - Login page
  - Sign-up page
  - Protected dashboard route
  - Logout

### Backend/API
- Node.js + Express API scaffolded in `server/`.
- MySQL connection layer and AI service layer created.
- **Python ML Service** (Flask) for advanced analytics.
- Transaction and AI routes implemented.
- Hybrid fallback system (ML + local logic).

### Important Note
- AI features work with or without ML service (automatic fallback)
- The current frontend auth flow is simplified for demo usability.
- Some backend authorization/persistence paths are in transition and can be hardened in the next phase.

## Tech Stack

- **Frontend**: Vite, React, TypeScript, Tailwind CSS, shadcn-ui, Recharts
- **Backend**: Node.js (Express), MySQL
- **ML Service**: Python (Flask), scikit-learn, Prophet, Pandas
- **Database**: MySQL

## Folder Highlights

- `src/pages/Index.tsx`: Main dashboard.
- `src/pages/Auth.tsx`: Login/Sign-up page.
- `src/components/`: UI modules (transactions, AI cards, charts).
- `src/lib/aiInsights.ts`: AI analytics logic.
- `src/lib/aiApi.ts`: Frontend API layer.
- `server/index.js`: API routes.
- `server/db.js`: MySQL pool config.
- `server/aiService.js`: AI service + ML integration.
- `ml_service/app.py`: Python ML models server.
- `ml_service/ml_models.py`: ML model implementations.

## Quick Start

### 1. Install dependencies

```sh
npm install
```

### 2. Setup ML Service (Optional but Recommended)

**Windows:**
```sh
setup-ml.cmd
```

**Linux/Mac:**
```sh
chmod +x setup-ml.sh
./setup-ml.sh
```

See [ML_SERVICE_README.md](ML_SERVICE_README.md) for detailed setup.

### 3. Configure environment

Create/update `.env` with your values:

```env
VITE_SUPABASE_URL="<your_supabase_url_if_used>"
VITE_SUPABASE_PUBLISHABLE_KEY="<your_supabase_anon_key_if_used>"

MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD="<your_mysql_password>"
MYSQL_DATABASE="budget_calculator"
API_PORT="3001"

# Optional: ML Service URL (default: http://localhost:5000)
# ML_SERVICE_URL="http://localhost:5000"
```

### 4a. Run Frontend Only

```sh
npm run dev
```

### 4b. Run with ML Service (Recommended)

**Windows:**
```cmd
start-all.cmd
```

**Linux/Mac:**
```bash
chmod +x start-all.sh
./start-all.sh
```

Or manually in separate terminals:

**Terminal 1 - ML Service:**
```bash
cd ml_service
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - API Server:**
```bash
npm run dev:api
```

### 5. Build for production

```sh
npm run build
```

## Scripts

- `npm run dev` - start frontend dev server
- `npm run dev:api` - start backend API server
- `npm run build` - production build

## ML Models Architecture

| Model | Purpose | Tech Stack |
|-------|---------|-----------|
| **Prophet** | Monthly spending forecast & trends | Facebook Prophet |
| **Isolation Forest** | Detect spending anomalies | scikit-learn |
| **Linear Regression** | Optimize savings goals | scikit-learn |
| **Random Forest** | Generate personalized tips | scikit-learn |

**Hybrid System**: If ML service is unavailable, the app automatically uses local JavaScript logic (no crashes, graceful degradation).

## Features in Detail

### 📊 Monthly AI Report
- Predict next month's spending using time series analysis
- Identify spending trends (increasing/decreasing)
- Confidence intervals for forecasts

### 🚨 Overspending Alerts
- Real-time anomaly detection
- Per-category spending spikes identified
- Severity scoring (high/medium/low)

### 💰 Savings Goal Planner
- Realistic monthly savings targets based on income/expense history
- Spending trend analysis
- Achievability assessment

### 💡 AI Tips & Insights
- Category-specific recommendations
- Weekend vs weekday spending patterns
- Personalized budget suggestions

## System Architecture

```
Frontend (React)
    ↓
API Server (Node.js/Express)
    ↓
   ├─→ Database (MySQL)
    ├─→ ML Service (Python/Flask) [Optional]
    └─→ Local JS Logic [Fallback]
```

## Troubleshooting

### ML Service Not Starting
See [ML_SERVICE_README.md - Troubleshooting](ML_SERVICE_README.md#troubleshooting)

### Connection Issues
- Verify ports: Frontend (5173), API (3001), ML (5000)
- Check `.env` configuration
- Review browser console for errors

### Database Issues
- Ensure MySQL is running
- Verify credentials in `.env`
- Check MySQL user has required permissions

## Development Roadmap

- [ ] User preferences & settings
- [ ] Budget alerts customization
- [ ] Export data (CSV/PDF)
- [ ] Multi-currency support
- [ ] Mobile app (React Native)
- [ ] Advanced reporting dashboard
- `npm run preview` - preview production build
- `npm run lint` - lint codebase

## Deployment

Recommended quick deployment for frontend: Github

- Build command: `npm run build`
- Publish directory: `root`

You can keep backend deployment separate (Render/Railway/VM) if needed.

## Next Enhancements

- Full production-grade auth + token-enforced backend integration.
- Budget and savings goals fully DB-backed.
- Better edit transaction UX via modal form.
- Backend validation, logging, and rate-limiting.
