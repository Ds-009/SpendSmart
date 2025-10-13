import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Budget } from '@/types/finance';
import { AlertCircle } from 'lucide-react';

interface BudgetWidgetProps {
  budgets: Budget[];
}

const BudgetWidget = ({ budgets }: BudgetWidgetProps) => {
  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <h3 className="text-xl font-semibold text-foreground mb-4">Monthly Budgets</h3>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isOverBudget = percentage > 100;
          const isNearLimit = percentage > 80 && percentage <= 100;

          return (
            <div key={budget.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{budget.category}</span>
                  {isOverBudget && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  ₹{budget.spent.toFixed(2)} / ₹{budget.limit.toFixed(2)}
                </span>
              </div>
              <Progress 
                value={Math.min(percentage, 100)} 
                className={`h-2 ${
                  isOverBudget ? 'bg-destructive/20' : 
                  isNearLimit ? 'bg-warning/20' : 
                  'bg-muted'
                }`}
                indicatorClassName={
                  isOverBudget ? 'bg-destructive' :
                  isNearLimit ? 'bg-warning' :
                  'bg-success'
                }
              />
              {isOverBudget && (
                <p className="text-xs text-destructive">
                  ₹{(budget.spent - budget.limit).toFixed(2)} over budget
                </p>
              )}
              {isNearLimit && !isOverBudget && (
                <p className="text-xs text-warning">
                  ₹{(budget.limit - budget.spent).toFixed(2)} remaining
                </p>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default BudgetWidget;
