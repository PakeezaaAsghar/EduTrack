import React, { useState } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { Search, ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { navigate } = useEduTrack();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'General' | 'Attendance' | 'Grades' | 'Scheduling'>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      category: 'General',
      q: 'What is EduTrack — Smart Student Management System?',
      a: 'EduTrack is a unified academic operations platform designed for modern universities and educational institutes. It coordinates student profiles, course registration, attendance tracking, weighted gradebook calculation, weekly timetables, and official transcript generation in one secure environment.'
    },
    {
      category: 'General',
      q: 'Who can use the platform and what are the roles?',
      a: 'EduTrack features three distinct role-based access tiers: (1) Administrators, who have full institutional privileges to manage courses, students, system policies, timetable slots, and reports; (2) Teachers & Faculty, who manage assigned course rosters, conduct roll calls, and enter grades; and (3) Students, who privately view their attendance rates, assignment feedback, and academic standing.'
    },
    {
      category: 'General',
      q: 'How do users sign in, and can I access portals without signing in?',
      a: 'All portals require authenticated access. Everyone—including students, teachers, administrators, and evaluators testing demo accounts—must first sign up or sign in before accessing any portal. On the Sign In page, sample credentials can be filled into the form to test each role, but authentication is strictly enforced.'
    },
    {
      category: 'General',
      q: 'Is the platform mobile-responsive and accessible?',
      a: 'Yes. EduTrack is thoroughly engineered for desktop, tablet, and mobile devices (from 360px upwards). It features dark mode support, accessible focus states, high-contrast typography, and full adherence to prefers-reduced-motion preferences.'
    },
    {
      category: 'Attendance',
      q: 'Can teachers record attendance and how does roll call work?',
      a: 'Instructors can take roll call directly for any course session. They can mark students as Present, Late, Absent, or Excused, add optional notes (such as transit delays), or use the "Mark All Present" button for rapid class logging.'
    },
    {
      category: 'Attendance',
      q: 'How does late attendance affect the overall attendance percentage?',
      a: 'EduTrack allows institutions to configure late attendance weighting via system settings. By default, Late counts as attended with a customizable ratio (e.g., 0.5 or 1.0). Excused absences are omitted from denominator penalties, guaranteeing fair tracking.'
    },
    {
      category: 'Attendance',
      q: 'What happens when a student falls below the attendance threshold?',
      a: 'If a student’s attendance drops below the institutional threshold (standard 75%), the system automatically flags an Academic Alert in the administrator and instructor dashboards, and places the student on warning status.'
    },
    {
      category: 'Grades',
      q: 'How are course grades and cumulative GPAs calculated?',
      a: 'Assessments (Assignments, Quizzes, Midterms, Final Exams, Projects) have customizable weights that total 100%. The system computes a running weighted average, maps it to the institutional letter grade tier (A, B, C, D, F), and multiplies grade points by course credit hours to establish cumulative GPAs.'
    },
    {
      category: 'Grades',
      q: 'Can students view peer grades or private faculty feedback?',
      a: 'No. Strict FERPA compliance ensures students can strictly view their own personal grades, assignment feedback, and academic progress reports. Teacher gradebooks are accessible only to assigned instructors and authorized administrators.'
    },
    {
      category: 'Scheduling',
      q: 'How does the class schedule conflict detection work?',
      a: 'When scheduling a class session in the timetable, the system checks whether the designated classroom room is already booked for an overlapping time on that day, or if the instructor is already committed to another lecture. If a collision is found, an immediate conflict warning is returned.'
    },
    {
      category: 'Scheduling',
      q: 'Can schedules and student rosters be imported or exported?',
      a: 'Yes. Administrators can export the complete student directory into standardized CSV files at any time, as well as import student cohorts directly from CSV files.'
    }
  ];

  const filteredFaqs = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-20">
      
      {/* Header */}
      <section className="pt-10 sm:pt-14 text-center max-w-2xl mx-auto px-4 sm:px-6 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Knowledge Base & Help Desk
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Clear documentation on EduTrack features, formulas, access control, and best practices.
        </p>

        {/* Search Bar */}
        <div className="pt-2 max-w-lg mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. attendance, gpa, conflicts)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>

        {/* Category Filter Pills (Functional Buttons) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          {(['All', 'General', 'Attendance', 'Grades', 'Scheduling'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Accordion List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">No matching questions found</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching for broader keywords or clear your category filter.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-medium text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {faq.category}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Bottom Still Have Questions */}
      <section className="max-w-2xl mx-auto px-4 text-center space-y-3">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Still have questions?</h3>
        <p className="text-xs text-slate-500">Our academic support team is ready to provide demonstrations and assistance.</p>
        <button
          onClick={() => navigate('/contact')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <span>Contact Academic Support</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

    </div>
  );
};
