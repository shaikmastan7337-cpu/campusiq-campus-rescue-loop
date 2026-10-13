export type UserRole = 
  | 'super-admin'
  | 'student'
  | 'faculty'
  | 'hod'
  | 'admin'
  | 'placement-admin'
  | 'mentor'
  | 'parent';

export interface User {
  uid: string;
  role: UserRole;
  status: 'active' | 'inactive';
  displayName: string;
  email: string;
  /** Institutional ID accepted by the demo login form (not a password). */
  loginId?: string;
  departmentId?: string;
  departmentName?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface StudentProfile {
  studentId: string;
  uid: string;
  rollNumber: string;
  departmentId: string;
  departmentName: string;
  section: string;
  semester: number;
  academicYear: string;
  cgpa: number;
  backlogs: number;
  mentorUid: string;
  guardianUid?: string;
  learningPlatformActivityScore?: number; // 0 - 100
  engagementScore?: number; // 0 - 100
}

export interface FacultyProfile {
  facultyId: string;
  uid: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  assignedClasses: string[]; // classIds
}

export interface Department {
  departmentId: string;
  name: string;
  code: string;
  hodUid: string;
  hodName: string;
  studentCount: number;
  facultyCount: number;
}

export interface Course {
  courseId: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  departmentId: string;
}

export interface ClassSection {
  classId: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  facultyUid: string;
  facultyName: string;
  section: string;
  academicYear: string;
  semester: number;
  departmentId: string;
  enrolledCount: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  classId: string;
  courseName?: string;
  date: string; // YYYY-MM-DD
  session: string;
  status: AttendanceStatus;
  markedBy: string;
  markedByName?: string;
  updatedAt: string;
  correctionRequested?: boolean;
  correctionReason?: string;
}

export interface Assignment {
  assignmentId: string;
  classId: string;
  courseName: string;
  title: string;
  description: string;
  dueAt: string;
  maxMarks: number;
  allowedFormats: string[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export type SubmissionStatus = 'draft' | 'submitted' | 'late' | 'evaluated' | 'returned';

export interface Submission {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  filePath?: string;
  fileName: string;
  fileSize: string;
  submittedAt: string;
  status: SubmissionStatus;
  marks?: number;
  maxMarks?: number;
  feedback?: string;
  canResubmit?: boolean;
}

export interface GradeRecord {
  id: string;
  studentId: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  assessmentType: 'Internal 1' | 'Internal 2' | 'Semester Exam' | 'Assignment Avg';
  marks: number;
  maxMarks: number;
  updatedBy: string;
  updatedAt: string;
}

export interface TimetableEntry {
  id: string;
  classId: string;
  courseName: string;
  courseCode: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room: string;
  facultyName: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: 'all' | 'students' | 'faculty' | 'department';
  departmentId?: string;
  category: 'academic' | 'placement' | 'event' | 'urgent';
  createdBy: string;
  creatorRole: string;
  createdAt: string;
  important: boolean;
}

export interface PlacementProfile {
  studentId: string;
  skills: string[];
  certifications: string[];
  resumeName: string;
  resumeUrl: string;
  githubUrl?: string;
  linkedinUrl?: string;
  leetcodeSolved?: number;
  aptitudeScore?: number; // 0-100
  mockInterviewScore?: number; // 0-100
}

export interface PlacementEligibilityRule {
  minCgpa: number;
  maxBacklogs: number;
  departments: string[];
}

export interface PlacementDrive {
  driveId: string;
  companyName: string;
  companyLogo?: string;
  role: string;
  packageLpa: number;
  eligibility: PlacementEligibilityRule;
  deadline: string;
  driveDate: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
}

export type ApplicationStage = 
  | 'applied'
  | 'shortlisted'
  | 'aptitude'
  | 'technical'
  | 'hr'
  | 'offered'
  | 'rejected';

export interface Application {
  applicationId: string;
  driveId: string;
  companyName: string;
  role: string;
  packageLpa: number;
  studentId: string;
  studentName: string;
  rollNumber: string;
  stage: ApplicationStage;
  appliedAt: string;
  updatedAt: string;
  feedback?: string;
}

export interface PlanMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface PlanCheckIn {
  id: string;
  date: string;
  mentorUid: string;
  mentorName: string;
  notes: string;
  outcomeStatus?: 'recovering' | 'stable' | 'needs-revision' | 'resolved';
}

export interface PlanProgressUpdate {
  id: string;
  date: string;
  studentUid: string;
  studentName: string;
  message: string;
}

export interface PlanBaselineSnapshot {
  recordedAt: string;
  attendanceRate: number;
  attendanceNumerator: number;
  attendanceDenominator: number;
  attendanceDetail: string;
  cgpa: number;
  academicScore: number;
}

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  mentorUid: string;
  mentorName: string;
  goal?: string; // Concise, measurable objective
  actionPlan: string;
  actionOwner: string;
  status: 'open' | 'in-progress' | 'resolved';
  followUpAt: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  category: 'Academic' | 'Attendance' | 'Placement' | 'Personal';
  escalated?: boolean;
  escalationReason?: string;
  milestones?: PlanMilestone[];
  checkIns?: PlanCheckIn[];
  progressUpdates?: PlanProgressUpdate[];
  baselineSnapshot?: PlanBaselineSnapshot;
}

export interface MentoringNote {
  id: string;
  studentId: string;
  mentorUid: string;
  isPrivate: true; // Strictly private - inaccessible to student
  content: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  recipientUid: string;
  type: 'academic' | 'attendance' | 'assignment' | 'placement' | 'alert';
  title: string;
  message: string;
  readAt?: string;
  createdAt: string;
  actionUrl?: string;
}

export interface AuditLog {
  id: string;
  actorUid: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  recordType: string;
  recordId: string;
  details: string;
  createdAt: string;
}

export interface ScoreComponentBreakdown {
  name: string;
  weight: number; // e.g. 35 for 35%
  rawScore: number; // 0 - 100
  weightedScore: number;
  status: 'available' | 'partial' | 'missing';
  description: string;
  includedRecordsCount?: number;
  dataCoverageText?: string;
  formulaDetail?: string;
}

export interface SupportSignal {
  id: string;
  category: 'Academic' | 'Attendance' | 'Engagement' | 'Placement';
  title: string;
  description: string;
  dateWindow: string;
  evidence: string;
  suggestedAction: string;
  severity: 'high' | 'medium' | 'info';
}

export interface PlacementEligibilityCriterion {
  name: string;
  required: string;
  actual: string;
  met: boolean;
}

export interface PlacementEligibilityResult {
  isEligible: boolean;
  status: 'eligible' | 'ineligible' | 'unknown';
  unmetCriteria: string[];
  criteriaDetails: PlacementEligibilityCriterion[];
  evaluatedAt: string;
}

export interface AcademicSuccessScore {
  studentId: string;
  totalScore: number;
  isProvisional: boolean;
  availableDataPercent: number;
  components: ScoreComponentBreakdown[];
  supportSignals: SupportSignal[];
  riskAlerts: string[]; // Retained for backwards-compatibility
  recommendations: string[];
  placementReadinessScore: number; // calculated separately
  placementReadinessStatus: 'Ready' | 'Needs Practice' | 'Critical Gaps';
  evidenceDateWindow?: string;
  formulaSummary?: string;
}

