export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  title?: string;
  studentId?: string;
  phone?: string;
  password?: string;
  bio?: string;
  officeLocation?: string;
  officeHours?: string;
  emergencyContact?: string;
  year?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  gpa: number;
  attendanceRate: number; // percentage e.g. 88
  enrolledCourses: string[]; // course IDs
  status: 'active' | 'warning' | 'probation';
  phone?: string;
  avatar?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  department: string;
  semester: string;
  instructorId: string;
  instructorName: string;
  room: string;
  scheduleDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  scheduleTime: string; // e.g. "09:00 - 10:30"
  capacity: number;
  enrolledCount: number;
  description: string;
  color: string;
}

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

export interface AttendanceRecord {
  id: string;
  courseId: string;
  courseName: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  assessmentType: 'Assignment' | 'Quiz' | 'Midterm' | 'Final Exam' | 'Project';
  title: string;
  score: number;
  maxScore: number;
  weight: number; // percentage e.g. 20
  date: string;
  feedback?: string;
}

export interface ScheduleItem {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  instructorName: string;
  room: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  color: string;
}

export interface NotificationItem {
  id: string;
  targetRole: 'all' | 'admin' | 'teacher' | 'student';
  targetUserId?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  timestamp: string;
  read: boolean;
}

export interface ActivityLog {
  id: string;
  user: string;
  role: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AcademicAlert {
  id: string;
  studentId: string;
  studentName: string;
  type: 'low_attendance' | 'low_grade' | 'probation' | 'conflict';
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  resolved: boolean;
}

export interface GradingScaleTier {
  grade: string;
  minScore: number;
  gpaPoint: number;
}

export interface SystemSettings {
  attendanceThreshold: number; // e.g. 75%
  lateCountsAsAttended: boolean;
  lateAttendanceWeight: number; // 0.5 or 1.0
  gradingScale: GradingScaleTier[];
  academicTerm: string;
  institutionName: string;
}
