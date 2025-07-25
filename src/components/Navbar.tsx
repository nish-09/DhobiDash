import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu } from "lucide-react";
import React, { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLanding = location.pathname === "/";

  return (
    <nav className="border-b sticky top-0 z-50 backdrop-blur-sm bg-white/30" style={{ background: 'radial-gradient(circle, rgba(182, 232, 242, 0.85) 0%, rgba(255, 191, 255, 0.85) 100%)', WebkitBackdropFilter: 'blur(4px)', backdropFilter: 'blur(4px)' }}>
      <div className="max-w-6xl mx-auto px-6 py-1">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 group"
            onClick={e => {
              if (location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <img
              src="/logo.jpg"
              alt="DhobiDash Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 transition-all duration-200 group-hover:scale-105"
            />
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-primary transition-all duration-200">DhobiDash</span>
          </Link>
          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 md:gap-4 whitespace-nowrap">
            {isLanding ? (
              <>
                <a
                  href="#about"
                  className="text-lg font-medium text-muted-foreground hover:text-primary transition-smooth"
                >
                  About
                </a>
                <a
                  href="#portal"
                  className="text-lg font-medium text-muted-foreground hover:text-primary transition-smooth"
                >
                  Portal
                </a>
                <a
                  href="#contact"
                  className="text-lg font-medium text-muted-foreground hover:text-primary transition-smooth"
                >
                  Contact
                </a>
                <Link to="/auth">
                  <Button variant="speed" size="sm">
                    {user ? 'Dashboard' : 'Sign In'}
                  </Button>
                </Link>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            )}
          </div>
          {/* Mobile Hamburger */}
          <div className="sm:hidden flex items-center">
            <button
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              <Menu className="w-7 h-7 text-primary" />
            </button>
            {menuOpen && (
              <div className="absolute right-4 top-16 bg-white/90 rounded-xl shadow-lg py-2 px-4 flex flex-col space-y-2 z-50 min-w-[140px] border border-primary/10 animate-fade-in">
                {isLanding ? (
                  <>
                    <a
                      href="#about"
                      className="text-base font-medium text-muted-foreground hover:text-primary transition-smooth py-1"
                      onClick={() => setMenuOpen(false)}
                    >
                      About
                    </a>
                    <a
                      href="#portal"
                      className="text-base font-medium text-muted-foreground hover:text-primary transition-smooth py-1"
                      onClick={() => setMenuOpen(false)}
                    >
                      Portal
                    </a>
                    <a
                      href="#contact"
                      className="text-base font-medium text-muted-foreground hover:text-primary transition-smooth py-1"
                      onClick={() => setMenuOpen(false)}
                    >
                      Contact
                    </a>
                    <Link to="/auth" onClick={() => setMenuOpen(false)}>
                      <Button variant="speed" size="sm" className="w-full">
                        {user ? 'Dashboard' : 'Sign In'}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { setMenuOpen(false); signOut(); }}>
                    Sign Out
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 