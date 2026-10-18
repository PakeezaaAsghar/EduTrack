import React, { useState } from 'react';
import { useEduTrack } from '../../context/EduTrackContext';
import { DashboardLayout } from './DashboardLayout';
import { 
  GraduationCap, BookOpen, CheckCircle2, Award, Calendar, 
  AlertTriangle, Printer, Clock, FileText, ArrowRight, User 
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { 
    currentUser, students, courses, grades, attendance, 
    calculateStudentAttendance, getStudentCourseGrade, schedules, settings 
  } = useEduTrack();

  const [activeTab, setActiveTab] = useState('overview');

  // Find student entity matching logged-in student user
  const currentStudent = students.find(s => 
    s.id === currentUser?.id || s.email === currentUser?.email || s.studentId === currentUser?.studentId
  ) || students[0];

  const myCourses = courses.filter(c => currentStudent?.enrolledCourses.includes(c.id));
  const myGrades = grades.filter(g => g.studentId === currentStudent?.id);
  const myAttendanceSummary = calculateStudentAttendance(currentStudent?.id || '');
  const mySchedule = schedules.filter(s => myCourses.some(mc => mc.id === s.courseId));

  const isAttendanceAtRisk = myAttendanceSummary.percentage < settings.attendanceThreshold;

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
    >
      <div className="space-y-6">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Student Welcome Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-900 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase text-indigo-400">Student Academic Hub</span>
                <h2 className="text-xl font-bold">Welcome back, {currentStudent.name}</h2>
                <p className="text-xs text-slate-300">
                  Student ID: <span className="font-mono text-indigo-300 font-semibold">{currentStudent.studentId}</span> · {currentStudent.department} ({currentStudent.year})
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Edit My Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('report-card')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Full Transcript</span>
                </button>
              </div>
            </div>

            {/* Attendance Alert if at risk */}
            {isAttendanceAtRisk && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex items-start gap-3 text-xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Academic Warning: Low Attendance</p>
                  <p className="mt-0.5">
                    Your cumulative attendance of <span className="font-bold font-mono">{myAttendanceSummary.percentage}%</span> is below the required <span className="font-bold font-mono">{settings.attendanceThreshold}%</span> threshold. Please consult your academic advisor.
                  </p>
                </div>
              </div>
            )}

            {/* Academic Stat Strips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Cumulative GPA</span>
                <p className="text-3xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400 mt-1">
                  {currentStudent.gpa.toFixed(2)}
                </p>
                <p className="text-xs text-slate-500 mt-1">4.0 Scale Standard · Standing: <strong className="capitalize">{currentStudent.status}</strong></p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Attendance Rate</span>
                <p className={`text-3xl font-bold font-mono tabular-nums mt-1 ${isAttendanceAtRisk ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {myAttendanceSummary.percentage}%
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {myAttendanceSummary.present} Present · {myAttendanceSummary.late} Late · {myAttendanceSummary.absent} Absent
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Registered Course Load</span>
                <p className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {myCourses.reduce((acc, c) => acc + c.credits, 0)} Credits
                </p>
                <p className="text-xs text-slate-500 mt-1">{myCourses.length} Enrolled Course Sections</p>
              </div>
            </div>

            {/* Enrolled Courses Preview & Upcoming Lecture */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  My Enrolled Courses & Standing
                </h3>
                <div className="space-y-3">
                  {myCourses.map((course) => {
                    const grade = getStudentCourseGrade(currentStudent.id, course.id);
                    const att = calculateStudentAttendance(currentStudent.id, course.id);
                    return (
                      <div 
                        key={course.id}
                        className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{course.code}</span>
                            <span className="font-semibold text-slate-900 dark:text-white">{course.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {course.instructorName} · {course.room} · {course.scheduleDay}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            {grade.letterGrade} ({grade.weightedScore > 0 ? `${grade.weightedScore}%` : 'In Progress'})
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Attendance: {att.percentage}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Upcoming Class Agenda */}
              <div className="lg:col-span-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Next Scheduled Session
                </h3>
                {mySchedule.length > 0 ? (
                  <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                        {mySchedule[0].courseCode}
                      </span>
                      <span className="text-slate-500 font-mono">{mySchedule[0].day}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{mySchedule[0].title}</h4>
                    <div className="space-y-1 text-slate-500">
                      <p>Time: <strong className="font-mono text-slate-800 dark:text-slate-200">{mySchedule[0].startTime} – {mySchedule[0].endTime}</strong></p>
                      <p>Classroom: <strong className="text-slate-800 dark:text-slate-200">{mySchedule[0].room}</strong></p>
                      <p>Instructor: {mySchedule[0].instructorName}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border text-xs text-slate-400 text-center">
                    No upcoming sessions scheduled.
                  </div>
                )}

                {/* Academic Announcement */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] font-semibold uppercase text-indigo-600 dark:text-indigo-400">
                    Department Announcement
                  </span>
                  <p className="font-semibold text-slate-900 dark:text-white">Fall 2026 Midterm Review Week</p>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Course evaluations and progress reviews are scheduled with academic advisors before the withdrawal deadline.
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ENROLLED COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Enrolled Course Catalog</h3>
              <p className="text-xs text-slate-500">Courses registered for {settings.academicTerm}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCourses.map(c => (
                <div key={c.id} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60">
                      {c.code}
                    </span>
                    <span className="text-slate-500">{c.credits} Credit Hours</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h4>
                    <p className="text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-slate-500">
                    <p>Instructor: <strong className="text-slate-800 dark:text-slate-200">{c.instructorName}</strong></p>
                    <p>Classroom: {c.room} · {c.scheduleDay} ({c.scheduleTime})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Attendance Logs</h3>
              <p className="text-xs text-slate-500">Verified roll call entries recorded by your course instructors</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Course Code & Name</th>
                    <th className="px-4 py-3">Session Date</th>
                    <th className="px-4 py-3">Roll Call Status</th>
                    <th className="px-4 py-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attendance.filter(a => a.studentId === currentStudent.id).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        No roll call logs recorded yet.
                      </td>
                    </tr>
                  ) : (
                    attendance.filter(a => a.studentId === currentStudent.id).map(a => (
                      <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{a.courseName}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{a.date}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                            a.status === 'present' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' :
                            a.status === 'late' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                            'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400">{a.notes || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MY GRADES & TRANSCRIPT TAB */}
        {activeTab === 'grades' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Assessments & Scores</h3>
              <p className="text-xs text-slate-500">Evaluations recorded across assignments, quizzes, and exams</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Assessment Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Score</th>
                    <th className="px-4 py-3 text-right">Weight</th>
                    <th className="px-4 py-3">Instructor Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {myGrades.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                        No graded assessments published yet.
                      </td>
                    </tr>
                  ) : (
                    myGrades.map(g => (
                      <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{g.courseName}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{g.title}</td>
                        <td className="px-4 py-3 font-mono">{g.assessmentType}</td>
                        <td className="px-4 py-3 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                          {g.score} / {g.maxScore}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-slate-500">{g.weight}%</td>
                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{g.feedback || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* WEEKLY SCHEDULE TAB */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">My Weekly Class Schedule</h3>
              <p className="text-xs text-slate-500">Classrooms and scheduled lecture times</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => {
                const daySlots = mySchedule.filter(s => s.day === day);
                return (
                  <div key={day} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300 block pb-1 border-b border-slate-100 dark:border-slate-800">
                      {day}
                    </span>
                    {daySlots.length === 0 ? (
                      <p className="text-[11px] text-slate-400 py-6 text-center">No classes</p>
                    ) : (
                      daySlots.map(slot => (
                        <div key={slot.id} className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs">
                          <span className="font-bold font-mono text-indigo-700 dark:text-indigo-300">{slot.courseCode}</span>
                          <p className="font-medium text-slate-900 dark:text-white mt-0.5">{slot.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-1">{slot.startTime} – {slot.endTime}</p>
                          <p className="text-[10px] text-slate-400">{slot.room}</p>
                        </div>
                      ))
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* OFFICIAL TRANSCRIPT & REPORT CARD TAB */}
        {activeTab === 'report-card' && (
          <div className="space-y-6">
            
            <div className="no-print flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Official Student Academic Report</h3>
                <p className="text-xs text-slate-500">Official semester standing and grade point transcript</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Report</span>
              </button>
            </div>

            {/* Official Report Card */}
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
              
              <div className="flex items-start justify-between border-b-2 border-slate-900 dark:border-slate-700 pb-4">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wide">
                    {settings.institutionName}
                  </h2>
                  <p className="text-xs text-slate-500">Student Progress & Evaluation Report Card</p>
                </div>
                <div className="text-right text-xs font-mono">
                  <p className="font-bold">Term: {settings.academicTerm}</p>
                  <p className="text-slate-400">Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Student Name</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{currentStudent.name}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Student ID</span>
                  <p className="font-mono font-semibold text-slate-900 dark:text-white mt-0.5">{currentStudent.studentId}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Program</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{currentStudent.department}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Standing</span>
                  <p className="font-mono font-bold capitalize mt-0.5 text-indigo-600">{currentStudent.status}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Course Breakdown</h4>
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                  <thead className="bg-slate-100 dark:bg-slate-800/80 font-semibold text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="p-3">Course Code & Title</th>
                      <th className="p-3 text-right">Credits</th>
                      <th className="p-3 text-right">Attendance Rate</th>
                      <th className="p-3 text-right">Normalized Score</th>
                      <th className="p-3 text-right">Letter Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {myCourses.map(course => {
                      const grade = getStudentCourseGrade(currentStudent.id, course.id);
                      const att = calculateStudentAttendance(currentStudent.id, course.id);
                      return (
                        <tr key={course.id}>
                          <td className="p-3">
                            <span className="font-bold font-mono text-indigo-600">{course.code}</span>
                            <span className="ml-2 font-medium">{course.title}</span>
                          </td>
                          <td className="p-3 text-right font-mono">{course.credits}</td>
                          <td className="p-3 text-right font-mono">{att.percentage}%</td>
                          <td className="p-3 text-right font-mono font-semibold">{grade.weightedScore > 0 ? `${grade.weightedScore}%` : 'In Progress'}</td>
                          <td className="p-3 text-right font-mono font-bold">{grade.letterGrade}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Certified by University Academic Registrar</p>
                  <p className="text-[11px] text-slate-400">All registered course grades meet accredited degree prerequisites.</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Cumulative GPA</span>
                  <p className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {currentStudent.gpa.toFixed(2)} / 4.00
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
