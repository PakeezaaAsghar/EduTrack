import React, { useState } from 'react';
import { useEduTrack } from '../../context/EduTrackContext';
import { EduTrackLogo } from '../common/EduTrackLogo';
import { RotateCcw, Check, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, resetAllData, currentUser } = useEduTrack();
  const [resetConfirming, setResetConfirming] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (!resetConfirming) {
      setResetConfirming(true);
      setTimeout(() => setResetConfirming(false), 4000);
      return;
    }
    resetAllData();
    setResetConfirming(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const handlePortalClick = (role: 'admin' | 'teacher' | 'student') => {
    if (currentUser?.role === role) {
      navigate(`/${role}`);
    } else {
      navigate('/signin');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <button 
              onClick={() => navigate('/')} 
              className="text-left focus:outline-none"
              aria-label="EduTrack Home"
            >
              <EduTrackLogo size="md" theme="light" />
            </button>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Student Management System. Unifying attendance, grade calculation, conflict detection, and academic reporting in one dependable platform.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md transition-colors ${
                  resetSuccess
                    ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    : resetConfirming
                    ? 'bg-amber-900/60 text-amber-300 border border-amber-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-800'
                }`}
                title="Reset local state to factory default seed data"
              >
                {resetSuccess ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Database Restored</span>
                  </>
                ) : resetConfirming ? (
                  <>
                    <RotateCcw className="w-3 h-3 animate-spin" />
                    <span>Confirm Reset Records?</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Sample Records</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-white transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  About EduTrack
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/features')} className="hover:text-white transition-colors">
                  System Features
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  Support & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Role Portals */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <span>Academic Portals</span>
              <Lock className="w-3 h-3 text-indigo-400" />
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handlePortalClick('admin')} className="hover:text-white transition-colors flex items-center gap-1.5 text-left">
                  <span>Administrator Console</span>
                  {!currentUser && <span className="text-[10px] text-slate-500 font-mono">(Sign In)</span>}
                </button>
              </li>
              <li>
                <button onClick={() => handlePortalClick('teacher')} className="hover:text-white transition-colors flex items-center gap-1.5 text-left">
                  <span>Faculty & Instructor Desk</span>
                  {!currentUser && <span className="text-[10px] text-slate-500 font-mono">(Sign In)</span>}
                </button>
              </li>
              <li>
                <button onClick={() => handlePortalClick('student')} className="hover:text-white transition-colors flex items-center gap-1.5 text-left">
                  <span>Student Academic Portal</span>
                  {!currentUser && <span className="text-[10px] text-slate-500 font-mono">(Sign In)</span>}
                </button>
              </li>
              <li className="pt-1 border-t border-slate-800">
                <button onClick={() => navigate('/signin')} className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Sign In to Account
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/signup')} className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Register New Account
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Standards */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Standards & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
                  Student Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                  Academic Terms of Service
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-500 leading-relaxed">
                Mandatory authentication policy: all portals are secured with institutional credentials and FERPA compliance.
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduTrack — Smart Student Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono tabular-nums text-[11px]">Academic Year 2026-2027</span>
            <span>·</span>
            <span className="font-mono tabular-nums text-[11px]">v3.2 Authenticated</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
