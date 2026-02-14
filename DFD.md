# Data Flow Diagrams for Pixie Fin Pal

## Level 0 DFD (Context Diagram)

This diagram shows the system as a single process interacting with external entities.

```mermaid
flowchart TD
    U[User] -->|Transaction Details, Budget Goals| P1[Finance Management System]
    P1 -->|Dashboard Data, Insights| U
    P1 -->|Store/Retrieve Data| D1[(Supabase Database)]
    D1 -->|Data Retrieval| P1
```

## Level 1 DFD

This diagram decomposes the system into main processes.

```mermaid
flowchart TD
    U[User] -->|Add Transaction Request| P1[1.0 Manage Transactions]
    U -->|View Dashboard| P2[2.0 Display Dashboard]
    U -->|Set Budgets/Goals| P3[3.0 Manage Budgets & Goals]
    P1 -->|Transaction Data| D1[(Transactions Store)]
    D1 -->|Retrieve Transactions| P2
    D1 -->|Transaction Data| P4[4.0 Calculate Finances]
    P4 -->|Balance, Expenses| P2
    P3 -->|Budget Data| D2[(Budgets Store)]
    D2 -->|Retrieve Budgets| P2
    P3 -->|Goals Data| D3[(Savings Goals Store)]
    D3 -->|Retrieve Goals| P2
    P4 -->|Financial Calculations| P5[5.0 Generate AI Insights]
    P5 -->|Insights Data| D4[(AI Insights Store)]
    D4 -->|Retrieve Insights| P2
    P2 -->|Dashboard Output| U
    P1 -->|Update Data| D1
    P3 -->|Update Data| D2
    P3 -->|Update Data| D3
    P5 -->|Update Data| D4
```

## Notes
- **Processes**: Represented by circles (e.g., 1.0 Manage Transactions).
- **Data Stores**: Represented by rectangles with double lines (e.g., (Transactions Store)).
- **External Entity**: User (square).
- **Data Flows**: Arrows showing data movement.
- Level 0 provides an overview; Level 1 shows decomposition into subprocesses.
- Data stores are based on the entities from the ER diagram (Transactions, Budgets, Savings Goals, AI Insights).

To render these diagrams, copy the Mermaid code into a compatible viewer like https://mermaid.live or GitHub.
