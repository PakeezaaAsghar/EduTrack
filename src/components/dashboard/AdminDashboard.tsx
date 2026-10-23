import React, { useState } from 'react';
import { useEduTrack } from '../../context/EduTrackContext';
import { DashboardLayout } from './DashboardLayout';
import { 
  Users, BookOpen, CheckCircle2, Award, Calendar, 
  AlertTriangle, History, FileText, Settings, Plus, 
  Search, Download, Upload, Trash2, Edit2, Check, 
  X, Filter, Eye, Printer, ChevronRight, RefreshCw, AlertCircle,
  UserCircle, BarChart3, Database
} from 'lucide-react';
import { Student, Course, AttendanceStatus } from '../../types';
import { AdminAnalyticsView } from './AdminAnalyticsView';
import { 
  StaggerContainer, 
  DashboardStatCard, 
  AnimatedProgressBar, 
  AnimatedBarItem 
} from '../common/MotionComponents';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser,
    students, addStudent, updateStudent, deleteStudent, exportStudentsCSV, importStudentsCSV,
    courses, addCourse, deleteCourse,
    attendance, recordAttendance, calculateStudentAttendance,
    grades, addGrade, deleteGrade, getStudentCourseGrade, getStudentOverallGPA,
    schedules, addScheduleItem, deleteScheduleItem, checkScheduleConflict,
    alerts, resolveAlert,
    activityLogs,
    settings, updateSettings, resetAllData,
    supabaseConnected, supabaseStatus
  } = useEduTrack();

  const [activeTab, setActiveTab] = useState('overview');

  // Modals
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [importCsvOpen, setImportCsvOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);

  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [addScheduleOpen, setAddScheduleOpen] = useState(false);
  const [addGradeOpen, setAddGradeOpen] = useState(false);
  const [transcriptStudentId, setTranscriptStudentId] = useState<string>(students[0]?.id || '');

  // Search & Filters for Students
  const [studentSearch, setStudentSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Attendance Module Local State
  const [selectedAttendanceCourse, setSelectedAttendanceCourse] = useState<string>(courses[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [rollCallState, setRollCallState] = useState<Record<string, AttendanceStatus>>({});
  const [attendanceSavedToast, setAttendanceSavedToast] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    studentId: `STU-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    department: 'Computer Science',
    year: 'Freshman' as Student['year'],
    phone: ''
  });

  // New Course Form State
  const [newCourse, setNewCourse] = useState({
    code: '',
    title: '',
    credits: 3,
    department: 'Computer Science',
    semester: settings.academicTerm,
    instructorId: 'user-teacher-1',
    instructorName: 'Prof. Marcus Reed',
    room: 'Hall B-204',
    scheduleDay: 'Monday' as Course['scheduleDay'],
    scheduleTime: '09:00 - 10:30',
    capacity: 40,
    description: '',
    color: '#3b82f6'
  });

  // New Timetable Schedule State
  const [newSchedule, setNewSchedule] = useState({
    courseId: courses[0]?.id || '',
    courseCode: courses[0]?.code || 'CS-201',
    title: courses[0]?.title || 'Data Structures',
    instructorName: 'Prof. Marcus Reed',
    room: 'Hall B-204',
    day: 'Monday' as const,
    startTime: '09:00',
    endTime: '10:30',
    color: '#3b82f6'
  });
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  // New Assessment Grade Form State
  const [newAssessment, setNewAssessment] = useState({
    studentId: students[0]?.id || '',
    courseId: courses[0]?.id || '',
    assessmentType: 'Assignment' as const,
    title: '',
    score: 85,
    maxScore: 100,
    weight: 20,
    feedback: ''
  });

  // Aggregate Metrics
  const totalStudents = students.length;
  const activeCourses = courses.length;
  const overallAttendanceAvg = students.length > 0 
    ? Math.round((students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length) * 10) / 10 
    : 92;
  const meanGPA = students.length > 0 
    ? (students.reduce((acc, s) => acc + s.gpa, 0) / students.length).toFixed(2) 
    : '3.45';

  const atRiskStudents = students.filter(s => s.status !== 'active' || s.attendanceRate < settings.attendanceThreshold);

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          s.studentId.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // Attendance Roll Call Handler
  const handleSaveAttendance = () => {
    const course = courses.find(c => c.id === selectedAttendanceCourse);
    if (!course) return;

    const records = students
      .filter(s => s.enrolledCourses.includes(selectedAttendanceCourse))
      .map(s => ({
        courseId: selectedAttendanceCourse,
        studentId: s.id,
        status: rollCallState[s.id] || 'present',
        date: attendanceDate
      }));

    recordAttendance(records);
    setAttendanceSavedToast(true);
    setTimeout(() => setAttendanceSavedToast(false), 3000);
  };

  const handleMarkAllPresent = () => {
    const newState: Record<string, AttendanceStatus> = {};
    students.forEach(s => {
      newState[s.id] = 'present';
    });
    setRollCallState(newState);
  };

  // Add Schedule with Conflict Check
  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleError(null);

    const res = addScheduleItem({
      courseId: newSchedule.courseId,
      courseCode: newSchedule.courseCode,
      title: newSchedule.title,
      instructorName: newSchedule.instructorName,
      room: newSchedule.room,
      day: newSchedule.day,
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      color: newSchedule.color
    });

    if (!res.success) {
      setScheduleError(res.conflictReason || 'Conflict detected in schedule.');
    } else {
      setAddScheduleOpen(false);
    }
  };

  // Add Assessment Grade Handler
  const handleAddGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === newAssessment.studentId);
    const course = courses.find(c => c.id === newAssessment.courseId);
    if (!student || !course || !newAssessment.title.trim()) return;

    addGrade({
      studentId: student.id,
      studentName: student.name,
      courseId: course.id,
      courseName: course.title,
      assessmentType: newAssessment.assessmentType,
      title: newAssessment.title,
      score: Number(newAssessment.score),
      maxScore: Number(newAssessment.maxScore),
      weight: Number(newAssessment.weight),
      date: new Date().toISOString().slice(0, 10),
      feedback: newAssessment.feedback
    });
    setAddGradeOpen(false);
  };

  // Student Transcript Target
  const transcriptStudent = students.find(s => s.id === transcriptStudentId) || students[0];

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
    >
      <div className="space-y-6">

        {/* ===================== OVERVIEW TAB ===================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Admin Command Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-900/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">Institutional Command Center</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-emerald-300 font-mono">System Online</span>
                </div>
                <h2 className="text-xl font-bold">Welcome back, {currentUser?.name}</h2>
                <p className="text-xs text-slate-300">
                  {currentUser?.title || 'Academic Administrator'} · {currentUser?.department || 'Academic Administration'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Institutional Analytics</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <UserCircle className="w-3.5 h-3.5" />
                  <span>Edit Admin Profile</span>
                </button>
                <button
                  onClick={() => setAddStudentOpen(true)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enroll Student</span>
                </button>
              </div>
            </div>

            {/* Top Stat Strips with Staggered Entrance & Numerical Counting */}
            <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardStatCard
                title="Enrolled Cohort"
                value={totalStudents}
                numericValue={totalStudents}
                icon={Users}
                iconColor="text-indigo-600 dark:text-indigo-400"
                subtext={
                  <>
                    <span className="text-emerald-500">✓</span>
                    <span>{students.filter(s => s.status === 'active').length} in Good Standing</span>
                  </>
                }
                onClick={() => setActiveTab('students')}
              />

              <DashboardStatCard
                title="Active Courses"
                value={activeCourses}
                numericValue={activeCourses}
                icon={BookOpen}
                iconColor="text-blue-600 dark:text-blue-400"
                subtext={<span>Term: {settings.academicTerm}</span>}
                onClick={() => setActiveTab('courses')}
              />

              <DashboardStatCard
                title="Attendance Rate"
                value={`${overallAttendanceAvg}%`}
                numericValue={overallAttendanceAvg}
                decimals={1}
                suffix="%"
                icon={CheckCircle2}
                iconColor="text-emerald-600 dark:text-emerald-400"
                subtext={<span>Target: ≥ {settings.attendanceThreshold}%</span>}
                onClick={() => setActiveTab('attendance')}
              />

              <DashboardStatCard
                title="Cohort Mean GPA"
                value={meanGPA}
                numericValue={parseFloat(meanGPA) || 3.45}
                decimals={2}
                icon={Award}
                iconColor="text-purple-600 dark:text-purple-400"
                subtext={<span>4.0 Scale Standard</span>}
                onClick={() => setActiveTab('grades')}
              />
            </StaggerContainer>

            {/* Middle Row: Attendance Chart & Grade Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Attendance Chart */}
              <div className="lg:col-span-7 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Weekly Attendance Trajectory
                    </h3>
                    <p className="text-xs text-slate-500">
                      Rolling attendance percentages across instructional weekdays
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md">
                      Avg: {overallAttendanceAvg}%
                    </span>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                    >
                      Telemetry Radar →
                    </button>
                  </div>
                </div>

                <div className="h-44 flex items-end gap-3 pt-6 px-2">
                  {[
                    { day: 'Mon', pct: 94 },
                    { day: 'Tue', pct: 91 },
                    { day: 'Wed', pct: 96 },
                    { day: 'Thu', pct: 89 },
                    { day: 'Fri', pct: 84 },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.pct}%
                      </span>
                      <div className="w-full max-w-[48px] h-full flex flex-col justify-end">
                        <AnimatedBarItem
                          percentage={bar.pct}
                          delay={i * 0.08}
                          color="bg-indigo-600 dark:bg-indigo-500"
                          hoverColor="hover:bg-indigo-700 dark:hover:bg-indigo-400"
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade Distribution Bar */}
              <div className="lg:col-span-5 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Grade Distribution
                  </h3>
                  <p className="text-xs text-slate-500">
                    Distribution across enrolled assessments
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    { grade: 'A (90–100%)', count: 4, pct: 45, color: 'bg-emerald-500' },
                    { grade: 'B (80–89%)', count: 3, pct: 30, color: 'bg-indigo-500' },
                    { grade: 'C (70–79%)', count: 1, pct: 15, color: 'bg-amber-500' },
                    { grade: 'D/F (<70%)', count: 2, pct: 10, color: 'bg-rose-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.grade}</span>
                        <span className="font-mono text-slate-500">{item.count} students</span>
                      </div>
                      <AnimatedProgressBar
                        value={item.pct}
                        color={item.color}
                        className="shadow-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 flex justify-between">
                  <span>Grading Policy: Weighted Assessments</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setActiveTab('settings')} className="text-indigo-600 hover:underline">
                      Configure scale
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <button onClick={() => setActiveTab('analytics')} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                      View Grade Curves →
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Students Requiring Attention & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* At-risk students */}
              <div className="lg:col-span-8 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Students Requiring Attention ({atRiskStudents.length})
                    </h3>
                  </div>
                  <button 
                    onClick={() => setActiveTab('alerts')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    View Alert Center
                  </button>
                </div>

                {atRiskStudents.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">All students are currently meeting attendance and GPA standards.</p>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {atRiskStudents.map((stu) => (
                      <div key={stu.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{stu.name}</p>
                          <p className="text-[11px] text-slate-500">{stu.studentId} · {stu.department}</p>
                        </div>
                        <div className="text-right space-y-0.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            stu.status === 'probation' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {stu.status}
                          </span>
                          <p className="text-[10px] text-slate-500">
                            Attendance: <span className="font-mono text-rose-500 font-bold">{stu.attendanceRate}%</span> · GPA: <span className="font-mono">{stu.gpa}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions Panel */}
              <div className="lg:col-span-4 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setAddStudentOpen(true)}
                    className="w-full py-2.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-indigo-600" />
                    <span>Enroll New Student</span>
                  </button>
                  <button
                    onClick={() => setAddCourseOpen(true)}
                    className="w-full py-2.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Create Course Offering</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="w-full py-2.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Record Daily Attendance</span>
                  </button>
                  <button
                    onClick={exportStudentsCSV}
                    className="w-full py-2.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-purple-600" />
                    <span>Export Students to CSV</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ===================== ANALYTICS TAB ===================== */}
        {activeTab === 'analytics' && (
          <AdminAnalyticsView setActiveTab={setActiveTab} />
        )}

        {/* ===================== STUDENTS TAB ===================== */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by name, ID, or email..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Department filter */}
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Mathematics">Mathematics</option>
                </select>

                {/* Status filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <option value="All">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="warning">Warning</option>
                  <option value="probation">Probation</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setImportCsvOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center gap-1.5"
                  title="Import from CSV"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import CSV</span>
                </button>
                <button
                  onClick={exportStudentsCSV}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center gap-1.5"
                  title="Export to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setAddStudentOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Student</span>
                </button>
              </div>

            </div>

            {/* Students Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Student Name & ID</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3 text-right">GPA</th>
                    <th className="px-4 py-3 text-right">Attendance %</th>
                    <th className="px-4 py-3">Standing</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        No students match the selected search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 dark:text-white">{s.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{s.studentId} · {s.email}</p>
                        </td>
                        <td className="px-4 py-3">{s.department}</td>
                        <td className="px-4 py-3">{s.year}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                          {s.gpa.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums">
                          <span className={s.attendanceRate < settings.attendanceThreshold ? 'text-rose-600 font-bold' : 'text-emerald-600'}>
                            {s.attendanceRate}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            s.status === 'active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                            s.status === 'warning' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                            'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => setSelectedStudentForDetail(s)}
                            className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                            title="View academic dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove student ${s.name} from institutional records?`)) {
                                deleteStudent(s.id);
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ===================== COURSES TAB ===================== */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Institutional Course Catalog
                </h3>
                <p className="text-xs text-slate-500">
                  {courses.length} active offerings in {settings.academicTerm}
                </p>
              </div>
              <button
                onClick={() => setAddCourseOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Course</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div 
                  key={course.id}
                  className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {course.code}
                    </span>
                    <span className="text-[11px] text-slate-500">{course.credits} Credits</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {course.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <p>Instructor: <span className="font-medium text-slate-900 dark:text-white">{course.instructorName}</span></p>
                    <p>Room: <span className="font-mono">{course.room}</span> · {course.scheduleDay} ({course.scheduleTime})</p>
                    <p>Enrolled: <span className="font-mono tabular-nums">{course.enrolledCount} / {course.capacity}</span> capacity</p>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        if (confirm(`Delete course ${course.code}?`)) deleteCourse(course.id);
                      }}
                      className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== ATTENDANCE TAB ===================== */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Class Attendance & Roll Call
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record session participation and update institutional attendance tallies
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold">Course</label>
                    <select
                      value={selectedAttendanceCourse}
                      onChange={(e) => setSelectedAttendanceCourse(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold">Session Date</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>

              {attendanceSavedToast && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Attendance roll call records updated successfully!</span>
                </div>
              )}

              {/* Roster Checklist */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Enrolled Student Roster</span>
                  <button
                    onClick={handleMarkAllPresent}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    Mark All Present
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {students.map((student) => {
                    const currentStatus = rollCallState[student.id] || 'present';
                    return (
                      <div key={student.id} className="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{student.studentId} · Current Rate: {student.attendanceRate}%</p>
                        </div>

                        {/* Status Radio Buttons */}
                        <div className="flex items-center gap-1.5">
                          {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map((status) => {
                            const isSelected = currentStatus === status;
                            return (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setRollCallState({ ...rollCallState, [student.id]: status })}
                                className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors ${
                                  isSelected 
                                    ? status === 'present' ? 'bg-emerald-600 text-white' :
                                      status === 'late' ? 'bg-amber-600 text-white' :
                                      status === 'absent' ? 'bg-rose-600 text-white' : 'bg-slate-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSaveAttendance}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Submit Roll Call</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ===================== GRADES & GPA TAB ===================== */}
        {activeTab === 'grades' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Assessment Gradebook & Weighted GPA
                </h3>
                <p className="text-xs text-slate-500">
                  Record exam, quiz, and assignment scores with weighted percentages
                </p>
              </div>
              <button
                onClick={() => setAddGradeOpen(true)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Record Assessment</span>
              </button>
            </div>

            {/* Assessment Records Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Assessment Title</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3 text-right">Score</th>
                    <th className="px-4 py-3 text-right">Weight</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {grades.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {g.studentName}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {g.courseName}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {g.title}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                          {g.assessmentType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
                        {g.score} / {g.maxScore} ({Math.round((g.score / g.maxScore) * 100)}%)
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-500">
                        {g.weight}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteGrade(g.id)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                          title="Delete assessment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ===================== CLASS SCHEDULE & CONFLICT DETECTION TAB ===================== */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Institutional Timetable Scheduler
                </h3>
                <p className="text-xs text-slate-500">
                  Weekly class matrix with automated collision detection
                </p>
              </div>
              <button
                onClick={() => { setScheduleError(null); setAddScheduleOpen(true); }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Timetable Slot</span>
              </button>
            </div>

            {/* Weekly Timetable Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map((day) => {
                const dayItems = schedules.filter(s => s.day === day);
                return (
                  <div key={day} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 shadow-xs">
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300">{day}</span>
                      <span className="text-[10px] font-mono text-slate-400">{dayItems.length} slots</span>
                    </div>

                    <div className="space-y-2 min-h-[160px]">
                      {dayItems.length === 0 ? (
                        <p className="text-[11px] text-slate-400 text-center pt-8">No scheduled sessions</p>
                      ) : (
                        dayItems.map((slot) => (
                          <div 
                            key={slot.id}
                            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/70 text-xs space-y-1 relative group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                                {slot.courseCode}
                              </span>
                              <button
                                onClick={() => deleteScheduleItem(slot.id)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-500"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="font-medium text-slate-900 dark:text-white truncate leading-tight">
                              {slot.title}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono">
                              {slot.startTime} – {slot.endTime}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {slot.room} · {slot.instructorName}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ===================== ACADEMIC ALERTS TAB ===================== */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Rule-Based Early Academic Warning Alerts
              </h3>
              <p className="text-xs text-slate-500">
                Automatic triggers for low attendance (&lt;{settings.attendanceThreshold}%), failing assessments, and probation
              </p>
            </div>

            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">No active academic alerts</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-colors ${
                      alert.resolved 
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60' 
                        : alert.severity === 'critical'
                        ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                        : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'}`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs">{alert.studentName}</p>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/70 dark:bg-slate-900/70">
                            {alert.type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed">{alert.message}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Date flagged: {alert.timestamp}</p>
                      </div>
                    </div>

                    {!alert.resolved && (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1 text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs whitespace-nowrap"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===================== ACTIVITY LOGS TAB ===================== */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Institutional Activity & Audit Log
              </h3>
              <p className="text-xs text-slate-500">
                Chronological record of registrations, roll calls, and policy alterations
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs shadow-xs">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{log.action}</span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">· {log.role}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap shrink-0">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== REPORTS & TRANSCRIPTS TAB ===================== */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            
            <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Student Academic Transcript Generator
                </h3>
                <p className="text-xs text-slate-500">
                  Generate formal, print-ready student report cards and academic dossiers
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={transcriptStudentId}
                  onChange={(e) => setTranscriptStudentId(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                  ))}
                </select>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Official Transcript</span>
                </button>
              </div>
            </div>

            {/* Print-ready Academic Transcript Card */}
            {transcriptStudent && (
              <div className="p-8 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
                
                {/* Transcript Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 dark:border-slate-700 pb-4">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-wide">
                      {settings.institutionName}
                    </h2>
                    <p className="text-xs text-slate-500">Office of the University Registrar · Official Student Academic Transcript</p>
                  </div>
                  <div className="text-right text-xs font-mono">
                    <p className="font-bold">Term: {settings.academicTerm}</p>
                    <p className="text-slate-400">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Student Info Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Student Name</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{transcriptStudent.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Student ID</p>
                    <p className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">{transcriptStudent.studentId}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Department / Program</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{transcriptStudent.department}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold">Academic Standing</p>
                    <p className="font-mono font-bold capitalize mt-0.5">{transcriptStudent.status}</p>
                  </div>
                </div>

                {/* Course Breakdown Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Registered Courses & Grade Evaluations
                  </h4>
                  <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 font-semibold text-slate-700 dark:text-slate-300">
                      <tr>
                        <th className="p-3">Course Code & Title</th>
                        <th className="p-3 text-right">Credits</th>
                        <th className="p-3 text-right">Attendance %</th>
                        <th className="p-3 text-right">Final Score</th>
                        <th className="p-3 text-right">Letter Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {transcriptStudent.enrolledCourses.map((cId) => {
                        const course = courses.find(c => c.id === cId);
                        const grade = getStudentCourseGrade(transcriptStudent.id, cId);
                        const att = calculateStudentAttendance(transcriptStudent.id, cId);
                        return (
                          <tr key={cId}>
                            <td className="p-3">
                              <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">{course?.code}</span>
                              <span className="ml-2 font-medium">{course?.title}</span>
                            </td>
                            <td className="p-3 text-right font-mono">{course?.credits || 3}</td>
                            <td className="p-3 text-right font-mono">{att.percentage}%</td>
                            <td className="p-3 text-right font-mono font-semibold">{grade.weightedScore > 0 ? `${grade.weightedScore}%` : 'In Progress'}</td>
                            <td className="p-3 text-right font-mono font-bold">{grade.letterGrade}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary GPA & Certification */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-xs text-slate-500">Institutional Registrar Remarks</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Student is matriculated and eligible for academic honors. All credits verified.
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Cumulative Grade Point Average</p>
                    <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                      {transcriptStudent.gpa.toFixed(2)} / 4.00
                    </p>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* ===================== SETTINGS TAB ===================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Academic System Configuration
              </h3>
              <p className="text-xs text-slate-500">
                Institutional thresholds, late penalty ratios, and grading scales
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Attendance Minimum Threshold ({settings.attendanceThreshold}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={settings.attendanceThreshold}
                  onChange={(e) => updateSettings({ attendanceThreshold: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Students dropping below this percentage automatically trigger early warning alerts.
                </p>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-semibold">
                  <input
                    type="checkbox"
                    checked={settings.lateCountsAsAttended}
                    onChange={(e) => updateSettings({ lateCountsAsAttended: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Late arrivals count towards attended percentage</span>
                </label>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Current Academic Term
                </label>
                <input
                  type="text"
                  value={settings.academicTerm}
                  onChange={(e) => updateSettings({ academicTerm: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institution Name
                </label>
                <input
                  type="text"
                  value={settings.institutionName}
                  onChange={(e) => updateSettings({ institutionName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Supabase Cloud Database Integration Panel */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Supabase Cloud Integration</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono font-medium border border-emerald-200 dark:border-emerald-800">
                          Project: bijklibeveykmyjbzcik
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {supabaseStatus}
                      </p>
                    </div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${supabaseConnected ? 'bg-emerald-500 ring-4 ring-emerald-500/20' : 'bg-amber-500 ring-4 ring-amber-500/20'}`} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase font-semibold">Table 1</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">students_profile</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Student signups, GPA, attendance & year</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-semibold">Table 2</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">teachers_profile</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Faculty signups, titles & office hours</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase font-semibold">Table 3</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">admins_profile</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Administrator accounts & permissions</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] font-mono text-sky-600 dark:text-sky-400 uppercase font-semibold">Table 4</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">contact_messages</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Support & visitor inquiries from contact form</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 sm:col-span-2 lg:col-span-2">
                    <p className="text-[10px] font-mono text-purple-600 dark:text-purple-400 uppercase font-semibold">Table 5</p>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">chatbot_queries</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">All questions asked to AI Chatbot with user role & timestamps</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Reset Institutional Database</p>
                  <p className="text-[11px] text-slate-500">Restore factory demonstration students, courses, and schedules.</p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Reset all academic records to default demo state?')) {
                      resetAllData();
                      alert('Data restored to institutional defaults.');
                    }
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-lg hover:bg-rose-100"
                >
                  Reset Records
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ===================== MODALS ===================== */}

      {/* 1. Add Student Modal */}
      {addStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Enroll New Student</h3>
              <button onClick={() => setAddStudentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newStudent.name || !newStudent.email) return;
                addStudent({
                  studentId: newStudent.studentId,
                  name: newStudent.name,
                  email: newStudent.email,
                  department: newStudent.department,
                  year: newStudent.year,
                  phone: newStudent.phone,
                  enrolledCourses: ['course-1', 'course-2']
                });
                setAddStudentOpen(false);
                setNewStudent({
                  name: '',
                  email: '',
                  studentId: `STU-2024-${Math.floor(1000 + Math.random() * 9000)}`,
                  department: 'Computer Science',
                  year: 'Freshman',
                  phone: ''
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Institutional Email *</label>
                <input
                  type="email"
                  required
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  placeholder="e.g. j.hayes@student.edutrack.edu"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <select
                    value={newStudent.department}
                    onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Mathematics">Mathematics</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Year Standing</label>
                  <select
                    value={newStudent.year}
                    onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddStudentOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Import CSV Modal */}
      {importCsvOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Import Students from CSV</h3>
              <button onClick={() => setImportCsvOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-500">
              Paste CSV text formatted as: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">ID,Name,Email,Department,Year,GPA,Attendance</code>
            </p>

            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder={`STU-2024-9001,Lucas Vance,l.vance@student.edutrack.edu,Computer Science,Junior,3.8,94\nSTU-2024-9002,Amara Diallo,a.diallo@student.edutrack.edu,Data Science,Freshman,3.9,98`}
              className="w-full p-3 font-mono text-[11px] rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setImportCsvOpen(false)}
                className="px-4 py-2 text-slate-600 dark:text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const res = importStudentsCSV(csvContent);
                  alert(`Imported ${res.imported} student records.`);
                  setImportCsvOpen(false);
                  setCsvContent('');
                }}
                className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              >
                Process CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Student Dossier Detail Modal */}
      {selectedStudentForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedStudentForDetail.name}</h3>
                <p className="text-[11px] text-slate-500 font-mono">{selectedStudentForDetail.studentId} · {selectedStudentForDetail.department}</p>
              </div>
              <button onClick={() => setSelectedStudentForDetail(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">GPA</span>
                <p className="text-base font-bold font-mono text-slate-900 dark:text-white">{selectedStudentForDetail.gpa}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Attendance</span>
                <p className="text-base font-bold font-mono text-emerald-600">{selectedStudentForDetail.attendanceRate}%</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Standing</span>
                <p className="text-xs font-bold capitalize mt-1 text-indigo-600">{selectedStudentForDetail.status}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">Enrolled Courses</h4>
              <div className="space-y-1.5">
                {selectedStudentForDetail.enrolledCourses.map(cId => {
                  const c = courses.find(course => course.id === cId);
                  return (
                    <div key={cId} className="p-2 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                      <span className="font-semibold">{c?.code} · {c?.title}</span>
                      <span className="font-mono text-slate-500">{c?.room}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedStudentForDetail(null)}
                className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Add Course Modal */}
      {addCourseOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Course Offering</h3>
              <button onClick={() => setAddCourseOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCourse.code || !newCourse.title) return;
                addCourse(newCourse);
                setAddCourseOpen(false);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    placeholder="e.g. CS-450"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Credits</label>
                  <input
                    type="number"
                    value={newCourse.credits}
                    onChange={(e) => setNewCourse({ ...newCourse, credits: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="e.g. Distributed Computing"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Classroom Room</label>
                  <input
                    type="text"
                    value={newCourse.room}
                    onChange={(e) => setNewCourse({ ...newCourse, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newCourse.capacity}
                    onChange={(e) => setNewCourse({ ...newCourse, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddCourseOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Timetable Slot Modal with Conflict Detection Alert */}
      {addScheduleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Schedule Class Timetable Slot</h3>
              <button onClick={() => setAddScheduleOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {scheduleError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Collision Detected!</p>
                  <p className="text-[11px] mt-0.5">{scheduleError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleAddSchedule} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Course</label>
                <select
                  value={newSchedule.courseId}
                  onChange={(e) => {
                    const c = courses.find(course => course.id === e.target.value);
                    if (c) {
                      setNewSchedule({
                        ...newSchedule,
                        courseId: c.id,
                        courseCode: c.code,
                        title: c.title,
                        instructorName: c.instructorName,
                        room: c.room
                      });
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Day</label>
                  <select
                    value={newSchedule.day}
                    onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Room</label>
                  <input
                    type="text"
                    required
                    value={newSchedule.room}
                    onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newSchedule.startTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={newSchedule.endTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddScheduleOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Verify & Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Add Assessment Grade Modal */}
      {addGradeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Assessment Score</h3>
              <button onClick={() => setAddGradeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddGrade} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Student</label>
                <select
                  value={newAssessment.studentId}
                  onChange={(e) => setNewAssessment({ ...newAssessment, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Course</label>
                <select
                  value={newAssessment.courseId}
                  onChange={(e) => setNewAssessment({ ...newAssessment, courseId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Assessment Type</label>
                  <select
                    value={newAssessment.assessmentType}
                    onChange={(e) => setNewAssessment({ ...newAssessment, assessmentType: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Assignment">Assignment</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Midterm">Midterm Exam</option>
                    <option value="Final Exam">Final Exam</option>
                    <option value="Project">Project Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (%)</label>
                  <input
                    type="number"
                    value={newAssessment.weight}
                    onChange={(e) => setNewAssessment({ ...newAssessment, weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={newAssessment.title}
                  onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                  placeholder="e.g. Midterm 1: Logic Gates"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Score Earned</label>
                  <input
                    type="number"
                    value={newAssessment.score}
                    onChange={(e) => setNewAssessment({ ...newAssessment, score: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={newAssessment.maxScore}
                    onChange={(e) => setNewAssessment({ ...newAssessment, maxScore: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddGradeOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Record Mark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
