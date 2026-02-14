import { FormEvent, useMemo, useState } from 'react';
import { Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction } from '@/types/finance';
import { buildSavingsPlan } from '@/lib/aiInsights';

interface SavingsGoalPlannerProps {
  transactions: Transaction[];
}

const goalOptions = ['Trip', 'Emergency Fund', 'Bike', 'Laptop'];

const SavingsGoalPlanner = ({ transactions }: SavingsGoalPlannerProps) => {
  const [goal, setGoal] = useState('Trip');
  const [amount, setAmount] = useState('30000');
  const [months, setMonths] = useState('6');
  const [submitted, setSubmitted] = useState(false);

  const plan = useMemo(
    () =>
      buildSavingsPlan({
        goalName: goal,
        targetAmount: Number(amount) || 0,
        months: Number(months) || 1,
        transactions,
      }),
    [goal, amount, months, transactions]
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-success" />
        <h3 className="text-xl font-semibold text-foreground">Personalized Savings Goal Planner</h3>
      </div>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label>Goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger>
              <SelectValue placeholder="Select goal" />
            </SelectTrigger>
            <SelectContent>
              {goalOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Amount (INR)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" required />
          </div>
          <div className="space-y-2">
            <Label>Time (months)</Label>
            <Input type="number" value={months} onChange={(e) => setMonths(e.target.value)} min="1" required />
          </div>
        </div>

        <Button type="submit" className="w-full">Build AI Plan</Button>
      </form>

      {submitted && (
        <div className="mt-4 p-4 rounded-md bg-muted/30 space-y-2 text-sm">
          <p>
            Save <span className="font-semibold">INR {plan.monthlySaving.toFixed(0)}/month</span> for {plan.goalName}
          </p>
          {plan.suggestions.map((suggestion) => (
            <p key={suggestion} className="text-muted-foreground">- {suggestion}</p>
          ))}
        </div>
      )}
    </Card>
  );
};

export default SavingsGoalPlanner;
