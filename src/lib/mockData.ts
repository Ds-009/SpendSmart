import { Transaction, Budget, SavingsGoal, AIInsight } from '@/types/finance';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Grocery Shopping',
    amount: 85.42,
    category: 'Food & Dining',
    date: '2025-10-12',
    type: 'expense'
  },
  {
    id: '2',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-10-10',
    type: 'income'
  },
  {
    id: '3',
    description: 'Uber Ride',
    amount: 22.50,
    category: 'Transportation',
    date: '2025-10-11',
    type: 'expense'
  },
  {
    id: '4',
    description: 'Netflix Subscription',
    amount: 15.99,
    category: 'Entertainment',
    date: '2025-10-09',
    type: 'expense'
  },
  {
    id: '5',
    description: 'Electricity Bill',
    amount: 120.00,
    category: 'Bills & Utilities',
    date: '2025-10-08',
    type: 'expense'
  },
  {
    id: '6',
    description: 'Coffee Shop',
    amount: 12.50,
    category: 'Food & Dining',
    date: '2025-10-12',
    type: 'expense'
  },
  {
    id: '7',
    description: 'Online Shopping',
    amount: 156.78,
    category: 'Shopping',
    date: '2025-10-10',
    type: 'expense'
  },
  {
    id: '8',
    description: 'Gym Membership',
    amount: 45.00,
    category: 'Healthcare',
    date: '2025-10-07',
    type: 'expense'
  }
];

export const mockBudgets: Budget[] = [
  { category: 'Food & Dining', limit: 500, spent: 297.92 },
  { category: 'Transportation', limit: 200, spent: 122.50 },
  { category: 'Shopping', limit: 300, spent: 156.78 },
  { category: 'Entertainment', limit: 150, spent: 78.99 },
  { category: 'Bills & Utilities', limit: 400, spent: 320.00 },
  { category: 'Healthcare', limit: 100, spent: 45.00 }
];

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    deadline: '2025-12-31',
    icon: '🛡️'
  },
  {
    id: '2',
    name: 'Summer Vacation',
    targetAmount: 3000,
    currentAmount: 1850,
    deadline: '2026-06-01',
    icon: '✈️'
  },
  {
    id: '3',
    name: 'New Laptop',
    targetAmount: 2000,
    currentAmount: 450,
    deadline: '2026-03-01',
    icon: '💻'
  }
];

export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    message: "Great job! You're 15% under budget on dining this month. 🎉",
    type: 'achievement',
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    message: "Your transportation spending is higher than usual. Consider carpooling or public transit to save ₹80/month.",
    type: 'tip',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    message: "Heads up! Your electricity bill is due in 3 days.",
    type: 'alert',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  }
];

export const calculateTotalBalance = (transactions: Transaction[]): number => {
  return transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);
};

export const calculateMonthlyIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
};

export const calculateMonthlyExpenses = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
};
