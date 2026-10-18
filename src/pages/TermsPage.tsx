import React from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { FileText, CheckCircle, ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { navigate } = useEduTrack();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </button>

      <div className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <FileText className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Academic Agreement</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Academic Service
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Applies to all institutional faculty, administrative staff, and enrolled students.
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Authorized Academic Usage
          </h2>
          <p>
            The EduTrack platform is provided exclusively for verified educational administration, teaching coordination, and student academic progress tracking. Unauthorized attempts to alter grade records, circumvent role-based permissions, or tamper with timetable schedules are strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Instructor Assessment Responsibilities
          </h2>
          <p>
            Faculty members are responsible for timely entry of class roll calls and assessment marks according to the published departmental syllabus and institutional grading scales. Grade submissions become binding once certified by the departmental registrar.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Student Standing & Attendance Policies
          </h2>
          <p>
            Students are expected to monitor their attendance percentages and published grades. Attendance falling below the institutional threshold (minimum 75%) may result in academic warning flags or formal probation reviews in accordance with faculty senate guidelines.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Service Integrity and Uptime
          </h2>
          <p>
            EduTrack operates with continuous backup validation and secure local caching to prevent loss of academic work during unexpected network interruptions. Scheduled maintenance is conducted during official inter-semester recess windows.
          </p>
        </section>
      </div>
    </div>
  );
};
