import React, { useState, useEffect } from 'react';
import { useEduTrack } from '../../context/EduTrackContext';
import { EduTrackLogo } from '../common/EduTrackLogo';
import { 
  Menu, X, 
  ArrowRight, LogOut, Lock, User as UserIcon, Shield, BookOpen
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout, currentPath, navigate } = useEduTrack();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Features', path: '/features' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!currentUser) return '/signin';
    if (currentUser.role === 'admin') return '/admin';
    if (currentUser.role === 'teacher') return '/teacher';
    return '/student';
  };

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-200 border-b ${
        scrolled 
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs border-slate-200 dark:border-slate-800' 
          : 'bg-white dark:bg-slate-900 border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-6">
          
          {/* Zone 1: Brand Wordmark */}
          <button 
            onClick={() => handleNavClick('/')}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg shrink-0"
            aria-label="EduTrack Home"
          >
            <EduTrackLogo size="md" />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Auth / Dashboard) */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">

            {currentUser ? (
              <div className="flex items-center gap-2.5 pl-1 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-left pr-1">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center text-xs font-bold uppercase overflow-hidden shrink-0">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>{currentUser.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <div className="hidden lg:block leading-tight">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[110px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 capitalize font-mono">
                      {currentUser.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleNavClick(getDashboardPath())}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                >
                  <span>My Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNavClick('/signin')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('/signup')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPath === link.path
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{currentUser.name}</p>
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 uppercase font-mono">{currentUser.role} Portal</p>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="text-xs text-rose-600 font-medium hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
                <button
                  onClick={() => handleNavClick(getDashboardPath())}
                  className="w-full py-2.5 text-center text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <span>Open {currentUser.role} Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Portal access requires signing in or registering.</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavClick('/signin')}
                    className="py-2.5 text-center text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavClick('/signup')}
                    className="py-2.5 text-center text-xs font-semibold text-white bg-indigo-600 rounded-lg"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
