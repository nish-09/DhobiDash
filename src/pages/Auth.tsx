import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useAuth } from '@/hooks/useAuth';
import { Truck, UserCheck, Shield, Mail, Phone } from 'lucide-react';

export default function Auth() {
  const { user, profile, signUp, signIn, signUpWithMobile, signInWithMobile, verifyOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'customer' | 'driver' | 'admin'>('customer');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('email');
  const [showOtpVerification, setShowOtpVerification] = useState(false);

  // Redirect if already authenticated
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
    setLoading(true);
    
    if (authMethod === 'email') {
      await signIn(email, password);
    } else {
      const result = await signInWithMobile(phone);
      if (!result.error) {
        setShowOtpVerification(true);
      }
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (authMethod === 'email') {
      await signUp(email, password, fullName, role);
    } else {
      const result = await signUpWithMobile(phone, fullName, role);
      if (!result.error) {
        setShowOtpVerification(true);
      }
    }
    setLoading(false);
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await verifyOtp(phone, otp);
    setLoading(false);
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
    <div className="min-h-screen bg-gradient-clean flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant border-0 backdrop-blur-sm bg-white/95">
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
          {showOtpVerification ? (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Enter OTP</h3>
                <p className="text-sm text-muted-foreground">
                  We sent a code to {phone}
                </p>
              </div>
              <form onSubmit={handleOtpVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-digit code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowOtpVerification(false);
                      setOtp('');
                    }}
                  >
                    Back
                  </Button>
                  <Button type="submit" variant="brand" className="flex-1" disabled={loading || otp.length !== 6}>
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : 'Verify'}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-6">
                <div className="flex bg-muted/50 rounded-lg p-1">
                  <Button
                    type="button"
                    variant={authMethod === 'email' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setAuthMethod('email')}
                    className="flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </Button>
                  <Button
                    type="button"
                    variant={authMethod === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setAuthMethod('mobile')}
                    className="flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Mobile</span>
                  </Button>
                </div>
              </div>
              <Tabs defaultValue="signin" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
                </TabsList>
            
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    {authMethod === 'email' ? (
                      <>
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
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="signin-phone">Mobile Number</Label>
                        <Input
                          id="signin-phone"
                          type="tel"
                          placeholder="+1234567890"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    )}
                    <Button type="submit" variant="brand" className="w-full" disabled={loading}>
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{authMethod === 'email' ? 'Signing In...' : 'Sending Code...'}</span>
                        </div>
                      ) : authMethod === 'email' ? 'Sign In' : 'Send Code'}
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
                    {authMethod === 'email' ? (
                      <>
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
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Mobile Number</Label>
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="+1234567890"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    )}
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
                    <Button type="submit" variant="brand" className="w-full" disabled={loading}>
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{authMethod === 'email' ? 'Creating Account...' : 'Sending Code...'}</span>
                        </div>
                      ) : authMethod === 'email' ? 'Create Account' : 'Send Code'}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}