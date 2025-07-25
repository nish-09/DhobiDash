import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Truck, UserCheck, Shield, Mail } from 'lucide-react';

export default function Auth() {
  const { user, profile, signUp, signIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'driver' | 'admin'>('customer');
  const [formLoading, setFormLoading] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setTimedOut(true), 8000); // 8 seconds
    return () => clearTimeout(timer);
  }, [loading]);

  // Fallback UI if user is set but profile is missing after loading
  if (!loading && user && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/80 animate-fade-in">
        <div className="flex flex-col items-center">
          <span className="text-lg text-primary mb-2">No profile found for this user.</span>
          <span className="text-sm text-muted-foreground">Please contact support or try signing up again.</span>
        </div>
      </div>
    );
  }
  if (loading && !timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/80 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <span className="text-lg text-primary">Loading...</span>
        </div>
      </div>
    );
  }
  if (loading && timedOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white/80 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <span className="text-lg text-primary mb-2">Still loading...</span>
          <span className="text-sm text-muted-foreground">This is taking longer than usual. Please check your internet connection or try again later.</span>
        </div>
      </div>
    );
  }
  if (user && profile) {
    switch (profile.role) {
      case 'customer':
        return <Navigate to="/customer" replace />;
      case 'driver':
        return <Navigate to="/driver" replace />;
      case 'admin':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    await signIn(email, password);
    setFormLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    
    await signUp(email, password, fullName, role);
    setFormLoading(false);
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'customer':
        return <UserCheck className="w-5 h-5" />;
      case 'driver':
        return <Truck className="w-5 h-5" />;
      case 'admin':
        return <Shield className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(circle, rgba(219, 247, 255, 1) 0%, rgba(245, 213, 245, 1) 100%)' }}>
      <Card className="w-full max-w-md shadow-2xl border-2 border-white/60 backdrop-blur-3xl bg-transparent">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-primary">DhobiDash</CardTitle>
            <CardDescription className="text-base">20-minute laundry pickup & delivery</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs defaultValue="signin" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" variant="brand" className="w-full" disabled={formLoading}>
                  {formLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">I want to join as a:</Label>
                  <Select value={role} onValueChange={(value: 'customer' | 'driver' | 'admin') => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon('customer')}
                          <span>Customer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="driver">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon('driver')}
                          <span>Driver</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon('admin')}
                          <span>Admin</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" variant="brand" className="w-full" disabled={formLoading}>
                  {formLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}