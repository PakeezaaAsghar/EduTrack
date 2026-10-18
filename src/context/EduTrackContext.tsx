import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, UserRole, Student, Course, AttendanceRecord, GradeRecord, 
  ScheduleItem, NotificationItem, ActivityLog, AcademicAlert, SystemSettings, AttendanceStatus 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_COURSES, INITIAL_STUDENTS, 
  INITIAL_ATTENDANCE, INITIAL_GRADES, INITIAL_SCHEDULE, 
  INITIAL_NOTIFICATIONS, INITIAL_ACTIVITY_LOGS, INITIAL_ALERTS, DEFAULT_SETTINGS 
} from '../data/mockData';

interface EduTrackContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  login: (email: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  registerUser: (
    name: string, 
    email: string, 
    role: UserRole, 
    password?: string,
    additionalInfo?: {
      department?: string;
      title?: string;
      studentYear?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
      studentId?: string;
    }
  ) => { success: boolean; error?: string };
  registerStudent: (name: string, email: string, password?: string) => { success: boolean; error?: string };
  updateUserProfile: (updates: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    department?: string;
    title?: string;
    bio?: string;
    officeLocation?: string;
    officeHours?: string;
    emergencyContact?: string;
    year?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    currentPassword?: string;
    newPassword?: string;
  }) => { success: boolean; error?: string };

  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'gpa' | 'attendanceRate' | 'status'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  exportStudentsCSV: () => void;
  importStudentsCSV: (csvText: string) => { imported: number; errors: string[] };

  // Courses
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'enrolledCount'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Attendance
  attendance: AttendanceRecord[];
  recordAttendance: (records: { courseId: string; studentId: string; status: AttendanceStatus; notes?: string; date: string }[]) => void;
  calculateStudentAttendance: (studentId: string, courseId?: string) => { total: number; present: number; late: number; absent: number; excused: number; percentage: number };

  // Grades
  grades: GradeRecord[];
  addGrade: (grade: Omit<GradeRecord, 'id'>) => void;
  deleteGrade: (id: string) => void;
  getStudentCourseGrade: (studentId: string, courseId: string) => { weightedScore: number; letterGrade: string; gpaPoint: number; records: GradeRecord[] };
  getStudentOverallGPA: (studentId: string) => number;

  // Schedule & Conflict Detection
  schedules: ScheduleItem[];
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => { success: boolean; conflictReason?: string };
  deleteScheduleItem: (id: string) => void;
  checkScheduleConflict: (day: string, startTime: string, endTime: string, room: string, instructorName: string, ignoreId?: string) => string | null;

  // Alerts
  alerts: AcademicAlert[];
  resolveAlert: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Activity Logs
  activityLogs: ActivityLog[];
  logActivity: (action: string, details: string) => void;

  // Settings
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;

  // Dark Mode & Navigation
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentPath: string;
  navigate: (path: string) => void;
  resetAllData: () => void;
}

const EduTrackContext = createContext<EduTrackContextType | undefined>(undefined);

export const EduTrackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State with browser history sync
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('edutrack_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('edutrack_dark_mode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Settings
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('edutrack_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('edutrack_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logActivity('Updated Settings', 'Academic system configuration modified');
  };

  // Current User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edutrack_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('edutrack_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Data Collections with localStorage fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('edutrack_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('edutrack_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edutrack_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('edutrack_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    const saved = localStorage.getItem('edutrack_grades');
    return saved ? JSON.parse(saved) : INITIAL_GRADES;
  });

  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('edutrack_schedules');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('edutrack_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('edutrack_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [alerts, setAlerts] = useState<AcademicAlert[]>(() => {
    const saved = localStorage.getItem('edutrack_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('edutrack_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('edutrack_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('edutrack_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edutrack_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('edutrack_grades', JSON.stringify(grades));
  }, [grades]);

  useEffect(() => {
    localStorage.setItem('edutrack_schedules', JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem('edutrack_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('edutrack_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('edutrack_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Activity logger
  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      user: currentUser ? currentUser.name : 'System',
      role: currentUser ? currentUser.role : 'System',
      action,
      details,
      timestamp: 'Just now'
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // Auth Operations
  const login = (email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const foundUser = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!foundUser) {
      return { success: false, error: 'No account registered with this institutional email.' };
    }
    
    // Check password if configured
    if (foundUser.password && password && foundUser.password !== password) {
      return { success: false, error: 'Incorrect password entered. Please check your credentials.' };
    }

    setCurrentUser(foundUser);
    logActivity('User Sign In', `${foundUser.name} signed into the portal`);
    if (foundUser.role === 'admin') navigate('/admin');
    else if (foundUser.role === 'teacher') navigate('/teacher');
    else navigate('/student');
    return { success: true };
  };

  const logout = () => {
    if (currentUser) {
      logActivity('User Sign Out', `${currentUser.name} signed out`);
    }
    setCurrentUser(null);
    navigate('/');
  };

  const registerUser = (
    name: string,
    email: string,
    role: UserRole,
    password?: string,
    additionalInfo?: {
      department?: string;
      title?: string;
      studentYear?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
      studentId?: string;
    }
  ): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email address already exists in the institutional directory.' };
    }

    const newUserId = `user-${role}-${Date.now()}`;
    const generatedStudentId = additionalInfo?.studentId || `STU-2024-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser: User = {
      id: newUserId,
      name,
      email: cleanEmail,
      role,
      studentId: role === 'student' ? generatedStudentId : undefined,
      title: additionalInfo?.title || (role === 'teacher' ? 'Faculty Instructor' : role === 'admin' ? 'Academic Administrator' : 'Undergraduate Student'),
      department: additionalInfo?.department || 'Computer Science',
      password: password || `${role}123`
    };

    if (role === 'student') {
      const newStudent: Student = {
        id: newUserId,
        studentId: generatedStudentId,
        name,
        email: cleanEmail,
        department: additionalInfo?.department || 'Computer Science',
        year: additionalInfo?.studentYear || 'Freshman',
        gpa: 4.0,
        attendanceRate: 100,
        enrolledCourses: ['course-1', 'course-3'],
        status: 'active'
      };
      setStudents(prev => [...prev, newStudent]);
    }

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    logActivity(`New ${role.toUpperCase()} Registered`, `${name} created a new ${role} account`);

    if (role === 'admin') navigate('/admin');
    else if (role === 'teacher') navigate('/teacher');
    else navigate('/student');

    return { success: true };
  };

  const registerStudent = (name: string, email: string, password?: string): { success: boolean; error?: string } => {
    return registerUser(name, email, 'student', password);
  };

  const updateUserProfile = (updates: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    department?: string;
    title?: string;
    bio?: string;
    officeLocation?: string;
    officeHours?: string;
    emergencyContact?: string;
    year?: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    currentPassword?: string;
    newPassword?: string;
  }): { success: boolean; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'You must be signed in to modify your profile.' };
    }

    // Email uniqueness check if changed
    if (updates.email && updates.email.trim().toLowerCase() !== currentUser.email.toLowerCase()) {
      const cleanEmail = updates.email.trim().toLowerCase();
      const emailConflict = users.some(u => u.id !== currentUser.id && u.email.toLowerCase() === cleanEmail);
      if (emailConflict) {
        return { success: false, error: 'An account with this email address already exists in the institutional directory.' };
      }
    }

    // Password change check if requested
    if (updates.newPassword) {
      if (currentUser.password && updates.currentPassword && updates.currentPassword !== currentUser.password) {
        return { success: false, error: 'Current password does not match our records.' };
      }
      if (updates.newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters long.' };
      }
    }

    const oldName = currentUser.name;
    const oldEmail = currentUser.email;
    const newName = updates.name?.trim() || currentUser.name;
    const newEmail = updates.email?.trim().toLowerCase() || currentUser.email;

    const updatedUser: User = {
      ...currentUser,
      name: newName,
      email: newEmail,
      phone: updates.phone !== undefined ? updates.phone : currentUser.phone,
      avatar: updates.avatar !== undefined ? updates.avatar : currentUser.avatar,
      department: updates.department !== undefined ? updates.department : currentUser.department,
      title: updates.title !== undefined ? updates.title : currentUser.title,
      bio: updates.bio !== undefined ? updates.bio : currentUser.bio,
      officeLocation: updates.officeLocation !== undefined ? updates.officeLocation : currentUser.officeLocation,
      officeHours: updates.officeHours !== undefined ? updates.officeHours : currentUser.officeHours,
      emergencyContact: updates.emergencyContact !== undefined ? updates.emergencyContact : currentUser.emergencyContact,
      year: updates.year !== undefined ? updates.year : currentUser.year,
      password: updates.newPassword || currentUser.password
    };

    // Update currentUser state & localStorage
    setCurrentUser(updatedUser);

    // Update users array
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Role-specific sync:
    if (currentUser.role === 'student') {
      // Sync student in students roster
      setStudents(prev => prev.map(s => {
        if (s.id === currentUser.id || s.email.toLowerCase() === oldEmail.toLowerCase() || (currentUser.studentId && s.studentId === currentUser.studentId)) {
          return {
            ...s,
            name: newName,
            email: newEmail,
            phone: updates.phone !== undefined ? updates.phone : s.phone,
            avatar: updates.avatar !== undefined ? updates.avatar : s.avatar,
            department: updates.department !== undefined ? updates.department : s.department,
            year: updates.year !== undefined ? updates.year : s.year,
          };
        }
        return s;
      }));

      // If student name changed, sync in grades and attendance and alerts
      if (newName !== oldName) {
        setGrades(prev => prev.map(g => (g.studentId === currentUser.id || g.studentName === oldName) ? { ...g, studentName: newName } : g));
        setAttendance(prev => prev.map(a => (a.studentId === currentUser.id || a.studentName === oldName) ? { ...a, studentName: newName } : a));
        setAlerts(prev => prev.map(al => (al.studentId === currentUser.id || al.studentName === oldName) ? { ...al, studentName: newName } : al));
      }
    } else if (currentUser.role === 'teacher') {
      // Sync courses instructor name if changed
      if (newName !== oldName) {
        setCourses(prev => prev.map(c => (c.instructorId === currentUser.id || c.instructorName.includes(oldName) || oldName.includes(c.instructorName)) ? { ...c, instructorName: newName } : c));
        setSchedules(prev => prev.map(sc => (sc.instructorName.includes(oldName) || oldName.includes(sc.instructorName)) ? { ...sc, instructorName: newName } : sc));
      }
    }

    logActivity('Profile Updated', `${newName} (${currentUser.role}) updated their profile details`);
    
    // Add success notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole: currentUser.role,
      targetUserId: currentUser.id,
      title: 'Profile Updated',
      message: 'Your personal details, credentials, and contact info have been saved.',
      type: 'success',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return { success: true };
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'gpa' | 'attendanceRate' | 'status'>) => {
    const newId = `stu-${Date.now()}`;
    const newStudent: Student = {
      ...studentData,
      id: newId,
      gpa: 3.5,
      attendanceRate: 100,
      status: 'active'
    };
    setStudents(prev => [newStudent, ...prev]);
    logActivity('Added Student', `Enrolled ${newStudent.name} (${newStudent.studentId})`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logActivity('Updated Student', `Modified profile for student ID ${id}`);
  };

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    logActivity('Removed Student', `Removed student ${student?.name || id}`);
  };

  const exportStudentsCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Email', 'Department', 'Year', 'GPA', 'Attendance %', 'Status', 'Phone'];
    const rows = students.map(s => [
      s.studentId,
      `"${s.name}"`,
      s.email,
      s.department,
      s.year,
      s.gpa.toFixed(2),
      s.attendanceRate.toFixed(1),
      s.status,
      s.phone || ''
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edutrack_students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logActivity('Exported CSV', 'Downloaded student records in CSV format');
  };

  const importStudentsCSV = (csvText: string): { imported: number; errors: string[] } => {
    const lines = csvText.split('\n').filter(line => line.trim().length > 0);
    if (lines.length <= 1) return { imported: 0, errors: ['CSV file is empty or missing data rows.'] };
    
    let count = 0;
    const errors: string[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length >= 3) {
        const studentId = cols[0] || `STU-2024-${Math.floor(1000 + Math.random() * 9000)}`;
        const name = cols[1];
        const email = cols[2];
        const department = cols[3] || 'General Studies';
        const year = (cols[4] as Student['year']) || 'Freshman';
        const gpa = parseFloat(cols[5]) || 3.0;
        const attendanceRate = parseFloat(cols[6]) || 90.0;

        if (!name || !email) {
          errors.push(`Row ${i + 1}: Name and email are required.`);
          continue;
        }

        const newStudent: Student = {
          id: `stu-${Date.now()}-${i}`,
          studentId,
          name,
          email,
          department,
          year,
          gpa,
          attendanceRate,
          enrolledCourses: ['course-1'],
          status: gpa < 2.5 || attendanceRate < 70 ? 'warning' : 'active'
        };

        setStudents(prev => [...prev, newStudent]);
        count++;
      }
    }

    if (count > 0) {
      logActivity('Imported CSV', `Imported ${count} student records from CSV file`);
    }
    return { imported: count, errors };
  };

  // Course CRUD
  const addCourse = (courseData: Omit<Course, 'id' | 'enrolledCount'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      enrolledCount: 0
    };
    setCourses(prev => [...prev, newCourse]);
    logActivity('Created Course', `Created ${newCourse.code}: ${newCourse.title}`);
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    logActivity('Updated Course', `Updated syllabus/schedule for course ${id}`);
  };

  const deleteCourse = (id: string) => {
    const course = courses.find(c => c.id === id);
    setCourses(prev => prev.filter(c => c.id !== id));
    logActivity('Deleted Course', `Removed course ${course?.code || id}`);
  };

  // Attendance Calculations
  const calculateStudentAttendance = (studentId: string, courseId?: string) => {
    const relevant = attendance.filter(a => 
      a.studentId === studentId && (!courseId || a.courseId === courseId)
    );
    const total = relevant.length;
    if (total === 0) return { total: 0, present: 0, late: 0, absent: 0, excused: 0, percentage: 100 };

    const present = relevant.filter(a => a.status === 'present').length;
    const late = relevant.filter(a => a.status === 'late').length;
    const absent = relevant.filter(a => a.status === 'absent').length;
    const excused = relevant.filter(a => a.status === 'excused').length;

    // Weight late attendance based on settings policy
    const effectiveAttended = present + (settings.lateCountsAsAttended ? late * settings.lateAttendanceWeight : 0);
    const nonExcusedTotal = total - excused;
    const percentage = nonExcusedTotal > 0 ? (effectiveAttended / nonExcusedTotal) * 100 : 100;

    return { total, present, late, absent, excused, percentage: Math.round(percentage * 10) / 10 };
  };

  const recordAttendance = (records: { courseId: string; studentId: string; status: AttendanceStatus; notes?: string; date: string }[]) => {
    const newRecords: AttendanceRecord[] = records.map(r => {
      const course = courses.find(c => c.id === r.courseId);
      const student = students.find(s => s.id === r.studentId);
      return {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        courseId: r.courseId,
        courseName: course?.title || 'Course',
        studentId: r.studentId,
        studentName: student?.name || 'Student',
        date: r.date,
        status: r.status,
        notes: r.notes
      };
    });

    setAttendance(prev => [...newRecords, ...prev]);

    // Recalculate student attendance rates and trigger alerts if below threshold
    records.forEach(r => {
      const att = calculateStudentAttendance(r.studentId);
      setStudents(prev => prev.map(s => {
        if (s.id === r.studentId) {
          const newStatus = att.percentage < settings.attendanceThreshold ? 'warning' : 'active';
          return { ...s, attendanceRate: att.percentage, status: newStatus };
        }
        return s;
      }));

      if (att.percentage < settings.attendanceThreshold) {
        const student = students.find(s => s.id === r.studentId);
        if (student) {
          setAlerts(prev => {
            const exists = prev.some(a => a.studentId === student.id && a.type === 'low_attendance' && !a.resolved);
            if (!exists) {
              return [{
                id: `alt-${Date.now()}`,
                studentId: student.id,
                studentName: student.name,
                type: 'low_attendance',
                message: `Attendance rate dropped to ${att.percentage}% below the required ${settings.attendanceThreshold}% minimum.`,
                severity: 'critical',
                timestamp: new Date().toISOString().slice(0, 10),
                resolved: false
              }, ...prev];
            }
            return prev;
          });
        }
      }
    });

    logActivity('Recorded Attendance', `Submitted attendance logs for ${records.length} students`);
  };

  // Grades & Performance
  const addGrade = (gradeData: Omit<GradeRecord, 'id'>) => {
    const newGrade: GradeRecord = {
      ...gradeData,
      id: `grd-${Date.now()}`
    };
    setGrades(prev => [newGrade, ...prev]);

    // Recalculate student GPA
    const newGpa = getStudentOverallGPA(gradeData.studentId);
    setStudents(prev => prev.map(s => s.id === gradeData.studentId ? { ...s, gpa: newGpa } : s));

    logActivity('Recorded Grade', `Scored ${gradeData.studentName} on ${gradeData.title} (${gradeData.score}/${gradeData.maxScore})`);
  };

  const deleteGrade = (id: string) => {
    setGrades(prev => prev.filter(g => g.id !== id));
    logActivity('Deleted Grade Record', `Removed assessment record ID ${id}`);
  };

  const getStudentCourseGrade = (studentId: string, courseId: string) => {
    const courseGrades = grades.filter(g => g.studentId === studentId && g.courseId === courseId);
    if (courseGrades.length === 0) {
      return { weightedScore: 0, letterGrade: 'N/A', gpaPoint: 0, records: [] };
    }

    let totalWeight = 0;
    let earnedWeight = 0;

    courseGrades.forEach(g => {
      const percentage = (g.score / g.maxScore) * 100;
      earnedWeight += (percentage * g.weight) / 100;
      totalWeight += g.weight;
    });

    const normalizedScore = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;
    const rounded = Math.round(normalizedScore * 10) / 10;

    // Find letter grade and GPA points from settings grading scale
    let letterGrade = 'F';
    let gpaPoint = 0.0;
    for (const tier of settings.gradingScale) {
      if (rounded >= tier.minScore) {
        letterGrade = tier.grade;
        gpaPoint = tier.gpaPoint;
        break;
      }
    }

    return { weightedScore: rounded, letterGrade, gpaPoint, records: courseGrades };
  };

  const getStudentOverallGPA = (studentId: string): number => {
    const student = students.find(s => s.id === studentId);
    if (!student || student.enrolledCourses.length === 0) return 3.5;

    let totalPoints = 0;
    let totalCredits = 0;

    student.enrolledCourses.forEach(cId => {
      const course = courses.find(c => c.id === cId);
      const grade = getStudentCourseGrade(studentId, cId);
      if (course && grade.records.length > 0) {
        totalPoints += grade.gpaPoint * course.credits;
        totalCredits += course.credits;
      }
    });

    if (totalCredits === 0) return student.gpa || 3.5;
    return Math.round((totalPoints / totalCredits) * 100) / 100;
  };

  // Schedule & Conflict Detection Algorithm
  const checkScheduleConflict = (
    day: string, 
    startTime: string, 
    endTime: string, 
    room: string, 
    instructorName: string, 
    ignoreId?: string
  ): string | null => {
    const toMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const newStart = toMinutes(startTime);
    const newEnd = toMinutes(endTime);

    for (const item of schedules) {
      if (ignoreId && item.id === ignoreId) continue;
      if (item.day !== day) continue;

      const itemStart = toMinutes(item.startTime);
      const itemEnd = toMinutes(item.endTime);

      // Overlap condition: start < itemEnd && end > itemStart
      const overlaps = newStart < itemEnd && newEnd > itemStart;

      if (overlaps) {
        if (item.room.toLowerCase().trim() === room.toLowerCase().trim()) {
          return `Room conflict: ${room} is already booked for "${item.title}" on ${day} (${item.startTime} - ${item.endTime}).`;
        }
        if (item.instructorName.toLowerCase().trim() === instructorName.toLowerCase().trim()) {
          return `Instructor conflict: ${instructorName} is already teaching "${item.title}" on ${day} (${item.startTime} - ${item.endTime}).`;
        }
      }
    }

    return null;
  };

  const addScheduleItem = (itemData: Omit<ScheduleItem, 'id'>): { success: boolean; conflictReason?: string } => {
    const conflict = checkScheduleConflict(
      itemData.day, 
      itemData.startTime, 
      itemData.endTime, 
      itemData.room, 
      itemData.instructorName
    );

    if (conflict) {
      return { success: false, conflictReason: conflict };
    }

    const newItem: ScheduleItem = {
      ...itemData,
      id: `sch-${Date.now()}`
    };

    setSchedules(prev => [...prev, newItem]);
    logActivity('Added Class Schedule', `Scheduled ${itemData.courseCode} in ${itemData.room} on ${itemData.day}`);
    return { success: true };
  };

  const deleteScheduleItem = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
    logActivity('Deleted Schedule Slot', `Removed timetable slot ID ${id}`);
  };

  // Alerts
  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
    logActivity('Resolved Academic Alert', `Marked alert ID ${id} as resolved`);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Reset to default mock data
  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setStudents(INITIAL_STUDENTS);
    setCourses(INITIAL_COURSES);
    setAttendance(INITIAL_ATTENDANCE);
    setGrades(INITIAL_GRADES);
    setSchedules(INITIAL_SCHEDULE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setAlerts(INITIAL_ALERTS);
    setSettings(DEFAULT_SETTINGS);
    localStorage.clear();
    logActivity('System Reset', 'Reset all database records to institutional defaults');
  };

  return (
    <EduTrackContext.Provider value={{
      currentUser,
      setCurrentUser,
      users,
      login,
      logout,
      registerUser,
      registerStudent,
      updateUserProfile,
      students,
      addStudent,
      updateStudent,
      deleteStudent,
      exportStudentsCSV,
      importStudentsCSV,
      courses,
      addCourse,
      updateCourse,
      deleteCourse,
      attendance,
      recordAttendance,
      calculateStudentAttendance,
      grades,
      addGrade,
      deleteGrade,
      getStudentCourseGrade,
      getStudentOverallGPA,
      schedules,
      addScheduleItem,
      deleteScheduleItem,
      checkScheduleConflict,
      alerts,
      resolveAlert,
      notifications,
      markNotificationRead,
      markAllNotificationsRead,
      addNotification,
      activityLogs,
      logActivity,
      settings,
      updateSettings,
      darkMode,
      toggleDarkMode,
      currentPath,
      navigate,
      resetAllData
    }}>
      {children}
    </EduTrackContext.Provider>
  );
};

export const useEduTrack = () => {
  const context = useContext(EduTrackContext);
  if (!context) {
    throw new Error('useEduTrack must be used within an EduTrackProvider');
  }
  return context;
};
