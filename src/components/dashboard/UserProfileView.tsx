import React, { useState } from 'react';
import { useEduTrack } from '../../context/EduTrackContext';
import { 
  User, Mail, Phone, Building, Briefcase, GraduationCap, 
  Lock, KeyRound, Shield, Check, AlertCircle, Camera, 
  Upload, Trash2, Award, Calendar, BookOpen, Clock,
  Sparkles, CheckCircle2, RefreshCw, Eye, EyeOff, MapPin
} from 'lucide-react';

// Curated high quality avatars suitable for academic portals
const PRESET_AVATARS = [
  { label: 'Academic 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  { label: 'Academic 2', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
  { label: 'Student 1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80' },
  { label: 'Student 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { label: 'Faculty 1', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { label: 'Faculty 2', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80' },
  { label: 'Scholar 1', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80' },
  { label: 'Scholar 2', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80' }
];

const DEPARTMENTS = [
  'Computer Science',
  'Software Engineering',
  'Mathematics & Statistics',
  'Electrical & Computer Engineering',
  'Data Science & AI',
  'Physics & Applied Sciences',
  'Business Administration',
  'Academic Administration',
  'Humanities & Social Sciences'
];

interface UserProfileViewProps {
  onBackToOverview?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ onBackToOverview }) => {
  const { currentUser, updateUserProfile, students, courses } = useEduTrack();

  if (!currentUser) {
    return (
      <div className="p-8 text-center text-slate-500">
        Please sign in to view and manage your profile.
      </div>
    );
  }

  // Associated student or course details
  const matchingStudent = currentUser.role === 'student' 
    ? students.find(s => s.id === currentUser.id || s.email === currentUser.email || s.studentId === currentUser.studentId)
    : null;

  const teacherCourses = currentUser.role === 'teacher'
    ? courses.filter(c => c.instructorId === currentUser.id || c.instructorName.includes(currentUser.name) || currentUser.name.includes(c.instructorName))
    : [];

  // Form states
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'photo' | 'security' | 'academic'>('general');
  
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || matchingStudent?.phone || '',
    department: currentUser.department || matchingStudent?.department || 'Computer Science',
    title: currentUser.title || (currentUser.role === 'teacher' ? 'Faculty Instructor' : currentUser.role === 'admin' ? 'Academic Administrator' : 'Student'),
    year: (currentUser.year || matchingStudent?.year || 'Freshman') as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior',
    bio: currentUser.bio || '',
    officeLocation: currentUser.officeLocation || '',
    officeHours: currentUser.officeHours || '',
    emergencyContact: currentUser.emergencyContact || '',
    avatar: currentUser.avatar || matchingStudent?.avatar || ''
  });

  // Password state
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & Feedback states
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (feedback) setFeedback(null);
  };

  // Handle avatar upload via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (PNG, JPG, WebP).' });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Image size should be under 3MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData(prev => ({ ...prev, avatar: event.target?.result as string }));
        setFeedback({ type: 'success', message: 'Photo uploaded! Remember to click "Save Profile Changes" below.' });
      }
    };
    reader.readAsDataURL(file);
  };

  // Submit profile updates
  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    // Validation
    if (!formData.name.trim()) {
      setFeedback({ type: 'error', message: 'Full Name cannot be empty.' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFeedback({ type: 'error', message: 'Please provide a valid institutional email address.' });
      setIsSubmitting(false);
      return;
    }

    // Call context updater
    const result = updateUserProfile({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      department: formData.department,
      title: formData.title.trim(),
      year: currentUser.role === 'student' ? formData.year : undefined,
      bio: formData.bio.trim(),
      officeLocation: formData.officeLocation.trim(),
      officeHours: formData.officeHours.trim(),
      emergencyContact: formData.emergencyContact.trim(),
      avatar: formData.avatar
    });

    setIsSubmitting(false);

    if (result.success) {
      setFeedback({ type: 'success', message: 'Profile information updated successfully across EduTrack!' });
      setTimeout(() => {
        setFeedback(prev => prev?.type === 'success' ? null : prev);
      }, 4000);
    } else {
      setFeedback({ type: 'error', message: result.error || 'Failed to update profile.' });
    }
  };

  // Submit Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (currentUser.password && !passwords.currentPassword) {
      setFeedback({ type: 'error', message: 'Please enter your current password to verify identity.' });
      return;
    }

    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'New password must be at least 6 characters long.' });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setFeedback({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    setIsSubmitting(true);

    const result = updateUserProfile({
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword
    });

    setIsSubmitting(false);

    if (result.success) {
      setFeedback({ type: 'success', message: 'Account password changed securely.' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setFeedback(prev => prev?.type === 'success' ? null : prev);
      }, 4000);
    } else {
      setFeedback({ type: 'error', message: result.error || 'Password update failed.' });
    }
  };

  const getRoleHeaderColor = () => {
    switch (currentUser.role) {
      case 'admin':
        return 'from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30';
      case 'teacher':
        return 'from-slate-900 via-emerald-950 to-slate-900 border-emerald-500/30';
      default:
        return 'from-slate-900 via-blue-950 to-slate-900 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Banner & Profile Overview */}
      <div className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-r ${getRoleHeaderColor()} text-white border shadow-md relative overflow-hidden`}>
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Avatar with live preview & badge */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-800 border-2 border-white/20 shadow-lg overflow-hidden flex items-center justify-center text-3xl font-bold uppercase text-white">
              {formData.avatar ? (
                <img 
                  src={formData.avatar} 
                  alt={formData.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span>{formData.name.slice(0, 2)}</span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActiveSubTab('photo')}
              className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md border border-white/20 transition-transform active:scale-95"
              title="Change Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Details & Credentials */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15">
                {currentUser.role === 'admin' ? '🛡️ Administrator' : currentUser.role === 'teacher' ? '🎓 Faculty Instructor' : '📚 Enrolled Student'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Account
              </span>
              {currentUser.studentId && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">
                  ID: {currentUser.studentId}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {formData.name || 'Your Profile'}
            </h1>

            <p className="text-sm text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
              <span className="font-medium text-white">{formData.title}</span>
              <span>•</span>
              <span>{formData.department}</span>
              {formData.phone && (
                <>
                  <span>•</span>
                  <span>{formData.phone}</span>
                </>
              )}
            </p>

            <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1 font-mono">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{formData.email}</span>
            </p>
          </div>

          {/* Quick return button */}
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 transition-colors self-center sm:self-start shrink-0"
            >
              Back to Overview
            </button>
          )}

        </div>

        {/* Role Metrics Micro Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {currentUser.role === 'student' && matchingStudent && (
            <>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Cumulative GPA</p>
                <p className="text-base font-bold text-white font-mono">{matchingStudent.gpa.toFixed(2)}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Attendance Rate</p>
                <p className="text-base font-bold text-emerald-400 font-mono">{matchingStudent.attendanceRate.toFixed(1)}%</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Class Standing</p>
                <p className="text-base font-bold text-indigo-300">{formData.year}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Enrolled Classes</p>
                <p className="text-base font-bold text-white font-mono">{matchingStudent.enrolledCourses.length} Courses</p>
              </div>
            </>
          )}

          {currentUser.role === 'teacher' && (
            <>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Faculty Status</p>
                <p className="text-base font-bold text-emerald-300">Teaching Faculty</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Active Sections</p>
                <p className="text-base font-bold text-white font-mono">{teacherCourses.length} Courses</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Department</p>
                <p className="text-base font-bold text-indigo-200 truncate">{formData.department}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Office Hours</p>
                <p className="text-base font-bold text-white truncate">{formData.officeHours || 'Configurable'}</p>
              </div>
            </>
          )}

          {currentUser.role === 'admin' && (
            <>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Access Scope</p>
                <p className="text-base font-bold text-indigo-300">Full System Admin</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Authority Level</p>
                <p className="text-base font-bold text-emerald-400">Institutional Officer</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Roster Directory</p>
                <p className="text-base font-bold text-white font-mono">{students.length} Students</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-slate-400 uppercase font-mono">Active Curriculum</p>
                <p className="text-base font-bold text-white font-mono">{courses.length} Courses</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in duration-200 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200' 
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Profile Section Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('general')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeSubTab === 'general'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal & Contact Info</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('photo')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeSubTab === 'photo'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Profile Photo & Avatar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('security')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeSubTab === 'security'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security & Password</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('academic')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeSubTab === 'academic'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Records & Credentials</span>
        </button>
      </div>

      {/* TAB 1: GENERAL & CONTACT INFO */}
      {activeSubTab === 'general' && (
        <form onSubmit={handleSubmitProfile} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Personal Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your official identity, contact numbers, and institutional department. Changes will reflect across attendance, grades, and faculty directories.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Legal / Display Name</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Dr. Jane Smith or Alex Johnson"
                />
              </div>

              {/* Institutional Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Institutional Email Address</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="name@edutrack.edu"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academic Department</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Title / Role Specialization */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Academic Title / Designation</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={currentUser.role === 'teacher' ? 'e.g. Associate Professor' : currentUser.role === 'admin' ? 'e.g. Dean of Students' : 'e.g. Undergraduate Student'}
                />
              </div>

              {/* If Student: Academic Standing Year */}
              {currentUser.role === 'student' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                    <span>Academic Year Standing</span>
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Freshman">Freshman (1st Year)</option>
                    <option value="Sophomore">Sophomore (2nd Year)</option>
                    <option value="Junior">Junior (3rd Year)</option>
                    <option value="Senior">Senior (4th Year)</option>
                  </select>
                </div>
              ) : (
                /* If Teacher or Admin: Office Location */
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Campus Office / Room</span>
                  </label>
                  <input
                    type="text"
                    name="officeLocation"
                    value={formData.officeLocation}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Hall B-204, East Science Wing"
                  />
                </div>
              )}

              {/* Teacher/Admin: Office Hours */}
              {(currentUser.role === 'teacher' || currentUser.role === 'admin') && (
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Office Hours & Consultation Schedule</span>
                  </label>
                  <input
                    type="text"
                    name="officeHours"
                    value={formData.officeHours}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Mon & Wed 2:00 PM - 4:00 PM, or by appointment"
                  />
                </div>
              )}

              {/* Bio / Academic Statement */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bio, Focus Areas & Academic Interests</span>
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="Share a brief overview of your academic focus, research areas, or learning objectives..."
                />
              </div>

              {/* Emergency Contact */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Emergency Contact Details (Optional)</span>
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Contact Name & Relationship — Phone Number"
                />
              </div>

            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: currentUser.name || '',
                    email: currentUser.email || '',
                    phone: currentUser.phone || matchingStudent?.phone || '',
                    department: currentUser.department || matchingStudent?.department || 'Computer Science',
                    title: currentUser.title || (currentUser.role === 'teacher' ? 'Faculty Instructor' : currentUser.role === 'admin' ? 'Academic Administrator' : 'Student'),
                    year: (currentUser.year || matchingStudent?.year || 'Freshman') as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior',
                    bio: currentUser.bio || '',
                    officeLocation: currentUser.officeLocation || '',
                    officeHours: currentUser.officeHours || '',
                    emergencyContact: currentUser.emergencyContact || '',
                    avatar: currentUser.avatar || matchingStudent?.avatar || ''
                  });
                  setFeedback({ type: 'success', message: 'Form values reset to current saved profile.' });
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: PROFILE PHOTO & AVATAR */}
      {activeSubTab === 'photo' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Profile Photo & Avatar Customization
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose your profile appearance. You can upload a photo from your computer, choose from curated academic avatars, or provide an image link.
            </p>
          </div>

          {/* Current Avatar Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="w-24 h-24 rounded-2xl bg-slate-700 border-2 border-indigo-500/50 shadow-md overflow-hidden flex items-center justify-center text-3xl font-bold uppercase text-white shrink-0">
              {formData.avatar ? (
                <img 
                  src={formData.avatar} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{formData.name.slice(0, 2)}</span>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {formData.avatar ? 'Custom Photo Active' : 'Default Initials Icon Active'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports PNG, JPG, or WebP. The photo will automatically scale and center on navigation bars, rosters, and ID badges.
              </p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <label className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer transition-colors flex items-center gap-2 shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </label>

                {formData.avatar && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, avatar: '' }));
                      setFeedback({ type: 'success', message: 'Photo cleared. Click "Save Photo Changes" to commit.' });
                    }}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Curated Preset Avatars */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Or Select from Academic Presets
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {PRESET_AVATARS.map((preset, index) => {
                const isSelected = formData.avatar === preset.url;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, avatar: preset.url }));
                      setFeedback({ type: 'success', message: `Selected ${preset.label}. Remember to save changes.` });
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all p-0.5 group focus:outline-none ${
                      isSelected 
                        ? 'border-indigo-600 ring-2 ring-indigo-500/50 scale-105' 
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                    }`}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.label} 
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" 
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white drop-shadow-md" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL Input */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Or Enter Direct Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="https://example.com/my-photo.jpg"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (customAvatarUrl.trim()) {
                    setFormData(prev => ({ ...prev, avatar: customAvatarUrl.trim() }));
                    setCustomAvatarUrl('');
                    setFeedback({ type: 'success', message: 'Custom image URL applied. Click save to commit.' });
                  }
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl"
              >
                Apply URL
              </button>
            </div>
          </div>

          {/* Save Photo Button */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={() => {
                const res = updateUserProfile({ avatar: formData.avatar });
                if (res.success) {
                  setFeedback({ type: 'success', message: 'Profile photo updated successfully!' });
                }
              }}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Photo Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & PASSWORD */}
      {activeSubTab === 'security' && (
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Account Security & Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your account password. All passwords must contain at least 6 characters. Keep your institutional login confidential.
              </p>
            </div>

            <div className="max-w-lg space-y-4">
              
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Current Password</span>
                  <span className="text-[10px] text-slate-400 font-normal">Required for verification</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter existing password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3.5 py-2.5 pr-10 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Re-enter new password"
                />
              </div>

              {/* Password strength tips */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Security Recommendations</span>
                </p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>Use a unique password not shared with personal email accounts</li>
                  <li>Include uppercase letters, numbers, and symbols for robust security</li>
                  <li>Do not share your faculty or administrative credentials with others</li>
                </ul>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs flex items-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 4: ACADEMIC CREDENTIALS & RECORDS */}
      {activeSubTab === 'academic' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Institutional Status & Authorizations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Verified institutional records, role privileges, and assigned curriculum sections.
            </p>
          </div>

          {/* Student Specific Records */}
          {currentUser.role === 'student' && matchingStudent && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Institutional Student ID</p>
                  <p className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                    {matchingStudent.studentId}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Official University Registrar Roster</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Academic Standing</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white capitalize mt-1">
                    {matchingStudent.status} Status
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">In Good Standing</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Department Roster</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {matchingStudent.department}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Class of {matchingStudent.year}</p>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Enrolled Sections ({matchingStudent.enrolledCourses.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {courses
                    .filter(c => matchingStudent.enrolledCourses.includes(c.id))
                    .map(course => (
                      <div 
                        key={course.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                            {course.code}
                          </span>
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">
                            {course.title}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {course.instructorName} · {course.room}
                          </p>
                        </div>
                        <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {course.credits} Cr
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Teacher Specific Records */}
          {currentUser.role === 'teacher' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Faculty Rank</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {formData.title}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Tenured / Instructional</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Office Location</p>
                  <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    {formData.officeLocation || 'Main Campus'}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Consultation Ready</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Assigned Sections</p>
                  <p className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    {teacherCourses.length} Lecture Offerings
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Active Term</p>
                </div>
              </div>

              {/* Teaching Sections List */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Assigned Lecture Curriculum ({teacherCourses.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teacherCourses.map(course => (
                    <div 
                      key={course.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          {course.code}
                        </span>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {course.title}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {course.scheduleDay} {course.scheduleTime} · {course.room}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300">
                        {course.enrolledCount} Students
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Admin Specific Records */}
          {currentUser.role === 'admin' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Institutional Role</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    System Administrator
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Superuser Permissions</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Security Clearance</p>
                  <p className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
                    Level 5 — Academic Dean
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Policy & Database Control</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Audit Status</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    Active Logging
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Encrypted Event Trails</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 text-xs text-indigo-950 dark:text-indigo-200 space-y-1">
                <p className="font-bold">Administrative Authority Checklist</p>
                <p className="text-[11px] leading-relaxed opacity-90">
                  As an administrator, you possess full authority to edit your administrative contact identity, manage all student enrollments, modify courses and schedule timings, configure attendance threshold policies, and export official academic transcripts.
                </p>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
