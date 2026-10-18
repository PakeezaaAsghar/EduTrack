import React from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { 
  UserCheck, LayoutDashboard, Database, 
  CheckCircle2, Award, BarChart2, ArrowRight 
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { navigate } = useEduTrack();

  const steps = [
    {
      num: '01',
      icon: UserCheck,
      title: 'Account Provisioning & Access Control',
      desc: 'Administrators configure faculty accounts and import incoming student rosters. Students receive their institutional logins or register directly with verified student IDs.',
      detail: 'FERPA-compliant role assignments protect sensitive student academic records from unauthorized viewing.'
    },
    {
      num: '02',
      icon: Database,
      title: 'Course Catalog & Timetable Scheduling',
      desc: 'Department heads define course offerings, credit values, syllabus goals, and capacity ceilings. The timetable scheduler automatically flags any instructor or classroom conflicts.',
      detail: 'Students are enrolled into their respective course tracks, immediately populating faculty roll call sheets.'
    },
    {
      num: '03',
      icon: CheckCircle2,
      title: 'Daily Attendance & Roll Call',
      desc: 'Instructors take roll call in seconds at the start of each lecture. The system tracks present, late, absent, and excused tallies, dynamically updating running attendance percentages.',
      detail: 'If attendance falls below the institutional threshold (e.g. 75%), automatic warning alerts are raised.'
    },
    {
      num: '04',
      icon: Award,
      title: 'Assessment Scoring & Weighted Gradebooks',
      desc: 'Teachers post scores for quizzes, assignments, midterm examinations, and final projects with customized percentage weights. The grading engine converts raw totals into official letter grades.',
      detail: 'Students receive prompt feedback, and their cumulative Grade Point Averages are recalculated in real time.'
    },
    {
      num: '05',
      icon: BarChart2,
      title: 'Analytics, Alerts & Official Transcripts',
      desc: 'Administrators review cohort performance trends and address early warning alerts. Official academic reports can be previewed on-screen or printed directly for institutional records.',
      detail: 'Export complete datasets to CSV for departmental accreditation or backup archives at any time.'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero */}
      <section className="pt-10 sm:pt-14 text-center max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Step-by-Step Workflow
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          How EduTrack Unifies Campus Academics
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          A seamless journey from initial enrollment and timetable generation to everyday roll call and official degree transcript generation.
        </p>
      </section>

      {/* Timeline Steps */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative border-l-2 border-indigo-200 dark:border-indigo-950 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
          
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md">
                  <Icon className="w-4 h-4" />
                </div>

                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      STEP {step.num}
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase font-medium">Standard Academic Flow</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.desc}
                  </p>
                  <div className="pt-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {step.detail}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          See the Workflow in Action
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Sign in or create an authenticated account to explore the Admin, Teacher, or Student portal.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
          >
            <span>Register Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => navigate('/signin')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg"
          >
            Sign In to Portal
          </button>
        </div>
      </section>

    </div>
  );
};
