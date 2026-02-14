import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { session, login, signup } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    return <Navigate to="/" replace />;
  }

  const fromPath = ((location.state as { from?: { pathname?: string } } | undefined)?.from?.pathname) ?? '/';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (mode === 'signup' && password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Password and confirm password must be the same.',
      });
      return;
    }

    try {
      setSubmitting(true);

      if (mode === 'signup') {
        await signup(email, password);

        toast({
          title: 'Account created',
          description: 'Account created successfully. Please login.',
        });
        setMode('login');
      } else {
        await login(email, password);

        toast({
          title: 'Login successful',
          description: 'Welcome back.',
        });
        navigate(fromPath, { replace: true });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed';
      toast({
        title: 'Auth error',
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_45%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.2),transparent_40%),var(--gradient-background)]">
      <Card className="w-full max-w-md p-6 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Wallet className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">SpendSmart</h1>
            <p className="text-sm text-muted-foreground">Secure access with email and password</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <Button
            type="button"
            variant={mode === 'login' ? 'default' : 'outline'}
            onClick={() => setMode('login')}
          >
            Login
          </Button>
          <Button
            type="button"
            variant={mode === 'signup' ? 'default' : 'outline'}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={6}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
