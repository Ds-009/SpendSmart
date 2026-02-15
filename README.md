# SpendSmart

SpendSmart is an AI-assisted personal finance web app for tracking transactions, analyzing spending trends, and generating actionable saving insights.

## Current Project Status

### Implemented
- Dashboard with total balance, monthly income, monthly expenses.
- Add transaction flow with local-date default and instant UI updates.
- Edit and delete transaction actions from recent transactions.
- Spending-by-category visualization.
- AI modules:
  - Monthly AI Report Generator
  - Personalized Savings Goal Planner
  - Overspending Alerts
  - AI Assistant insights (trend/regression-based local logic)
- Auth UI:
  - Login page
  - Sign-up page
  - Protected dashboard route
  - Logout

### Backend/API
- Node.js + Express API scaffolded in `server/`.
- MySQL connection layer and AI service layer created.
- Transaction and AI routes implemented.

### Important Note
- The current frontend auth flow is simplified for demo usability.
- Some backend authorization/persistence paths are in transition and can be hardened in the next phase.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui
- Recharts
- Node.js (Express)
- MySQL

## Folder Highlights

- `src/pages/Index.tsx`: Main dashboard.
- `src/pages/Auth.tsx`: Login/Sign-up page.
- `src/components/`: UI modules (transactions, AI cards, charts).
- `src/lib/aiInsights.ts`: AI analytics logic.
- `src/lib/aiApi.ts`: Frontend API layer.
- `server/index.js`: API routes.
- `server/db.js`: MySQL pool config.
- `server/aiService.js`: backend AI calculations.

## Local Setup

### 1. Install dependencies

```sh
npm install
```

### 2. Configure environment

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
```

### 3. Run frontend

```sh
npm run dev
```

### 4. Run backend API (optional)

```sh
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
