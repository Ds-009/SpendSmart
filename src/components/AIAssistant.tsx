import { Card } from '@/components/ui/card';
import { AIInsight } from '@/types/finance';
import { Sparkles, AlertCircle, Trophy } from 'lucide-react';

interface AIAssistantProps {
  insights: AIInsight[];
}

const AIAssistant = ({ insights }: AIAssistantProps) => {
  const getIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'tip':
        return <Sparkles className="h-5 w-5 text-secondary" />;
      case 'alert':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'achievement':
        return <Trophy className="h-5 w-5 text-success" />;
    }
  };

  const getBgColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'tip':
        return 'bg-secondary/10 border-secondary/20';
      case 'alert':
        return 'bg-warning/10 border-warning/20';
      case 'achievement':
        return 'bg-success/10 border-success/20';
    }
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-6 w-6 text-secondary" />
        <h3 className="text-xl font-semibold text-foreground">AI Assistant</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border ${getBgColor(insight.type)} transition-all hover:shadow-sm`}
          >
            <div className="flex items-start gap-3">
              {getIcon(insight.type)}
              <div className="flex-1">
                <p className="text-sm text-foreground leading-relaxed">
                  {insight.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(insight.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <p className="text-sm font-medium text-foreground mb-2">💡 Quick Tip</p>
        <p className="text-xs text-muted-foreground">
          I'm here to help you manage your finances better! Ask me anything about your spending,
          saving goals, or budgeting strategies.
        </p>
      </div>
    </Card>
  );
};

export default AIAssistant;
