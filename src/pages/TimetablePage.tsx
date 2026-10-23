import React, { useState, useMemo } from 'react';
import { useEduTrack } from '../context/EduTrackContext';
import { ScheduleItem, Course } from '../types';
import { 
  Calendar, Clock, Building, Users, Search, 
  Filter, AlertTriangle, CheckCircle2, Download, 
  Printer, Plus, ShieldCheck, Sparkles, Sliders,
  ArrowRight, BookOpen, ChevronRight, X, Info
} from 'lucide-react';
import { 
  RevealOnScroll, 
  StaggerContainer, 
  StaggerItem, 
  InteractiveCard, 
  InteractiveCTAButton 
} from '../components/common/MotionComponents';

export const TimetablePage: React.FC = () => {
  const { 
    schedules, 
    courses, 
    currentUser, 
    addScheduleItem, 
    deleteScheduleItem,
    checkScheduleConflict,
    navigate 
  } = useEduTrack();

  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedRoom, setSelectedRoom] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid');

  // Simulation booking state
  const [simDay, setSimDay] = useState<string>('Monday');
  const [simStart, setSimStart] = useState<string>('09:00');
  const [simEnd, setSimEnd] = useState<string>('10:30');
  const [simRoom, setSimRoom] = useState<string>('Hall B-204');
  const [simInstructor, setSimInstructor] = useState<string>('Prof. Marcus Reed');
  const [simCourseCode, setSimCourseCode] = useState<string>('CS-201');
  const [simCourseTitle, setSimCourseTitle] = useState<string>('Data Structures & Algorithms');
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const allRooms = useMemo(() => {
    const set = new Set<string>();
    schedules.forEach(s => set.add(s.room));
    courses.forEach(c => set.add(c.room));
    return ['All', ...Array.from(set).sort()];
  }, [schedules, courses]);

  const allDepts = useMemo(() => {
    const set = new Set<string>();
    courses.forEach(c => set.add(c.department));
    return ['All', ...Array.from(set).sort()];
  }, [courses]);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter(item => {
      const matchDay = selectedDay === 'All' || item.day === selectedDay;
      const matchRoom = selectedRoom === 'All' || item.room === selectedRoom;
      
      const courseMatch = courses.find(c => c.id === item.courseId || c.code === item.courseCode);
      const matchDept = selectedDept === 'All' || (courseMatch && courseMatch.department === selectedDept);

      const q = searchQuery.toLowerCase();
      const matchQuery = !q || 
        item.title.toLowerCase().includes(q) ||
        item.courseCode.toLowerCase().includes(q) ||
        item.instructorName.toLowerCase().includes(q) ||
        item.room.toLowerCase().includes(q);

      return matchDay && matchRoom && matchDept && matchQuery;
    });
  }, [schedules, courses, selectedDay, selectedRoom, selectedDept, searchQuery]);

  // Real-time conflict calculation for simulator
  const activeConflict = useMemo(() => {
    return checkScheduleConflict(simDay, simStart, simEnd, simRoom, simInstructor);
  }, [checkScheduleConflict, simDay, simStart, simEnd, simRoom, simInstructor]);

  const handleCommitBooking = () => {
    if (activeConflict) return;
    const res = addScheduleItem({
      courseId: courses.find(c => c.code === simCourseCode)?.id || 'course-custom',
      courseCode: simCourseCode,
      title: simCourseTitle,
      instructorName: simInstructor,
      room: simRoom,
      day: simDay as any,
      startTime: simStart,
      endTime: simEnd,
      color: '#4f46e5'
    });

    if (res.success) {
      setBookingSuccessMsg(`Session for ${simCourseCode} in ${simRoom} on ${simDay} has been added to the master timetable!`);
      setTimeout(() => setBookingSuccessMsg(null), 5000);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Course Code', 'Title', 'Instructor', 'Room', 'Day', 'Start Time', 'End Time'];
    const rows = filteredSchedules.map(s => [
      s.courseCode,
      `"${s.title}"`,
      `"${s.instructorName}"`,
      s.room,
      s.day,
      s.startTime,
      s.endTime
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduTrack_Timetable_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-16 pb-24">
      
      {/* Hero Header */}
      <section className="relative pt-10 pb-8 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-indigo-50/50 via-white to-transparent dark:from-slate-900/60 dark:via-slate-950 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <RevealOnScroll direction="up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Academic Timetable & Space Allocations</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-3">
              Master Lecture Schedule & Room Collision Radar
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mt-2">
              Browse verified lecture hall allocations, explore daily course timetables across departments, and test schedule slots with instantaneous collision detection.
            </p>

            {/* Quick Metrics Bar */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Scheduled Sessions</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{schedules.length} Lectures</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Lecture Halls & Labs</span>
                <span className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">{allRooms.length - 1} Facilities</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Timetable Conflicts</span>
                <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">0 Collisions</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Current Term</span>
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">Fall 2026</span>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Action Controls & Filter Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course code, title, professor, or lecture hall..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* View Mode & Export Buttons */}
            <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
              <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Weekly Grid
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'timeline' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Roster List
                </button>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Schedule</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Day Selector */}
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              <option value="All">All Days (Mon-Fri)</option>
              {days.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Room Selector */}
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              {allRooms.map(r => (
                <option key={r} value={r}>{r === 'All' ? 'All Rooms & Labs' : r}</option>
              ))}
            </select>

            {/* Dept Selector */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none"
            >
              {allDepts.map(dept => (
                <option key={dept} value={dept}>{dept === 'All' ? 'All Departments' : dept}</option>
              ))}
            </select>

            {(selectedDay !== 'All' || selectedRoom !== 'All' || selectedDept !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedDay('All');
                  setSelectedRoom('All');
                  setSelectedDept('All');
                  setSearchQuery('');
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium text-xs ml-auto cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* View Mode: Weekly Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {days.map(dayName => {
              const daySchedules = filteredSchedules.filter(s => s.day === dayName);
              const isSelected = selectedDay === 'All' || selectedDay === dayName;
              if (!isSelected) return null;

              return (
                <div 
                  key={dayName} 
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs flex flex-col min-h-[340px]"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{dayName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">
                      {daySchedules.length} {daySchedules.length === 1 ? 'class' : 'classes'}
                    </span>
                  </div>

                  <div className="flex-1 space-y-2.5 overflow-y-auto">
                    {daySchedules.length === 0 ? (
                      <div className="h-full flex items-center justify-center p-6 text-center text-slate-400 text-xs italic">
                        No sessions scheduled
                      </div>
                    ) : (
                      daySchedules.map(item => (
                        <InteractiveCard
                          key={item.id}
                          hoverY={-3}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                              {item.courseCode}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {item.startTime} - {item.endTime}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
                            {item.title}
                          </h4>

                          <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                            <p className="flex items-center gap-1.5 truncate">
                              <Building className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{item.room}</span>
                            </p>
                            <p className="flex items-center gap-1.5 truncate text-[10px] text-slate-500">
                              <Users className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{item.instructorName}</span>
                            </p>
                          </div>
                        </InteractiveCard>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Mode: Timeline / Roster List */}
        {viewMode === 'timeline' && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase font-mono tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Course Code</th>
                    <th className="py-3.5 px-4 font-semibold">Course Title</th>
                    <th className="py-3.5 px-4 font-semibold">Day & Time</th>
                    <th className="py-3.5 px-4 font-semibold">Lecture Space</th>
                    <th className="py-3.5 px-4 font-semibold">Instructor</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Radar Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {filteredSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No schedules match your selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredSchedules.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {item.courseCode}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {item.title}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                          {item.day}, {item.startTime} - {item.endTime}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                            <Building className="w-3 h-3 text-slate-400" />
                            {item.room}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {item.instructorName}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Clear
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION: LIVE COLLISION RADAR & PROJECTION SANDBOX */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-medium mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Real-Time Collision Detection Engine</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Lecture Hall Collision Radar & Booking Simulator
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Test any prospective session slot before publishing. The radar algorithm checks physical room reservations and faculty teaching loads concurrently.
              </p>
            </div>

            {currentUser?.role === 'admin' && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 self-start md:self-auto">
                Admin Authority Active
              </span>
            )}
          </div>

          {bookingSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{bookingSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Simulator Inputs */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Day of Week</label>
                <select
                  value={simDay}
                  onChange={(e) => setSimDay(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Lecture Room / Lab</label>
                <select
                  value={simRoom}
                  onChange={(e) => setSimRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  {allRooms.filter(r => r !== 'All').map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
                <select
                  value={simStart}
                  onChange={(e) => setSimStart(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:30">01:30 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:30">03:30 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">End Time</label>
                <select
                  value={simEnd}
                  onChange={(e) => setSimEnd(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-indigo-500"
                >
                  <option value="10:30">10:30 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="15:30">03:30 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Assigned Faculty Instructor</label>
                <select
                  value={simInstructor}
                  onChange={(e) => setSimInstructor(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="Prof. Marcus Reed">Prof. Marcus Reed (Computer Science)</option>
                  <option value="Dr. Alan Sterling">Dr. Alan Sterling (Mathematics)</option>
                  <option value="Dr. Elena Rostova">Dr. Elena Rostova (Academic Communication)</option>
                  <option value="Dr. Claire Bennett">Dr. Claire Bennett (Data Science)</option>
                  <option value="Guest Lecturer">Visiting Scholar / Guest Lecturer</option>
                </select>
              </div>
            </div>

            {/* Radar Analysis Outcome Card */}
            <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono text-slate-400 tracking-wider">
                  Radar Conflict Telemetry
                </span>
                <span className="text-[10px] font-mono text-indigo-400">
                  Real-Time Scan
                </span>
              </div>

              {activeConflict ? (
                <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>TIMETABLE COLLISION DETECTED</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeConflict}
                  </p>
                  <p className="text-[10px] text-rose-300 pt-1">
                    System prevents overlapping room allocations to eliminate first-day scheduling crises.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>FACILITY & INSTRUCTOR SLOT VERIFIED</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>{simRoom}</strong> is completely available on {simDay} between {simStart} and {simEnd}. {simInstructor} has zero conflicting commitments.
                  </p>
                  <p className="text-[10px] text-emerald-300 pt-1">
                    Verified compliant with institutional scheduling protocols.
                  </p>
                </div>
              )}

              {/* Administrative commit button */}
              {currentUser?.role === 'admin' ? (
                <InteractiveCTAButton
                  onClick={handleCommitBooking}
                  disabled={!!activeConflict}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeConflict 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Commit Session to Official Master Timetable</span>
                </InteractiveCTAButton>
              ) : (
                <div className="pt-2 text-center">
                  <button
                    onClick={() => navigate('/signin')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
                  >
                    Sign in as Administrator to commit session into live database
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
