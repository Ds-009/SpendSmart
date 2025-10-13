import { Transaction } from '@/types/finance';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
}

const categoryColors: Record<string, string> = {
  'Food & Dining': 'bg-accent/20 text-accent',
  'Transportation': 'bg-primary/20 text-primary',
  'Shopping': 'bg-secondary/20 text-secondary',
  'Entertainment': 'bg-warning/20 text-warning',
  'Bills & Utilities': 'bg-muted-foreground/20 text-muted-foreground',
  'Healthcare': 'bg-success/20 text-success',
  'Travel': 'bg-primary/20 text-primary',
  'Income': 'bg-success/20 text-success',
  'Other': 'bg-muted/20 text-muted-foreground'
};

const TransactionList = ({ transactions, onAddTransaction }: TransactionListProps) => {
  const recentTransactions = transactions.slice(0, 6);

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-foreground">Recent Transactions</h3>
        <Button onClick={onAddTransaction} size="sm" className="bg-primary hover:bg-primary-dark">
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                transaction.type === 'income' ? 'bg-success/20' : 'bg-accent/20'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-5 w-5 text-success" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-accent" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{transaction.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className={categoryColors[transaction.category]}>
                    {transaction.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className={`text-lg font-semibold ${
              transaction.type === 'income' ? 'text-success' : 'text-foreground'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}
              ${transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TransactionList;
