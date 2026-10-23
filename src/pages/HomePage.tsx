import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useEduTrack } from '../context/EduTrackContext';
import { HeroDashboardPreview } from '../components/home/HeroDashboardPreview';
import { 
  ScrollProgressBar, 
  RevealOnScroll, 
  StaggerContainer, 
  StaggerItem, 
  InteractiveCard, 
  InteractiveCTAButton, 
  FloatingBadge,
  AnimatedCounter,
  SectionHeading
} from '../components/common/MotionComponents';
import { 
  Users, BookOpen, CheckCircle, BarChart3, 
  Calendar, Award, ArrowRight, ShieldCheck, 
  GraduationCap, ChevronDown, Sparkles, Check,
  AlertTriangle, Clock, RefreshCw, Star, Layers, 
  Activity, Lock, Sliders, CheckCircle2, Shield, 
  Zap, ArrowUpRight, School, Laptop
} from 'lucide-react';

import authLibraryImage from '../assets/images/auth_education_library_1792272727886.jpg';
import teacherAnalyticsImage from '../assets/images/teacher_classroom_analytics_1792272725585.jpg';
import studentsStemImage from '../assets/images/students_collaborating_stem_1792272726934.jpg';
import campusHeroImage from '../assets/images/modern_university_hero_1792343735348.jpg';

// Campus Live Marquee Ticker
const CampusLiveTicker: React.FC = () => {
  const tickerItems = [
    { icon: '🟢', text: 'Live Timetable Radar: 0 Room & Faculty Collisions across 48 Lecture Halls' },
    { icon: '⚡', text: '10-Second Digital Roll Call: Average completion in 8.4s per course roster' },
    { icon: '🎓', text: 'Weighted Assessment Engine: Automated GPA 4.0 letter grade mapping active' },
    { icon: '🛡️', text: 'FERPA Segregation: Strict role-isolated permissions for 4,800+ scholars' },
    { icon: '📈', text: 'Spring Semester Health: 99.4% overall campus attendance compliance' },
  ];

  return (
    <div className="relative w-full overflow-hidden py-2 bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-y border-indigo-500/20 text-xs text-slate-300">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 px-3 py-0.5 bg-indigo-600/80 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-r-md shrink-0 shadow-xs z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-0.5" />
          Campus Pulse
        </div>
        <div className="overflow-hidden whitespace-nowrap flex-1 relative mask-linear">
          <div className="animate-marquee flex items-center gap-8 pl-4">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <div key={idx} className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-default">
                <span>{item.icon}</span>
                <span className="font-medium">{item.text}</span>
                <span className="text-slate-600 ml-4 font-bold">/</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Animated rotating text component for hero headline with kinetic word transition & badge
const AnimatedTextRotator: React.FC = () => {
  const phrases = [
    { text: 'Better Academic Outcomes.', badge: 'Retention Boost +18%', gradient: 'from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400' },
    { text: 'Higher Retention Rates.', badge: 'Early Risk Alerts', gradient: 'from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400' },
    { text: 'Accurate Weighted GPAs.', badge: '100% Math Precision', gradient: 'from-purple-600 via-fuchsia-600 to-rose-600 dark:from-purple-400 dark:via-fuchsia-400 dark:to-rose-400' },
    { text: 'Collision-Free Schedules.', badge: 'Zero Room Overlaps', gradient: 'from-amber-600 via-orange-600 to-rose-600 dark:from-amber-400 dark:via-orange-400 dark:to-rose-400' },
    { text: '10-Second Roll Calls.', badge: 'Instant Digital Records', gradient: 'from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400' }
  ];
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setAnimating(false);
      }, 350);
    }, 3400);
    return () => clearInterval(timer);
  }, [phrases.length]);

  const current = phrases[index];

  return (
    <div className="inline-block relative">
      <div className="flex flex-wrap items-baseline gap-2">
        <span
          className={`inline-block transition-all duration-350 ease-out transform ${
            animating 
              ? 'opacity-0 translate-y-3 blur-xs scale-98' 
              : 'opacity-100 translate-y-0 blur-none scale-100 animate-text-glow'
          } bg-gradient-to-r ${current.gradient} bg-clip-text text-transparent animate-gradient-text font-black`}
        >
          {current.text}
        </span>
        <span className="inline-block w-[3px] h-7 sm:h-9 lg:h-11 bg-indigo-600 dark:bg-indigo-400 align-middle animate-cursor rounded-full" />
      </div>
      
      {/* Dynamic kinetic badge tied to current phrase */}
      <div className="mt-1.5 flex items-center gap-1.5">
        <span 
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold transition-all duration-300 border ${
            animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          } bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 shadow-xs`}
        >
          <Sparkles className="w-3 h-3 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{current.badge}</span>
        </span>
      </div>
    </div>
  );
};

// Animated statistics counter label with hover shimmer & glowing metric
const AnimatedStatValue: React.FC<{ 
  value: string; 
  numericValue?: number;
  decimals?: number;
  suffix?: string;
  label: string; 
  color?: string; 
  badge?: string 
}> = ({
  value,
  numericValue,
  decimals = 0,
  suffix = '',
  label,
  color = 'text-slate-900 dark:text-white',
  badge
}) => {
  return (
    <div className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 group cursor-default shadow-xs hover:shadow-md">
      <div className="flex items-center justify-between gap-1">
        <p className={`text-base sm:text-lg font-bold font-mono ${color} transition-all duration-300 group-hover:scale-105 inline-block group-hover:animate-text-glow`}>
          {numericValue !== undefined ? (
            <AnimatedCounter value={numericValue} decimals={decimals} suffix={suffix} />
          ) : (
            value
          )}
        </p>
        {badge && (
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200/50 dark:border-indigo-800/50">
            {badge}
          </span>
        )}
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors mt-0.5">
        {label}
      </p>
    </div>
  );
};

export const HomePage: React.FC = () => {
  const { navigate, currentUser } = useEduTrack();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [heroVisualTab, setHeroVisualTab] = useState<'photo' | 'dashboard'>('photo');

  // Interactive Live Simulator Local State
  const [simulatorTab, setSimulatorTab] = useState<'attendance' | 'gpa' | 'conflict'>('attendance');
  const [simAttendanceRate, setSimAttendanceRate] = useState<number>(72);
  const [simLateRatio, setSimLateRatio] = useState<number>(0.5);
  
  // GPA Simulator State
  const [simQuiz, setSimQuiz] = useState<number>(85);
  const [simMidterm, setSimMidterm] = useState<number>(78);
  const [simFinal, setSimFinal] = useState<number>(92);

  // Conflict Simulator State
  const [simRoom, setSimRoom] = useState<'Hall-A' | 'Lab-4C' | 'Room-201'>('Hall-A');
  const [simTimeSlot, setSimTimeSlot] = useState<'09:00' | '11:00' | '14:00'>('09:00');

  // Role Showcase Tab State
  const [activeRoleTab, setActiveRoleTab] = useState<'admin' | 'teacher' | 'student'>('admin');

  // Calculate simulated GPA & Letter Grade
  const simWeightedScore = Math.round((simQuiz * 0.2) + (simMidterm * 0.3) + (simFinal * 0.5));
  const getSimGrade = (score: number) => {
    if (score >= 90) return { letter: 'A', gpa: 4.0, text: 'Excellence Standing', color: 'text-emerald-500' };
    if (score >= 80) return { letter: 'B', gpa: 3.0, text: 'Above Average Standing', color: 'text-indigo-500' };
    if (score >= 70) return { letter: 'C', gpa: 2.0, text: 'Satisfactory Standing', color: 'text-amber-500' };
    if (score >= 60) return { letter: 'D', gpa: 1.0, text: 'Passing Condition', color: 'text-orange-500' };
    return { letter: 'F', gpa: 0.0, text: 'Failing / Academic Review Required', color: 'text-rose-500' };
  };
  const simGradeObj = getSimGrade(simWeightedScore);

  // Conflict state (Hall-A at 09:00 has a simulated collision)
  const isSimCollision = simRoom === 'Hall-A' && simTimeSlot === '09:00';

  const handleRoleExplore = (targetRole: 'admin' | 'teacher' | 'student') => {
    if (currentUser && currentUser.role === targetRole) {
      navigate(`/${targetRole}`);
    } else {
      navigate('/signin');
    }
  };

  const scrollToSimulator = () => {
    const el = document.getElementById('interactive-simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Users,
      title: 'Student Dossiers & Cohorts',
      tag: 'DIRECTORY',
      desc: 'Centralized student dossiers, demographic records, year levels, academic standing, and emergency contacts.',
      accent: 'from-blue-500/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60'
    },
    {
      icon: BookOpen,
      title: 'Curriculum & Courses',
      tag: 'ACADEMICS',
      desc: 'Syllabus administration, credit weighting, room assignments, faculty allocation, and capacity limits.',
      accent: 'from-sky-500/10 to-blue-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-900/60'
    },
    {
      icon: CheckCircle2,
      title: '10-Second Digital Roll Call',
      tag: 'ATTENDANCE',
      desc: 'Daily session roll calls, automated late/absent weighting, and proactive threshold breach alerts.',
      accent: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60'
    },
    {
      icon: Award,
      title: 'Weighted Assessment Engine',
      tag: 'GRADEBOOK',
      desc: 'Weighted assessment recording, automated letter grade determination, and credit-weighted GPA calculation.',
      accent: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60'
    },
    {
      icon: Calendar,
      title: 'Collision-Free Timetable',
      tag: 'SCHEDULING',
      desc: 'Weekly timetable organization with built-in room and faculty schedule conflict detection radar.',
      accent: 'from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/60'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Transcripts',
      tag: 'INSIGHTS',
      desc: 'Real-time cohort performance distributions, attendance trajectories, and one-click printable official transcripts.',
      accent: 'from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/60'
    }
  ];

  const faqs = [
    {
      q: 'What is EduTrack — Smart Student Management System?',
      a: 'EduTrack is a modern, unified academic management system engineered for educational institutions to coordinate student records, attendance tracking, grade calculation, and weekly timetables in one synchronized workspace.'
    },
    {
      q: 'Who can use the platform and what roles are supported?',
      a: 'EduTrack provides tailored role-based access for three primary tiers: Administrators (full institutional oversight, policy settings, and student dossiers), Teachers (assigned course rosters, roll calls, and gradebook entry), and Students (personal transcripts, attendance records, and weekly schedules).'
    },
    {
      q: 'How do users sign in, and can anyone access the portals?',
      a: 'All portals require authenticated access. Everyone—including students, teachers, administrators, and evaluators using sample accounts—must first sign up or sign in before accessing any portal. On the Sign In page, sample credentials can be filled into the form to test each role, but authentication is strictly enforced.'
    },
    {
      q: 'What can students see in their portal?',
      a: 'Students have private access to their cumulative GPA, attendance percentages per enrolled course, itemized assignment and exam scores, weekly class timetable with room assignments, and downloadable academic progress reports.'
    },
    {
      q: 'Can teachers record attendance and calculate weighted grades?',
      a: 'Yes. Teachers can mark Present, Late, Absent, or Excused for any scheduled class session. Grades support configurable weightings (e.g. 30% Midterm, 40% Final, 30% Assignments) which automatically calculate final letter grades.'
    },
    {
      q: 'How are grades and GPAs calculated?',
      a: 'EduTrack calculates final course scores using weighted assessment averages. It then maps scores to institutional grading tiers (A through F) and derives grade point averages weighted by course credit hours.'
    },
    {
      q: 'Is the website mobile-friendly and accessible?',
      a: 'Yes. EduTrack is fully responsive across mobile, tablet, and widescreen desktop viewports, with support for dark mode, keyboard navigation, and reduced-motion preferences.'
    },
    {
      q: 'How does the schedule conflict detection work?',
      a: 'When an administrator schedules a class session, the system evaluates the selected day, start time, end time, assigned room, and instructor against existing timetable entries, immediately warning if either the room or instructor is already double-booked.'
    }
  ];

  const testimonials = [
    {
      quote: "EduTrack replaced four disjointed Excel sheets with a real-time system. Our faculty completed roll call in seconds, and we caught at-risk student attendance dips 4 weeks earlier than previous semesters.",
      author: "Dr. Karen Vance",
      role: "Dean of Academic Affairs",
      dept: "College of Science & Technology",
      stars: 5,
      avatar: "KV"
    },
    {
      quote: "The weighted grading engine is bulletproof. Calculating letter grades and credit-adjusted GPAs used to take a whole weekend during finals. In EduTrack, it computes instantaneously.",
      author: "Prof. Marcus Reed",
      role: "Department Chair",
      dept: "Computer Science & Engineering",
      stars: 5,
      avatar: "MR"
    },
    {
      quote: "As a student, having transparent visibility into my attendance percentage and published exam grades gave me complete confidence in my academic standing before midterm week.",
      author: "Sarah Jenkins",
      role: "Undergraduate Scholar",
      dept: "B.S. Software Engineering '27",
      stars: 5,
      avatar: "SJ"
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 overflow-hidden">
      
      {/* GLOBAL SCROLL PROGRESS INDICATOR */}
      <ScrollProgressBar />

      {/* CAMPUS LIVE TICKER: REAL-TIME MARQUEE RIBBON */}
      <CampusLiveTicker />

      {/* SECTION 1: HERO SECTION WITH ATMOSPHERIC LIGHTING & LIVE PREVIEW */}
      <section className="relative pt-4 sm:pt-10 pb-8">
        {/* Soft background radial mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Compelling Copy & Trust Counters with Staggered Entrance */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Release Tag Pill with Animated Shimmer */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800/80 text-xs text-indigo-700 dark:text-indigo-300 shadow-xs hover:shadow-md transition-shadow"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold tracking-wide">EduTrack v3.2</span>
                <span className="text-slate-400 dark:text-slate-500">·</span>
                <span className="animate-text-shine font-bold">
                  Intelligent Academic Management
                </span>
              </motion.div>

              {/* Impact Headline with Animated Rotating Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-2"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12] text-balance">
                  Smarter Student Management.<br />
                  <AnimatedTextRotator />
                </h1>
              </motion.div>

              {/* Subtitle with Subtle Staggered Delay */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                Bring student records, digital attendance, weighted gradebooks, and timetable conflict detection together in one dependable platform built for contemporary education.
              </motion.p>

              {/* Action Buttons with Interactive Spring Motion */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap items-center gap-3 pt-1"
              >
                <InteractiveCTAButton
                  onClick={() => navigate('/signup')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl transition-all shadow-md hover:shadow-indigo-500/30 flex items-center gap-2 whitespace-nowrap cursor-pointer group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </InteractiveCTAButton>
                <InteractiveCTAButton
                  onClick={scrollToSimulator}
                  className="px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-xs flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-indigo-500 animate-pulse" />
                  <span>Try Interactive Simulator</span>
                </InteractiveCTAButton>
              </motion.div>

              {/* Key Trust Metrics Strip with Animated Text Values & Badges */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5"
              >
                <AnimatedStatValue value="4,800+" numericValue={4800} suffix="+" label="Active Scholars" badge="Roster" />
                <AnimatedStatValue value="99.4%" numericValue={99.4} decimals={1} suffix="%" label="Attendance Accuracy" color="text-emerald-600 dark:text-emerald-400" badge="Target >75%" />
                <AnimatedStatValue value="0 Collisions" numericValue={0} suffix=" Collisions" label="Timetable Radar" color="text-indigo-600 dark:text-indigo-400" badge="Automated" />
                <AnimatedStatValue value="100%" numericValue={100} suffix="%" label="FERPA Compliant" badge="Secured" />
              </motion.div>

            </div>

            {/* Right Column: Visual Hero Section with Photo & Live Dashboard Toggle */}
            <RevealOnScroll direction="right" duration={0.65} delay={0.15} className="lg:col-span-7 relative">
              
              {/* Floating micro-badge: Collision radar */}
              <FloatingBadge delay={0.2} yOffset={6} className="absolute -top-3 -right-2 sm:-right-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white border border-indigo-500/40 shadow-xl backdrop-blur-md text-[11px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-emerald-400">Timetable Radar:</span>
                <span className="text-slate-300">0 Overlaps Found</span>
              </FloatingBadge>

              {/* Floating micro-badge: Gradebook accuracy */}
              <FloatingBadge delay={1.2} yOffset={7} className="absolute -bottom-4 -left-2 sm:-left-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white border border-purple-500/40 shadow-xl backdrop-blur-md text-[11px] font-mono">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold text-purple-300">Weighted GPA Engine:</span>
                <span className="text-slate-300">Instant Letter Tier</span>
              </FloatingBadge>

              {/* View Switcher Controls */}
              <div className="flex items-center justify-end mb-2.5">
                <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60 text-xs shadow-xs">
                  <button
                    onClick={() => setHeroVisualTab('photo')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      heroVisualTab === 'photo'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <School className="w-3.5 h-3.5" />
                    <span>Campus & Scholars</span>
                  </button>
                  <button
                    onClick={() => setHeroVisualTab('dashboard')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      heroVisualTab === 'dashboard'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Live UI Preview</span>
                  </button>
                </div>
              </div>

              {heroVisualTab === 'photo' ? (
                <InteractiveCard hoverY={-4} scale={1.008} className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group transition-all duration-300">
                  <img
                    src={campusHeroImage}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/modern_university_hero_1792343735348.jpg';
                    }}
                    alt="Modern University Academic & Innovation Center with Students"
                    className="w-full h-[410px] object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent pointer-events-none" />

                  {/* Campus details overlay card */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <School className="w-4 h-4 text-indigo-400" />
                        <span>Center for Academic Innovation & Research</span>
                      </p>
                      <p className="text-[11px] text-slate-300 font-mono">
                        4,800+ Active Scholars · Synchronized Roll Call & Timetables
                      </p>
                    </div>
                    <button
                      onClick={() => setHeroVisualTab('dashboard')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto shrink-0 cursor-pointer"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>Tour UI</span>
                    </button>
                  </div>
                </InteractiveCard>
              ) : (
                <InteractiveCard hoverY={-4} scale={1.008}>
                  <HeroDashboardPreview />
                </InteractiveCard>
              )}
            </RevealOnScroll>

          </div>
        </div>
      </section>

      {/* SECTION 2: INSTITUTIONAL SOCIAL PROOF & BADGES STRIP */}
      <section className="border-y border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <RevealOnScroll direction="left" className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">
              <School className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Standard of Excellence in Academic Management</span>
            </RevealOnScroll>
            
            <StaggerContainer staggerDelay={0.1} className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <StaggerItem>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-emerald-500/50 transition-colors">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>FERPA Certified Segregation</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-indigo-500/50 transition-colors">
                  <Award className="w-4 h-4 text-indigo-500" />
                  <span>ABET & Regional Standard</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-emerald-500/50 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Spreadsheet Vulnerability</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-purple-500/50 transition-colors">
                  <Lock className="w-4 h-4 text-purple-500" />
                  <span>Role-Governed Security</span>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE LIVE ACADEMIC SIMULATOR (HIGH VALUE ATTRACTION) */}
      <RevealOnScroll direction="up" duration={0.65}>
        <section id="interactive-simulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-indigo-900/60 relative overflow-hidden">
            
            {/* Subtle Ambient Decorative Circles */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-8">
              
              {/* Simulator Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Interactive Public Sandbox</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Test EduTrack&apos;s Core Academic Intelligence
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                    Experience how automated rules calculate weighted GPAs, detect timetable room collisions, and trigger threshold warning alerts in real time.
                  </p>
                </div>

                {/* Simulator Tabs with Animated Indicator */}
                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0 self-start md:self-auto">
                  <button
                    onClick={() => setSimulatorTab('attendance')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      simulatorTab === 'attendance'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Attendance Alert Rule
                  </button>
                  <button
                    onClick={() => setSimulatorTab('gpa')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      simulatorTab === 'gpa'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    GPA & Grade Engine
                  </button>
                  <button
                    onClick={() => setSimulatorTab('conflict')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      simulatorTab === 'conflict'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Timetable Radar
                  </button>
                </div>
              </div>

              {/* TAB 1: Attendance Early Warning Simulator */}
              {simulatorTab === 'attendance' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-200">
                          Simulate Student Attendance Percentage
                        </label>
                        <span className="font-mono text-sm font-bold text-indigo-400">
                          {simAttendanceRate}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min={50}
                        max={100}
                        value={simAttendanceRate}
                        onChange={(e) => setSimAttendanceRate(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                        <span>50% (Deficient)</span>
                        <span className="text-amber-400 font-bold">75% (Institution Standard)</span>
                        <span>100% (Perfect)</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-200">
                          Configurable Late-Arrival Weighting
                        </label>
                        <span className="font-mono text-xs text-indigo-300">
                          {simLateRatio === 0.5 ? '0.5 (Half Count)' : '1.0 (Full Count)'}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSimLateRatio(0.5)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            simLateRatio === 0.5
                              ? 'bg-indigo-600/40 border-indigo-500 text-white'
                              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                          }`}
                        >
                          0.5 Ratio (Standard Policy)
                        </button>
                        <button
                          onClick={() => setSimLateRatio(1.0)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            simLateRatio === 1.0
                              ? 'bg-indigo-600/40 border-indigo-500 text-white'
                              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                          }`}
                        >
                          1.0 Ratio (Lenient Policy)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Outcome Display Card with Spring Glow */}
                  <InteractiveCard hoverY={-3} scale={1.01} className="lg:col-span-5 p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">
                        Automated System Action
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Real-time Rule Engine</span>
                    </div>

                    {simAttendanceRate < 75 ? (
                      <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 space-y-2">
                        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>Academic Alert Triggered!</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Student is currently at <strong className="text-rose-400 font-mono">{simAttendanceRate}%</strong>, which breaches the 75% institutional requirement.
                        </p>
                        <div className="pt-1 text-[11px] text-rose-300 font-medium">
                          ✓ Dispatched to Administrator Early Warning Dashboard<br />
                          ✓ Instructor notified on class roll call sheet
                        </div>
                      </div>
                    ) : simAttendanceRate >= 90 ? (
                      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Honor Standing & Perfect Attendance</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Attendance is outstanding at <strong className="text-emerald-400 font-mono">{simAttendanceRate}%</strong>.
                        </p>
                        <div className="pt-1 text-[11px] text-emerald-300 font-medium">
                          ✓ Eligible for Dean&apos;s Honor Roll certificate<br />
                          ✓ Zero intervention required
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/80 space-y-2">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>Good Academic Standing</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Student meets the standard threshold at <strong className="text-indigo-400 font-mono">{simAttendanceRate}%</strong>.
                        </p>
                        <div className="pt-1 text-[11px] text-slate-300">
                          ✓ Normal course progression maintained.
                        </div>
                      </div>
                    )}
                  </InteractiveCard>
                </div>
              )}

              {/* TAB 2: Weighted GPA & Grading Engine Simulator */}
              {simulatorTab === 'gpa' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold text-slate-200">
                        <span>Assignments & Quizzes (Weight: 20%)</span>
                        <span className="font-mono text-indigo-400">{simQuiz}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={simQuiz}
                        onChange={(e) => setSimQuiz(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold text-slate-200">
                        <span>Midterm Examination (Weight: 30%)</span>
                        <span className="font-mono text-indigo-400">{simMidterm}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={simMidterm}
                        onChange={(e) => setSimMidterm(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold text-slate-200">
                        <span>Final Project / Exam (Weight: 50%)</span>
                        <span className="font-mono text-indigo-400">{simFinal}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={simFinal}
                        onChange={(e) => setSimFinal(Number(e.target.value))}
                        className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <InteractiveCard hoverY={-3} scale={1.01} className="lg:col-span-5 p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono text-slate-400 tracking-wider block">
                        Calculated Academic Outcome
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 border border-indigo-800/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                        Live Weighted Engine
                      </span>
                    </div>

                    <div className="py-2 space-y-2">
                      <span className="text-5xl font-black font-mono text-white block tracking-tight animate-text-glow">
                        {simWeightedScore}%
                      </span>
                      <div className="inline-block px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-inner">
                        <span className={`text-lg font-bold font-mono ${simGradeObj.color}`}>
                          Grade {simGradeObj.letter} · {simGradeObj.gpa.toFixed(1)} GPA
                        </span>
                      </div>
                      <span className="text-xs text-slate-300 block font-medium">
                        {simGradeObj.text}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="text-[11px] text-slate-400">
                        Calculated automatically from (20% × {simQuiz}) + (30% × {simMidterm}) + (50% × {simFinal}).
                      </p>
                      <button
                        onClick={() => navigate('/planner')}
                        className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors self-end sm:self-auto cursor-pointer"
                      >
                        <span>Full Degree & Honors Planner</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </InteractiveCard>
                </div>
              )}

              {/* TAB 3: Timetable Conflict Radar */}
              {simulatorTab === 'conflict' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-4">
                    <p className="text-xs text-slate-300">
                      Test the collision detection algorithm. Booking <strong>Hall-A at 09:00 AM</strong> will intentionally trigger a simulated double-booking alert.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Select Lecture Room</label>
                        <select
                          value={simRoom}
                          onChange={(e) => setSimRoom(e.target.value as any)}
                          className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        >
                          <option value="Hall-A">Hall-A (Lecture Hall)</option>
                          <option value="Lab-4C">Lab-4C (Computer Lab)</option>
                          <option value="Room-201">Room-201 (Seminar Room)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Select Start Time</label>
                        <select
                          value={simTimeSlot}
                          onChange={(e) => setSimTimeSlot(e.target.value as any)}
                          className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        >
                          <option value="09:00">09:00 - 10:30 AM</option>
                          <option value="11:00">11:00 - 12:30 PM</option>
                          <option value="14:00">02:00 - 03:30 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <InteractiveCard hoverY={-3} scale={1.01} className="lg:col-span-5 p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                    <span className="text-xs uppercase font-mono text-slate-400 tracking-wider block">
                      Collision Detection Status
                    </span>

                    {isSimCollision ? (
                      <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 space-y-2">
                        <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>SCHEDULE COLLISION DETECTED</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          <strong>Hall-A</strong> is already occupied on Monday at 09:00 AM by <em>CS-101 (Intro to Algorithms)</em> with Dr. Evans.
                        </p>
                        <p className="text-[10px] text-rose-300 font-medium">
                          EduTrack blocks double-bookings before timetable finalization.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>SCHEDULE SLOT APPROVED</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {simRoom} is completely free on Monday at {simTimeSlot}. No room or instructor collisions found.
                        </p>
                        <p className="text-[10px] text-emerald-300 font-medium">
                          Safe to schedule session into official student timetable.
                        </p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                      <button
                        onClick={() => navigate('/timetable')}
                        className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Open Live Timetable Radar</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </InteractiveCard>
                </div>
              )}

              {/* Bottom note reminding about mandatory authentication for the real portals */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ready to manage live institutional records? Everyone must sign in or register an account.</span>
                </span>
                <div className="flex gap-2">
                  <InteractiveCTAButton
                    onClick={() => navigate('/signup')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
                  >
                    Create Account
                  </InteractiveCTAButton>
                  <InteractiveCTAButton
                    onClick={() => navigate('/signin')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Sign In
                  </InteractiveCTAButton>
                </div>
              </div>

            </div>

          </div>
        </section>
      </RevealOnScroll>

      {/* FLAGSHIP ACADEMIC TOOLS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" className="rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/50 border border-indigo-500/20 p-8 sm:p-10 shadow-xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-mono font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flagship Academic Operations Suite</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Two Purpose-Built Tools for Campuses & Scholars
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Beyond standard course lists, EduTrack offers dedicated algorithmic tools designed to prevent institutional scheduling chaos and empower students to reach academic honors.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs text-slate-300 font-mono">
                <span>Fast search anywhere:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-[11px] text-white font-bold">⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tool Card 1: Timetable & Room Radar */}
            <InteractiveCard hoverY={-5} className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-indigo-200 dark:border-indigo-900/60 shadow-md flex flex-col justify-between space-y-5 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-mono font-semibold border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Conflict Radar Active
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Interactive Timetable & Room Collision Radar
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Real-time weekly master grid with instant room occupancy radar. Filter by hall, department, or day; test custom session bookings with collision detection, and export schedules cleanly to CSV or print.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Room Booking Radar</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Weekly & List Grid</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">CSV Export</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <InteractiveCTAButton
                  onClick={() => navigate('/timetable')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Open Timetable & Room Radar</span>
                  <ArrowRight className="w-4 h-4" />
                </InteractiveCTAButton>
              </div>
            </InteractiveCard>

            {/* Tool Card 2: GPA Target Planner */}
            <InteractiveCard hoverY={-5} className="p-6 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-purple-200 dark:border-purple-900/60 shadow-md flex flex-col justify-between space-y-5 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800">
                    <Award className="w-5 h-5" />
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[11px] font-mono font-semibold border border-purple-200 dark:border-purple-800/60">
                    Honors & Scenario Simulator
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Academic GPA Target Planner & Degree Simulator
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Project cumulative graduation GPA, model custom semester course loads, calculate the exact final exam score needed for an target letter grade, and track progress toward Dean&apos;s List, Cum Laude, and Summa Cum Laude.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Final Score Solver</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Latin Honors Tiers</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">4.0 Scale Reference</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <InteractiveCTAButton
                  onClick={() => navigate('/planner')}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Launch Degree & GPA Planner</span>
                  <ArrowRight className="w-4 h-4" />
                </InteractiveCTAButton>
              </div>
            </InteractiveCard>
          </div>
        </RevealOnScroll>
      </section>

      {/* SECTION 4: WHY INSTITUTIONS SWITCH (SPREADSHEET CONTRAST GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll direction="up" className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider animate-gradient-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            The Evolution of Academic Operations
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Why Modern Universities Retire Spreadsheets
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Compare manual spreadsheet chaos with EduTrack&apos;s synchronized, role-governed operating system.
          </p>
        </RevealOnScroll>

        <StaggerContainer staggerDelay={0.15} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Traditional Spreadsheets Card */}
          <StaggerItem>
            <InteractiveCard hoverY={-6} className="h-full p-8 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-500 uppercase">Legacy Method</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fragmented Spreadsheets</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center font-bold">
                  ✕
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                  <span><strong>Broken Formulas & VLOOKUP Errors:</strong> One accidental cell overwrite corrupts GPA calculations across hundreds of records.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                  <span><strong>Delayed Attendance Discovery:</strong> At-risk students falling below the 75% standard are only noticed at the end of the term.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                  <span><strong>Accidental Double-Bookings:</strong> No collision detection when scheduling lectures, leading to classroom chaos on Day 1.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-xs shrink-0 mt-0.5">✕</span>
                  <span><strong>Privacy & FERPA Vulnerabilities:</strong> Emailing entire rosters where students can view other peers&apos; grades.</span>
                </li>
              </ul>
            </InteractiveCard>
          </StaggerItem>

          {/* The EduTrack Standard Card */}
          <StaggerItem>
            <InteractiveCard hoverY={-6} className="h-full p-8 rounded-2xl bg-gradient-to-b from-indigo-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-2 border-indigo-500/40 shadow-lg space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-indigo-100 dark:border-slate-800">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase">The EduTrack Standard</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Synchronized Academic OS</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                  ✓
                </div>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Automated Weighted Gradebooks:</strong> Mathematical accuracy guaranteed with configurable assessment tiers (A through F).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Proactive Early Warnings:</strong> Threshold breaches trigger instant notices on admin and faculty dashboards before midterms.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>Collision-Free Scheduling:</strong> Built-in radar automatically flags room and faculty collisions the second they occur.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xs shrink-0 mt-0.5">✓</span>
                  <span><strong>FERPA Role Isolation:</strong> Students strictly view their private transcripts; faculty only manage assigned classes.</span>
                </li>
              </ul>
            </InteractiveCard>
          </StaggerItem>

        </StaggerContainer>
      </section>

      {/* SECTION 5: CORE CAPABILITY MODULES (CLEAN GRID) */}
      <section className="bg-slate-100/70 dark:bg-slate-900/50 py-20 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <RevealOnScroll direction="up" className="max-w-2xl text-left space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider animate-gradient-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Comprehensive Platform Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Everything Needed to Run Higher Academics
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Every tool and metric is purpose-built to reduce manual clerical hours and elevate educational quality.
            </p>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <StaggerItem key={idx}>
                  <InteractiveCard
                    hoverY={-8}
                    scale={1.015}
                    onClick={() => navigate('/features')}
                    className="h-full group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 shadow-xs hover:shadow-lg cursor-pointer flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/60 transition-all">
                          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase">
                          {feat.tag}
                        </span>
                      </div>
                      
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {feat.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1.5 transition-transform">
                      <span>Explore Module Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </InteractiveCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

        </div>
      </section>

      {/* SECTION 6: INTERACTIVE ROLE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <RevealOnScroll direction="up" className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider animate-gradient-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Tailored Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Designed Specifically for Your Academic Role
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Each portal delivers an authentic workspace with strict permission boundaries and role-appropriate tools.
          </p>
        </RevealOnScroll>

        {/* Role Segmented Tabs with Spring Indicator */}
        <RevealOnScroll direction="up" delay={0.1} className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <button
              onClick={() => setActiveRoleTab('admin')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeRoleTab === 'admin'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Administrator Console</span>
            </button>

            <button
              onClick={() => setActiveRoleTab('teacher')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeRoleTab === 'teacher'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Faculty Instructor Desk</span>
            </button>

            <button
              onClick={() => setActiveRoleTab('student')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeRoleTab === 'student'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Student Academic Center</span>
            </button>
          </div>
        </RevealOnScroll>

        {/* Selected Role Showcase Card with Animated Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoleTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
          >
            {activeRoleTab === 'admin' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
                    <span>Executive Governance & Institutional Policies</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Full Oversight of Cohorts, Courses, and Campus Health
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Administrators control institutional grading thresholds, import student rosters via CSV, schedule collision-free room allocations, and generate certified transcripts.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <InteractiveCard hoverY={-3} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      <strong className="block text-slate-900 dark:text-white">Timetable Collision Radar</strong>
                      <span className="text-slate-500">Flags double-booked professors & rooms</span>
                    </InteractiveCard>
                    <InteractiveCard hoverY={-3} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      <strong className="block text-slate-900 dark:text-white">Cohort Transcripts</strong>
                      <span className="text-slate-500">Print official semester grade reports</span>
                    </InteractiveCard>
                  </div>
                  <div className="pt-2">
                    <InteractiveCTAButton
                      onClick={() => handleRoleExplore('admin')}
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs flex items-center gap-2"
                    >
                      <span>{currentUser?.role === 'admin' ? 'Open Administrator Console' : 'Sign In to Administrator Console'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </InteractiveCTAButton>
                  </div>
                </div>

                <InteractiveCard hoverY={-4} className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group bg-slate-100 dark:bg-slate-800 relative">
                  <img
                    src={authLibraryImage}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/auth_education_library_1792272727886.jpg';
                    }}
                    alt="Administrator Library Operations"
                    className="w-full h-72 sm:h-80 object-cover object-center transition-transform duration-500 group-hover:scale-105 block"
                    loading="lazy"
                  />
                </InteractiveCard>
              </div>
            )}

            {activeRoleTab === 'teacher' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                    <span>Classroom Instruction & Assessment Hub</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Take Roll Call in Seconds & Grade with Ease
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Designed for professors and teaching assistants. Take live session roll calls with &quot;Mark All Present&quot; speed, grade quizzes and midterms with automated weighting, and identify students who need mentoring.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <InteractiveCard hoverY={-3} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      <strong className="block text-slate-900 dark:text-white">Rapid Roll Call</strong>
                      <span className="text-slate-500">Log present, late, absent, or excused</span>
                    </InteractiveCard>
                    <InteractiveCard hoverY={-3} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      <strong className="block text-slate-900 dark:text-white">Assessment Matrix</strong>
                      <span className="text-slate-500">Weighted scores update student GPA</span>
                    </InteractiveCard>
                  </div>
                  <div className="pt-2">
                    <InteractiveCTAButton
                      onClick={() => handleRoleExplore('teacher')}
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-2"
                    >
                      <span>{currentUser?.role === 'teacher' ? 'Open Faculty Desk' : 'Sign In to Faculty Desk'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </InteractiveCTAButton>
                  </div>
                </div>

                <InteractiveCard hoverY={-4} className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group bg-slate-100 dark:bg-slate-800 relative">
                  <img
                    src={teacherAnalyticsImage}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/teacher_classroom_analytics_1792272725585.jpg';
                    }}
                    alt="Faculty reviewing analytics"
                    className="w-full h-72 sm:h-80 object-cover object-center transition-transform duration-500 group-hover:scale-105 block"
                    loading="lazy"
                  />
                </InteractiveCard>
              </div>
            )}

            {activeRoleTab === 'student' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    <span>Personal Academic Progress Center</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    Track Your Cumulative GPA & Daily Attendance Rates
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Students privately log in to view course-by-course attendance percentages, itemized examination feedback, their weekly class room timetable, and print official semester report cards.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <InteractiveCard hoverY={-3} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      <strong className="block text-slate-900 dark:text-white">Private GPA Dashboard</strong>
                      <span className="text-slate-500">Live 4.0 scale tracking with letter grades</span>
                    </InteractiveCard>
                    <InteractiveCard hoverY={-3} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
                      <strong className="block text-slate-900 dark:text-white">Printable Report Card</strong>
                      <span className="text-slate-500">Formatted with dean remarks & credits</span>
                    </InteractiveCard>
                  </div>
                  <div className="pt-2">
                    <InteractiveCTAButton
                      onClick={() => handleRoleExplore('student')}
                      className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs flex items-center gap-2"
                    >
                      <span>{currentUser?.role === 'student' ? 'Open Student Portal' : 'Sign In to Student Portal'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </InteractiveCTAButton>
                  </div>
                </div>

                <InteractiveCard hoverY={-4} className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md group bg-slate-100 dark:bg-slate-800 relative">
                  <img
                    src={studentsStemImage}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/images/students_collaborating_stem_1792272726934.jpg';
                    }}
                    alt="Students Collaborating"
                    className="w-full h-72 sm:h-80 object-cover object-center transition-transform duration-500 group-hover:scale-105 block"
                    loading="lazy"
                  />
                </InteractiveCard>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* SECTION 7: VOICE OF THE CAMPUS (TESTIMONIALS) */}
      <section className="bg-slate-100/70 dark:bg-slate-900/50 py-20 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <RevealOnScroll direction="up" className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Trusted by Campus Leaders & Students
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              See how EduTrack transforms everyday academic management across departments.
            </p>
          </RevealOnScroll>

          <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, index) => (
              <StaggerItem key={index}>
                <InteractiveCard
                  hoverY={-6}
                  scale={1.015}
                  className="h-full p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(item.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 transition-transform hover:scale-125" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{item.author}</p>
                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{item.role}</p>
                      <p className="text-[10px] text-slate-400">{item.dept}</p>
                    </div>
                  </div>
                </InteractiveCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

        </div>
      </section>

      {/* SECTION 8: FAQ ACCORDION */}
      <section>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <RevealOnScroll direction="up" className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Clear Answers
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Everything you need to know about EduTrack roles, data privacy, and academic mechanics.
            </p>
          </RevealOnScroll>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all shadow-xs hover:border-indigo-400/50 dark:hover:border-indigo-600/50"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 9: GRAND FINAL CTA BANNER */}
      <RevealOnScroll direction="up" duration={0.65}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-indigo-900/40 group">
            <img
              src={campusHeroImage}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/images/modern_university_hero_1792343735348.jpg';
              }}
              alt="University Innovation and Academic Center"
              className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/70 backdrop-blur-[1px] flex items-center justify-center p-6 text-center">
              <div className="max-w-2xl space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Modernize Your Institution Today
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Bring Your Campus Academics Together.
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Join thousands of students and faculty members experiencing faster roll calls, automated weighted GPAs, and collision-free schedules.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <InteractiveCTAButton
                    onClick={() => navigate('/signup')}
                    className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Register Your Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </InteractiveCTAButton>
                  <InteractiveCTAButton
                    onClick={() => navigate('/signin')}
                    className="px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                  >
                    Sign In to Portal
                  </InteractiveCTAButton>
                </div>
                <p className="text-[11px] text-slate-400">
                  Institutional Policy: All portals are protected with verified authentication.
                </p>
              </div>
            </div>
          </div>
        </section>
      </RevealOnScroll>

    </div>
  );
};
