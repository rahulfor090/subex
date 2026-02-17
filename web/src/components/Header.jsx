import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { ModeToggle } from './ModeToggle';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';
import { motion } from 'framer-motion';
import Logo from './Logo';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Security', href: '#security' },
  { label: 'Pricing', href: '#pricing' },
];

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  const handleNavClick = useCallback(
    (e, href) => {
      e.preventDefault();
      closeMobile();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    },
    [closeMobile]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10'
        : 'bg-transparent'
        }`}
    >
      {/* Shimmer Border Effect on Scroll */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
      )}

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center group" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <Logo />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {isAuthenticated && (
              <a
                href="/"
                onClick={(e) => { e.preventDefault(); navigate('/'); }}
                className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-lg"
              >
                Home
              </a>
            )}
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-lg group"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ModeToggle />
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <>
                <Button
                  onClick={() => navigate('/login')}
                  variant="ghost"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 font-medium rounded-lg text-sm"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg px-5 text-sm shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all border-none"
                >
                  Start free trial
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ModeToggle />
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-white/10"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <nav className="py-4 space-y-1 border-t border-zinc-200 dark:border-white/10 bg-white/95 dark:bg-black/95 backdrop-blur-xl rounded-b-2xl px-4 pb-6 mt-2 border-b border-x shadow-xl">
            {isAuthenticated && (
              <a
                href="/"
                onClick={(e) => { e.preventDefault(); closeMobile(); navigate('/'); }}
                className="block px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg font-medium transition-colors text-sm"
              >
                Home
              </a>
            )}
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="block px-4 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg font-medium transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-zinc-200 dark:border-white/10">
              {isAuthenticated ? (
                <div className="px-2">
                  <UserProfile />
                </div>
              ) : (
                <>
                  <Button onClick={() => navigate('/login')} variant="outline" className="w-full rounded-lg h-10 border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white text-sm bg-transparent">
                    Log in
                  </Button>
                  <Button
                    onClick={() => navigate('/register')}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg h-10 text-sm shadow-lg border-none"
                  >
                    Start free trial
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
