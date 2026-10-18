import React, { useState } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { UserRole } from '../types';
import { EduTrackLogo } from '../components/common/EduTrackLogo';
import authLibraryImage from '../assets/images/auth_education_library_1792272727886.jpg';
import campusHeroImage from '../assets/images/modern_university_hero_1792343735348.jpg';
import { 
  Eye, EyeOff, ShieldCheck, 
  BookOpen, User as UserIcon, ArrowRight, Lock, 
  AlertCircle, KeyRound, Sparkles
} from 'lucide-react';

export const SignInPage: React.FC = () => {
  const { login, navigate } = useEduTrack();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [presetFilledMessage, setPresetFilledMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPresetFilledMessage('');

    if (!email.trim()) {
      setError('Please provide your registered institutional email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = login(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid credentials entered.');
      }
    }, 350);
  };

  const handleFillCredentials = (presetEmail: string, presetPass: string, roleName: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setError('');
    setPresetFilledMessage(`Populated ${roleName} credentials (${presetEmail}). Click "Sign In to Portal" below to authenticate.`);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-slate-900">
      
      {/* Left Form Column */}
      <div className="md:col-span-7 lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10 space-y-6 max-w-xl mx-auto w-full">
        
        {/* Mobile/Compact Campus Photo Banner (visible on mobile / small screens) */}
        <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden shadow-md md:hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
          <img
            src={authLibraryImage}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/images/auth_education_library_1792272727886.jpg';
            }}
            alt="University Academic Library & Study Hall"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-4 text-white">
            <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Role-Governed Authentication
            </span>
            <p className="text-xs font-bold text-white">
              EduTrack Academic Center
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="text-left focus:outline-none"
            aria-label="EduTrack Home"
          >
            <EduTrackLogo size="md" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
            Sign In to Your Academic Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Access your personalized student, faculty, or administrator workspace.
          </p>
        </div>

        {/* Mandatory Authentication Notice */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-[11px] uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Authentication Policy
            </p>
            <p className="leading-relaxed">
              Every person must first sign in or register before accessing the Admin, Teacher, or Student portal. Direct unauthenticated entry is disabled.
            </p>
          </div>
        </div>

        {presetFilledMessage && (
          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{presetFilledMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Institutional Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@edutrack.edu"
              className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Remember this workstation</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <span>Verifying credentials...</span> : <span>Sign In to Portal</span>}
          </button>
        </form>

        {/* Directory Sample Accounts Helper: Only fills form, user must click Sign In */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Sample Directory Accounts
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Click to populate fields
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleFillCredentials('admin@edutrack.edu', 'admin123', 'Administrator')}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-left transition-colors bg-slate-50 dark:bg-slate-800/50 group"
            >
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Admin</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">admin@edutrack.edu</p>
              <p className="text-[9px] text-slate-400 font-mono">admin123</p>
            </button>

            <button
              type="button"
              onClick={() => handleFillCredentials('teacher@edutrack.edu', 'teacher123', 'Faculty')}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-left transition-colors bg-slate-50 dark:bg-slate-800/50 group"
            >
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Teacher</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">teacher@edutrack.edu</p>
              <p className="text-[9px] text-slate-400 font-mono">teacher123</p>
            </button>

            <button
              type="button"
              onClick={() => handleFillCredentials('student@edutrack.edu', 'student123', 'Student')}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-left transition-colors bg-slate-50 dark:bg-slate-800/50 group"
            >
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <UserIcon className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Student</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">student@edutrack.edu</p>
              <p className="text-[9px] text-slate-400 font-mono">student123</p>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center italic">
            Note: Selecting a sample account fills the inputs above. Click &quot;Sign In to Portal&quot; to authenticate.
          </p>
        </div>

        <div className="text-center text-xs text-slate-500 pt-1">
          <span>Don&apos;t have an account yet? </span>
          <button
            onClick={() => navigate('/signup')}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Register as Student, Teacher, or Admin
          </button>
        </div>

      </div>

      {/* Right Column: Visual Side Panel (visible on tablet and desktop md:) */}
      <div className="hidden md:block md:col-span-5 lg:col-span-6 relative bg-slate-900 min-h-[500px] overflow-hidden">
        <img
          src={authLibraryImage}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/images/auth_education_library_1792272727886.jpg';
          }}
          alt="Modern campus library"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex flex-col justify-end p-10 lg:p-14 text-white">
          <div className="max-w-md space-y-3 relative z-10">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Role-Governed Authentication
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold">
              Secure, Transparent, and Synchronized Campus Life.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Serving faculty instructors, administrative deans, and enrolled students with verified academic records and zero unauthenticated data leaks.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export const SignUpPage: React.FC = () => {
  const { registerUser, navigate } = useEduTrack();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [studentYear, setStudentYear] = useState<'Freshman' | 'Sophomore' | 'Junior' | 'Senior'>('Freshman');
  const [academicTitle, setAcademicTitle] = useState('Associate Professor');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter your full legal name.');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setError('Please enter a valid institutional email address.');
    if (password.length < 6) return setError('Password must contain at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (!agreed) return setError('You must agree to the academic terms of service.');

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const res = registerUser(name, email, selectedRole, password, {
        department,
        title: selectedRole === 'teacher' ? academicTitle : selectedRole === 'admin' ? 'Academic Administrator' : 'Undergraduate Student',
        studentYear
      });
      if (!res.success) {
        setError(res.error || `Failed to create ${selectedRole} account.`);
      }
    }, 400);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] grid grid-cols-1 md:grid-cols-12 bg-white dark:bg-slate-900">
      
      {/* Visual Left on SignUp (visible on tablet and desktop md:) */}
      <div className="hidden md:block md:col-span-5 relative bg-slate-900 min-h-[500px] overflow-hidden">
        <img
          src={campusHeroImage}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/assets/images/modern_university_hero_1792343735348.jpg';
          }}
          alt="Modern university campus and academic center"
          className="w-full h-full object-cover absolute inset-0"
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex flex-col justify-end p-10 lg:p-14 text-white">
          <div className="max-w-md space-y-3 relative z-10">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Unified Academic Registration
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold">
              Join Your Academic Community.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Create a personalized portal for students, faculty, or staff. Every new account is verified into the institutional directory with full permissions.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Column */}
      <div className="md:col-span-7 flex flex-col justify-center px-6 sm:px-12 lg:px-14 py-10 space-y-5 max-w-2xl mx-auto w-full">
        
        {/* Mobile/Compact Campus Photo Banner (visible on mobile / small screens) */}
        <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden shadow-md md:hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
          <img
            src={campusHeroImage}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/images/modern_university_hero_1792343735348.jpg';
            }}
            alt="Modern university campus and academic center"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-4 text-white">
            <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              EduTrack Campus Registration
            </span>
            <p className="text-xs font-bold text-white">
              Create Student, Teacher, or Admin Account
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="text-left focus:outline-none"
            aria-label="EduTrack Home"
          >
            <EduTrackLogo size="md" />
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
            Create Your Academic Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your academic role to provision your secure portal workspace.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Select Your Role *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedRole('student')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRole === 'student'
                  ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <UserIcon className="w-4 h-4" />
                <span className="text-xs font-bold">Student</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Undergraduate / Graduate</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('teacher')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRole === 'teacher'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-bold">Teacher</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Faculty & Instructors</p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedRole === 'admin'
                  ? 'border-slate-900 bg-slate-100 dark:bg-slate-800 dark:border-slate-600 ring-2 ring-slate-400/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold">Admin</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Registrar & Deans</p>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedRole === 'teacher' ? 'e.g. Prof. David Miller' : selectedRole === 'admin' ? 'e.g. Dr. Karen Vance' : 'e.g. Maya Lin'}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={`e.g. ${name.toLowerCase().replace(/\s+/g, '.') || 'user'}@${selectedRole === 'student' ? 'student.' : ''}edutrack.edu`}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              />
            </div>
          </div>

          {/* Role-specific details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Business Administration">Business Administration</option>
                <option value="Academic Affairs">Academic Affairs (Admin)</option>
              </select>
            </div>

            {selectedRole === 'student' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Year Level *
                </label>
                <select
                  value={studentYear}
                  onChange={(e) => setStudentYear(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                >
                  <option value="Freshman">Freshman (1st Year)</option>
                  <option value="Sophomore">Sophomore (2nd Year)</option>
                  <option value="Junior">Junior (3rd Year)</option>
                  <option value="Senior">Senior (4th Year)</option>
                </select>
              </div>
            ) : selectedRole === 'teacher' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Faculty Title *
                </label>
                <select
                  value={academicTitle}
                  onChange={(e) => setAcademicTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                >
                  <option value="Professor">Professor</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Assistant Professor">Assistant Professor</option>
                  <option value="Lecturer">Lecturer</option>
                  <option value="Teaching Assistant">Teaching Assistant</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Administrative Title
                </label>
                <input
                  type="text"
                  readOnly
                  value="Academic Administrator"
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 cursor-not-allowed shadow-xs"
                />
              </div>
            )}
          </div>

          <label className="flex items-start gap-2 pt-1 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
            />
            <span>
              I agree to the <button type="button" onClick={() => navigate('/terms')} className="text-indigo-600 dark:text-indigo-400 underline">Terms of Academic Service</button> and <button type="button" onClick={() => navigate('/privacy')} className="text-indigo-600 dark:text-indigo-400 underline">FERPA Privacy Notice</button>.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 ${
              selectedRole === 'student'
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : selectedRole === 'teacher'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500'
            }`}
          >
            {loading ? (
              <span>Provisioning {selectedRole} account...</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Create {selectedRole.toUpperCase()} Account & Enter Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-1">
          <span>Already registered? </span>
          <button
            onClick={() => navigate('/signin')}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Sign In here
          </button>
        </div>

      </div>

    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const { navigate } = useEduTrack();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please provide a valid institutional email.');
      return;
    }
    setError('');
    setStep('reset');
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length < 4) {
      setError('Please enter the 4-digit verification code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    setError('');
    setStep('done');
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        
        <div className="text-center space-y-3">
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="inline-block focus:outline-none"
            aria-label="EduTrack Home"
          >
            <EduTrackLogo size="md" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            {step === 'request' && 'Reset Institutional Password'}
            {step === 'reset' && 'Enter Verification Code'}
            {step === 'done' && 'Password Updated'}
          </h1>
          <p className="text-xs text-slate-500">
            {step === 'request' && 'Enter your university email to receive a password recovery dispatch.'}
            {step === 'reset' && `We sent a security dispatch to ${email}. Enter code and new password.`}
            {step === 'done' && 'Your credentials have been securely updated. You can now sign in.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-300">
            {error}
          </div>
        )}

        {step === 'request' && (
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Institutional Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. s.jenkins@edutrack.edu"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Send Security Code
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                4-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="1234"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-center font-mono tracking-widest text-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Update Password
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/signin')}
              className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
            >
              Proceed to Sign In
            </button>
          </div>
        )}

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('/signin')}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
          >
            ← Back to Sign In
          </button>
        </div>

      </div>
    </div>
  );
};
