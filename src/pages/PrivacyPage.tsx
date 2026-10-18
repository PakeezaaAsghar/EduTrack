import React from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
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
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">FERPA & Data Protection Policy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Student Data Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Effective Date: Academic Term 2026-2027 · Last Revision: October 2026
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Institutional Commitment to FERPA Compliance
          </h2>
          <p>
            EduTrack complies fully with the Family Educational Rights and Privacy Act (FERPA) (20 U.S.C. § 1232g; 34 CFR Part 99). All personally identifiable student information (PII), academic evaluations, roll call logs, and Grade Point Averages are classified as confidential educational records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Scope of Collected Academic Data
          </h2>
          <p>
            To facilitate academic administration, EduTrack stores the following operational datasets:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Student directory information: Full legal name, institutional email, student ID code, matriculation year, and enrolled department.</li>
            <li>Course records: Course registrations, syllabus assignments, and class timetable schedules.</li>
            <li>Attendance records: Daily session timestamps, presence/tardiness states, and excused absence justifications.</li>
            <li>Assessment data: Raw exam scores, quiz marks, assignment feedback, and calculated weighted grade points.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Role-Based Access Segregation
          </h2>
          <p>
            Access to educational records is strictly restricted according to authenticated institutional roles:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Students:</strong> May exclusively view their personal attendance percentages, published assessments, and official transcript previews. Peer information is strictly isolated.</li>
            <li><strong>Faculty Instructors:</strong> May exclusively access rosters, attendance records, and gradebooks for courses to which they are officially assigned as instructors or teaching assistants.</li>
            <li><strong>Administrators:</strong> Maintain authorized oversight over course scheduling, student registrations, and institutional reporting.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Security and Data Retention
          </h2>
          <p>
            All academic transmissions are encrypted using standard cryptographic transport protocols. Educational records are preserved in accordance with institutional accreditation and retention mandates. Users may request archival extracts or report printouts through the institutional registrar.
          </p>
        </section>
      </div>
    </div>
  );
};
