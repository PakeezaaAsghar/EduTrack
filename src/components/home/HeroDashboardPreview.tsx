import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, BookOpen, CheckCircle2, TrendingUp, 
  Calendar, Bell, Search, LayoutDashboard, FileText, 
  ChevronRight, Sparkles, Shield, AlertTriangle, ArrowUpRight
} from 'lucide-react';

export const HeroDashboardPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'grades' | 'conflicts'>('attendance');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  const attendanceBars = [
    { day: 'Mon', rate: 94, present: 453, late: 18, absent: 11 },
    { day: 'Tue', rate: 96, present: 462, late: 12, absent: 8 },
    { day: 'Wed', rate: 91, present: 438, late: 24, absent: 20 },
    { day: 'Thu', rate: 98, present: 472, late: 6, absent: 4 },
    { day: 'Fri', rate: 89, present: 429, late: 29, absent: 24 },
    { day: 'Sat', rate: 84, present: 210, late: 15, absent: 25 },
  ];

  const gradeDistribution = [
    { grade: 'A', percent: 34, count: 164, color: 'bg-[#778D7A]' },
    { grade: 'B', percent: 42, count: 202, color: 'bg-[#415A77]' },
    { grade: 'C', percent: 18, count: 87, color: 'bg-[#D4C4A8]' },
    { grade: 'D/F', percent: 6, count: 29, color: 'bg-[#1B263B]' },
  ];

  const timetablePreview = [
    { time: '09:00 - 10:30', code: 'CS-101', name: 'Intro to Algorithmic Logic', room: 'Hall A-1', status: 'Clear', instructor: 'Dr. Evans' },
    { time: '11:00 - 12:30', code: 'CS-305', name: 'Database Architecture', room: 'Lab 4-C', status: 'Clear', instructor: 'Prof. Reed' },
    { time: '14:00 - 15:30', code: 'MATH-201', name: 'Multivariate Calculus', room: 'Hall B-2', status: 'Verified', instructor: 'Dr. Vance' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.97, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      className="relative mx-auto w-full max-w-2xl group"
    >
      {/* Ambient background glow with Holst colors */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#415A77]/30 via-[#778D7A]/20 to-[#D4C4A8]/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

      {/* Main Browser Window Frame */}
      <div className="relative rounded-2xl bg-[#0D1B2A] text-[#F4F1DE] overflow-hidden border border-[#D4C4A8]/40 shadow-2xl transition-all duration-300">
        
        {/* Browser Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#0D1B2A] border-b border-[#1B263B]">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4C4A8]/70" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#778D7A]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#415A77]" />
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1B263B] rounded-md border border-[#415A77]/40 text-[11px] text-[#D4C4A8] font-mono">
            <span className="text-[#F4F1DE]/40">https://</span>
            <span className="text-[#D4C4A8] font-semibold">portal.edutrack.edu</span>
            <span className="text-[#F4F1DE]/70">/admin/analytics</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#778D7A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#778D7A]"></span>
            </span>
            <span className="text-[10px] text-[#778D7A] font-mono font-medium">Synced</span>
          </div>
        </div>

        {/* Dashboard Canvas inside window */}
        <div className="grid grid-cols-12 min-h-[410px] bg-[#0D1B2A] text-[#F4F1DE]">
          
          {/* Mini Sidebar */}
          <div className="col-span-3 border-r border-[#1B263B] p-3 bg-[#0D1B2A]/90 hidden sm:flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 rounded-lg bg-[#415A77] border border-[#D4C4A8]/60 flex items-center justify-center text-xs font-bold text-[#F4F1DE] shadow-xs">
                  E
                </div>
                <div>
                  <span className="text-xs font-bold text-[#F4F1DE] tracking-tight block">EduTrack</span>
                  <span className="text-[9px] text-[#D4C4A8] block -mt-1 font-mono">Academic Cloud</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="px-2.5 py-1.5 rounded-lg bg-[#415A77] text-white font-medium flex items-center gap-2 shadow-xs border border-[#D4C4A8]/30">
                  <LayoutDashboard className="w-3.5 h-3.5 shrink-0 text-[#D4C4A8]" />
                  <span>Overview</span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg text-[#F4F1DE]/70 hover:text-white hover:bg-[#1B263B] flex items-center gap-2 transition-colors">
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>Students</span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg text-[#F4F1DE]/70 hover:text-white hover:bg-[#1B263B] flex items-center gap-2 transition-colors">
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>Courses</span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg text-[#F4F1DE]/70 hover:text-white hover:bg-[#1B263B] flex items-center gap-2 transition-colors">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Attendance</span>
                </div>
                <div className="px-2.5 py-1.5 rounded-lg text-[#F4F1DE]/70 hover:text-white hover:bg-[#1B263B] flex items-center gap-2 transition-colors">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span>Timetable</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1B263B] text-[10px] text-[#D4C4A8] flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#1B263B] border border-[#D4C4A8]/50 flex items-center justify-center text-[#D4C4A8] font-bold text-[10px]">
                EV
              </div>
              <div className="truncate">
                <p className="font-semibold text-[#F4F1DE] truncate">Dr. Vance</p>
                <p className="text-[9px] text-[#D4C4A8] font-mono">Academic Dean</p>
              </div>
            </div>
          </div>

          {/* Main Dashboard Canvas Area */}
          <div className="col-span-12 sm:col-span-9 p-3 sm:p-4 space-y-3 bg-[#0D1B2A] overflow-hidden">
            
            {/* Top Toolbar in Preview */}
            <div className="flex items-center justify-between pb-2 border-b border-[#1B263B]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#F4F1DE]">Fall 2026 Academic Term</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#415A77]/40 text-[#D4C4A8] font-mono font-medium border border-[#D4C4A8]/40">
                  Week 8 Live
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#D4C4A8] font-mono hidden sm:inline">Tue 10:45 AM</span>
                <div className="relative">
                  <Bell className="w-3.5 h-3.5 text-[#D4C4A8]" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#D4C4A8] rounded-full" />
                </div>
              </div>
            </div>

            {/* Metric KPI Cards in Holst Palette */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-[#1B263B] p-2.5 rounded-xl border border-[#415A77]/40 shadow-xs">
                <p className="text-[10px] text-[#D4C4A8] uppercase font-mono tracking-wider">Enrolled Scholars</p>
                <p className="text-lg font-bold text-[#F4F1DE] font-mono tabular-nums leading-tight">482</p>
                <div className="flex items-center gap-1 text-[10px] text-[#778D7A] mt-0.5 font-semibold">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>99.2% Active</span>
                </div>
              </div>

              <div className="bg-[#1B263B] p-2.5 rounded-xl border border-[#415A77]/40 shadow-xs">
                <p className="text-[10px] text-[#D4C4A8] uppercase font-mono tracking-wider">Attendance Rate</p>
                <p className="text-lg font-bold text-[#F4F1DE] font-mono tabular-nums leading-tight">92.4%</p>
                <p className="text-[10px] text-[#D4C4A8] mt-0.5 font-medium">Standard: &gt; 75%</p>
              </div>

              <div className="bg-[#1B263B] p-2.5 rounded-xl border border-[#415A77]/40 shadow-xs">
                <p className="text-[10px] text-[#D4C4A8] uppercase font-mono tracking-wider">Cohort Mean GPA</p>
                <p className="text-lg font-bold text-[#F4F1DE] font-mono tabular-nums leading-tight">3.48</p>
                <div className="flex items-center gap-1 text-[10px] text-[#778D7A] mt-0.5 font-semibold">
                  <span>+0.14 vs mid</span>
                </div>
              </div>
            </div>

            {/* Interactive Preview Tabs Bar */}
            <div className="bg-[#1B263B]/80 p-3 rounded-xl border border-[#415A77]/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#D4C4A8]">
                    {activeTab === 'attendance' && 'Weekly Session Attendance Dynamics'}
                    {activeTab === 'grades' && 'Cohort Letter Grade Distribution'}
                    {activeTab === 'conflicts' && 'Timetable Conflict Radar & Room Allocations'}
                  </span>
                </div>
                
                {/* Clickable View Switchers */}
                <div className="flex items-center gap-1 bg-[#0D1B2A] p-0.5 rounded-lg border border-[#415A77]/40 text-[10px]">
                  <button 
                    onClick={() => setActiveTab('attendance')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                      activeTab === 'attendance' 
                        ? 'bg-[#415A77] text-white shadow-xs' 
                        : 'text-[#D4C4A8]/70 hover:text-white'
                    }`}
                  >
                    Attendance
                  </button>
                  <button 
                    onClick={() => setActiveTab('grades')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                      activeTab === 'grades' 
                        ? 'bg-[#415A77] text-white shadow-xs' 
                        : 'text-[#D4C4A8]/70 hover:text-white'
                    }`}
                  >
                    Grades
                  </button>
                  <button 
                    onClick={() => setActiveTab('conflicts')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all cursor-pointer ${
                      activeTab === 'conflicts' 
                        ? 'bg-[#415A77] text-white shadow-xs' 
                        : 'text-[#D4C4A8]/70 hover:text-white'
                    }`}
                  >
                    Schedule
                  </button>
                </div>
              </div>

              {/* Tab 1: Attendance Dynamic Bars */}
              {activeTab === 'attendance' && (
                <motion.div 
                  key="attendance"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <div className="h-20 w-full flex items-end gap-2 pt-2 relative">
                    {/* 75% Threshold Line */}
                    <div className="absolute left-0 right-0 top-[25%] border-b border-dashed border-[#D4C4A8]/50 pointer-events-none flex items-center justify-end pr-1">
                      <span className="text-[8px] font-mono text-[#D4C4A8] bg-[#0D1B2A] px-1 rounded border border-[#D4C4A8]/40">75% Std</span>
                    </div>

                    {attendanceBars.map((bar, i) => (
                      <div 
                        key={i} 
                        className="flex-1 flex flex-col items-center gap-1 h-full justify-end cursor-pointer group"
                        onMouseEnter={() => setHoveredBarIndex(i)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      >
                        <div className="w-full h-full flex flex-col justify-end">
                          <motion.div 
                            className="w-full rounded-t-sm transition-colors duration-200 bg-[#415A77] group-hover:bg-[#D4C4A8] relative origin-bottom"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                            style={{ height: `${bar.rate}%` }}
                          >
                            {hoveredBarIndex === i && (
                              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0D1B2A] px-1.5 py-0.5 rounded border border-[#D4C4A8] text-[9px] text-[#D4C4A8] whitespace-nowrap z-10 shadow-lg font-mono">
                                {bar.rate}% ({bar.present} P)
                              </div>
                            )}
                          </motion.div>
                        </div>
                        <span className="text-[9px] text-[#D4C4A8]/80 font-mono group-hover:text-white transition-colors">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#D4C4A8]/90 pt-1 border-t border-[#415A77]/40">
                    <span>Average Daily Rate: <strong className="text-white">93.5%</strong></span>
                    <span className="text-[#778D7A] font-medium">All departments meeting target</span>
                  </div>
                </motion.div>
              )}

              {/* Tab 2: Grade Distribution */}
              {activeTab === 'grades' && (
                <motion.div 
                  key="grades"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 pt-1"
                >
                  <div className="space-y-1.5">
                    {gradeDistribution.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px]">
                        <span className="w-7 font-mono font-bold text-[#D4C4A8]">{item.grade}</span>
                        <div className="flex-1 h-3 bg-[#0D1B2A] rounded-full overflow-hidden p-0.5">
                          <motion.div 
                            className={`h-full rounded-full ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>
                        <span className="w-10 text-right font-mono text-[#F4F1DE]">{item.percent}%</span>
                        <span className="text-[#D4C4A8]/60 text-[9px]">({item.count})</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#D4C4A8]/90 pt-1 border-t border-[#415A77]/40">
                    <span>Grading Policy: <strong className="text-white">4.0 Scale Standard</strong></span>
                    <span className="text-[#D4C4A8]">Weighted Assessment Engine</span>
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Timetable Collision Radar */}
              {activeTab === 'conflicts' && (
                <motion.div 
                  key="conflicts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1.5 pt-1"
                >
                  {timetablePreview.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
                      className="p-1.5 rounded-lg bg-[#0D1B2A] border border-[#415A77]/40 flex items-center justify-between text-[10px] hover:border-[#D4C4A8]/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#D4C4A8] font-semibold">{item.time}</span>
                        <span className="font-bold text-[#F4F1DE]">{item.code}</span>
                        <span className="text-[#D4C4A8]/70 truncate max-w-[120px]">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-[#1B263B] text-[#D4C4A8] font-mono text-[9px] border border-[#415A77]/40">{item.room}</span>
                        <span className="text-[#778D7A] font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-[#778D7A]" />
                          <span>{item.status}</span>
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <div className="flex items-center justify-between text-[10px] text-[#778D7A] pt-1 border-t border-[#415A77]/40">
                    <span className="flex items-center gap-1 font-medium">
                      <Shield className="w-3 h-3 text-[#778D7A]" />
                      <span>Zero Room or Faculty Double-Bookings Detected</span>
                    </span>
                    <span className="font-mono text-[#D4C4A8]">100% Collision-Free</span>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Bottom Row: Quick Status Indicators */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-[#1B263B] p-2.5 rounded-xl border border-[#415A77]/40 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-[#D4C4A8] uppercase font-mono">Next Session · 11:00 AM</p>
                  <p className="font-semibold text-[#F4F1DE] truncate">CS-305 Database Eng</p>
                  <p className="text-[10px] text-[#D4C4A8]">Lab 4-C · 32 Students Enrolled</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#415A77]/40 border border-[#D4C4A8]/30 text-[#D4C4A8] flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="bg-[#1B263B] p-2.5 rounded-xl border border-[#D4C4A8]/30 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-[#D4C4A8] uppercase font-mono">Early Warning Radar</p>
                  <p className="font-semibold text-[#F4F1DE]">2 Alerts Flagged</p>
                  <p className="text-[10px] text-[#D4C4A8]/80">Roll Call &lt; 75% standard</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-[#D4C4A8]/20 border border-[#D4C4A8]/50 text-[#D4C4A8] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};
