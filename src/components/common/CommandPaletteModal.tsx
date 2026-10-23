import React, { useState, useEffect, useRef } from 'react';
import { useEduTrack } from '../../context/EduTrackContext';
import { 
  Search, X, BookOpen, Users, Calendar, 
  Calculator, Sliders, Shield, ArrowRight, 
  Sparkles, Building, GraduationCap, ChevronRight
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({ isOpen, onClose }) => {
  const { navigate, courses, students, currentUser } = useEduTrack();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtered categories
  const pages = [
    { title: 'Interactive Timetable Radar', category: 'Academic Tools', path: '/timetable', icon: Calendar, desc: 'Weekly schedule & room collision radar' },
    { title: 'GPA Target & Degree Planner', category: 'Academic Tools', path: '/planner', icon: Calculator, desc: 'Degree honors & target grade simulator' },
    { title: 'Platform Capabilities & Features', category: 'General', path: '/features', icon: Sliders, desc: 'Overview of all academic modules' },
    { title: 'Interactive Simulator', category: 'General', path: '/#interactive-simulator', icon: Sparkles, desc: 'Test attendance & grade engine in sandbox' },
    { title: 'How It Works & Implementation', category: 'General', path: '/how-it-works', icon: BookOpen, desc: 'FERPA workflow & multi-role guide' },
    { title: 'Frequently Asked Questions', category: 'Support', path: '/faq', icon: Building, desc: 'Academic policies & mechanics' },
    { title: 'About EduTrack Institute', category: 'General', path: '/about', icon: Building, desc: 'Mission, accreditation, and methodology' },
    { title: 'Contact Academic Support', category: 'Support', path: '/contact', icon: Users, desc: 'Help desk & department directory' },
  ];

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.desc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCourses = courses.filter(c => 
    c.code.toLowerCase().includes(query.toLowerCase()) || 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.instructorName.toLowerCase().includes(query.toLowerCase()) ||
    c.room.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredStudents = (currentUser?.role === 'admin' || currentUser?.role === 'teacher')
    ? students.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.studentId.toLowerCase().includes(query.toLowerCase()) ||
        s.department.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const allResults = [
    ...filteredPages.map(p => ({ ...p, type: 'page' })),
    ...filteredCourses.map(c => ({
      title: `${c.code}: ${c.title}`,
      category: 'Course Catalog',
      desc: `${c.scheduleDay} ${c.scheduleTime} · ${c.room} · ${c.instructorName}`,
      path: '/timetable',
      icon: BookOpen,
      type: 'course'
    })),
    ...filteredStudents.map(s => ({
      title: `${s.name} (${s.studentId})`,
      category: 'Student Records',
      desc: `${s.department} · GPA: ${s.gpa.toFixed(2)} · Attendance: ${s.attendanceRate}%`,
      path: currentUser?.role === 'admin' ? '/admin' : '/teacher',
      icon: GraduationCap,
      type: 'student'
    }))
  ];

  const handleSelect = (item: typeof allResults[0]) => {
    navigate(item.path);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search academic pages, courses (CS-201), timetable, planner..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer transition-colors"
              title="Clear search text"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-200/60 dark:bg-slate-800 rounded">
            ESC
          </kbd>
          {/* Option of cross to leave / close modal */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700/60 shrink-0 flex items-center justify-center ml-0.5"
            title="Close (Esc)"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60">
          {allResults.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-400 mx-auto opacity-50" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-400">Try searching for &quot;Timetable&quot;, &quot;Planner&quot;, &quot;CS-201&quot;, or &quot;Algorithms&quot;</p>
            </div>
          ) : (
            <div className="space-y-1">
              {allResults.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-slate-900 dark:text-white' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate text-slate-900 dark:text-white">{item.title}</span>
                          <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/40 px-1.5 py-0.2 rounded font-medium shrink-0">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-indigo-600 dark:text-indigo-400 translate-x-0.5' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">↵</kbd> Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-mono text-[10px]">ESC</kbd> Close
            </span>
          </div>
          <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">
            EduTrack Instant Index
          </span>
        </div>
      </div>
    </div>
  );
};
