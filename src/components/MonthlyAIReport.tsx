import { useEffect, useMemo, useState } from 'react';
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
import { Transaction, MonthlyAIReport } from '@/types/finance';
import { generateMonthlyReportHybrid } from '@/lib/aiInsights';

interface MonthlyAIReportProps {
  transactions: Transaction[];
}

const MonthlyAIReport = ({ transactions }: MonthlyAIReportProps) => {
  const [report, setReport] = useState<MonthlyAIReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    generateMonthlyReportHybrid(transactions)
      .then((result) => {
        if (mounted) {
          setReport(result);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [transactions]);

  const graphData = useMemo(() => {
    if (!report) {
      return [];
    }

    const data = report.monthlySeries.map((item) => ({
      month: item.month,
      actual: item.spending,
      forecast: null,
    }));

    if (report.forecastNextMonth !== undefined) {
      if (data.length > 0) {
        data[data.length - 1].forecast = data[data.length - 1].actual;
      }

      data.push({
        month: report.forecastMonthLabel || 'Next month',
        actual: null,
        forecast: Number(report.forecastNextMonth.toFixed(2)),
      });
    }

    return data;
  }, [report]);

  if (loading || !report) {
    return (
      <Card className="p-6 shadow-[var(--shadow-soft)]">
        <div className="animate-pulse space-y-3 text-sm text-foreground">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-64 rounded bg-muted" />
          <div className="h-48 rounded bg-muted" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">Monthly AI Report Generator</h3>
      </div>

      <div className="space-y-3 text-sm text-foreground">
        <p><span className="font-medium">Month:</span> {report.monthLabel}</p>
        <p><span className="font-medium">Total spending:</span> ₹{report.totalSpending.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        <p>
          <span className="font-medium">Biggest category:</span> {report.biggestCategory.name} (₹{report.biggestCategory.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })})
        </p>
        {report.forecastNextMonth !== undefined && (
          <p className="text-sm text-success-foreground">
            <span className="font-medium">Forecast next month:</span> ₹{report.forecastNextMonth.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({report.forecastTrend})
          </p>
        )}
        <p className="p-3 rounded-md bg-muted/40">"{report.summary}"</p>
      </div>

      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: number | string | null) => {
              if (value === null || value === undefined) {
                return '';
              }
              const numberValue = typeof value === 'string' ? Number(value) : value;
              return `₹${numberValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
            }} />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Actual"
            />
            {report.forecastNextMonth !== undefined && (
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                dot={{ r: 3 }}
                strokeDasharray="5 5"
                connectNulls
                name="Forecast"
              />
            )}
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
