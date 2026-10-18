import { 
  User, Student, Course, AttendanceRecord, GradeRecord, 
  ScheduleItem, NotificationItem, ActivityLog, AcademicAlert, SystemSettings 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Dr. Evelyn Vance',
    email: 'admin@edutrack.edu',
    role: 'admin',
    title: 'Dean of Academic Affairs',
    department: 'Academic Administration',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    password: 'admin123'
  },
  {
    id: 'user-teacher-1',
    name: 'Prof. Marcus Reed',
    email: 'teacher@edutrack.edu',
    role: 'teacher',
    title: 'Associate Professor',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    password: 'teacher123'
  },
  {
    id: 'user-student-1',
    name: 'Sarah Jenkins',
    email: 'student@edutrack.edu',
    role: 'student',
    studentId: 'STU-2024-8841',
    title: 'Sophomore Student',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    password: 'student123'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    code: 'CS-201',
    title: 'Data Structures & Algorithms',
    credits: 4,
    department: 'Computer Science',
    semester: 'Fall 2026',
    instructorId: 'user-teacher-1',
    instructorName: 'Prof. Marcus Reed',
    room: 'Hall B-204',
    scheduleDay: 'Monday',
    scheduleTime: '09:00 - 10:30',
    capacity: 45,
    enrolledCount: 38,
    description: 'Advanced data structures including balanced trees, hash tables, graph algorithms, and asymptotic complexity analysis.',
    color: '#3b82f6'
  },
  {
    id: 'course-2',
    code: 'CS-305',
    title: 'Relational Database Engineering',
    credits: 3,
    department: 'Computer Science',
    semester: 'Fall 2026',
    instructorId: 'user-teacher-1',
    instructorName: 'Prof. Marcus Reed',
    room: 'Lab 4-C',
    scheduleDay: 'Wednesday',
    scheduleTime: '11:00 - 12:30',
    capacity: 35,
    enrolledCount: 32,
    description: 'Relational algebra, normal forms, SQL optimization, index architecture, transactions, and ACID compliance.',
    color: '#6366f1'
  },
  {
    id: 'course-3',
    code: 'MATH-220',
    title: 'Discrete Computational Mathematics',
    credits: 3,
    department: 'Mathematics',
    semester: 'Fall 2026',
    instructorId: 'inst-alan',
    instructorName: 'Dr. Alan Sterling',
    room: 'Hall A-102',
    scheduleDay: 'Tuesday',
    scheduleTime: '13:30 - 15:00',
    capacity: 50,
    enrolledCount: 44,
    description: 'Propositional logic, combinatorics, graph theory, modular arithmetic, and recurrence relations.',
    color: '#0ea5e9'
  },
  {
    id: 'course-4',
    code: 'CS-410',
    title: 'Distributed Operating Systems',
    credits: 4,
    department: 'Computer Science',
    semester: 'Fall 2026',
    instructorId: 'user-teacher-1',
    instructorName: 'Prof. Marcus Reed',
    room: 'Lab 2-A',
    scheduleDay: 'Thursday',
    scheduleTime: '14:00 - 15:30',
    capacity: 30,
    enrolledCount: 28,
    description: 'Concurrency primitives, kernel architecture, memory virtualization, RPC protocols, and consensus mechanisms.',
    color: '#8b5cf6'
  },
  {
    id: 'course-5',
    code: 'DS-315',
    title: 'Statistical Machine Learning',
    credits: 4,
    department: 'Data Science',
    semester: 'Fall 2026',
    instructorId: 'inst-claire',
    instructorName: 'Dr. Claire Bennett',
    room: 'Turing Hall 101',
    scheduleDay: 'Friday',
    scheduleTime: '10:00 - 11:30',
    capacity: 40,
    enrolledCount: 36,
    description: 'Supervised and unsupervised models, gradient descent optimization, regularization, neural representations.',
    color: '#10b981'
  },
  {
    id: 'course-6',
    code: 'ENG-108',
    title: 'Technical Academic Communication',
    credits: 2,
    department: 'Humanities',
    semester: 'Fall 2026',
    instructorId: 'inst-elena',
    instructorName: 'Dr. Elena Rostova',
    room: 'Auditorium C',
    scheduleDay: 'Wednesday',
    scheduleTime: '15:30 - 17:00',
    capacity: 60,
    enrolledCount: 52,
    description: 'Peer-reviewed research composition, technical documentation, grant drafting, and academic conference delivery.',
    color: '#f59e0b'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'user-student-1',
    studentId: 'STU-2024-8841',
    name: 'Sarah Jenkins',
    email: 'student@edutrack.edu',
    department: 'Computer Science',
    year: 'Sophomore',
    gpa: 3.84,
    attendanceRate: 94.2,
    enrolledCourses: ['course-1', 'course-2', 'course-3', 'course-6'],
    status: 'active',
    phone: '+1 (555) 234-5678'
  },
  {
    id: 'stu-2',
    studentId: 'STU-2024-8842',
    name: 'Liam Chen',
    email: 'l.chen@student.edutrack.edu',
    department: 'Computer Science',
    year: 'Junior',
    gpa: 3.92,
    attendanceRate: 98.0,
    enrolledCourses: ['course-1', 'course-2', 'course-4', 'course-5'],
    status: 'active',
    phone: '+1 (555) 345-6789'
  },
  {
    id: 'stu-3',
    studentId: 'STU-2024-8843',
    name: 'Maya Patel',
    email: 'm.patel@student.edutrack.edu',
    department: 'Data Science',
    year: 'Sophomore',
    gpa: 3.65,
    attendanceRate: 91.5,
    enrolledCourses: ['course-1', 'course-3', 'course-5'],
    status: 'active',
    phone: '+1 (555) 456-7890'
  },
  {
    id: 'stu-4',
    studentId: 'STU-2024-8844',
    name: 'David Kim',
    email: 'd.kim@student.edutrack.edu',
    department: 'Computer Science',
    year: 'Senior',
    gpa: 2.38,
    attendanceRate: 68.4,
    enrolledCourses: ['course-2', 'course-4'],
    status: 'warning',
    phone: '+1 (555) 567-8901'
  },
  {
    id: 'stu-5',
    studentId: 'STU-2024-8845',
    name: 'Aisha Al-Mansoor',
    email: 'a.almansoor@student.edutrack.edu',
    department: 'Computer Science',
    year: 'Freshman',
    gpa: 3.78,
    attendanceRate: 96.0,
    enrolledCourses: ['course-1', 'course-3', 'course-6'],
    status: 'active',
    phone: '+1 (555) 678-9012'
  },
  {
    id: 'stu-6',
    studentId: 'STU-2024-8846',
    name: 'Jordan Taylor',
    email: 'j.taylor@student.edutrack.edu',
    department: 'Mathematics',
    year: 'Junior',
    gpa: 2.15,
    attendanceRate: 64.0,
    enrolledCourses: ['course-3', 'course-5'],
    status: 'probation',
    phone: '+1 (555) 789-0123'
  },
  {
    id: 'stu-7',
    studentId: 'STU-2024-8847',
    name: 'Elena Rostova',
    email: 'e.rostova@student.edutrack.edu',
    department: 'Data Science',
    year: 'Sophomore',
    gpa: 3.50,
    attendanceRate: 88.5,
    enrolledCourses: ['course-1', 'course-5', 'course-6'],
    status: 'active',
    phone: '+1 (555) 890-1234'
  },
  {
    id: 'stu-8',
    studentId: 'STU-2024-8848',
    name: 'Marcus Vance Jr.',
    email: 'm.vance@student.edutrack.edu',
    department: 'Computer Science',
    year: 'Senior',
    gpa: 3.42,
    attendanceRate: 85.0,
    enrolledCourses: ['course-2', 'course-4'],
    status: 'active',
    phone: '+1 (555) 901-2345'
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // Sarah Jenkins (user-student-1)
  { id: 'att-1', courseId: 'course-1', courseName: 'Data Structures & Algorithms', studentId: 'user-student-1', studentName: 'Sarah Jenkins', date: '2026-10-12', status: 'present' },
  { id: 'att-2', courseId: 'course-1', courseName: 'Data Structures & Algorithms', studentId: 'user-student-1', studentName: 'Sarah Jenkins', date: '2026-10-05', status: 'present' },
  { id: 'att-3', courseId: 'course-1', courseName: 'Data Structures & Algorithms', studentId: 'user-student-1', studentName: 'Sarah Jenkins', date: '2026-09-28', status: 'late', notes: 'Transit delay' },
  { id: 'att-4', courseId: 'course-2', courseName: 'Relational Database Engineering', studentId: 'user-student-1', studentName: 'Sarah Jenkins', date: '2026-10-14', status: 'present' },
  { id: 'att-5', courseId: 'course-2', courseName: 'Relational Database Engineering', studentId: 'user-student-1', studentName: 'Sarah Jenkins', date: '2026-10-07', status: 'present' },
  { id: 'att-6', courseId: 'course-3', courseName: 'Discrete Computational Mathematics', studentId: 'user-student-1', studentName: 'Sarah Jenkins', date: '2026-10-13', status: 'present' },
  
  // Liam Chen (stu-2)
  { id: 'att-7', courseId: 'course-1', courseName: 'Data Structures & Algorithms', studentId: 'stu-2', studentName: 'Liam Chen', date: '2026-10-12', status: 'present' },
  { id: 'att-8', courseId: 'course-1', courseName: 'Data Structures & Algorithms', studentId: 'stu-2', studentName: 'Liam Chen', date: '2026-10-05', status: 'present' },

  // David Kim (stu-4 - Low attendance)
  { id: 'att-9', courseId: 'course-2', courseName: 'Relational Database Engineering', studentId: 'stu-4', studentName: 'David Kim', date: '2026-10-14', status: 'absent', notes: 'Unexcused' },
  { id: 'att-10', courseId: 'course-2', courseName: 'Relational Database Engineering', studentId: 'stu-4', studentName: 'David Kim', date: '2026-10-07', status: 'absent', notes: 'Unexcused' },
  { id: 'att-11', courseId: 'course-4', courseName: 'Distributed Operating Systems', studentId: 'stu-4', studentName: 'David Kim', date: '2026-10-15', status: 'late' },

  // Jordan Taylor (stu-6 - Warning)
  { id: 'att-12', courseId: 'course-3', courseName: 'Discrete Computational Mathematics', studentId: 'stu-6', studentName: 'Jordan Taylor', date: '2026-10-13', status: 'absent' },
  { id: 'att-13', courseId: 'course-3', courseName: 'Discrete Computational Mathematics', studentId: 'stu-6', studentName: 'Jordan Taylor', date: '2026-10-06', status: 'absent' }
];

export const INITIAL_GRADES: GradeRecord[] = [
  // Sarah Jenkins
  { id: 'grd-1', studentId: 'user-student-1', studentName: 'Sarah Jenkins', courseId: 'course-1', courseName: 'Data Structures & Algorithms', assessmentType: 'Midterm', title: 'Midterm Exam: Trees & Graphs', score: 92, maxScore: 100, weight: 30, date: '2026-10-08', feedback: 'Excellent algorithmic proof and tree balance analysis.' },
  { id: 'grd-2', studentId: 'user-student-1', studentName: 'Sarah Jenkins', courseId: 'course-1', courseName: 'Data Structures & Algorithms', assessmentType: 'Assignment', title: 'Assignment 1: Red-Black Tree Implementation', score: 98, maxScore: 100, weight: 15, date: '2026-09-22', feedback: 'Clean code and thorough edge-case unit tests.' },
  { id: 'grd-3', studentId: 'user-student-1', studentName: 'Sarah Jenkins', courseId: 'course-2', courseName: 'Relational Database Engineering', assessmentType: 'Project', title: 'B-Tree Query Engine Mini-Project', score: 88, maxScore: 100, weight: 25, date: '2026-10-02', feedback: 'Good query plan caching, minor concurrency lock contention.' },
  { id: 'grd-4', studentId: 'user-student-1', studentName: 'Sarah Jenkins', courseId: 'course-3', courseName: 'Discrete Computational Mathematics', assessmentType: 'Quiz', title: 'Quiz 2: Modular Arithmetic & Cryptography', score: 95, maxScore: 100, weight: 10, date: '2026-09-29', feedback: 'Flawless Euclidean algorithm breakdown.' },
  { id: 'grd-5', studentId: 'user-student-1', studentName: 'Sarah Jenkins', courseId: 'course-6', courseName: 'Technical Academic Communication', assessmentType: 'Assignment', title: 'Research Paper Proposal', score: 90, maxScore: 100, weight: 20, date: '2026-10-10', feedback: 'Clear research scope and well-formulated methodology.' },

  // Liam Chen
  { id: 'grd-6', studentId: 'stu-2', studentName: 'Liam Chen', courseId: 'course-1', courseName: 'Data Structures & Algorithms', assessmentType: 'Midterm', title: 'Midterm Exam: Trees & Graphs', score: 96, maxScore: 100, weight: 30, date: '2026-10-08', feedback: 'Exceptional mastery of dynamic programming.' },
  
  // David Kim (at risk)
  { id: 'grd-7', studentId: 'stu-4', studentName: 'David Kim', courseId: 'course-2', courseName: 'Relational Database Engineering', assessmentType: 'Midterm', title: 'Relational Normalization Midterm', score: 58, maxScore: 100, weight: 30, date: '2026-10-02', feedback: 'Struggled with 3NF/BCNF decomposition theorems.' },

  // Jordan Taylor (probation)
  { id: 'grd-8', studentId: 'stu-6', studentName: 'Jordan Taylor', courseId: 'course-3', courseName: 'Discrete Computational Mathematics', assessmentType: 'Quiz', title: 'Quiz 1: Propositional Logic', score: 52, maxScore: 100, weight: 10, date: '2026-09-15', feedback: 'Review truth tables and proof by contradiction.' }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  { id: 'sch-1', courseId: 'course-1', courseCode: 'CS-201', title: 'Data Structures & Algorithms', instructorName: 'Prof. Marcus Reed', room: 'Hall B-204', day: 'Monday', startTime: '09:00', endTime: '10:30', color: '#3b82f6' },
  { id: 'sch-2', courseId: 'course-3', courseCode: 'MATH-220', title: 'Discrete Computational Mathematics', instructorName: 'Dr. Alan Sterling', room: 'Hall A-102', day: 'Tuesday', startTime: '13:30', endTime: '15:00', color: '#0ea5e9' },
  { id: 'sch-3', courseId: 'course-2', courseCode: 'CS-305', title: 'Relational Database Engineering', instructorName: 'Prof. Marcus Reed', room: 'Lab 4-C', day: 'Wednesday', startTime: '11:00', endTime: '12:30', color: '#6366f1' },
  { id: 'sch-4', courseId: 'course-6', courseCode: 'ENG-108', title: 'Technical Academic Communication', instructorName: 'Dr. Elena Rostova', room: 'Auditorium C', day: 'Wednesday', startTime: '15:30', endTime: '17:00', color: '#f59e0b' },
  { id: 'sch-5', courseId: 'course-4', courseCode: 'CS-410', title: 'Distributed Operating Systems', instructorName: 'Prof. Marcus Reed', room: 'Lab 2-A', day: 'Thursday', startTime: '14:00', endTime: '15:30', color: '#8b5cf6' },
  { id: 'sch-6', courseId: 'course-5', courseCode: 'DS-315', title: 'Statistical Machine Learning', instructorName: 'Dr. Claire Bennett', room: 'Turing Hall 101', day: 'Friday', startTime: '10:00', endTime: '11:30', color: '#10b981' }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', targetRole: 'all', title: 'Fall 2026 Midterm Review Schedule', message: 'Midterm grade submission deadline for faculty is scheduled for Friday, October 24.', timestamp: '2 hours ago', type: 'info', read: false },
  { id: 'notif-2', targetRole: 'teacher', title: 'Pending Attendance Records', message: 'Attendance records for CS-201 on Monday have been saved successfully.', timestamp: '5 hours ago', type: 'success', read: false },
  { id: 'notif-3', targetRole: 'admin', title: 'Academic Alert: 2 Students At Risk', message: 'David Kim and Jordan Taylor have attendance rates below the 75% institutional threshold.', timestamp: '1 day ago', type: 'warning', read: false },
  { id: 'notif-4', targetRole: 'student', title: 'Grade Published: CS-201 Midterm', message: 'Your score of 92/100 has been recorded in Data Structures & Algorithms.', timestamp: '2 days ago', type: 'success', read: true }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  { id: 'log-1', user: 'Prof. Marcus Reed', role: 'Teacher', action: 'Recorded Grades', details: 'Added scores for CS-201 Midterm Exam for 38 students', timestamp: 'Today at 11:42 AM' },
  { id: 'log-2', user: 'Dr. Evelyn Vance', role: 'Admin', action: 'Updated Policy', details: 'Configured attendance warning threshold to 75.0%', timestamp: 'Yesterday at 3:15 PM' },
  { id: 'log-3', user: 'Prof. Marcus Reed', role: 'Teacher', action: 'Took Attendance', details: 'Marked 36 Present, 1 Late, 1 Absent for CS-305', timestamp: 'Oct 14, 2026' },
  { id: 'log-4', user: 'Dr. Evelyn Vance', role: 'Admin', action: 'Enrolled Student', details: 'Enrolled Sarah Jenkins into ENG-108', timestamp: 'Oct 10, 2026' }
];

export const INITIAL_ALERTS: AcademicAlert[] = [
  { id: 'alt-1', studentId: 'stu-4', studentName: 'David Kim', type: 'low_attendance', message: 'Attendance dropped to 68.4% (Threshold: 75%). 2 consecutive unexcused absences.', severity: 'critical', timestamp: '2026-10-15', resolved: false },
  { id: 'alt-2', studentId: 'stu-6', studentName: 'Jordan Taylor', type: 'probation', message: 'Cumulative GPA is 2.15 with 64.0% attendance. Requires academic advisor consultation.', severity: 'critical', timestamp: '2026-10-14', resolved: false },
  { id: 'alt-3', studentId: 'stu-4', studentName: 'David Kim', type: 'low_grade', message: 'Received 58% on CS-305 Midterm Exam.', severity: 'warning', timestamp: '2026-10-03', resolved: false }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  attendanceThreshold: 75,
  lateCountsAsAttended: true,
  lateAttendanceWeight: 0.5,
  academicTerm: 'Fall 2026',
  institutionName: 'EduTrack Institute of Technology',
  gradingScale: [
    { grade: 'A', minScore: 90, gpaPoint: 4.0 },
    { grade: 'B', minScore: 80, gpaPoint: 3.0 },
    { grade: 'C', minScore: 70, gpaPoint: 2.0 },
    { grade: 'D', minScore: 60, gpaPoint: 1.0 },
    { grade: 'F', minScore: 0, gpaPoint: 0.0 }
  ]
};
