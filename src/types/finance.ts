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
