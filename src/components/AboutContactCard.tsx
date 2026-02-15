import { Card } from '@/components/ui/card';
import { BookOpen, Mail } from 'lucide-react';

const AboutContactCard = () => {
  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold text-foreground">About Us</h3>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        SpendSmart is built to help students understand money better, track expenses clearly, and
        make smarter day-to-day financial decisions with practical insights.
      </p>

      <div className="mt-5 pt-4 border-t border-border/60">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-secondary" />
          <p className="text-sm font-medium text-foreground">Contact Us</p>
        </div>
        <a
          href="mailto:deeyasharma01@gmail.com"
          className="text-sm text-primary hover:underline"
        >
          deeyasharma01@gmail.com
        </a>
      </div>
    </Card>
  );
};

export default AboutContactCard;
