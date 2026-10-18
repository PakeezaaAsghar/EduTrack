import React from 'react';
import { EduTrackProvider, useEduTrack } from './context/EduTrackContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SignInPage, SignUpPage, ForgotPasswordPage } from './pages/AuthPages';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { Lock, ShieldAlert, ArrowRight, UserPlus, LogIn, AlertCircle } from 'lucide-react';

const AuthGateCard: React.FC<{
  portalName: string;
  roleHint: string;
  description: string;
  accentColor: string;
}> = ({ portalName, roleHint, description, accentColor }) => {
  const { navigate } = useEduTrack();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        
        {/* Shield Lock Badge */}
        <div className={`w-14 h-14 rounded-2xl ${accentColor} flex items-center justify-center mx-auto shadow-md ring-8 ring-slate-100 dark:ring-slate-800/60`}>
          <Lock className="w-7 h-7 text-white" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Sign In or Sign Up Required</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {portalName} Is Protected
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            {description}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            Institutional Policy
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            Everyone—including student scholars, faculty professors, administrators, and evaluators testing demo accounts—must first sign in or register before entering any academic portal.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate('/signin')}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to {roleHint}</span>
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border border-slate-300 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Account</span>
          </button>
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          ← Return to Public Homepage
        </button>

      </div>
    </div>
  );
};

const UnauthorizedRoleCard: React.FC<{
  requiredRole: string;
  currentRole: string;
  userName: string;
}> = ({ requiredRole, currentRole, userName }) => {
  const { navigate, logout } = useEduTrack();

  const getTargetDashboard = () => {
    if (currentRole === 'admin') return '/admin';
    if (currentRole === 'teacher') return '/teacher';
    return '/student';
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg p-8 sm:p-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-7 h-7 text-white" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Role Permission Required
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            You are signed in as <strong className="text-slate-900 dark:text-white">{userName}</strong> ({currentRole.toUpperCase()}). This portal strictly requires <strong className="text-slate-900 dark:text-white">{requiredRole.toUpperCase()}</strong> credentials.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => navigate(getTargetDashboard())}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <span>Go to My {currentRole.toUpperCase()} Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={logout}
            className="py-2.5 px-4 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-xl transition-all"
          >
            Sign Out & Switch Account
          </button>
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentPath, currentUser, navigate } = useEduTrack();

  // Route router logic
  const renderView = () => {
    // Protected Admin Route
    if (currentPath === '/admin') {
      if (!currentUser) {
        return (
          <>
            <Navbar />
            <AuthGateCard
              portalName="Administrator Console"
              roleHint="Admin Portal"
              description="Institutional policies, system settings, timetable scheduler, and comprehensive student rosters are restricted to authorized administrators."
              accentColor="bg-slate-900 dark:bg-indigo-600"
            />
            <Footer />
          </>
        );
      }
      if (currentUser.role !== 'admin') {
        return (
          <>
            <Navbar />
            <UnauthorizedRoleCard
              requiredRole="Administrator"
              currentRole={currentUser.role}
              userName={currentUser.name}
            />
            <Footer />
          </>
        );
      }
      return <AdminDashboard />;
    }

    // Protected Teacher Route
    if (currentPath === '/teacher') {
      if (!currentUser) {
        return (
          <>
            <Navbar />
            <AuthGateCard
              portalName="Faculty & Instructor Desk"
              roleHint="Faculty Portal"
              description="Course rosters, session roll call, and weighted gradebook entry require authenticated faculty or instructor credentials."
              accentColor="bg-emerald-600"
            />
            <Footer />
          </>
        );
      }
      if (currentUser.role !== 'teacher' && currentUser.role !== 'admin') {
        return (
          <>
            <Navbar />
            <UnauthorizedRoleCard
              requiredRole="Faculty Instructor"
              currentRole={currentUser.role}
              userName={currentUser.name}
            />
            <Footer />
          </>
        );
      }
      return <TeacherDashboard />;
    }

    // Protected Student Route
    if (currentPath === '/student') {
      if (!currentUser) {
        return (
          <>
            <Navbar />
            <AuthGateCard
              portalName="Student Academic Portal"
              roleHint="Student Portal"
              description="Personal attendance records, itemized grade breakdown, cumulative GPA tracking, and official report cards require verified student authentication."
              accentColor="bg-blue-600"
            />
            <Footer />
          </>
        );
      }
      return <StudentDashboard />;
    }

    // Public & Auth Pages
    switch (currentPath) {
      case '/about':
        return (
          <>
            <Navbar />
            <main><AboutPage /></main>
            <Footer />
          </>
        );
      case '/features':
        return (
          <>
            <Navbar />
            <main><FeaturesPage /></main>
            <Footer />
          </>
        );
      case '/how-it-works':
        return (
          <>
            <Navbar />
            <main><HowItWorksPage /></main>
            <Footer />
          </>
        );
      case '/contact':
        return (
          <>
            <Navbar />
            <main><ContactPage /></main>
            <Footer />
          </>
        );
      case '/faq':
        return (
          <>
            <Navbar />
            <main><FaqPage /></main>
            <Footer />
          </>
        );
      case '/privacy':
        return (
          <>
            <Navbar />
            <main><PrivacyPage /></main>
            <Footer />
          </>
        );
      case '/terms':
        return (
          <>
            <Navbar />
            <main><TermsPage /></main>
            <Footer />
          </>
        );
      case '/signin':
        return (
          <>
            <Navbar />
            <main className="flex-1"><SignInPage /></main>
          </>
        );
      case '/signup':
        return (
          <>
            <Navbar />
            <main className="flex-1"><SignUpPage /></main>
          </>
        );
      case '/forgot-password':
        return (
          <>
            <Navbar />
            <main className="flex-1"><ForgotPasswordPage /></main>
          </>
        );
      default:
        return (
          <>
            <Navbar />
            <main><HomePage /></main>
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-150">
      {renderView()}
    </div>
  );
};

export default function App() {
  return (
    <EduTrackProvider>
      <AppContent />
    </EduTrackProvider>
  );
}
