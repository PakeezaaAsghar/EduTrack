import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useEduTrack } from '../../context/EduTrackContext';
import { EduTrackLogo } from '../common/EduTrackLogo';
import { UserProfileView } from './UserProfileView';
import { 
  LayoutDashboard, Users, BookOpen, 
  CheckCircle2, Award, Calendar, AlertTriangle, FileText, 
  Settings, LogOut, Bell, Search, Menu, X, 
  ChevronRight, ArrowLeft, History, Shield, Check,
  UserCircle, Edit3, BarChart3, Sun, Moon, Calculator
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  title: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  title
}) => {
  const { 
    currentUser, logout, 
    navigate, notifications, markNotificationRead, markAllNotificationsRead,
    alerts, darkMode, toggleDarkMode
  } = useEduTrack();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // If no user or wrong route, safeguard
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Authentication is required to view this portal.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-xs"
          >
            Sign In to EduTrack
          </button>
        </div>
      </div>
    );
  }

  // Define tabs based on role
  const getNavItems = () => {
    if (currentUser.role === 'admin') {
      return [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'analytics', label: 'Analytics & Intelligence', icon: BarChart3 },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
        { id: 'grades', label: 'Grades & GPA', icon: Award },
        { id: 'schedule', label: 'Class Schedule', icon: Calendar },
        { id: 'alerts', label: 'Academic Alerts', icon: AlertTriangle, count: alerts.filter(a => !a.resolved).length },
        { id: 'history', label: 'Activity Logs', icon: History },
        { id: 'reports', label: 'Reports & Transcripts', icon: FileText },
        { id: 'profile', label: 'Admin Profile', icon: UserCircle },
        { id: 'settings', label: 'System Settings', icon: Settings },
      ];
    } else if (currentUser.role === 'teacher') {
      return [
        { id: 'overview', label: 'Teacher Overview', icon: LayoutDashboard },
        { id: 'my-courses', label: 'Assigned Courses', icon: BookOpen },
        { id: 'attendance', label: 'Take Roll Call', icon: CheckCircle2 },
        { id: 'gradebook', label: 'Gradebook Entry', icon: Award },
        { id: 'schedule', label: 'Teaching Timetable', icon: Calendar },
        { id: 'alerts', label: 'Student Alerts', icon: AlertTriangle, count: alerts.filter(a => !a.resolved).length },
        { id: 'profile', label: 'Faculty Profile', icon: UserCircle },
      ];
    } else {
      return [
        { id: 'overview', label: 'My Academic Center', icon: LayoutDashboard },
        { id: 'courses', label: 'Enrolled Courses', icon: BookOpen },
        { id: 'attendance', label: 'My Attendance', icon: CheckCircle2 },
        { id: 'grades', label: 'Grades & Transcript', icon: Award },
        { id: 'schedule', label: 'Weekly Schedule', icon: Calendar },
        { id: 'report-card', label: 'Report Card Preview', icon: FileText },
        { id: 'profile', label: 'My Student Profile', icon: UserCircle },
      ];
    }
  };

  const navItems = getNavItems();
  const unreadNotifs = notifications.filter(n => !n.read);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold">Administrator</span>;
      case 'teacher':
        return <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">Faculty Instructor</span>;
      default:
        return <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold">Enrolled Student</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-800 dark:text-slate-100 font-sans">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300"
            aria-label="Toggle navigation drawer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm tracking-tight">EduTrack</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-mono">{currentUser.role}</span>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          
          {/* Top Brand & User Profile */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center text-left focus:outline-none"
                aria-label="EduTrack Home"
              >
                <EduTrackLogo size="sm" theme="light" subtitle="Academic Cloud" />
              </button>
            </div>

            {/* Current User Card */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0 overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser.name.slice(0, 2)}</span>
                  )}
                </div>
                <div className="truncate min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate font-mono">{currentUser.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-0.5 border-t border-slate-800/60">
                <div>{getRoleBadge(currentUser.role)}</div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('profile');
                    setSidebarOpen(false);
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors py-0.5 px-1.5 rounded hover:bg-slate-800"
                  title="Edit My Profile"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Nav list */}
            <nav className="space-y-1 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                      isActive 
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs' 
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && item.count > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Academic Suite Shortcuts */}
            <div className="pt-4 border-t border-slate-800 space-y-1">
              <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                Academic Suite
              </span>
              <button
                onClick={() => navigate('/timetable')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer text-left"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Timetable Radar</span>
              </button>
              <button
                onClick={() => navigate('/planner')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer text-left"
              >
                <Calculator className="w-3.5 h-3.5 text-purple-400" />
                <span>GPA Target Planner</span>
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Public Site</span>
              </button>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar for Desktop */}
        <header className="hidden md:flex items-center justify-between px-6 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-900 dark:text-white capitalize">
              {currentUser.role} Portal
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              {title}
            </span>
          </div>

          {/* Right Header Affordances */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              )}
            </button>

            {/* Notification Center */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* Notification Dropdown with Smooth Animation */}
              <AnimatePresence>
                {notifDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-3 z-50"
                    onMouseLeave={() => setNotifDropdownOpen(false)}
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Academic Notifications</span>
                      {unreadNotifs.length > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-2 pt-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">No notifications present</p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                              n.read 
                                ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400' 
                                : 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 text-slate-900 dark:text-white font-medium'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-xs">{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                              {n.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Mini Tab with Quick Profile Link */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group focus:outline-none cursor-pointer"
                title="View & Edit My Profile"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0 overflow-hidden ring-1 ring-slate-300 dark:ring-slate-700 group-hover:ring-indigo-500 transition-all">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser.name.slice(0, 2)}</span>
                  )}
                </div>
                <div className="text-right text-xs hidden lg:block leading-tight">
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-500 capitalize flex items-center justify-end gap-1">
                    <span>{currentUser.role}</span>
                    <span className="text-indigo-500 font-medium">• Edit Profile</span>
                  </p>
                </div>
              </button>

              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Viewport with Gentle Fade & Slide Reveal */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'profile' ? (
              <UserProfileView onBackToOverview={() => setActiveTab('overview')} />
            ) : (
              children
            )}
          </motion.div>
        </main>

      </div>

    </div>
  );
};
