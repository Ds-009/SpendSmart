import { useMemo } from 'react';
import { BellRing } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Transaction } from '@/types/finance';
import { detectOverspendingAlerts } from '@/lib/aiInsights';

interface OverspendingAlertsProps {
  transactions: Transaction[];
}

const OverspendingAlerts = ({ transactions }: OverspendingAlertsProps) => {
  const alerts = useMemo(() => detectOverspendingAlerts(transactions), [transactions]);

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <BellRing className="h-5 w-5 text-warning" />
        <h3 className="text-xl font-semibold text-foreground">Overspending Alerts</h3>
      </div>

      {alerts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No overspending patterns detected right now.</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-md border ${
                alert.severity === 'high'
                  ? 'bg-destructive/10 border-destructive/30'
                  : 'bg-warning/10 border-warning/30'
              }`}
            >
              <p className="text-sm text-foreground">{alert.message}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default OverspendingAlerts;
