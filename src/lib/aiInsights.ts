import {
  AIInsight,
  MonthlyAIReport,
  OverspendingAlert,
  SavingsPlan,
  Transaction,
  TransactionCategory,
} from '@/types/finance';

interface PlannerInput {
  goalName: string;
  targetAmount: number;
  months: number;
  transactions: Transaction[];
}

interface RegressionResult {
  slope: number;
  intercept: number;
}

const EXPENSE_CATEGORIES: TransactionCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Other',
];

const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

const monthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const parseDate = (value: string) => new Date(`${value}T00:00:00`);

const sum = (values: number[]) => values.reduce((acc, value) => acc + value, 0);

const linearRegression = (values: number[]): RegressionResult => {
  const n = values.length;
  if (n <= 1) {
    return { slope: 0, intercept: values[0] ?? 0 };
  }

  const xMean = (n - 1) / 2;
  const yMean = sum(values) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i += 1) {
    const xDiff = i - xMean;
    const yDiff = values[i] - yMean;
    numerator += xDiff * yDiff;
    denominator += xDiff * xDiff;
  }

  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;

  return { slope, intercept };
};

const expenseCategoryBreakdown = (transactions: Transaction[]) => {
  const map: Record<string, number> = {};
  transactions
    .filter((item) => item.type === 'expense')
    .forEach((item) => {
      map[item.category] = (map[item.category] ?? 0) + item.amount;
    });

  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
};

export const generateMonthlyAIReport = (transactions: Transaction[]): MonthlyAIReport => {
  const expenses = transactions.filter((item) => item.type === 'expense');
  const orderedMonthKeys = [...new Set(expenses.map((item) => monthKey(parseDate(item.date))))].sort();

  const currentMonth = orderedMonthKeys.at(-1);
  const previousMonth = orderedMonthKeys.at(-2);

  const currentMonthExpenses = expenses.filter(
    (item) => monthKey(parseDate(item.date)) === currentMonth
  );
  const previousMonthExpenses = expenses.filter(
    (item) => monthKey(parseDate(item.date)) === previousMonth
  );

  const totalSpending = sum(currentMonthExpenses.map((item) => item.amount));
  const previousSpending = sum(previousMonthExpenses.map((item) => item.amount));

  const categories = expenseCategoryBreakdown(currentMonthExpenses);
  const biggestCategory = categories[0] ?? { category: 'Other', amount: 0 };
  const biggestShare = totalSpending > 0 ? (biggestCategory.amount / totalSpending) * 100 : 0;

  const percentChange = previousSpending > 0 ? ((totalSpending - previousSpending) / previousSpending) * 100 : 0;
  const direction: 'up' | 'down' | 'same' = percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'same';

  const monthlySeries = orderedMonthKeys.map((key) => {
    const monthlyTotal = sum(
      expenses.filter((item) => monthKey(parseDate(item.date)) === key).map((item) => item.amount)
    );

    return {
      month: formatMonthLabel(parseDate(`${key}-01`)),
      spending: Number(monthlyTotal.toFixed(2)),
    };
  });

  const regression = linearRegression(monthlySeries.map((item) => item.spending));
  const projectedNext = Math.max(
    0,
    regression.intercept + regression.slope * monthlySeries.length
  );

  const previousCategoryAmount = sum(
    previousMonthExpenses
      .filter((item) => item.category === biggestCategory.category)
      .map((item) => item.amount)
  );
  const categoryChangePercent =
    previousCategoryAmount > 0
      ? ((biggestCategory.amount - previousCategoryAmount) / previousCategoryAmount) * 100
      : 0;

  const trendText =
    regression.slope > 0
      ? 'upward'
      : regression.slope < 0
        ? 'downward'
        : 'flat';

  const graphInsights = [
    `${biggestCategory.category} is your top category at ${biggestShare.toFixed(0)}% of this month spending.`,
    `Regression trend is ${trendText} (${regression.slope.toFixed(2)} INR per month), projected next month: INR ${projectedNext.toFixed(0)}.`,
  ];

  const aiSavingsTips = [
    `Cap ${biggestCategory.category} weekly spending to INR ${(biggestCategory.amount / 4).toFixed(0)}.`,
    regression.slope > 0
      ? 'Spending trend is rising. Move a fixed amount to savings at month start.'
      : 'Spending trend is stable. Increase monthly savings target by 5-10%.',
    'Review recurring subscriptions and pause low-value plans.',
  ];

  const summary = previousCategoryAmount > 0
    ? `You spent ${Math.abs(categoryChangePercent).toFixed(0)}% ${categoryChangePercent >= 0 ? 'more' : 'less'} on ${biggestCategory.category} this month.`
    : `Top category this month is ${biggestCategory.category}. Add more months for stronger trend predictions.`;

  return {
    monthLabel: currentMonth ? formatMonthLabel(parseDate(`${currentMonth}-01`)) : formatMonthLabel(new Date()),
    totalSpending,
    biggestCategory: {
      name: biggestCategory.category,
      amount: biggestCategory.amount,
      share: biggestShare,
    },
    monthOverMonthChange: {
      percent: percentChange,
      direction,
    },
    aiSavingsTips,
    graphInsights,
    summary,
    monthlySeries,
  };
};

const isSubscriptionLike = (description: string) => {
  const keywords = ['subscription', 'netflix', 'spotify', 'prime', 'membership'];
  const text = description.toLowerCase();
  return keywords.some((term) => text.includes(term));
};

export const buildSavingsPlan = ({ goalName, targetAmount, months, transactions }: PlannerInput): SavingsPlan => {
  const monthlySaving = targetAmount / Math.max(months, 1);

  const subscriptionSpending = sum(
    transactions
      .filter((item) => item.type === 'expense' && isSubscriptionLike(item.description))
      .map((item) => item.amount)
  );

  const suggestions = [
    `Save INR ${monthlySaving.toFixed(0)} per month toward ${goalName}.`,
    subscriptionSpending > 0
      ? `Cut low-value subscriptions to unlock about INR ${subscriptionSpending.toFixed(0)} monthly.`
      : 'Audit recurring expenses and cancel at least one non-essential subscription.',
    'Move your savings amount via auto-transfer right after income credits.',
  ];

  return {
    monthlySaving,
    goalName,
    targetAmount,
    months,
    suggestions,
  };
};

export const detectOverspendingAlerts = (transactions: Transaction[]): OverspendingAlert[] => {
  const expenses = transactions.filter((item) => item.type === 'expense');
  if (expenses.length === 0) {
    return [];
  }

  const latestDate = parseDate(
    expenses.map((item) => item.date).sort().at(-1) ?? new Date().toISOString().slice(0, 10)
  );
  const windowDays = 7;
  const currentWindowStart = new Date(latestDate);
  currentWindowStart.setDate(currentWindowStart.getDate() - windowDays + 1);

  const previousWindowEnd = new Date(currentWindowStart);
  previousWindowEnd.setDate(previousWindowEnd.getDate() - 1);
  const previousWindowStart = new Date(previousWindowEnd);
  previousWindowStart.setDate(previousWindowStart.getDate() - windowDays + 1);

  const inRange = (value: string, start: Date, end: Date) => {
    const date = parseDate(value);
    return date >= start && date <= end;
  };

  const alerts: OverspendingAlert[] = [];

  EXPENSE_CATEGORIES.forEach((category) => {
    const current = sum(
      expenses
        .filter((item) => item.category === category && inRange(item.date, currentWindowStart, latestDate))
        .map((item) => item.amount)
    );
    const previous = sum(
      expenses
        .filter((item) => item.category === category && inRange(item.date, previousWindowStart, previousWindowEnd))
        .map((item) => item.amount)
    );

    if (current <= 0) {
      return;
    }

    if (previous === 0 && current >= 100) {
      alerts.push({
        id: `alert-${category}`,
        category,
        severity: 'high',
        message: `You are spending more than usual on ${category}. This week: INR ${current.toFixed(2)}.`,
      });
      return;
    }

    if (previous > 0) {
      const changePercent = ((current - previous) / previous) * 100;
      if (changePercent >= 25) {
        alerts.push({
          id: `alert-${category}`,
          category,
          severity: changePercent >= 50 ? 'high' : 'medium',
          message: `You are spending ${changePercent.toFixed(0)}% more than usual on ${category}.`,
        });
      }
    }
  });

  return alerts;
};

export const generateAIInsights = (transactions: Transaction[]): AIInsight[] => {
  const expenses = transactions.filter((item) => item.type === 'expense');
  const today = new Date();

  if (expenses.length === 0) {
    return [
      {
        id: 'ai-empty',
        type: 'tip',
        message: 'Add transactions to generate personalized AI insights.',
        timestamp: today.toISOString(),
      },
    ];
  }

  const dailyMap = new Map<string, number>();
  expenses.forEach((item) => {
    dailyMap.set(item.date, (dailyMap.get(item.date) ?? 0) + item.amount);
  });

  const dailySeries = [...dailyMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((entry) => entry[1]);

  const { slope } = linearRegression(dailySeries);
  const latestSpend = dailySeries.at(-1) ?? 0;
  const averageSpend = sum(dailySeries) / Math.max(dailySeries.length, 1);

  const byCategory = expenseCategoryBreakdown(expenses);
  const topCategory = byCategory[0] ?? { category: 'Other', amount: 0 };

  const trendInsight: AIInsight = slope > 2
    ? {
      id: 'ai-trend-up',
      type: 'alert',
      message: `Regression detected a rising spend trend (+${slope.toFixed(2)} INR/day). Watch ${topCategory.category} closely.`,
      timestamp: today.toISOString(),
    }
    : {
      id: 'ai-trend-stable',
      type: 'achievement',
      message: `Spending trend is stable (${slope.toFixed(2)} INR/day). Keep following your current plan.`,
      timestamp: today.toISOString(),
    };

  const anomalyInsight: AIInsight = latestSpend > averageSpend * 1.5
    ? {
      id: 'ai-anomaly',
      type: 'alert',
      message: `Today looks higher than your normal pattern (${latestSpend.toFixed(0)} vs avg ${averageSpend.toFixed(0)} INR).`,
      timestamp: new Date(today.getTime() - 3600000).toISOString(),
    }
    : {
      id: 'ai-tip',
      type: 'tip',
      message: `Top expense category is ${topCategory.category}. Reducing it by 10% can improve monthly savings quickly.`,
      timestamp: new Date(today.getTime() - 3600000).toISOString(),
    };

  const total = sum(expenses.map((item) => item.amount));
  const categoryShare = total > 0 ? (topCategory.amount / total) * 100 : 0;

  const categoryInsight: AIInsight = {
    id: 'ai-category',
    type: categoryShare > 40 ? 'alert' : 'tip',
    message: `${topCategory.category} is ${categoryShare.toFixed(0)}% of your expenses. Diversify spending to reduce risk of overspending in one area.`,
    timestamp: new Date(today.getTime() - 7200000).toISOString(),
  };

  return [trendInsight, anomalyInsight, categoryInsight];
};
