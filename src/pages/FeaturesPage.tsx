import React from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { 
  Users, BookOpen, CheckCircle, Award, BarChart3, 
  Calendar, FileText, ArrowRight, Download, AlertTriangle, 
  Clock, Shield, Sparkles, Filter 
} from 'lucide-react';
import studentsStemImage from '../assets/images/students_collaborating_stem_1792272726934.jpg';
import teacherAnalyticsImage from '../assets/images/teacher_classroom_analytics_1792272725585.jpg';

export const FeaturesPage: React.FC = () => {
  const { navigate, currentUser } = useEduTrack();

  const handleProtectedAction = (role: 'admin' | 'teacher' | 'student') => {
    if (currentUser && currentUser.role === role) {
      navigate(`/${role}`);
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* Header Banner */}
      <section className="pt-10 sm:pt-14 text-center max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Complete Platform Capabilities
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Engineered for Academic Precision
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Every tool, calculation, and workflow in EduTrack is purpose-built to streamline institutional administrative burdens and foster higher student achievement.
        </p>
      </section>

      {/* FEATURE 1: Student Profiles & Directory (Text Left, Visual Right) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Module 01 · Student Information
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Holistic Student Dossiers & Cohort Directory
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Consolidate full academic life-cycles in unified records. Track matriculation year, enrolled course loads, cumulative GPA trajectory, historical roll calls, and emergency advisor contacts.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold block text-slate-900 dark:text-white">Live Search & Filters</span>
                <span>Sort by department, status, or year</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold block text-slate-900 dark:text-white">Status Triggers</span>
                <span>Active, Academic Warning, or Probation</span>
              </div>
            </div>
            <button
              onClick={() => handleProtectedAction('admin')}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Explore Student Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800">
              <img
                src={studentsStemImage}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/images/students_collaborating_stem_1792272726934.jpg';
                }}
                alt="Students collaborating"
                className="w-full h-[340px] sm:h-[380px] object-cover"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>

      {/* FEATURE 2: Attendance Tracking (Visual Left, Text Right) */}
      <section className="bg-slate-100/60 dark:bg-slate-900/50 py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-100 dark:bg-slate-800">
                <img
                  src={teacherAnalyticsImage}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/images/teacher_classroom_analytics_1792272725585.jpg';
                  }}
                  alt="Teacher recording attendance"
                  className="w-full h-[340px] sm:h-[380px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Module 02 · Roll Call & Attendance
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Frictionless Roll Call & Threshold Enforcement
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Take attendance in seconds with batch checkmarks or granular Present / Late / Absent / Excused designations. Configurable late weighting policies ensure fair attendance percentages.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold block text-slate-900 dark:text-white">Batch Present Option</span>
                  <span>Mark full class in one click</span>
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="font-semibold block text-slate-900 dark:text-white">Automatic Alerts</span>
                  <span>Instant flag when rate &lt; 75%</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/teacher')}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>Try Faculty Attendance Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURE 3: Smart Timetable & Conflict Detection (Full-Width Interactive Showcase) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="max-w-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Module 03 · Timetable Scheduling
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Weekly Timetable Engine with Collision Detection
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Never worry about double-booking a lecture theater or scheduling an instructor for two simultaneous labs. Our conflict detection checks rooms, times, and faculty schedules before saving.
          </p>
        </div>

        {/* Timetable Interactive Grid Preview */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Active Timetable Matrix</h3>
              <p className="text-xs text-slate-500">Hall A-102, Hall B-204, Lab 4-C, and Turing Hall</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Collision Verification: Clear</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <div key={day} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] block">
                  {day}
                </span>
                {day === 'Monday' && (
                  <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                    <p className="font-semibold text-indigo-900 dark:text-indigo-200">CS-201</p>
                    <p className="text-[10px] text-indigo-700 dark:text-indigo-300">09:00 - 10:30 · Hall B-204</p>
                    <p className="text-[9px] text-slate-500">Prof. Reed</p>
                  </div>
                )}
                {day === 'Tuesday' && (
                  <div className="p-2 rounded bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800">
                    <p className="font-semibold text-sky-900 dark:text-sky-200">MATH-220</p>
                    <p className="text-[10px] text-sky-700 dark:text-sky-300">13:30 - 15:00 · Hall A-102</p>
                    <p className="text-[9px] text-slate-500">Dr. Sterling</p>
                  </div>
                )}
                {day === 'Wednesday' && (
                  <>
                    <div className="p-2 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                      <p className="font-semibold text-indigo-900 dark:text-indigo-200">CS-305</p>
                      <p className="text-[10px] text-indigo-700 dark:text-indigo-300">11:00 - 12:30 · Lab 4-C</p>
                      <p className="text-[9px] text-slate-500">Prof. Reed</p>
                    </div>
                    <div className="p-2 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800">
                      <p className="font-semibold text-amber-900 dark:text-amber-200">ENG-108</p>
                      <p className="text-[10px] text-amber-700 dark:text-amber-300">15:30 - 17:00 · Aud C</p>
                      <p className="text-[9px] text-slate-500">Dr. Rostova</p>
                    </div>
                  </>
                )}
                {day === 'Thursday' && (
                  <div className="p-2 rounded bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800">
                    <p className="font-semibold text-purple-900 dark:text-purple-200">CS-410</p>
                    <p className="text-[10px] text-purple-700 dark:text-purple-300">14:00 - 15:30 · Lab 2-A</p>
                    <p className="text-[9px] text-slate-500">Prof. Reed</p>
                  </div>
                )}
                {day === 'Friday' && (
                  <div className="p-2 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
                    <p className="font-semibold text-emerald-900 dark:text-emerald-200">DS-315</p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-300">10:00 - 11:30 · Turing 101</p>
                    <p className="text-[9px] text-slate-500">Dr. Bennett</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE 4 & 5: Gradebook & Official Reports (2 Columns) */}
      <section className="bg-slate-100/60 dark:bg-slate-900/50 py-16 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Weighted Gradebook & Letter Grade Conversion
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Configure assignments, midterm examinations, quizzes, and project milestones with custom percentage weightings. The system calculates running normalized scores, assigns letter grades according to your institutional scale, and updates cumulative GPAs.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>• Transparent calculation breakdown per course</li>
                <li>• Automatic letter grade mapping (A, B, C, D, F)</li>
                <li>• Credit-weighted Grade Point Average</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Official Student Academic Reports & CSV Tools
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Generate clean, formal academic transcript reports with institutional letterheads, dean remarks, course breakdown, and attendance records. Export full rosters to standard CSV or import incoming student cohorts.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>• Print-ready official transcript format</li>
                <li>• Instant CSV student roster export and batch upload</li>
                <li>• Detailed course-by-course attendance logs</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Ready to Experience EduTrack */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Ready to Modernize Your Academic Operations?
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Sign in or register an account to access the authenticated Administrator, Faculty, or Student portal.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate('/signin')}
            className="px-6 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg"
          >
            Sign In to Portal
          </button>
        </div>
      </section>

    </div>
  );
};
