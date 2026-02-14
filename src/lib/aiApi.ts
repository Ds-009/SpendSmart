import { MonthlyAIReport, OverspendingAlert, SavingsPlan, Transaction, TransactionCategory } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';

const checkResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

const getAuthHeaders = async (withJson: boolean = false): Promise<HeadersInit> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;
  const headers: HeadersInit = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (withJson) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch('/api/transactions', {
    headers: await getAuthHeaders(),
  });

  return checkResponse<Transaction[]>(response);
};

export const createTransaction = async (
  payload: {
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
    category: TransactionCategory;
  }
): Promise<Transaction> => {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: await getAuthHeaders(true),
    body: JSON.stringify(payload),
  });

  return checkResponse<Transaction>(response);
};

export const updateTransaction = async (
  transactionId: string,
  payload: {
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
    category: TransactionCategory;
  }
): Promise<Transaction> => {
  const response = await fetch(`/api/transactions/${transactionId}`, {
    method: 'PUT',
    headers: await getAuthHeaders(true),
    body: JSON.stringify(payload),
  });

  return checkResponse<Transaction>(response);
};

export const deleteTransaction = async (transactionId: string): Promise<void> => {
  const response = await fetch(`/api/transactions/${transactionId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }
};

export const fetchMonthlyAIReport = async (): Promise<MonthlyAIReport> => {
  const response = await fetch('/api/ai/monthly-report', {
    headers: await getAuthHeaders(),
  });

  return checkResponse<MonthlyAIReport>(response);
};

export const fetchSavingsPlan = async ({
  goalName,
  targetAmount,
  months,
}: {
  goalName: string;
  targetAmount: number;
  months: number;
}): Promise<SavingsPlan> => {
  const response = await fetch('/api/ai/savings-plan', {
    method: 'POST',
    headers: await getAuthHeaders(true),
    body: JSON.stringify({ goalName, targetAmount, months }),
  });

  return checkResponse<SavingsPlan>(response);
};

export const fetchOverspendingAlerts = async (): Promise<OverspendingAlert[]> => {
  const response = await fetch('/api/ai/overspending-alerts', {
    headers: await getAuthHeaders(),
  });

  return checkResponse<OverspendingAlert[]>(response);
};
