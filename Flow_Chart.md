# Flow Chart for Pixie Fin Pal

This flow chart represents the main user journey in the finance application based on the React components and interactions defined in the codebase.

```mermaid
flowchart TD
    A[User Opens App] --> B[Load Dashboard]
    B --> C[Display Balance Overview<br/>DashboardHeader]
    C --> D[Display Main Grid]
    D --> E[Left Column:<br/>TransactionList & CategoryChart]
    D --> F[Right Column:<br/>AIAssistant, BudgetWidget, SavingsGoals]
    E --> G[User Interactions]
    F --> G
    G --> H{User Action?}
    H -->|Add Transaction| I[Open AddTransactionDialog]
    I --> J[Submit Transaction]
    J --> K[Update Mock Data]
    K --> L[Refresh Dashboard]
    L --> D
    H -->|View Insights| M[Interact with Widgets<br/>AIAssistant, BudgetWidget, SavingsGoals]
    M --> N[View Details/Stats]
    N --> D
    H -->|Close App| O[End Session]
    H -->|Other Actions| P[Loop Back to Dashboard]
    P --> D
```

## Notes
- **Dashboard**: Main view with balance, transactions, charts, budgets, goals, and AI insights.
- **Interactions**: Users can add transactions, view category charts, check budgets, track savings goals, and receive AI insights.
- **Data**: Currently uses mock data; in production, this would connect to Supabase.
- **Loops**: The app allows continuous interaction, looping back to the dashboard after actions.

To render this as an image, copy the Mermaid code into a compatible renderer like https://mermaid.live or GitHub.
