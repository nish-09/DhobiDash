import { Toaster } from "@/components/ui/sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import React, { useState, useEffect, useMemo, useRef } from "react";
// FloatingLaundryEmojis component and helpers
const laundryEmojis = [
  { symbol: "🧺" },
  { symbol: "🧦" },
  { symbol: "👕" },
  { symbol: "🧼" },
  { symbol: "🩳" },
  { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="#7dd3fc" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" /></svg> },
  { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="#f472b6" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="4" width="16" height="16" rx="4" /></svg> },
  { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,22 2,22" /></svg> },
  { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="#fbbf24" xmlns="http://www.w3.org/2000/svg"><ellipse cx="12" cy="12" rx="10" ry="6" /></svg> },
  { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="#38bdf8" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="12" height="12" rx="3" /></svg> },
];
function getRandom(min, max) { return Math.random() * (max - min) + min; }
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

const queryClient = new QueryClient();

const App = () => (
  <div style={{ cursor: 'url("data:image/svg+xml,%3Csvg width=\'32\' height=\'32\' viewBox=\'0 0 32 32\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'16\' cy=\'16\' r=\'14\' fill=\'%237dd3fc\'/%3E%3Ctext x=\'16\' y=\'22\' text-anchor=\'middle\' font-size=\'18\' fill=\'%23a78bfa\'%3E🧺%3C/text%3E%3C/svg%3E") 16 16, pointer' }}>
    <FloatingLaundryEmojis />
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/customer" element={
              <ProtectedRoute requiredRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/driver" element={
              <ProtectedRoute requiredRole="driver">
                <DriverDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </div>
);

export default App;
