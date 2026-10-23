import React from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { 
  ShieldCheck, Target, HeartHandshake, Zap, 
  CheckCircle2, ArrowRight, Layers, Award, Clock 
} from 'lucide-react';
import authLibraryImage from '../assets/images/auth_education_library_1792272727886.jpg';

export const AboutPage: React.FC = () => {
  const { navigate } = useEduTrack();

  return (
    <div className="space-y-20 pb-20 bg-[#F8F6F0] dark:bg-[#0D1B2A] text-[#0D1B2A] dark:text-[#F4F1DE]">
      
      {/* Hero Section */}
      <section className="pt-10 sm:pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#415A77] dark:text-[#D4C4A8]">
                Our Purpose & Philosophy
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D1B2A] dark:text-[#F4F1DE] leading-[1.15]">
                Built to Restore Clarity to Academic Operations
              </h1>
              <p className="text-base sm:text-lg text-[#415A77] dark:text-[#D4C4A8]/90 leading-relaxed">
                EduTrack was conceived to eliminate the daily friction caused by disconnected spreadsheets, siloed attendance logs, and delayed student intervention.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => navigate('/signup')}
                  className="px-6 py-2.5 text-xs font-semibold text-[#D4C4A8] bg-[#0D1B2A] hover:bg-[#1B263B] dark:bg-[#415A77] dark:hover:bg-[#1B263B] dark:text-white rounded-xl transition-all shadow-xs border border-[#D4C4A8]/40 cursor-pointer font-bold"
                >
                  Join EduTrack Today
                </button>
                <button
                  onClick={() => navigate('/features')}
                  className="px-6 py-2.5 text-xs font-semibold text-[#0D1B2A] dark:text-[#F4F1DE] bg-white dark:bg-[#1B263B] hover:bg-[#F8F6F0] dark:hover:bg-[#415A77]/40 border border-[#D4C4A8] dark:border-[#415A77] rounded-xl transition-colors cursor-pointer"
                >
                  View Features
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-[#D4C4A8] dark:border-[#415A77] shadow-xl">
                <img
                  src={authLibraryImage}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/assets/images/auth_education_library_1792272727886.jpg';
                  }}
                  alt="Modern university library atrium"
                  className="w-full h-[380px] sm:h-[420px] object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Narrative Section: Mission & Pillars */}
      <section className="bg-white dark:bg-[#1B263B] py-16 border-y border-[#D4C4A8]/50 dark:border-[#1B263B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#415A77] dark:text-[#D4C4A8]">
              The Core Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0D1B2A] dark:text-[#F4F1DE]">
              Why Academic Institutions Trust EduTrack
            </h2>
            <p className="text-sm sm:text-base text-[#415A77] dark:text-[#D4C4A8]/90 leading-relaxed">
              Universities don&apos;t just manage numbers; they guide human careers. Fragmented spreadsheets lose vital signals. When a student misses three consecutive laboratory sessions or drops below minimum attendance, intervention shouldn&apos;t wait until final grades are posted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#F8F6F0] dark:bg-[#0D1B2A] border border-[#D4C4A8]/60 dark:border-[#415A77]/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] dark:bg-[#415A77] border border-[#D4C4A8]/60 text-[#D4C4A8] flex items-center justify-center">
                <Target className="w-5 h-5 text-[#D4C4A8]" />
              </div>
              <h3 className="text-base font-bold text-[#0D1B2A] dark:text-[#F4F1DE]">
                Real-Time Intervention
              </h3>
              <p className="text-xs text-[#415A77] dark:text-[#D4C4A8]/80 leading-relaxed">
                Automated threshold monitoring immediately flags attendance dips below 75% so advisors can mentor students before they face academic penalties.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F6F0] dark:bg-[#0D1B2A] border border-[#D4C4A8]/60 dark:border-[#415A77]/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] dark:bg-[#415A77] border border-[#D4C4A8]/60 text-[#D4C4A8] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#D4C4A8]" />
              </div>
              <h3 className="text-base font-bold text-[#0D1B2A] dark:text-[#F4F1DE]">
                FERPA Compliant Privacy
              </h3>
              <p className="text-xs text-[#415A77] dark:text-[#D4C4A8]/80 leading-relaxed">
                Students access their transcripts privately. Teachers only see assigned rosters. Full mathematical transparency with absolute data isolation.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F8F6F0] dark:bg-[#0D1B2A] border border-[#D4C4A8]/60 dark:border-[#415A77]/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] dark:bg-[#415A77] border border-[#D4C4A8]/60 text-[#D4C4A8] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#D4C4A8]" />
              </div>
              <h3 className="text-base font-bold text-[#0D1B2A] dark:text-[#F4F1DE]">
                Collision-Free Organization
              </h3>
              <p className="text-xs text-[#415A77] dark:text-[#D4C4A8]/80 leading-relaxed">
                Built-in scheduling radar inspects room capacities, instructor availability, and timetable conflicts in real time, preventing chaotic semester starts.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#415A77] dark:text-[#D4C4A8]">
              Guiding Engineering Values
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0D1B2A] dark:text-[#F4F1DE]">
              Our 4 Design Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1B263B] border border-[#D4C4A8]/60 dark:border-[#415A77]/40 space-y-3">
              <span className="font-mono text-xs font-bold text-[#415A77] dark:text-[#D4C4A8]">01</span>
              <h3 className="text-sm font-semibold text-[#0D1B2A] dark:text-[#F4F1DE]">Speed & Low Latency</h3>
              <p className="text-xs text-[#415A77] dark:text-[#D4C4A8]/80 leading-relaxed">
                Taking attendance for 45 students takes under 15 seconds. Every interaction responds instantly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1B263B] border border-[#D4C4A8]/60 dark:border-[#415A77]/40 space-y-3">
              <span className="font-mono text-xs font-bold text-[#415A77] dark:text-[#D4C4A8]">02</span>
              <h3 className="text-sm font-semibold text-[#0D1B2A] dark:text-[#F4F1DE]">Transparent Math</h3>
              <p className="text-xs text-[#415A77] dark:text-[#D4C4A8]/80 leading-relaxed">
                Attendance rates and GPA weights follow clear institutional formulas, never black-box estimates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1B263B] border border-[#D4C4A8]/60 dark:border-[#415A77]/40 space-y-3">
              <span className="font-mono text-xs font-bold text-[#415A77] dark:text-[#D4C4A8]">03</span>
              <h3 className="text-sm font-semibold text-[#0D1B2A] dark:text-[#F4F1DE]">Strict Privacy</h3>
              <p className="text-xs text-[#415A77] dark:text-[#D4C4A8]/80 leading-relaxed">
                Role-based authorization prevents students from viewing peer records or unauthorized course metrics.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#1B263B] border border-[#D4C4A8]/60 dark:border-[#415A77]/40 space-y-3">
              <span className="font-mono text-xs font-bold text-[#415A77] dark:text-[#D4C4A8]">04</span>
              <h3 className="text-sm font-semibold text-[#0D1B2A] dark:text-[#F4F1DE]">Zero Clutter</h3>
              <p className="text-xs text-[#415A77] dark:text-[#D4C4A8]/80 leading-relaxed">
                Every screen delivers clear visual hierarchy with high-contrast typography and no unnecessary distractions.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0D1B2A] dark:text-[#F4F1DE]">
          Experience the Difference with EduTrack
        </h2>
        <p className="text-sm text-[#415A77] dark:text-[#D4C4A8]/90 max-w-xl mx-auto">
          Sign in with your institutional credentials or register a new student, faculty, or administrator account.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 text-xs font-semibold text-[#D4C4A8] bg-[#0D1B2A] hover:bg-[#1B263B] dark:bg-[#415A77] dark:hover:bg-[#1B263B] dark:text-white rounded-xl transition-all shadow-xs flex items-center gap-2 border border-[#D4C4A8]/40 cursor-pointer font-bold"
          >
            <span>Register Account</span>
            <ArrowRight className="w-4 h-4 text-[#D4C4A8]" />
          </button>
          <button
            onClick={() => navigate('/signin')}
            className="px-6 py-2.5 text-xs font-semibold text-[#0D1B2A] dark:text-[#F4F1DE] bg-white dark:bg-[#1B263B] hover:bg-[#F8F6F0] dark:hover:bg-[#415A77]/40 border border-[#D4C4A8] dark:border-[#415A77] rounded-xl transition-colors cursor-pointer"
          >
            Sign In to Portal
          </button>
        </div>
      </section>

    </div>
  );
};
