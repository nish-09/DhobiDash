import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Truck,
  Clock,
  Shield,
  Smartphone,
  Users,
  Settings,
  ChevronRight,
  Zap,
  Linkedin,
  Github,
  Instagram,
  Mail,
  Menu
} from "lucide-react";
import CountUp from "react-countup";
import { Typewriter } from 'react-simple-typewriter';

const laundryEmojis = [
  { symbol: "🧺" },
  { symbol: "🧦" },
  { symbol: "👕" },
  { symbol: "🧼" },
  { symbol: "🩳" },
  { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="#7dd3fc" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" /></svg> }, // blue
  { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="#f472b6" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="4" /></svg> }, // pink
  { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,22 2,22" /></svg> }, // purple
  { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="#fbbf24" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="12" rx="10" ry="6" /></svg> }, // yellow
  { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="#38bdf8" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="12" height="12" rx="3" /></svg> }, // cyan
];

function getRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const NUM_FLOATERS = 18;

const FloatingLaundryEmojis = () => {
  const floatersRef = useRef(
    Array.from({ length: NUM_FLOATERS }).map((_, i) => {
      const item = laundryEmojis[Math.floor(Math.random() * laundryEmojis.length)];
      const size = getRandom(28, 40);
      const x = getRandom(0, 100);
      const y = getRandom(0, 80);
      const angle = getRandom(0, 2 * Math.PI);
      const speed = getRandom(0.025, 0.06);
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;
      return { key: i, item, x, y, dx, dy, size };
    })
  );
  const [, forceRerender] = useState(0);

  useEffect(() => {
    let running = true;
    function animate() {
      if (!running) return;
      floatersRef.current = floatersRef.current.map(f => {
        let { x, y, dx, dy, size } = f;
        x += dx;
        y += dy;
        if (x < 0) { x = 0; dx = -dx; }
        if (x > 100) { x = 100; dx = -dx; }
        if (y < 0) { y = 0; dy = -dy; }
        if (y > 90) { y = 90; dy = -dy; }
        // Round to 2 decimals for less jitter
        return { ...f, x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100, dx, dy };
      });
      forceRerender(v => v + 1);
      requestAnimationFrame(animate);
    }
    animate();
    return () => { running = false; };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {floatersRef.current.map(({ key, item, x, y, size }) => (
        <span
          key={key}
          style={{
            left: `${x}%`,
            top: `${y}vh`,
            fontSize: item.symbol ? `${size}px` : undefined,
            width: item.svg ? `${size}px` : undefined,
            height: item.svg ? `${size}px` : undefined,
            position: 'absolute',
            zIndex: 0,
            opacity: 0.32,
            transition: 'none',
            willChange: 'transform',
            userSelect: 'none',
          }}
        >
          {item.symbol ? item.symbol : item.svg}
        </span>
      ))}
    </div>
  );
};

const Index = () => {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [counterKey, setCounterKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const phrases = [
    'Lightning Fast Laundry Service',
    'Schedule in Seconds',
    'Clean in a Click',
    'You Chill, We Clean',
    'Stain-Free Guarantee',
    'Fresh & Fragrant',
  ];
  function shuffle(arr: string[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const [shuffledPhrases, setShuffledPhrases] = useState(() => shuffle(phrases));
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const phraseIdxRef = useRef(0);
  const [loopCount, setLoopCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounterKey((k) => k + 1);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

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

  const phraseColors = [
    'text-blue-900', // navy blue
    'text-orange-600',
  ];

  const getPhraseColor = (phrase: string, idx: number) => {
    // Alternate or randomize color for each phrase
    return phraseColors[idx % phraseColors.length];
  };

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle, rgba(219, 247, 255, 1) 0%, rgba(245, 213, 245, 1) 100%)', cursor: 'url("data:image/svg+xml,%3Csvg width=\'32\' height=\'32\' viewBox=\'0 0 32 32\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'14\' fill=\'%237dd3fc\'/%3E%3Ctext x=\'16\' y=\'22\' text-anchor=\'middle\' font-size=\'18\' fill=\'%23a78bfa\'%3E🧺%3C/text%3E%3C/svg%3E") 16 16, pointer' }}>
      <FloatingLaundryEmojis />
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-primary leading-tight">
                  <span className="block min-h-[3.5rem] text-primary">
                    <Typewriter
                      words={shuffledPhrases}
                      loop={0}
                      cursor
                      cursorStyle="_"
                      typeSpeed={60}
                      deleteSpeed={40}
                      delaySpeed={1800}
                      onLoopDone={() => {
                        setShuffledPhrases(shuffle(phrases));
                        setLoopCount(l => l + 1);
                        setCurrentPhraseIdx(0);
                      }}
                      onType={(count) => {
                        if (count === 1) {
                          setCurrentPhraseIdx(idx => (idx + 1) % shuffledPhrases.length);
                        }
                      }}
                    />
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Professional laundry pickup and delivery in just 20 minutes.
                  Track your order in real-time with our mobile-optimized platform.
                </p>
              </div>

              {/* Outer Flex Column Container */}
              <div className="flex flex-col items-center justify-center gap-4">
                {/* 1. Buttons Row */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xl">
                  <div className="flex-1 w-full">
                    <Link to="/auth" className="block w-full">
                      <Button variant="speed" size="lg" className="w-full h-14">
                        <Clock className="w-5 h-5 mr-2" />
                        {user ? 'Go to Dashboard' : 'Get Started Now'}
                      </Button>
                    </Link>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="bg-white/30 backdrop-blur-md border border-white/30 rounded-2xl p-3 shadow-brand flex items-center space-x-3 w-full justify-center mx-auto h-14">
                      <div className="w-10 h-10 bg-gradient-speed rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-base">Next Pickup</div>
                        <div className="text-xs text-muted-foreground">
                          In {Math.floor(Math.random() * (20 - 8 + 1)) + 8} minutes
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 3. Stats Row */}
                <div className="flex flex-row items-center justify-center gap-2 sm:gap-4 w-full max-w-xl">
                  <div className="text-center px-2 py-1 sm:px-4 sm:py-2 bg-white/30 rounded-xl shadow-sm flex-1">
                    <div className="font-bold text-base sm:text-2xl text-primary">
                      <CountUp key={counterKey + '-20'} start={45} end={20} duration={5} />min
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Pickup Time</div>
                  </div>
                  <div className="text-center px-2 py-1 sm:px-4 sm:py-2 bg-white/30 rounded-xl shadow-sm flex-1">
                    <div className="font-bold text-base sm:text-2xl text-primary">
                      <CountUp key={counterKey + '-24'} end={24} duration={1.5} />/<CountUp key={counterKey + '-7'} end={7} duration={1.5} />
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Service</div>
                  </div>
                  <div className="text-center px-2 py-1 sm:px-4 sm:py-2 bg-white/30 rounded-xl shadow-sm flex-1">
                    <div className="font-bold text-base sm:text-2xl text-primary">
                      <CountUp key={counterKey + '-4.9'} end={4.9} duration={1.5} decimals={1} />★
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Rating</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wrap image and card in a flex-col container for centering on mobile */}
            <div className="relative flex flex-col items-center">
              <img
                src="/hero-laundry.jpg"
                alt="Laundry Hero"
                className="w-full h-72 sm:h-80 md:h-96 lg:h-[500px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold text-primary">Why Choose DhobiDash?</h2>
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
      <section id="portal" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary">Access Your Portal</h2>
            <p className="text-xl text-muted-foreground">Different interfaces for different users</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center hover:shadow-elegant transition-smooth group">
              <Users className="w-16 h-16 mx-auto mb-4 text-primary group-hover:scale-110 transition-bounce" />
              <h3 className="font-semibold mb-2">Customer Portal</h3>
              <p className="text-sm text-muted-foreground mb-4">Manage pickups & orders</p>
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

      {/* Contact Us Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary">Contact Us</h2>
            <p className="text-xl text-muted-foreground">Connect with our team</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Person 1 */}
            <div className="bg-white/70 rounded-2xl p-6 shadow-elegant text-center">
              <div className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-full object-cover" />
                Nishit Parikh
              </div>
              <div className="flex justify-center gap-4 text-2xl">
                <a href="mailto:nishit.parikh9@gmail.com" aria-label="Mail" className="group relative rounded-full bg-purple-100 hover:bg-purple-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Mail className="text-purple-600 group-hover:text-purple-800 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-purple-600 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">Mail</span>
                </a>
                <a href="https://www.linkedin.com/in/nishit-parikh-390785329" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group relative rounded-full bg-blue-100 hover:bg-blue-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Linkedin className="text-blue-600 group-hover:text-blue-800 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-blue-600 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">LinkedIn</span>
                </a>
                <a href="https://github.com/nish-09" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="group relative rounded-full bg-gray-100 hover:bg-gray-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Github className="text-gray-700 group-hover:text-black transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-gray-700 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">GitHub</span>
                </a>
                <a href="https://instagram.com/nishitparikh_" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group relative rounded-full bg-pink-100 hover:bg-pink-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Instagram className="text-pink-500 group-hover:text-pink-700 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-pink-500 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">Instagram</span>
                </a>
              </div>
            </div>
            {/* Person 2 */}
            <div className="bg-white/70 rounded-2xl p-6 shadow-elegant text-center">
              <div className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-full object-cover" />
                Darshika Singh
              </div>
              <div className="flex justify-center gap-4 text-2xl">
                <a href="mailto:darshikasinghhh@gmail.com" aria-label="Mail" className="group relative rounded-full bg-purple-100 hover:bg-purple-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Mail className="text-purple-600 group-hover:text-purple-800 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-purple-600 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">Mail</span>
                </a>
                <a href="https://linkedin.com/in/darshika-singh-762636329" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group relative rounded-full bg-blue-100 hover:bg-blue-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Linkedin className="text-blue-600 group-hover:text-blue-800 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-blue-600 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">LinkedIn</span>
                </a>
                <a href="https://github.com/darshikasingh0905" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="group relative rounded-full bg-gray-100 hover:bg-gray-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Github className="text-gray-700 group-hover:text-black transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-gray-700 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">GitHub</span>
                </a>
                <a href="https://instagram.com/darshika.singh" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group relative rounded-full bg-pink-100 hover:bg-pink-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Instagram className="text-pink-500 group-hover:text-pink-700 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-pink-500 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">Instagram</span>
                </a>
              </div>
            </div>
            {/* Person 3 */}
            <div className="bg-white/70 rounded-2xl p-6 shadow-elegant text-center">
              <div className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-full object-cover" />
                Madhavi Panjwani
              </div>
              <div className="flex justify-center gap-4 text-2xl">
                <a href="mailto:writetomads11@gmail.com
" aria-label="Mail" className="group relative rounded-full bg-purple-100 hover:bg-purple-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Mail className="text-purple-600 group-hover:text-purple-800 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-purple-600 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">Mail</span>
                </a>
                <a href="https://www.linkedin.com/in/madhavi-panjwani-0385a826b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group relative rounded-full bg-blue-100 hover:bg-blue-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Linkedin className="text-blue-600 group-hover:text-blue-800 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-blue-600 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">LinkedIn</span>
                </a>
                <a href="https://github.com/madhaviiip" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="group relative rounded-full bg-gray-100 hover:bg-gray-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Github className="text-gray-700 group-hover:text-black transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-gray-700 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">GitHub</span>
                </a>
                <a href="https://instagram.com/madspanjwani" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group relative rounded-full bg-pink-100 hover:bg-pink-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Instagram className="text-pink-500 group-hover:text-pink-700 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-pink-500 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">Instagram</span>
                </a>
              </div>
            </div>
            {/* Person 4 */}
            <div className="bg-white/70 rounded-2xl p-6 shadow-elegant text-center">
              <div className="text-xl font-semibold mb-2 flex items-center justify-center gap-2">
                <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-full object-cover" />
                Shiven Shetty
              </div>
              <div className="flex justify-center gap-4 text-2xl">
                <a href="mailto:david@example.com" aria-label="Mail" className="group relative rounded-full bg-purple-100 hover:bg-purple-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Mail className="text-purple-600 group-hover:text-purple-800 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-purple-600 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">Mail</span>
                </a>
                <a href="https://linkedin.com/in/davidkim" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group relative rounded-full bg-blue-100 hover:bg-blue-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Linkedin className="text-blue-600 group-hover:text-blue-800 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-blue-600 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">LinkedIn</span>
                </a>
                <a href="https://github.com/davidkim" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="group relative rounded-full bg-gray-100 hover:bg-gray-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Github className="text-gray-700 group-hover:text-black transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-gray-700 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">GitHub</span>
                </a>
                <a href="https://instagram.com/davidkim" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group relative rounded-full bg-pink-100 hover:bg-pink-300 p-2 transition-all shadow-sm transform hover:scale-125 duration-200">
                  <Instagram className="text-pink-500 group-hover:text-pink-700 transition-colors duration-200" />
                  <span className="absolute left-1/2 -bottom-7 -translate-x-1/2 text-xs bg-pink-500 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 pointer-events-none">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ background: 'radial-gradient(circle, rgba(182, 232, 242, 1) 0%, rgba(255, 191, 255, 1) 100%)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <img
                src="/logo.jpg"
                alt="DhobiDash Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-gray-800">DhobiDash</span>
            </div>
            <p className="text-primary">Lightning fast laundry service at your fingertips</p>
            <div className="text-sm text-primary/80">
              © 2025 DhobiDash. Professional laundry services.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;