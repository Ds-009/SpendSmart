import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface DashboardHeaderProps {
  balance: number;
  income: number;
  expenses: number;
}

const DashboardHeader = ({ balance, income, expenses }: DashboardHeaderProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6 bg-gradient-to-br from-primary to-primary-dark shadow-[var(--shadow-medium)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-foreground/80">Total Balance</p>
            <h2 className="text-3xl font-bold text-primary-foreground mt-2">
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-success to-success/80 shadow-[var(--shadow-medium)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-success-foreground/80">Monthly Income</p>
            <h2 className="text-3xl font-bold text-success-foreground mt-2">
              ${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="h-12 w-12 rounded-full bg-success-foreground/20 flex items-center justify-center">
            <ArrowUpRight className="h-6 w-6 text-success-foreground" />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-accent to-accent/80 shadow-[var(--shadow-medium)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-accent-foreground/80">Monthly Expenses</p>
            <h2 className="text-3xl font-bold text-accent-foreground mt-2">
              ${expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="h-12 w-12 rounded-full bg-accent-foreground/20 flex items-center justify-center">
            <ArrowDownRight className="h-6 w-6 text-accent-foreground" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardHeader;
