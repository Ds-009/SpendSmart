# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/a2396e0f-9215-4ef0-9d86-f90fbc5b8b50

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a2396e0f-9215-4ef0-9d86-f90fbc5b8b50) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Recommended architecture for AI features

Option A (best for this project): **Supabase + AI API (no heavy backend)**

- Supabase handles auth (login/signup), database, and storage.
- Keep Node server minimal and only for AI calls.
- Current app includes UI + local logic for:
  - Monthly AI Report Generator
  - Personalized Savings Goal Planner
  - Overspending Alerts
- To productionize, replace local logic in `src/lib/aiInsights.ts` with API calls from your lightweight Node endpoint.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a2396e0f-9215-4ef0-9d86-f90fbc5b8b50) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## MySQL API quick run (user_id = 1)

1. Configure `.env` with your MySQL credentials.
2. Start API server:

```sh
npm run dev:api
```

3. Start frontend in another terminal:

```sh
npm run dev
```

4. Health check:

```sh
http://localhost:3001/api/health
```

AI endpoints used by the dashboard:

- `GET /api/ai/monthly-report?userId=1`
- `POST /api/ai/savings-plan`
- `GET /api/ai/overspending-alerts?userId=1`
