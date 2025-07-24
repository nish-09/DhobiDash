import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { 
  Truck, 
  Clock, 
  Shield, 
  Smartphone,
  Users,
  Settings,
  ChevronRight,
  Zap
} from "lucide-react";

const Index = () => {
  const { user, profile } = useAuth();
  
  const features = [
    {
      icon: Clock,
      title: "20-Minute Pickup",
      description: "Lightning fast pickup guaranteed within 20 minutes"
    },
    {
      icon: Shield,
      title: "Premium Care",
      description: "Professional handling of all your garments"
    },
    {
      icon: Truck,
      title: "Real-Time Tracking",
      description: "Track your order from pickup to delivery"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Seamless experience on all devices"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
  <div className="max-w-6xl mx-auto px-6 py-1">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img
          src="/logo.jpg"
          alt="Dhobi Dash Logo"
          className="w-20 h-20"
        />
        <span className="text-3xl font-bold text-primary">Dhobi Dash</span>
      </div>
            <div className="hidden md:flex items-center space-x-6">
              <a
  href="#services"
  className="text-lg font-medium text-muted-foreground hover:text-primary transition-smooth"
>
  Services
</a>
<a
  href="#about"
  className="text-lg font-medium text-muted-foreground hover:text-primary transition-smooth"
>
  About
</a>

            </div>
            <Link to="/auth">
              <Button variant="speed" size="sm">
                {user ? 'Dashboard' : 'Sign In'}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-clean">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
                  Lightning Fast
                  <span className="bg-gradient-speed bg-clip-text text-transparent block">
                    Laundry Service
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Professional laundry pickup and delivery in just 20 minutes. 
                  Track your order in real-time with our mobile-optimized platform.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button variant="speed" size="lg" className="w-full sm:w-auto">
                    <Clock className="w-5 h-5 mr-2" />
                    {user ? 'Go to Dashboard' : 'Get Started Now'}
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Smartphone className="w-5 h-5 mr-2" />
                  Track Your Order
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">20min</div>
                  <div className="text-sm text-muted-foreground">Pickup Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Service</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4.9★</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src="/hero-laundry.jpg" 
                alt="Laundry Hero"
                className="w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-elegant"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-brand">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-speed rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Next Pickup</div>
                    <div className="text-sm text-muted-foreground">In {Math.floor(Math.random() * (20 - 8 + 1)) + 8} minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold text-primary">Why Choose Dhobi Dash?</h2>
            <p className="text-xl text-muted-foreground">Experience the fastest, most reliable laundry service</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-elegant transition-smooth">
                <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="py-20 bg-gradient-clean">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary">Access Your Portal</h2>
            <p className="text-xl text-muted-foreground">Different interfaces for different users</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-elegant transition-smooth group">
              <Users className="w-16 h-16 mx-auto mb-4 text-primary group-hover:scale-110 transition-bounce" />
              <h3 className="font-semibold mb-2">Customer Portal</h3>
              <p className="text-sm text-muted-foreground mb-4">Schedule pickups and track your orders</p>
              <Link to="/auth">
                <Button variant="brand" className="w-full">
                  Access Portal
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>

            <Card className="p-6 text-center hover:shadow-elegant transition-smooth group">
              <Truck className="w-16 h-16 mx-auto mb-4 text-info group-hover:scale-110 transition-bounce" />
              <h3 className="font-semibold mb-2">Driver Dashboard</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage pickups and deliveries</p>
              <Link to="/driver">
                <Button variant="info" className="w-full">
                  Driver Login
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>

            <Card className="p-6 text-center hover:shadow-elegant transition-smooth group">
              <Settings className="w-16 h-16 mx-auto mb-4 text-accent group-hover:scale-110 transition-bounce" />
              <h3 className="font-semibold mb-2">Admin Panel</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage operations and analytics</p>
              <Link to="/admin">
                <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white">
                  Admin Access
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <img
          src="/logo.jpg"
          alt="Dhobi Dash Logo"
          className="w-8 h-8 object-contain"
        />
              <span className="text-xl font-bold">Dhobi Dash</span>
            </div>
            <p className="text-primary-foreground/80">Lightning fast laundry service at your fingertips</p>
            <div className="text-sm text-primary-foreground/60">
              © 2024 Dhobi Dash. Professional laundry services.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;