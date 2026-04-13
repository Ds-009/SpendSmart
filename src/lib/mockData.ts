import { Transaction, Budget, SavingsGoal, AIInsight } from '@/types/finance';

export const mockTransactions: Transaction[] = [
  // October 2025
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
  },

  // September 2025
  {
    id: '9',
    description: 'Restaurant Dinner',
    amount: 234.50,
    category: 'Food & Dining',
    date: '2025-09-15',
    type: 'expense'
  },
  {
    id: '10',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-09-10',
    type: 'income'
  },
  {
    id: '11',
    description: 'Gas Station',
    amount: 78.90,
    category: 'Transportation',
    date: '2025-09-20',
    type: 'expense'
  },
  {
    id: '12',
    description: 'Movie Tickets',
    amount: 45.00,
    category: 'Entertainment',
    date: '2025-09-18',
    type: 'expense'
  },
  {
    id: '13',
    description: 'Internet Bill',
    amount: 89.99,
    category: 'Bills & Utilities',
    date: '2025-09-05',
    type: 'expense'
  },
  {
    id: '14',
    description: 'Pharmacy',
    amount: 67.30,
    category: 'Healthcare',
    date: '2025-09-12',
    type: 'expense'
  },
  {
    id: '15',
    description: 'Clothing Store',
    amount: 189.99,
    category: 'Shopping',
    date: '2025-09-25',
    type: 'expense'
  },

  // August 2025
  {
    id: '16',
    description: 'Grocery Shopping',
    amount: 92.15,
    category: 'Food & Dining',
    date: '2025-08-08',
    type: 'expense'
  },
  {
    id: '17',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-08-10',
    type: 'income'
  },
  {
    id: '18',
    description: 'Train Ticket',
    amount: 156.00,
    category: 'Transportation',
    date: '2025-08-22',
    type: 'expense'
  },
  {
    id: '19',
    description: 'Concert Tickets',
    amount: 120.00,
    category: 'Entertainment',
    date: '2025-08-14',
    type: 'expense'
  },
  {
    id: '20',
    description: 'Water Bill',
    amount: 45.50,
    category: 'Bills & Utilities',
    date: '2025-08-03',
    type: 'expense'
  },
  {
    id: '21',
    description: 'Doctor Visit',
    amount: 234.00,
    category: 'Healthcare',
    date: '2025-08-19',
    type: 'expense'
  },

  // July 2025
  {
    id: '22',
    description: 'Pizza Delivery',
    amount: 67.89,
    category: 'Food & Dining',
    date: '2025-07-12',
    type: 'expense'
  },
  {
    id: '23',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-07-10',
    type: 'income'
  },
  {
    id: '24',
    description: 'Taxi Ride',
    amount: 34.50,
    category: 'Transportation',
    date: '2025-07-15',
    type: 'expense'
  },
  {
    id: '25',
    description: 'Streaming Service',
    amount: 12.99,
    category: 'Entertainment',
    date: '2025-07-01',
    type: 'expense'
  },
  {
    id: '26',
    description: 'Gas Bill',
    amount: 156.78,
    category: 'Bills & Utilities',
    date: '2025-07-07',
    type: 'expense'
  },
  {
    id: '27',
    description: 'Dental Checkup',
    amount: 89.00,
    category: 'Healthcare',
    date: '2025-07-20',
    type: 'expense'
  },
  {
    id: '28',
    description: 'Book Purchase',
    amount: 45.99,
    category: 'Shopping',
    date: '2025-07-25',
    type: 'expense'
  },

  // June 2025
  {
    id: '29',
    description: 'Supermarket',
    amount: 178.45,
    category: 'Food & Dining',
    date: '2025-06-10',
    type: 'expense'
  },
  {
    id: '30',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-06-10',
    type: 'income'
  },
  {
    id: '31',
    description: 'Bus Pass',
    amount: 89.00,
    category: 'Transportation',
    date: '2025-06-01',
    type: 'expense'
  },
  {
    id: '32',
    description: 'Theater Show',
    amount: 67.50,
    category: 'Entertainment',
    date: '2025-06-18',
    type: 'expense'
  },
  {
    id: '33',
    description: 'Phone Bill',
    amount: 234.56,
    category: 'Bills & Utilities',
    date: '2025-06-05',
    type: 'expense'
  },
  {
    id: '34',
    description: 'Medicine',
    amount: 123.45,
    category: 'Healthcare',
    date: '2025-06-14',
    type: 'expense'
  },

  // May 2025
  {
    id: '35',
    description: 'Restaurant Lunch',
    amount: 145.67,
    category: 'Food & Dining',
    date: '2025-05-15',
    type: 'expense'
  },
  {
    id: '36',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-05-10',
    type: 'income'
  },
  {
    id: '37',
    description: 'Parking Fee',
    amount: 23.00,
    category: 'Transportation',
    date: '2025-05-20',
    type: 'expense'
  },
  {
    id: '38',
    description: 'Gaming Subscription',
    amount: 29.99,
    category: 'Entertainment',
    date: '2025-05-03',
    type: 'expense'
  },
  {
    id: '39',
    description: 'Electricity Bill',
    amount: 167.89,
    category: 'Bills & Utilities',
    date: '2025-05-08',
    type: 'expense'
  },

  // April 2025
  {
    id: '40',
    description: 'Grocery Shopping',
    amount: 134.56,
    category: 'Food & Dining',
    date: '2025-04-12',
    type: 'expense'
  },
  {
    id: '41',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-04-10',
    type: 'income'
  },
  {
    id: '42',
    description: 'Uber Ride',
    amount: 45.67,
    category: 'Transportation',
    date: '2025-04-18',
    type: 'expense'
  },
  {
    id: '43',
    description: 'Movie Streaming',
    amount: 19.99,
    category: 'Entertainment',
    date: '2025-04-05',
    type: 'expense'
  },

  // March 2025
  {
    id: '44',
    description: 'Fast Food',
    amount: 78.90,
    category: 'Food & Dining',
    date: '2025-03-08',
    type: 'expense'
  },
  {
    id: '45',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-03-10',
    type: 'income'
  },
  {
    id: '46',
    description: 'Fuel',
    amount: 123.45,
    category: 'Transportation',
    date: '2025-03-15',
    type: 'expense'
  },

  // February 2025
  {
    id: '47',
    description: 'Coffee Shop',
    amount: 15.50,
    category: 'Food & Dining',
    date: '2025-02-12',
    type: 'expense'
  },
  {
    id: '48',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-02-10',
    type: 'income'
  },
  {
    id: '49',
    description: 'Train Ticket',
    amount: 89.00,
    category: 'Transportation',
    date: '2025-02-20',
    type: 'expense'
  },

  // January 2025
  {
    id: '50',
    description: 'New Year Dinner',
    amount: 234.56,
    category: 'Food & Dining',
    date: '2025-01-01',
    type: 'expense'
  },
  {
    id: '51',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-01-10',
    type: 'income'
  },
  {
    id: '52',
    description: 'Taxi',
    amount: 67.89,
    category: 'Transportation',
    date: '2025-01-15',
    type: 'expense'
  },

  // December 2024
  {
    id: '53',
    description: 'Christmas Shopping',
    amount: 345.67,
    category: 'Shopping',
    date: '2024-12-20',
    type: 'expense'
  },
  {
    id: '54',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2024-12-10',
    type: 'income'
  },
  {
    id: '55',
    description: 'Holiday Travel',
    amount: 567.89,
    category: 'Travel',
    date: '2024-12-25',
    type: 'expense'
  },

  // November 2024
  {
    id: '56',
    description: 'Thanksgiving Dinner',
    amount: 189.99,
    category: 'Food & Dining',
    date: '2024-11-28',
    type: 'expense'
  },
  {
    id: '57',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2024-11-10',
    type: 'income'
  },
  {
    id: '58',
    description: 'Black Friday Shopping',
    amount: 456.78,
    category: 'Shopping',
    date: '2024-11-29',
    type: 'expense'
  },

  // October 2024
  {
    id: '59',
    description: 'Halloween Party',
    amount: 123.45,
    category: 'Entertainment',
    date: '2024-10-31',
    type: 'expense'
  },
  {
    id: '60',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2024-10-10',
    type: 'income'
  },

  // Add some realistic high-value transactions (not extreme outliers)
  {
    id: '61',
    description: 'Laptop Purchase',
    amount: 45000.00,
    category: 'Shopping',
    date: '2025-09-15',
    type: 'expense'
  },
  {
    id: '62',
    description: 'Home Renovation',
    amount: 75000.00,
    category: 'Other',
    date: '2025-08-20',
    type: 'expense'
  },
  {
    id: '63',
    description: 'Family Vacation',
    amount: 35000.00,
    category: 'Travel',
    date: '2025-07-10',
    type: 'expense'
  },
  {
    id: '64',
    description: 'Year-end Bonus',
    amount: 25000.00,
    category: 'Income',
    date: '2025-06-15',
    type: 'income'
  },
  {
    id: '65',
    description: 'Freelance Project',
    amount: 15000.00,
    category: 'Income',
    date: '2025-10-05',
    type: 'income'
  },
  {
    id: '66',
    description: 'Investment Returns',
    amount: 8000.00,
    category: 'Income',
    date: '2025-09-20',
    type: 'income'
  },
  {
    id: '67',
    description: 'Monthly Salary',
    amount: 4500.00,
    category: 'Income',
    date: '2025-11-10',
    type: 'income'
  },
  {
    id: '68',
    description: 'Side Business',
    amount: 12000.00,
    category: 'Income',
    date: '2025-10-25',
    type: 'income'
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
  // Calculate balance as: total income - total expenses
  const balance = transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount;
  }, 0);

  // Ensure balance is at least the latest month income amount for coherence
  const latestIncome = calculateMonthlyIncome(transactions);
  return Math.max(balance, latestIncome);
};

const getLatestMonthYear = (transactions: Transaction[]) => {
  if (transactions.length === 0) {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  }

  const latest = transactions.reduce((latestSoFar, t) => {
    const date = new Date(t.date);
    return date > latestSoFar ? date : latestSoFar;
  }, new Date(transactions[0].date));

  return { month: latest.getMonth(), year: latest.getFullYear() };
};

export const calculateMonthlyIncome = (transactions: Transaction[]): number => {
  const { month: latestMonth, year: latestYear } = getLatestMonthYear(transactions);

  return transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'income' &&
             transactionDate.getMonth() === latestMonth &&
             transactionDate.getFullYear() === latestYear;
    })
    .reduce((acc, t) => acc + t.amount, 0);
};

export const calculateMonthlyExpenses = (transactions: Transaction[]): number => {
  const { month: latestMonth, year: latestYear } = getLatestMonthYear(transactions);

  return transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      return t.type === 'expense' &&
             transactionDate.getMonth() === latestMonth &&
             transactionDate.getFullYear() === latestYear;
    })
    .reduce((acc, t) => acc + t.amount, 0);
};
