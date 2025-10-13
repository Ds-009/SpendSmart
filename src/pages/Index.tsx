import { useState } from 'react';
import { Wallet, Plus } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import TransactionList from '@/components/TransactionList';
import CategoryChart from '@/components/CategoryChart';
import BudgetWidget from '@/components/BudgetWidget';
import SavingsGoals from '@/components/SavingsGoals';
import AIAssistant from '@/components/AIAssistant';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import { Button } from '@/components/ui/button';
import {
  mockTransactions,
  mockBudgets,
  mockSavingsGoals,
  mockAIInsights,
  calculateTotalBalance,
  calculateMonthlyIncome,
  calculateMonthlyExpenses
} from '@/lib/mockData';

const Index = () => {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const balance = calculateTotalBalance(mockTransactions);
  const income = calculateMonthlyIncome(mockTransactions);
  const expenses = calculateMonthlyExpenses(mockTransactions);

  return (
    <div className="min-h-screen bg-[var(--gradient-background)]">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-glow)]">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">FinanceFlow</h1>
                <p className="text-sm text-muted-foreground">Your friendly finance companion</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAddTransactionOpen(true)}
              className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-[var(--shadow-medium)]"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Balance Overview */}
          <DashboardHeader balance={balance} income={income} expenses={expenses} />

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Transactions & Chart */}
            <div className="lg:col-span-2 space-y-6">
              <TransactionList 
                transactions={mockTransactions} 
                onAddTransaction={() => setIsAddTransactionOpen(true)}
              />
              <CategoryChart transactions={mockTransactions} />
            </div>

            {/* Right Column - Budgets, Goals, AI */}
            <div className="space-y-6">
              <AIAssistant insights={mockAIInsights} />
              <BudgetWidget budgets={mockBudgets} />
              <SavingsGoals goals={mockSavingsGoals} />
            </div>
          </div>
        </div>
      </main>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog 
        open={isAddTransactionOpen}
        onOpenChange={setIsAddTransactionOpen}
      />
    </div>
  );
};

export default Index;
