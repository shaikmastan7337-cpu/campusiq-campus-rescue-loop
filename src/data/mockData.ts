import {
  User,
  StudentProfile,
  FacultyProfile,
  Department,
  Course,
  ClassSection,
  AttendanceRecord,
  Assignment,
  Submission,
  GradeRecord,
  TimetableEntry,
  Announcement,
  PlacementProfile,
  PlacementDrive,
  Application,
  Intervention,
  MentoringNote,
  NotificationItem,
  AuditLog,
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    uid: 'user-super-admin',
    role: 'super-admin',
    status: 'active',
    displayName: 'Dr. Evelyn Vance',
    email: 'superadmin@campusiq.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 019-2831'
  },
  {
    uid: 'user-student-1',
    role: 'student',
    status: 'active',
    displayName: 'Aarav Sharma',
    email: 'aarav.sharma@campusiq.edu',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678'
  },
  {
    uid: 'user-student-2',
    role: 'student',
    status: 'active',
    displayName: 'Neha Patel',
    email: 'neha.patel@campusiq.edu',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789'
  },
  {
    uid: 'user-faculty-1',
    role: 'faculty',
    status: 'active',
    displayName: 'Prof. Rajesh Verma',
    email: 'rajesh.verma@campusiq.edu',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890'
  },
  {
    uid: 'user-hod-1',
    role: 'hod',
    status: 'active',
    displayName: 'Dr. Arvind Sundaram',
    email: 'hod.cse@campusiq.edu',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 567-8901'
  },
  {
    uid: 'user-admin-1',
    role: 'admin',
    status: 'active',
    displayName: 'Marcus Cole',
    email: 'admin.office@campusiq.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 678-9012'
  },
  {
    uid: 'user-placement-admin-1',
    role: 'placement-admin',
    status: 'active',
    displayName: 'Ms. Priya Deshmukh',
    email: 'placements@campusiq.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 789-0123'
  },
  {
    uid: 'user-mentor-1',
    role: 'mentor',
    status: 'active',
    displayName: 'Dr. Shweta Rao',
    email: 'shweta.rao@campusiq.edu',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 890-1234'
  },
  {
    uid: 'user-parent-1',
    role: 'parent',
    status: 'active',
    displayName: 'Suresh Sharma',
    email: 'suresh.sharma@parent.campusiq.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 901-2345'
  }
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    departmentId: 'dept-cse',
    name: 'Computer Science & Engineering',
    code: 'CSE',
    hodUid: 'user-hod-1',
    hodName: 'Dr. Arvind Sundaram',
    studentCount: 340,
    facultyCount: 24
  },
  {
    departmentId: 'dept-ece',
    name: 'Electronics & Communication Engineering',
    code: 'ECE',
    hodUid: 'user-hod-ece',
    hodName: 'Dr. Meenakshi Iyer',
    studentCount: 280,
    facultyCount: 19
  },
  {
    departmentId: 'dept-ds',
    name: 'Data Science & Artificial Intelligence',
    code: 'DSAI',
    hodUid: 'user-hod-ds',
    hodName: 'Dr. Vikram Malhotra',
    studentCount: 180,
    facultyCount: 14
  }
];

export const INITIAL_STUDENTS: StudentProfile[] = [
  {
    studentId: 'stu-101',
    uid: 'user-student-1',
    rollNumber: '21CS042',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    semester: 6,
    academicYear: '2025-2026',
    cgpa: 8.78,
    backlogs: 0,
    mentorUid: 'user-mentor-1',
    guardianUid: 'user-parent-1',
    learningPlatformActivityScore: 92,
    engagementScore: 88
  },
  {
    studentId: 'stu-102',
    uid: 'user-student-2',
    rollNumber: '21CS078',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    semester: 6,
    academicYear: '2025-2026',
    cgpa: 6.35,
    backlogs: 1,
    mentorUid: 'user-mentor-1',
    learningPlatformActivityScore: 54,
    engagementScore: 60
  },
  {
    studentId: 'stu-103',
    uid: 'user-student-3',
    rollNumber: '21CS099',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    semester: 6,
    academicYear: '2025-2026',
    cgpa: 9.20,
    backlogs: 0,
    mentorUid: 'user-mentor-1',
    learningPlatformActivityScore: 98,
    engagementScore: 95
  }
];

export const INITIAL_FACULTY: FacultyProfile[] = [
  {
    facultyId: 'fac-201',
    uid: 'user-faculty-1',
    departmentId: 'dept-cse',
    departmentName: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    assignedClasses: ['cls-301', 'cls-302']
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    courseId: 'crs-301',
    name: 'Distributed Systems & Cloud Architecture',
    code: 'CS601',
    credits: 4,
    semester: 6,
    departmentId: 'dept-cse'
  },
  {
    courseId: 'crs-302',
    name: 'Machine Learning & Neural Networks',
    code: 'CS602',
    credits: 4,
    semester: 6,
    departmentId: 'dept-cse'
  },
  {
    courseId: 'crs-303',
    name: 'Compiler Design & Code Optimization',
    code: 'CS603',
    credits: 3,
    semester: 6,
    departmentId: 'dept-cse'
  },
  {
    courseId: 'crs-304',
    name: 'Cybersecurity & Cryptography',
    code: 'CS604',
    credits: 3,
    semester: 6,
    departmentId: 'dept-cse'
  }
];

export const INITIAL_CLASSES: ClassSection[] = [
  {
    classId: 'cls-301',
    courseId: 'crs-301',
    courseName: 'Distributed Systems & Cloud Architecture',
    courseCode: 'CS601',
    facultyUid: 'user-faculty-1',
    facultyName: 'Prof. Rajesh Verma',
    section: 'CSE-A',
    academicYear: '2025-2026',
    semester: 6,
    departmentId: 'dept-cse',
    enrolledCount: 65
  },
  {
    classId: 'cls-302',
    courseId: 'crs-302',
    courseName: 'Machine Learning & Neural Networks',
    courseCode: 'CS602',
    facultyUid: 'user-faculty-1',
    facultyName: 'Prof. Rajesh Verma',
    section: 'CSE-A',
    academicYear: '2025-2026',
    semester: 6,
    departmentId: 'dept-cse',
    enrolledCount: 65
  },
  {
    classId: 'cls-303',
    courseId: 'crs-303',
    courseName: 'Compiler Design & Code Optimization',
    courseCode: 'CS603',
    facultyUid: 'user-faculty-2',
    facultyName: 'Dr. Anand Raman',
    section: 'CSE-B',
    academicYear: '2025-2026',
    semester: 6,
    departmentId: 'dept-cse',
    enrolledCount: 60
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  // --- Student 1: Aarav Sharma (stu-101) - Consistently strong attendance (Healthy comparison) ---
  {
    id: 'att-101-01',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-09-02',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-02T09:30:00Z'
  },
  {
    id: 'att-101-02',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-09-04',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-04T11:30:00Z'
  },
  {
    id: 'att-101-03',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-09-09',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-09T09:30:00Z'
  },
  {
    id: 'att-101-04',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-09-11',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-11T11:30:00Z'
  },
  {
    id: 'att-101-05',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-09-16',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-16T09:30:00Z'
  },
  {
    id: 'att-101-06',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-09-18',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-18T11:30:00Z'
  },
  {
    id: 'att-101-07',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-09-23',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-23T09:30:00Z'
  },
  {
    id: 'att-101-08',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-09-25',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'late',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-25T11:45:00Z'
  },
  {
    id: 'att-101-09',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-09-30',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-30T09:30:00Z'
  },
  {
    id: 'att-101-10',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-10-02',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-02T11:30:00Z'
  },
  {
    id: 'att-101-11',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-10-07',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-07T09:32:00Z'
  },
  {
    id: 'att-101-12',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-10-08',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-08T11:45:00Z'
  },
  {
    id: 'att-101-13',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-10-09',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-09T09:30:00Z'
  },
  {
    id: 'att-101-14',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-10-10',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-10T11:40:00Z'
  },

  // --- Student 2: Neha Patel (stu-102) - Seeded Demo Story Case ---
  // Phase 1 (Sept 01 - Sept 18): Stable attendance baseline (6/6 = 100%)
  {
    id: 'att-102-01',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-09-02',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-02T09:30:00Z'
  },
  {
    id: 'att-102-02',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-09-04',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-04T11:30:00Z'
  },
  {
    id: 'att-102-03',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-09-09',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-09T09:30:00Z'
  },
  {
    id: 'att-102-04',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-09-11',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-11T11:30:00Z'
  },
  {
    id: 'att-102-05',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-09-16',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-16T09:30:00Z'
  },
  {
    id: 'att-102-06',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-09-18',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-18T11:30:00Z'
  },

  // Phase 2 (Sept 22 - Oct 07): Downward decline triggering Review Prompt
  // In this 7-session span: 5 absent, 1 late, 1 present -> attendance dropped to ~50%
  {
    id: 'att-102-07',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-09-23',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'absent',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-23T09:35:00Z'
  },
  {
    id: 'att-102-08',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-09-25',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'absent',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-25T11:40:00Z'
  },
  {
    id: 'att-102-09',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-09-30',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'absent',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-30T09:35:00Z'
  },
  {
    id: 'att-102-10',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-10-02',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'late',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-02T11:45:00Z'
  },
  {
    id: 'att-102-11',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-10-05',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'absent',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-05T09:35:00Z'
  },
  {
    id: 'att-102-12',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-10-06',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'absent',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-06T11:40:00Z'
  },
  {
    id: 'att-102-13',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-10-07',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'absent',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-07T09:35:00Z'
  },

  // Phase 3 (Oct 08 - Oct 12): Post-Support Plan Recovery sessions
  // Plan was logged Oct 08. Student attended consecutive follow-up sessions.
  {
    id: 'att-102-14',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-10-08',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-08T11:35:00Z'
  },
  {
    id: 'att-102-15',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-10-09',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-09T09:30:00Z'
  },
  {
    id: 'att-102-16',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-10-10',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-10T11:30:00Z'
  },
  {
    id: 'att-102-17',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    date: '2026-10-11',
    session: 'Morning (09:00 - 10:30 AM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-11T09:30:00Z'
  },
  {
    id: 'att-102-18',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    date: '2026-10-12',
    session: 'Afternoon (11:00 - 12:30 PM)',
    status: 'present',
    markedBy: 'user-faculty-1',
    markedByName: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-12T11:30:00Z'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    assignmentId: 'asg-01',
    classId: 'cls-301',
    courseName: 'Distributed Systems & Cloud Architecture',
    title: 'Raft Consensus Protocol Implementation',
    description: 'Implement a distributed leader election algorithm and log replication simulator in TypeScript or Go. Submit unit test logs and architecture documentation.',
    dueAt: '2026-10-18T23:59:00Z',
    maxMarks: 50,
    allowedFormats: ['PDF', 'ZIP', 'TAR.GZ'],
    createdBy: 'user-faculty-1',
    createdByName: 'Prof. Rajesh Verma',
    createdAt: '2026-10-01T10:00:00Z'
  },
  {
    assignmentId: 'asg-02',
    classId: 'cls-302',
    courseName: 'Machine Learning & Neural Networks',
    title: 'Convolutional Neural Network for Medical Imaging',
    description: 'Train a ResNet-18 baseline on the histopathology dataset. Report validation accuracy, ROC-AUC curve, and explainability heatmaps (Grad-CAM).',
    dueAt: '2026-10-22T23:59:00Z',
    maxMarks: 100,
    allowedFormats: ['IPYNB', 'PDF', 'ZIP'],
    createdBy: 'user-faculty-1',
    createdByName: 'Prof. Rajesh Verma',
    createdAt: '2026-10-04T14:30:00Z'
  },
  {
    assignmentId: 'asg-03',
    classId: 'cls-301',
    courseName: 'Distributed Systems & Cloud Architecture',
    title: 'gRPC Microservices Benchmarking',
    description: 'Benchmark latency and throughput comparing REST vs gRPC over HTTP/2 with varying payload sizes.',
    dueAt: '2026-09-28T23:59:00Z',
    maxMarks: 40,
    allowedFormats: ['PDF'],
    createdBy: 'user-faculty-1',
    createdByName: 'Prof. Rajesh Verma',
    createdAt: '2026-09-15T09:00:00Z'
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    submissionId: 'sub-01',
    assignmentId: 'asg-01',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    rollNumber: '21CS042',
    fileName: 'Raft_Consensus_AaravSharma_21CS042.zip',
    fileSize: '4.2 MB',
    submittedAt: '2026-10-11T16:20:00Z',
    status: 'submitted'
  },
  {
    submissionId: 'sub-03',
    assignmentId: 'asg-03',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    rollNumber: '21CS042',
    fileName: 'gRPC_Benchmark_Report_21CS042.pdf',
    fileSize: '1.8 MB',
    submittedAt: '2026-09-27T21:10:00Z',
    status: 'evaluated',
    marks: 38,
    maxMarks: 40,
    feedback: 'Exceptional latency profiling and methodology. Good use of p99 histogram charts.'
  },
  {
    submissionId: 'sub-04',
    assignmentId: 'asg-03',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    rollNumber: '21CS078',
    fileName: 'gRPC_Report_Neha.pdf',
    fileSize: '1.1 MB',
    submittedAt: '2026-09-29T02:14:00Z',
    status: 'evaluated',
    marks: 24,
    maxMarks: 40,
    feedback: 'Submitted 3 hours late. High error variance observed in test runs.'
  }
];

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'grd-01',
    studentId: 'stu-101',
    courseId: 'crs-301',
    courseName: 'Distributed Systems & Cloud Architecture',
    courseCode: 'CS601',
    assessmentType: 'Internal 1',
    marks: 46,
    maxMarks: 50,
    updatedBy: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-25T11:00:00Z'
  },
  {
    id: 'grd-02',
    studentId: 'stu-101',
    courseId: 'crs-301',
    courseName: 'Distributed Systems & Cloud Architecture',
    courseCode: 'CS601',
    assessmentType: 'Internal 2',
    marks: 48,
    maxMarks: 50,
    updatedBy: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-05T14:30:00Z'
  },
  {
    id: 'grd-03',
    studentId: 'stu-101',
    courseId: 'crs-302',
    courseName: 'Machine Learning & Neural Networks',
    courseCode: 'CS602',
    assessmentType: 'Internal 1',
    marks: 44,
    maxMarks: 50,
    updatedBy: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-26T10:00:00Z'
  },
  {
    id: 'grd-04',
    studentId: 'stu-101',
    courseId: 'crs-302',
    courseName: 'Machine Learning & Neural Networks',
    courseCode: 'CS602',
    assessmentType: 'Internal 2',
    marks: 47,
    maxMarks: 50,
    updatedBy: 'Prof. Rajesh Verma',
    updatedAt: '2026-10-06T12:00:00Z'
  },
  {
    id: 'grd-05',
    studentId: 'stu-102',
    courseId: 'crs-301',
    courseName: 'Distributed Systems & Cloud Architecture',
    courseCode: 'CS601',
    assessmentType: 'Internal 1',
    marks: 26,
    maxMarks: 50,
    updatedBy: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-25T11:00:00Z'
  },
  {
    id: 'grd-06',
    studentId: 'stu-102',
    courseId: 'crs-302',
    courseName: 'Machine Learning & Neural Networks',
    courseCode: 'CS602',
    assessmentType: 'Internal 1',
    marks: 30,
    maxMarks: 50,
    updatedBy: 'Prof. Rajesh Verma',
    updatedAt: '2026-09-26T10:00:00Z'
  }
];

export const INITIAL_TIMETABLE: TimetableEntry[] = [
  {
    id: 'tt-1',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    courseCode: 'CS601',
    day: 'Monday',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    room: 'Hall B-204',
    facultyName: 'Prof. Rajesh Verma'
  },
  {
    id: 'tt-2',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    courseCode: 'CS602',
    day: 'Monday',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    room: 'AI Computing Lab 3',
    facultyName: 'Prof. Rajesh Verma'
  },
  {
    id: 'tt-3',
    classId: 'cls-301',
    courseName: 'Distributed Systems Lab',
    courseCode: 'CS601',
    day: 'Wednesday',
    startTime: '02:00 PM',
    endTime: '04:30 PM',
    room: 'Cloud Server Lab',
    facultyName: 'Prof. Rajesh Verma'
  },
  {
    id: 'tt-4',
    classId: 'cls-302',
    courseName: 'Machine Learning',
    courseCode: 'CS602',
    day: 'Thursday',
    startTime: '09:30 AM',
    endTime: '11:00 AM',
    room: 'Hall B-204',
    facultyName: 'Prof. Rajesh Verma'
  },
  {
    id: 'tt-5',
    classId: 'cls-301',
    courseName: 'Distributed Systems',
    courseCode: 'CS601',
    day: 'Friday',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    room: 'Hall B-204',
    facultyName: 'Prof. Rajesh Verma'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'anc-01',
    title: 'Google Cloud Platform On-Campus Recruitment Drive 2026',
    body: 'Registrations are open for the upcoming Google SDE & Cloud Engineering drive. Eligible students (CGPA >= 7.5, zero active backlogs) must verify their resumes before October 20.',
    audience: 'students',
    category: 'placement',
    createdBy: 'user-placement-admin-1',
    creatorRole: 'Placement Officer',
    createdAt: '2026-10-11T08:30:00Z',
    important: true
  },
  {
    id: 'anc-02',
    title: 'Mid-Semester Theory & Practical Examination Schedule',
    body: 'The revised timetable for the 6th semester internal evaluations has been published. Faculty members must freeze marks entries by October 25.',
    audience: 'all',
    category: 'academic',
    createdBy: 'user-admin-1',
    creatorRole: 'Campus Registrar',
    createdAt: '2026-10-09T14:15:00Z',
    important: false
  },
  {
    id: 'anc-03',
    title: 'Mandatory Attendance Review Meeting - HOD Notice',
    body: 'All students with overall attendance below 75% in CSE are required to schedule an in-person meeting with their designated mentors before Friday.',
    audience: 'department',
    departmentId: 'dept-cse',
    category: 'urgent',
    createdBy: 'user-hod-1',
    creatorRole: 'HOD, CSE Dept',
    createdAt: '2026-10-12T09:00:00Z',
    important: true
  }
];

export const INITIAL_PLACEMENT_PROFILES: PlacementProfile[] = [
  {
    studentId: 'stu-101',
    skills: ['React', 'TypeScript', 'Go', 'Distributed Systems', 'Docker', 'Kubernetes', 'PostgreSQL'],
    certifications: ['AWS Certified Solutions Architect Associate', 'Google Cloud Associate Cloud Engineer'],
    resumeName: 'Aarav_Sharma_SDE_Resume.pdf',
    resumeUrl: 'https://campusiq.storage/resumes/aarav_21cs042.pdf',
    githubUrl: 'https://github.com/aarav-sharma-dev',
    linkedinUrl: 'https://linkedin.com/in/aaravsharma-eng',
    leetcodeSolved: 382,
    aptitudeScore: 94,
    mockInterviewScore: 91
  },
  {
    studentId: 'stu-102',
    skills: ['Python', 'HTML/CSS', 'Basic SQL'],
    certifications: ['Python Essentials - Coursera'],
    resumeName: 'Neha_Patel_Draft_Resume.pdf',
    resumeUrl: 'https://campusiq.storage/resumes/neha_21cs078.pdf',
    leetcodeSolved: 48,
    aptitudeScore: 62,
    mockInterviewScore: 58
  }
];

export const INITIAL_PLACEMENT_DRIVES: PlacementDrive[] = [
  {
    driveId: 'drv-01',
    companyName: 'Google',
    role: 'Software Development Engineer I (Cloud)',
    packageLpa: 32.5,
    eligibility: {
      minCgpa: 8.0,
      maxBacklogs: 0,
      departments: ['dept-cse', 'dept-ds']
    },
    deadline: '2026-10-25T23:59:00Z',
    driveDate: '2026-10-28',
    location: 'Campus Virtual + Auditorium 1',
    status: 'upcoming',
    description: 'Core Engineering team hiring for Distributed Systems, Cloud Spanner, and Google Kubernetes Engine infrastructure.'
  },
  {
    driveId: 'drv-02',
    companyName: 'Microsoft',
    role: 'Software Engineer - Azure Core',
    packageLpa: 28.0,
    eligibility: {
      minCgpa: 7.5,
      maxBacklogs: 0,
      departments: ['dept-cse', 'dept-ece', 'dept-ds']
    },
    deadline: '2026-10-20T23:59:00Z',
    driveDate: '2026-10-24',
    location: 'Tech Park Block C',
    status: 'ongoing',
    description: 'Looking for candidates with strong foundations in Data Structures, OS fundamentals, and systems programming.'
  },
  {
    driveId: 'drv-03',
    companyName: 'Deloitte Digital',
    role: 'Technology Analyst - Cloud & AI',
    packageLpa: 12.0,
    eligibility: {
      minCgpa: 6.5,
      maxBacklogs: 1,
      departments: ['dept-cse', 'dept-ece', 'dept-ds']
    },
    deadline: '2026-11-02T23:59:00Z',
    driveDate: '2026-11-08',
    location: 'Campus Main Seminar Hall',
    status: 'upcoming',
    description: 'Advisory and engineering consulting role across enterprise modernization and cloud transformations.'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    applicationId: 'app-01',
    driveId: 'drv-02',
    companyName: 'Microsoft',
    role: 'Software Engineer - Azure Core',
    packageLpa: 28.0,
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    rollNumber: '21CS042',
    stage: 'technical',
    appliedAt: '2026-10-02T11:15:00Z',
    updatedAt: '2026-10-10T17:00:00Z',
    feedback: 'Cleared Online Assessment with 100% test cases. Round 1 Technical scheduled for Oct 14.'
  },
  {
    applicationId: 'app-02',
    driveId: 'drv-01',
    companyName: 'Google',
    role: 'Software Development Engineer I (Cloud)',
    packageLpa: 32.5,
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    rollNumber: '21CS042',
    stage: 'applied',
    appliedAt: '2026-10-11T09:20:00Z',
    updatedAt: '2026-10-11T09:20:00Z',
    feedback: 'Application registered. Awaiting initial screening results.'
  },
  {
    applicationId: 'app-03',
    driveId: 'drv-03',
    companyName: 'Deloitte Digital',
    role: 'Technology Analyst - Cloud & AI',
    packageLpa: 12.0,
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    rollNumber: '21CS078',
    stage: 'aptitude',
    appliedAt: '2026-10-05T14:40:00Z',
    updatedAt: '2026-10-09T18:00:00Z',
    feedback: 'Aptitude assessment test link shared.'
  }
];

export const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'int-01',
    studentId: 'stu-102',
    studentName: 'Neha Patel',
    rollNumber: '21CS078',
    mentorUid: 'user-mentor-1',
    mentorName: 'Dr. Shweta Rao',
    category: 'Attendance',
    goal: 'Restore CS601/CS602 attendance above 75% threshold and complete makeup coursework before internal assessment 2.',
    actionPlan: 'Structured 3-week attendance recovery contract: attend all morning lecture blocks, complete faculty makeup lab sessions, and log weekly progress check-ins.',
    actionOwner: 'Dr. Shweta Rao (Mentor) + Prof. Rajesh Verma (Course Faculty)',
    status: 'in-progress',
    followUpAt: '2026-10-18',
    createdAt: '2026-10-08T11:00:00Z',
    updatedAt: '2026-10-12T10:15:00Z',
    escalated: true,
    escalationReason: 'Attendance dropped to 53.8% (7/13 sessions) between Sept 22 and Oct 07.',
    baselineSnapshot: {
      recordedAt: '2026-10-08T11:00:00Z',
      attendanceRate: 53.8,
      attendanceNumerator: 7,
      attendanceDenominator: 13,
      attendanceDetail: '7 attended of 13 scheduled sessions (53.8%) prior to plan initiation',
      cgpa: 6.35,
      academicScore: 56,
    },
    milestones: [
      {
        id: 'ms-01',
        title: 'Attend 5 consecutive lectures without unexcused absence (CS601 & CS602)',
        completed: true,
        completedAt: '2026-10-12T11:30:00Z',
      },
      {
        id: 'ms-02',
        title: 'Schedule makeup laboratory review with Prof. Rajesh Verma for missed module',
        completed: true,
        completedAt: '2026-10-10T14:30:00Z',
      },
      {
        id: 'ms-03',
        title: 'Submit revised draft of gRPC benchmarking report for evaluation',
        completed: false,
      },
      {
        id: 'ms-04',
        title: 'Enroll in weekly peer-assisted tutorial circle for Distributed Systems',
        completed: false,
      },
    ],
    progressUpdates: [
      {
        id: 'prog-01',
        date: '2026-10-10T16:00:00Z',
        studentUid: 'user-student-2',
        studentName: 'Neha Patel',
        message: 'Met with Prof. Rajesh Verma during office hours. Received makeup review questions for the Raft consensus module.',
      },
      {
        id: 'prog-02',
        date: '2026-10-12T09:45:00Z',
        studentUid: 'user-student-2',
        studentName: 'Neha Patel',
        message: 'Maintained 100% on-time attendance for all scheduled lecture sessions this week. Working on the lab report revisions.',
      },
    ],
    checkIns: [
      {
        id: 'chk-01',
        date: '2026-10-11T11:30:00Z',
        mentorUid: 'user-mentor-1',
        mentorName: 'Dr. Shweta Rao',
        notes: 'First milestone review: Student attended 4 consecutive sessions and completed instructor office hours meeting. Positive engagement observed; continuing scheduled monitoring.',
        outcomeStatus: 'recovering',
      },
    ],
  },
  {
    id: 'int-02',
    studentId: 'stu-101',
    studentName: 'Aarav Sharma',
    rollNumber: '21CS042',
    mentorUid: 'user-mentor-1',
    mentorName: 'Dr. Shweta Rao',
    category: 'Placement',
    goal: 'Target tier-1 placement preparation for Google and Microsoft on-campus recruitment rounds.',
    actionPlan: 'Advanced mock interview preparation: distributed systems design, concurrency primitives, and dynamic programming benchmarks.',
    actionOwner: 'Dr. Shweta Rao (Mentor)',
    status: 'in-progress',
    followUpAt: '2026-10-20',
    createdAt: '2026-10-05T10:00:00Z',
    updatedAt: '2026-10-11T12:00:00Z',
    baselineSnapshot: {
      recordedAt: '2026-10-05T10:00:00Z',
      attendanceRate: 92.5,
      attendanceNumerator: 10,
      attendanceDenominator: 11,
      attendanceDetail: '10/11 sessions present (90.9%)',
      cgpa: 8.78,
      academicScore: 92,
    },
    milestones: [
      {
        id: 'ms-101-01',
        title: 'Complete 5 distributed systems design scenarios (Cache invalidation, Sharding)',
        completed: true,
        completedAt: '2026-10-09T18:00:00Z',
      },
      {
        id: 'ms-101-02',
        title: 'Mock technical round with alumni engineer',
        completed: true,
        completedAt: '2026-10-11T14:00:00Z',
      },
      {
        id: 'ms-101-03',
        title: 'Finalize Google Cloud SDE application portfolio',
        completed: false,
      },
    ],
    progressUpdates: [
      {
        id: 'prog-101-01',
        date: '2026-10-10T11:00:00Z',
        studentUid: 'user-student-1',
        studentName: 'Aarav Sharma',
        message: 'Completed systems design mock interview with positive feedback on rate limiting and p99 latency concepts.',
      },
    ],
    checkIns: [
      {
        id: 'chk-101-01',
        date: '2026-10-11T15:00:00Z',
        mentorUid: 'user-mentor-1',
        mentorName: 'Dr. Shweta Rao',
        notes: 'Cleared Microsoft OA with top scores. Recommended for final technical mock round.',
        outcomeStatus: 'stable',
      },
    ],
  }
];

export const INITIAL_MENTOR_NOTES: MentoringNote[] = [
  {
    id: 'note-01',
    studentId: 'stu-102',
    mentorUid: 'user-mentor-1',
    isPrivate: true,
    content: 'CONFIDENTIAL: Student expressed anxiety about family health emergency impacting focus during September. Advised campus mental wellness counseling and structured 2-week catch-up schedule with faculty.',
    createdAt: '2026-10-08T11:45:00Z'
  },
  {
    id: 'note-02',
    studentId: 'stu-101',
    mentorUid: 'user-mentor-1',
    isPrivate: true,
    content: 'Candidate possesses top 2% technical aptitude in systems engineering. Recommended for Google Cloud fellowship nomination.',
    createdAt: '2026-10-05T10:30:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-01',
    actorUid: 'user-super-admin',
    actorName: 'Dr. Evelyn Vance',
    actorRole: 'super-admin',
    action: 'SYSTEM_CONFIG_UPDATED',
    recordType: 'SystemSettings',
    recordId: 'cfg-security-2026',
    details: 'Enforced 2FA and tightened session inactivity timeout to 30 mins.',
    createdAt: '2026-10-12T07:12:00Z'
  },
  {
    id: 'aud-02',
    actorUid: 'user-faculty-1',
    actorName: 'Prof. Rajesh Verma',
    actorRole: 'faculty',
    action: 'ATTENDANCE_MARKED',
    recordType: 'Attendance',
    recordId: 'cls-301:2026-10-10',
    details: 'Marked 65 students present/absent for Distributed Systems lecture.',
    createdAt: '2026-10-10T09:35:00Z'
  },
  {
    id: 'aud-03',
    actorUid: 'user-placement-admin-1',
    actorName: 'Ms. Priya Deshmukh',
    actorRole: 'placement-admin',
    action: 'DRIVE_CREATED',
    recordType: 'PlacementDrive',
    recordId: 'drv-01',
    details: 'Created recruitment drive: Google SDE I with CGPA cutoff 8.0.',
    createdAt: '2026-10-11T08:15:00Z'
  },
  {
    id: 'aud-04',
    actorUid: 'user-mentor-1',
    actorName: 'Dr. Shweta Rao',
    actorRole: 'mentor',
    action: 'INTERVENTION_ESCALATED',
    recordType: 'Intervention',
    recordId: 'int-01',
    details: 'Flagged attendance concern for Neha Patel to CSE HOD.',
    createdAt: '2026-10-08T11:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    recipientUid: 'user-student-1',
    type: 'assignment',
    title: 'Assignment Deadline Approaching',
    message: 'Raft Consensus Protocol is due in 6 days. Submit your ZIP or PDF archive.',
    createdAt: '2026-10-12T06:00:00Z'
  },
  {
    id: 'notif-02',
    recipientUid: 'user-student-1',
    type: 'placement',
    title: 'Microsoft Azure Core Round 1',
    message: 'Your Technical Interview is confirmed for October 14 at 10:00 AM IST.',
    createdAt: '2026-10-11T12:00:00Z'
  },
  {
    id: 'notif-03',
    recipientUid: 'user-faculty-1',
    type: 'academic',
    title: 'New Assignment Submission',
    message: 'Aarav Sharma submitted Raft Consensus Protocol implementation.',
    createdAt: '2026-10-11T16:21:00Z'
  }
];
