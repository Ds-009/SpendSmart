import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SavingsGoal } from '@/types/finance';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
}

const SavingsGoals = ({ goals }: SavingsGoalsProps) => {
  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">Savings Goals</h3>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const percentage = (goal.currentAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.currentAmount;

          return (
            <div key={goal.id} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{goal.icon}</div>
                  <div>
                    <h4 className="font-semibold text-foreground">{goal.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    ₹{goal.currentAmount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <Progress 
                value={percentage} 
                className="h-2 bg-muted"
                indicatorClassName="bg-gradient-to-r from-primary to-success"
              />

              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {percentage.toFixed(0)}% complete
                </p>
                <p className="text-xs font-medium text-primary">
                  ₹{remaining.toLocaleString('en-IN')} to go
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/20">
        <div className="flex items-start gap-3">
          <Target className="h-5 w-5 text-success mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">AI Suggestion</p>
            <p className="text-xs text-muted-foreground mt-1">
              Save an extra ₹150/month on dining to reach your vacation goal 2 months earlier!
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SavingsGoals;
