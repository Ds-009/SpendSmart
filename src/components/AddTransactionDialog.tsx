import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Transaction, TransactionCategory } from '@/types/finance';
import { useToast } from '@/hooks/use-toast';

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTransaction: (transaction: Transaction) => Promise<void>;
}

const categories: TransactionCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Travel',
  'Income',
  'Other',
];

const getLocalDateString = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().split('T')[0];
};

const createTempId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `tmp-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
};

const AddTransactionDialog = ({ open, onOpenChange, onAddTransaction }: AddTransactionDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Other' as TransactionCategory,
    type: 'expense' as 'income' | 'expense',
    date: getLocalDateString(),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const amount = Number(formData.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid positive number.',
      });
      return;
    }

    const description = formData.description.trim();
    if (!description) {
      toast({
        title: 'Description required',
        description: 'Please add a short description.',
      });
      return;
    }

    const transaction: Transaction = {
      id: createTempId(),
      description,
      amount,
      category: formData.category,
      type: formData.type,
      date: formData.date,
    };

    try {
      setIsSubmitting(true);
      await onAddTransaction(transaction);

      toast({
        title: 'Transaction added',
        description: `${transaction.description} - INR ${transaction.amount.toFixed(2)}`,
      });

      onOpenChange(false);
      setFormData({
        description: '',
        amount: '',
        category: 'Other' as TransactionCategory,
        type: 'expense',
        date: getLocalDateString(),
      });
    } catch {
      toast({
        title: 'Save failed',
        description: 'Could not save transaction. Try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Record a new income or expense transaction</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Coffee at Starbucks"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value as TransactionCategory })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.type === 'expense' ? 'default' : 'outline'}
                onClick={() =>
                  setFormData({
                    ...formData,
                    type: 'expense',
                    category: formData.category === 'Income' ? 'Other' : formData.category,
                  })
                }
                className="flex-1"
              >
                Expense
              </Button>
              <Button
                type="button"
                variant={formData.type === 'income' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, type: 'income', category: 'Income' })}
                className="flex-1"
              >
                Income
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Transaction'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
