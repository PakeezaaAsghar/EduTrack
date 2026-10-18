import React, { useState } from 'react';
import { useEduTrack } from '../../context/EduTrackContext';
import { DashboardLayout } from './DashboardLayout';
import { 
  BookOpen, Users, CheckCircle2, Award, Calendar, 
  AlertTriangle, Plus, Check, Trash2, Clock, UserCircle
} from 'lucide-react';
import { AttendanceStatus } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const { 
    currentUser, courses, students, attendance, recordAttendance, 
    grades, addGrade, deleteGrade, schedules, alerts, settings 
  } = useEduTrack();

  const [activeTab, setActiveTab] = useState('overview');

  // Teacher courses: filtered by instructor
  const myCourses = courses.filter(c => 
    c.instructorName.includes(currentUser?.name || '') || 
    c.instructorId === currentUser?.id || 
    c.instructorName.includes('Reed')
  );

  const [selectedCourseId, setSelectedCourseId] = useState<string>(myCourses[0]?.id || courses[0]?.id || '');
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [rollCallState, setRollCallState] = useState<Record<string, AttendanceStatus>>({});
  const [savedToast, setSavedToast] = useState(false);

  // New Grade state
  const [addGradeModal, setAddGradeModal] = useState(false);
  const [newGrade, setNewGrade] = useState({
    studentId: '',
    title: '',
    assessmentType: 'Assignment' as const,
    score: 85,
    maxScore: 100,
    weight: 20,
    feedback: ''
  });

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || myCourses[0];
  const enrolledStudents = students.filter(s => s.enrolledCourses.includes(selectedCourse?.id || ''));

  const handleSaveRollCall = () => {
    if (!selectedCourse) return;
    const records = enrolledStudents.map(s => ({
      courseId: selectedCourse.id,
      studentId: s.id,
      status: rollCallState[s.id] || 'present',
      date: attendanceDate
    }));
    recordAttendance(records);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleMarkAllPresent = () => {
    const newState: Record<string, AttendanceStatus> = {};
    enrolledStudents.forEach(s => {
      newState[s.id] = 'present';
    });
    setRollCallState(newState);
  };

  const handleCreateGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === newGrade.studentId);
    if (!student || !selectedCourse || !newGrade.title.trim()) return;

    addGrade({
      studentId: student.id,
      studentName: student.name,
      courseId: selectedCourse.id,
      courseName: selectedCourse.title,
      assessmentType: newGrade.assessmentType,
      title: newGrade.title,
      score: Number(newGrade.score),
      maxScore: Number(newGrade.maxScore),
      weight: Number(newGrade.weight),
      date: new Date().toISOString().slice(0, 10),
      feedback: newGrade.feedback
    });
    setAddGradeModal(false);
  };

  // My teacher timetable
  const mySchedule = schedules.filter(s => 
    s.instructorName.includes(currentUser?.name || '') || s.instructorName.includes('Reed')
  );

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
            
            {/* Faculty Welcome Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-indigo-400">Faculty Desk</span>
                <h2 className="text-xl font-bold mt-1">Welcome back, {currentUser?.name}</h2>
                <p className="text-xs text-slate-300 mt-1">
                  You are assigned to {myCourses.length} active lecture sections in {settings.academicTerm}.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <UserCircle className="w-3.5 h-3.5" />
                  <span>Edit Faculty Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Launch Roll Call</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Teaching Load</span>
                <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {myCourses.reduce((acc, c) => acc + c.credits, 0)} Credit Hours
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{myCourses.length} Assigned Courses</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Students</span>
                <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {students.filter(s => s.enrolledCourses.some(cId => myCourses.some(mc => mc.id === cId))).length}
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">Enrolled across your sections</p>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Upcoming Lecture</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-1 truncate">
                  {mySchedule[0]?.courseCode || 'CS-201'}: {mySchedule[0]?.title || 'Algorithms'}
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 font-mono">
                  {mySchedule[0]?.day} {mySchedule[0]?.startTime} · {mySchedule[0]?.room}
                </p>
              </div>
            </div>

            {/* Assigned Courses Cards */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                My Course Offerings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myCourses.map((c) => (
                  <div key={c.id} className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                        {c.code}
                      </span>
                      <span className="text-xs text-slate-500">{c.credits} Credits</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span>Room: <strong className="text-slate-800 dark:text-slate-200">{c.room}</strong></span>
                      <span>Schedule: {c.scheduleDay}</span>
                    </div>
                    <div className="pt-1 flex gap-2">
                      <button
                        onClick={() => { setSelectedCourseId(c.id); setActiveTab('attendance'); }}
                        className="flex-1 py-1.5 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100"
                      >
                        Take Roll Call
                      </button>
                      <button
                        onClick={() => { setSelectedCourseId(c.id); setActiveTab('gradebook'); }}
                        className="flex-1 py-1.5 text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg hover:bg-emerald-100"
                      >
                        Gradebook
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ASSIGNED COURSES ROSTER TAB */}
        {activeTab === 'my-courses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assigned Course Rosters</h3>
                <p className="text-xs text-slate-500">View enrolled students and academic performance</p>
              </div>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                {myCourses.map(c => (
                  <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Student ID</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3 text-right">Attendance %</th>
                    <th className="px-4 py-3 text-right">Course Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {enrolledStudents.map(s => {
                    const grade = selectedCourse ? grades.filter(g => g.studentId === s.id && g.courseId === selectedCourse.id) : [];
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{s.name}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">{s.studentId}</td>
                        <td className="px-4 py-3">{s.year}</td>
                        <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">{s.attendanceRate}%</td>
                        <td className="px-4 py-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {grade.length > 0 ? `${grade[0].score}% (${grade[0].assessmentType})` : 'In Progress'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAKE ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Faculty Roll Call Desk</h3>
                <p className="text-xs text-slate-500">Record attendance for today's lecture</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {myCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} — {c.title}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            {savedToast && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Roll call submitted to university records!</span>
              </div>
            )}

            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-2 flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Roster for {selectedCourse?.code}</span>
                <button onClick={handleMarkAllPresent} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                  Mark All Present
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {enrolledStudents.map((s) => {
                  const status = rollCallState[s.id] || 'present';
                  return (
                    <div key={s.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{s.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{s.studentId}</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setRollCallState({ ...rollCallState, [s.id]: st })}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors ${
                              status === st 
                                ? st === 'present' ? 'bg-emerald-600 text-white' :
                                  st === 'late' ? 'bg-amber-600 text-white' :
                                  st === 'absent' ? 'bg-rose-600 text-white' : 'bg-slate-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveRollCall}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Submit Attendance Roll</span>
              </button>
            </div>
          </div>
        )}

        {/* GRADEBOOK ENTRY TAB */}
        {activeTab === 'gradebook' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instructor Gradebook</h3>
                <p className="text-xs text-slate-500">Record assessment evaluations with percentage weights</p>
              </div>
              <button
                onClick={() => {
                  setNewGrade({
                    studentId: enrolledStudents[0]?.id || '',
                    title: '',
                    assessmentType: 'Assignment',
                    score: 85,
                    maxScore: 100,
                    weight: 20,
                    feedback: ''
                  });
                  setAddGradeModal(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Assessment Mark</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Assessment</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3 text-right">Score</th>
                    <th className="px-4 py-3 text-right">Weight</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {grades.filter(g => myCourses.some(mc => mc.id === g.courseId)).map((g) => (
                    <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{g.studentName}</td>
                      <td className="px-4 py-3 text-slate-500">{g.courseName}</td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{g.title}</td>
                      <td className="px-4 py-3 font-mono">{g.assessmentType}</td>
                      <td className="px-4 py-3 text-right font-mono font-semibold">{g.score}/{g.maxScore}</td>
                      <td className="px-4 py-3 text-right font-mono text-slate-500">{g.weight}%</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => deleteGrade(g.id)} className="p-1 text-slate-400 hover:text-rose-500">
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

        {/* TEACHING TIMETABLE TAB */}
        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Teaching Agenda</h3>
              <p className="text-xs text-slate-500">Weekly lecture slots and seminar locations</p>
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
                      <p className="text-[11px] text-slate-400 py-6 text-center">No lectures</p>
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

        {/* STUDENT ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Student Academic Performance Alerts</h3>
              <p className="text-xs text-slate-500">Students with attendance or score deficiencies</p>
            </div>

            <div className="space-y-2.5">
              {alerts.map(a => (
                <div key={a.id} className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{a.studentName}</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5">{a.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Add Grade Modal */}
      {addGradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl text-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Assessment Score</h3>
            <form onSubmit={handleCreateGrade} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Student</label>
                <select
                  value={newGrade.studentId}
                  onChange={(e) => setNewGrade({ ...newGrade, studentId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {enrolledStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={newGrade.title}
                  onChange={(e) => setNewGrade({ ...newGrade, title: e.target.value })}
                  placeholder="e.g. Lab 2: Binary Search Trees"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Score</label>
                  <input
                    type="number"
                    value={newGrade.score}
                    onChange={(e) => setNewGrade({ ...newGrade, score: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (%)</label>
                  <input
                    type="number"
                    value={newGrade.weight}
                    onChange={(e) => setNewGrade({ ...newGrade, weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddGradeModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Submit Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
