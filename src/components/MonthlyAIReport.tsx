import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Transaction } from '@/types/finance';
import { generateMonthlyAIReport } from '@/lib/aiInsights';

interface MonthlyAIReportProps {
  transactions: Transaction[];
}

const MonthlyAIReport = ({ transactions }: MonthlyAIReportProps) => {
  const report = useMemo(() => generateMonthlyAIReport(transactions), [transactions]);

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">Monthly AI Report Generator</h3>
      </div>

      <div className="space-y-3 text-sm text-foreground">
        <p><span className="font-medium">Month:</span> {report.monthLabel}</p>
        <p><span className="font-medium">Total spending:</span> INR {report.totalSpending.toFixed(2)}</p>
        <p>
          <span className="font-medium">Biggest category:</span> {report.biggestCategory.name} (INR {report.biggestCategory.amount.toFixed(2)})
        </p>
        <p className="p-3 rounded-md bg-muted/40">"{report.summary}"</p>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={report.monthlySeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number) => `INR ${value.toFixed(2)}`} />
            <Line
              type="monotone"
              dataKey="spending"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium mb-2">AI savings tips</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {report.aiSavingsTips.map((tip) => (
            <li key={tip}>- {tip}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium mb-2">Graph insights</p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {report.graphInsights.map((insight) => (
            <li key={insight}>- {insight}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default MonthlyAIReport;
