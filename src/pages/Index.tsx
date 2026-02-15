import { useEffect, useMemo, useState } from 'react';
import { Wallet, Plus, LogOut } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import TransactionList from '@/components/TransactionList';
import CategoryChart from '@/components/CategoryChart';
import BudgetWidget from '@/components/BudgetWidget';
import SavingsGoals from '@/components/SavingsGoals';
import AIAssistant from '@/components/AIAssistant';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import MonthlyAIReport from '@/components/MonthlyAIReport';
import SavingsGoalPlanner from '@/components/SavingsGoalPlanner';
import OverspendingAlerts from '@/components/OverspendingAlerts';
import AboutContactCard from '@/components/AboutContactCard';
import { Button } from '@/components/ui/button';
import { generateAIInsights } from '@/lib/aiInsights';
import { createTransaction, deleteTransaction, fetchTransactions, updateTransaction } from '@/lib/aiApi';
import { useAuth } from '@/hooks/useAuth';
import {
  mockTransactions,
  mockBudgets,
  mockSavingsGoals,
  calculateTotalBalance,
  calculateMonthlyIncome,
  calculateMonthlyExpenses,
} from '@/lib/mockData';
import { Transaction, TransactionCategory } from '@/types/finance';

const Index = () => {
  const { logout } = useAuth();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  useEffect(() => {
    let mounted = true;

    fetchTransactions()
      .then((rows) => {
        if (mounted && rows.length > 0) {
          setTransactions(rows);
        }
      })
      .catch(() => {
        // Keep fallback mock data if API fails.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const balance = useMemo(() => calculateTotalBalance(transactions), [transactions]);
  const income = useMemo(() => calculateMonthlyIncome(transactions), [transactions]);
  const expenses = useMemo(() => calculateMonthlyExpenses(transactions), [transactions]);
  const aiInsights = useMemo(() => generateAIInsights(transactions), [transactions]);

  const handleAddTransaction = async (transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);

    try {
      const created = await createTransaction({
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
      });

      setTransactions((prev) => prev.map((item) => (item.id === transaction.id ? created : item)));
    } catch (error) {
      console.error('Failed to persist transaction:', error);
    }
  };

  const handleEditTransaction = async (transaction: Transaction) => {
    const description = window.prompt('Edit description', transaction.description)?.trim();
    if (!description) {
      return;
    }

    const amountRaw = window.prompt('Edit amount', String(transaction.amount));
    if (!amountRaw) {
      return;
    }

    const amount = Number(amountRaw);
    if (!Number.isFinite(amount) || amount <= 0) {
      window.alert('Invalid amount');
      return;
    }

    const date = window.prompt('Edit date (YYYY-MM-DD)', transaction.date)?.trim();
    if (!date) {
      return;
    }

    const category = (window.prompt('Edit category', transaction.category)?.trim() || transaction.category) as TransactionCategory;

    const updated: Transaction = {
      ...transaction,
      description,
      amount,
      date,
      category,
    };

    setTransactions((prev) => prev.map((item) => (item.id === transaction.id ? updated : item)));

    try {
      const saved = await updateTransaction(transaction.id, {
        description,
        amount,
        date,
        type: transaction.type,
        category,
      });

      setTransactions((prev) => prev.map((item) => (item.id === transaction.id ? saved : item)));
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    const confirmed = window.confirm('Delete this transaction?');
    if (!confirmed) {
      return;
    }

    setTransactions((prev) => prev.filter((item) => item.id !== transactionId));

    try {
      // Local-only rows (temp ids) are already deleted from UI.
      if (!/^\d+$/.test(transactionId)) {
        return;
      }

      await deleteTransaction(transactionId);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--gradient-background)]">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SpendSmart</h1>
                <p className="text-sm text-muted-foreground">Your friendly finance companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button
                onClick={() => setIsAddTransactionOpen(true)}
                className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-[var(--shadow-medium)]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <DashboardHeader balance={balance} income={income} expenses={expenses} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <TransactionList
                transactions={transactions}
                onAddTransaction={() => setIsAddTransactionOpen(true)}
                onEditTransaction={handleEditTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
              <CategoryChart transactions={transactions} />
              <MonthlyAIReport transactions={transactions} />
            </div>

            <div className="space-y-6">
              <AIAssistant insights={aiInsights} />
              <BudgetWidget budgets={mockBudgets} />
              <SavingsGoals goals={mockSavingsGoals} />
              <SavingsGoalPlanner transactions={transactions} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AboutContactCard />
            </div>
            <OverspendingAlerts transactions={transactions} />
          </div>
        </div>
      </main>

      <AddTransactionDialog
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
};

export default Index;
