export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: TransactionCategory;
  date: string;
  type: 'income' | 'expense';
}

export type TransactionCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Travel'
  | 'Income'
  | 'Other';

export interface Budget {
  category: TransactionCategory;
  limit: number;
  spent: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface AIInsight {
  id: string;
  message: string;
  type: 'tip' | 'alert' | 'achievement';
  timestamp: string;
}

export interface MonthlyAIReport {
  monthLabel: string;
  totalSpending: number;
  biggestCategory: {
    name: string;
    amount: number;
    share: number;
  };
  monthOverMonthChange: {
    percent: number;
    direction: 'up' | 'down' | 'same';
  };
  aiSavingsTips: string[];
  graphInsights: string[];
  summary: string;
  monthlySeries: Array<{
    month: string;
    spending: number;
  }>;
}

export interface SavingsPlan {
  monthlySaving: number;
  goalName: string;
  targetAmount: number;
  months: number;
  suggestions: string[];
}

export interface OverspendingAlert {
  id: string;
  category: string;
  message: string;
  severity: 'medium' | 'high';
}
