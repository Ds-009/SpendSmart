const parseDate = (value) => new Date(`${value}T00:00:00`);

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const sum = (values) => values.reduce((acc, value) => acc + value, 0);

export const normalizeTransactions = (rows) =>
  rows.map((row) => ({
    id: String(row.transaction_id),
    description: row.description ?? 'No description',
    amount: Number(row.amount),
    category: row.category_name,
    date: new Date(row.date).toISOString().slice(0, 10),
    type: row.category_type,
  }));

export const generateMonthlyReport = (transactions) => {
  const expenses = transactions.filter((item) => item.type === 'expense');
  const monthKeys = [...new Set(expenses.map((item) => monthKey(parseDate(item.date))))].sort();

  const currentMonth = monthKeys.at(-1);
  const previousMonth = monthKeys.at(-2);

  const currentExpenses = expenses.filter((item) => monthKey(parseDate(item.date)) === currentMonth);
  const previousExpenses = expenses.filter((item) => monthKey(parseDate(item.date)) === previousMonth);

  const totalSpending = sum(currentExpenses.map((item) => item.amount));
  const previousSpending = sum(previousExpenses.map((item) => item.amount));

  const byCategory = currentExpenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + item.amount;
    return acc;
  }, {});

  const categoryList = Object.entries(byCategory)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  const biggestCategory = categoryList[0] ?? { name: 'Other', amount: 0 };
  const share = totalSpending > 0 ? (biggestCategory.amount / totalSpending) * 100 : 0;
  const percentChange = previousSpending > 0 ? ((totalSpending - previousSpending) / previousSpending) * 100 : 0;

  const summary = previousSpending > 0
    ? `You spent ${Math.abs(percentChange).toFixed(0)}% ${percentChange >= 0 ? 'more' : 'less'} this month than last month.`
    : `Your biggest category this month is ${biggestCategory.name}.`;

  return {
    monthLabel: currentMonth ?? new Date().toISOString().slice(0, 7),
    totalSpending,
    biggestCategory: {
      name: biggestCategory.name,
      amount: biggestCategory.amount,
      share,
    },
    monthOverMonthChange: {
      percent: percentChange,
      direction: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'same',
    },
    aiSavingsTips: [
      `Set a weekly cap for ${biggestCategory.name}.`,
      'Use auto-transfer right after salary credit.',
      'Cut unnecessary subscriptions this month.',
    ],
    graphInsights: [
      `${biggestCategory.name} is ${share.toFixed(0)}% of monthly expenses.`,
      categoryList.length > 1
        ? `${categoryList[0].name} and ${categoryList[1].name} dominate your expense profile.`
        : 'Add more categorized expenses for better insights.',
    ],
    summary,
  };
};

export const buildSavingsPlanFromInput = ({ goalName, targetAmount, months, recurringMonthlySpend }) => {
  const monthlySaving = targetAmount / Math.max(months, 1);
  return {
    goalName,
    targetAmount,
    months,
    monthlySaving,
    suggestions: [
      `Save INR ${monthlySaving.toFixed(0)} per month for ${goalName}.`,
      recurringMonthlySpend > 0
        ? `Reduce recurring expenses by INR ${Math.min(recurringMonthlySpend, monthlySaving * 0.3).toFixed(0)} per month.`
        : 'Cut one non-essential subscription and redirect that money to savings.',
      'Set up an automatic transfer on day 1 of every month.',
    ],
  };
};

export const detectOverspending = (transactions) => {
  const expenses = transactions.filter((item) => item.type === 'expense');
  if (expenses.length === 0) {
    return [];
  }

  const latestDate = parseDate(expenses.map((item) => item.date).sort().at(-1));
  const currentStart = new Date(latestDate);
  currentStart.setDate(currentStart.getDate() - 6);

  const previousEnd = new Date(currentStart);
  previousEnd.setDate(previousEnd.getDate() - 1);

  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - 6);

  const inRange = (value, start, end) => {
    const date = parseDate(value);
    return date >= start && date <= end;
  };

  const byCategory = {};

  expenses.forEach((item) => {
    byCategory[item.category] = byCategory[item.category] ?? { current: 0, previous: 0 };
    if (inRange(item.date, currentStart, latestDate)) {
      byCategory[item.category].current += item.amount;
    } else if (inRange(item.date, previousStart, previousEnd)) {
      byCategory[item.category].previous += item.amount;
    }
  });

  return Object.entries(byCategory)
    .map(([category, value]) => {
      if (value.current <= 0) {
        return null;
      }

      if (value.previous === 0 && value.current >= 100) {
        return {
          id: `alert-${category}`,
          category,
          severity: 'high',
          message: `You are spending more than usual on ${category}.`,
        };
      }

      if (value.previous > 0) {
        const change = ((value.current - value.previous) / value.previous) * 100;
        if (change >= 25) {
          return {
            id: `alert-${category}`,
            category,
            severity: change >= 50 ? 'high' : 'medium',
            message: `You are spending ${change.toFixed(0)}% more than usual on ${category}.`,
          };
        }
      }

      return null;
    })
    .filter(Boolean);
};

export const recurringToMonthly = (amount, frequency) => {
  switch (frequency) {
    case 'daily':
      return amount * 30;
    case 'weekly':
      return amount * 4.33;
    case 'monthly':
      return amount;
    case 'yearly':
      return amount / 12;
    default:
      return 0;
  }
};
