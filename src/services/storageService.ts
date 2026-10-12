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
  AuditLog,
  NotificationItem,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DEPARTMENTS,
  INITIAL_STUDENTS,
  INITIAL_FACULTY,
  INITIAL_COURSES,
  INITIAL_CLASSES,
  INITIAL_ATTENDANCE,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_GRADES,
  INITIAL_TIMETABLE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_PLACEMENT_PROFILES,
  INITIAL_PLACEMENT_DRIVES,
  INITIAL_APPLICATIONS,
  INITIAL_INTERVENTIONS,
  INITIAL_MENTOR_NOTES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

const STORAGE_KEY = 'campusiq_state_v1';

export interface AppState {
  currentUser: User;
  users: User[];
  departments: Department[];
  students: StudentProfile[];
  faculty: FacultyProfile[];
  courses: Course[];
  classes: ClassSection[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
  submissions: Submission[];
  grades: GradeRecord[];
  timetable: TimetableEntry[];
  announcements: Announcement[];
  placementProfiles: PlacementProfile[];
  placementDrives: PlacementDrive[];
  applications: Application[];
  interventions: Intervention[];
  mentoringNotes: MentoringNote[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  firebaseConfig?: {
    apiKey?: string;
    authDomain?: string;
    projectId?: string;
    storageBucket?: string;
  };
  geminiApiKey?: string;
}

function getInitialState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const restored = JSON.parse(saved) as AppState;
      const users = [...restored.users];
      INITIAL_USERS.forEach((initialUser) => {
        if (!users.some((user) => user.uid === initialUser.uid)) users.push(initialUser);
      });
      const faculty = [...restored.faculty];
      INITIAL_FACULTY.forEach((initialFaculty) => {
        if (!faculty.some((profile) => profile.uid === initialFaculty.uid)) faculty.push(initialFaculty);
      });
      const classes = [...restored.classes];
      INITIAL_CLASSES.forEach((initialClass) => {
        if (!classes.some((classSection) => classSection.classId === initialClass.classId)) classes.push(initialClass);
      });
      const students = restored.students.map((student) => ({
        ...student,
        section: student.section || INITIAL_STUDENTS.find((initialStudent) => initialStudent.uid === student.uid)?.section || 'Unassigned',
      }));
      INITIAL_STUDENTS.forEach((initialStudent) => {
        if (!students.some((student) => student.studentId === initialStudent.studentId)) students.push(initialStudent);
      });
      const courses = [...restored.courses];
      INITIAL_COURSES.forEach((initialCourse) => {
        if (!courses.some((course) => course.courseId === initialCourse.courseId)) courses.push(initialCourse);
      });
      return { ...restored, users, faculty, classes, students, courses };
    }
  } catch (e) {
    console.error('Failed to parse saved state:', e);
  }

  return {
    currentUser: INITIAL_USERS[1], // Default to student Aarav Sharma
    users: INITIAL_USERS,
    departments: INITIAL_DEPARTMENTS,
    students: INITIAL_STUDENTS,
    faculty: INITIAL_FACULTY,
    courses: INITIAL_COURSES,
    classes: INITIAL_CLASSES,
    attendance: INITIAL_ATTENDANCE,
    assignments: INITIAL_ASSIGNMENTS,
    submissions: INITIAL_SUBMISSIONS,
    grades: INITIAL_GRADES,
    timetable: INITIAL_TIMETABLE,
    announcements: INITIAL_ANNOUNCEMENTS,
    placementProfiles: INITIAL_PLACEMENT_PROFILES,
    placementDrives: INITIAL_PLACEMENT_DRIVES,
    applications: INITIAL_APPLICATIONS,
    interventions: INITIAL_INTERVENTIONS,
    mentoringNotes: INITIAL_MENTOR_NOTES,
    auditLogs: INITIAL_AUDIT_LOGS,
    notifications: INITIAL_NOTIFICATIONS,
  };
}

class StorageManager {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = getInitialState();
  }

  public getState(): AppState {
    return this.state;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    this.listeners.forEach((listener) => listener());
  }

  public switchUser(user: User) {
    this.state.currentUser = user;
    this.addAuditLog(
      'USER_SWITCHED_SESSION',
      'User',
      user.uid,
      `Switched active role to ${user.role} (${user.displayName})`
    );
    this.notify();
  }

  public assignFacultyToClass(classId: string, facultyUid: string): boolean {
    const classSection = this.state.classes.find((item) => item.classId === classId);
    const facultyProfile = this.state.faculty.find((item) => item.uid === facultyUid);
    const facultyUser = this.state.users.find((item) => item.uid === facultyUid && item.role === 'faculty');
    if (!classSection || !facultyProfile || !facultyUser || facultyProfile.departmentId !== classSection.departmentId) return false;

    const previousFacultyUid = classSection.facultyUid;
    classSection.facultyUid = facultyUid;
    classSection.facultyName = facultyUser.displayName;
    this.state.faculty = this.state.faculty.map((profile) => {
      if (previousFacultyUid === facultyUid && profile.uid === facultyUid) {
        return profile.assignedClasses.includes(classId)
          ? profile
          : { ...profile, assignedClasses: [...profile.assignedClasses, classId] };
      }
      if (profile.uid === previousFacultyUid) {
        return { ...profile, assignedClasses: profile.assignedClasses.filter((assignedId) => assignedId !== classId) };
      }
      if (profile.uid === facultyUid && !profile.assignedClasses.includes(classId)) {
        return { ...profile, assignedClasses: [...profile.assignedClasses, classId] };
      }
      return profile;
    });
    this.addAuditLog('FACULTY_CLASS_ASSIGNED', 'ClassSection', classId, `Assigned ${classSection.section} ${classSection.courseCode} to ${facultyUser.displayName}`);
    this.notify();
    return true;
  }

  public markAttendance(
    studentId: string,
    classId: string,
    status: AttendanceRecord['status'],
    session: string,
    date: string = new Date().toISOString().split('T')[0]
  ) {
    const student = this.state.students.find((s) => s.studentId === studentId);
    const existingIndex = this.state.attendance.findIndex(
      (a) => a.studentId === studentId && a.classId === classId && a.date === date
    );

    const record: AttendanceRecord = {
      id: existingIndex >= 0 ? this.state.attendance[existingIndex].id : `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      studentName: student ? this.state.users.find(u => u.uid === student.uid)?.displayName : 'Student',
      classId,
      date,
      session,
      status,
      markedBy: this.state.currentUser.uid,
      markedByName: this.state.currentUser.displayName,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      this.state.attendance[existingIndex] = record;
    } else {
      this.state.attendance = [record, ...this.state.attendance];
    }

    this.addAuditLog(
      'ATTENDANCE_RECORDED',
      'AttendanceRecord',
      record.id,
      `Marked ${status} for student ${studentId} on ${date}`
    );
    this.notify();
  }

  public submitAssignment(assignmentId: string, fileName: string, fileSize: string) {
    const studentProfile = this.state.students.find((s) => s.uid === this.state.currentUser.uid);
    if (!studentProfile) return;

    const assignment = this.state.assignments.find((a) => a.assignmentId === assignmentId);
    const isLate = assignment ? new Date() > new Date(assignment.dueAt) : false;

    const existingIndex = this.state.submissions.findIndex(
      (s) => s.assignmentId === assignmentId && s.studentId === studentProfile.studentId
    );

    const submission: Submission = {
      submissionId: existingIndex >= 0 ? this.state.submissions[existingIndex].submissionId : `sub-${Date.now()}`,
      assignmentId,
      studentId: studentProfile.studentId,
      studentName: this.state.currentUser.displayName,
      rollNumber: studentProfile.rollNumber,
      fileName,
      fileSize,
      submittedAt: new Date().toISOString(),
      status: isLate ? 'late' : 'submitted',
    };

    if (existingIndex >= 0) {
      this.state.submissions[existingIndex] = submission;
    } else {
      this.state.submissions = [submission, ...this.state.submissions];
    }

    this.addAuditLog(
      'ASSIGNMENT_SUBMITTED',
      'Submission',
      submission.submissionId,
      `${this.state.currentUser.displayName} submitted ${fileName} for assignment ${assignmentId}`
    );

    this.notify();
  }

  public gradeSubmission(submissionId: string, marks: number, feedback: string) {
    const sub = this.state.submissions.find((s) => s.submissionId === submissionId);
    if (!sub) return;

    sub.marks = marks;
    sub.feedback = feedback;
    sub.status = 'evaluated';

    this.addAuditLog(
      'SUBMISSION_GRADED',
      'Submission',
      submissionId,
      `Graded submission ${submissionId} with ${marks} marks. Feedback: "${feedback.slice(0, 30)}..."`
    );

    // Push notification to student
    const student = this.state.students.find((s) => s.studentId === sub.studentId);
    if (student) {
      this.state.notifications.unshift({
        id: `notif-${Date.now()}`,
        recipientUid: student.uid,
        type: 'assignment',
        title: 'Assignment Graded',
        message: `Your submission for assignment has been evaluated: ${marks} marks. Feedback: ${feedback}`,
        createdAt: new Date().toISOString(),
      });
    }

    this.notify();
  }

  public createAssignment(assignmentData: Omit<Assignment, 'assignmentId' | 'createdAt' | 'createdBy' | 'createdByName'>) {
    const newAssignment: Assignment = {
      ...assignmentData,
      assignmentId: `asg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: this.state.currentUser.uid,
      createdByName: this.state.currentUser.displayName,
    };

    this.state.assignments.unshift(newAssignment);
    this.addAuditLog(
      'ASSIGNMENT_CREATED',
      'Assignment',
      newAssignment.assignmentId,
      `Created assignment "${newAssignment.title}" for class ${newAssignment.classId}`
    );
    this.notify();
  }

  public createPlacementDrive(driveData: Omit<PlacementDrive, 'driveId'>) {
    const newDrive: PlacementDrive = {
      ...driveData,
      driveId: `drv-${Date.now()}`,
    };

    this.state.placementDrives.unshift(newDrive);
    this.addAuditLog(
      'PLACEMENT_DRIVE_CREATED',
      'PlacementDrive',
      newDrive.driveId,
      `Created drive for ${newDrive.companyName} (${newDrive.role}, ${newDrive.packageLpa} LPA)`
    );

    // Broadcast announcement
    this.state.announcements.unshift({
      id: `anc-${Date.now()}`,
      title: `New Placement Drive: ${newDrive.companyName}`,
      body: `${newDrive.companyName} is hiring for ${newDrive.role} (${newDrive.packageLpa} LPA). Deadline: ${new Date(newDrive.deadline).toLocaleDateString()}.`,
      audience: 'students',
      category: 'placement',
      createdBy: this.state.currentUser.uid,
      creatorRole: 'Placement Cell',
      createdAt: new Date().toISOString(),
      important: true,
    });

    this.notify();
  }

  public applyToDrive(driveId: string, studentId: string) {
    const drive = this.state.placementDrives.find((d) => d.driveId === driveId);
    const student = this.state.students.find((s) => s.studentId === studentId);
    if (!drive || !student) return;

    const existing = this.state.applications.find(
      (a) => a.driveId === driveId && a.studentId === studentId
    );
    if (existing) return;

    const newApp: Application = {
      applicationId: `app-${Date.now()}`,
      driveId,
      companyName: drive.companyName,
      role: drive.role,
      packageLpa: drive.packageLpa,
      studentId,
      studentName: this.state.currentUser.displayName,
      rollNumber: student.rollNumber,
      stage: 'applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      feedback: 'Application registered. Verification pending.',
    };

    this.state.applications.unshift(newApp);
    this.addAuditLog(
      'APPLICATION_SUBMITTED',
      'Application',
      newApp.applicationId,
      `${newApp.studentName} applied to ${drive.companyName}`
    );
    this.notify();
  }

  public updateApplicationStage(applicationId: string, stage: Application['stage'], feedback?: string) {
    const app = this.state.applications.find((a) => a.applicationId === applicationId);
    if (!app) return;

    app.stage = stage;
    app.updatedAt = new Date().toISOString();
    if (feedback) app.feedback = feedback;

    this.addAuditLog(
      'APPLICATION_STAGE_UPDATED',
      'Application',
      applicationId,
      `Advanced application ${applicationId} to ${stage}`
    );
    this.notify();
  }

  public addIntervention(interventionData: Omit<Intervention, 'id' | 'createdAt'>) {
    const newInt: Intervention = {
      ...interventionData,
      id: `int-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: interventionData.milestones || [],
      checkIns: interventionData.checkIns || [],
      progressUpdates: interventionData.progressUpdates || [],
    };

    this.state.interventions.unshift(newInt);
    this.addAuditLog(
      'SUPPORT_PLAN_CREATED',
      'Intervention',
      newInt.id,
      `Support plan logged for student ${newInt.studentName} (${newInt.category}). Follow-up target: ${newInt.followUpAt}`
    );

    // Notify student about new shared plan
    const student = this.state.students.find((s) => s.studentId === newInt.studentId);
    if (student) {
      this.state.notifications.unshift({
        id: `notif-${Date.now()}`,
        recipientUid: student.uid,
        type: 'alert',
        title: 'New Shared Support Plan Created',
        message: `${newInt.mentorName} created a shared ${newInt.category} support plan with targeted milestones for you.`,
        createdAt: new Date().toISOString(),
      });
    }

    this.notify();
    return newInt;
  }

  public updateInterventionStatus(
    planId: string,
    status: Intervention['status'],
    note?: string
  ) {
    const plan = this.state.interventions.find((i) => i.id === planId);
    if (!plan) return;

    const oldStatus = plan.status;
    plan.status = status;
    plan.updatedAt = new Date().toISOString();
    if (status === 'resolved') {
      plan.resolvedAt = new Date().toISOString();
    } else {
      plan.resolvedAt = undefined;
    }

    this.addAuditLog(
      'SUPPORT_PLAN_STATUS_CHANGED',
      'Intervention',
      planId,
      `Plan status transitioned from ${oldStatus} to ${status}${note ? ` (Note: ${note})` : ''}`
    );

    // Push notification to student
    const student = this.state.students.find((s) => s.studentId === plan.studentId);
    if (student) {
      this.state.notifications.unshift({
        id: `notif-${Date.now()}`,
        recipientUid: student.uid,
        type: 'alert',
        title: `Support Plan Status: ${status.toUpperCase()}`,
        message: `Your ${plan.category} support plan status was updated to ${status} by ${this.state.currentUser.displayName}.`,
        createdAt: new Date().toISOString(),
      });
    }

    this.notify();
  }

  public toggleInterventionMilestone(planId: string, milestoneId: string) {
    const plan = this.state.interventions.find((i) => i.id === planId);
    if (!plan || !plan.milestones) return;

    const milestone = plan.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    milestone.completed = !milestone.completed;
    milestone.completedAt = milestone.completed ? new Date().toISOString() : undefined;
    plan.updatedAt = new Date().toISOString();

    const actor = this.state.currentUser.displayName;
    this.addAuditLog(
      'PLAN_MILESTONE_TOGGLED',
      'Intervention',
      planId,
      `Milestone "${milestone.title}" marked as ${milestone.completed ? 'COMPLETED' : 'INCOMPLETE'} by ${actor}`
    );

    // If student toggled milestone, notify mentor
    if (this.state.currentUser.role === 'student') {
      this.state.notifications.unshift({
        id: `notif-${Date.now()}`,
        recipientUid: plan.mentorUid,
        type: 'academic',
        title: 'Milestone Progress Update',
        message: `${plan.studentName} marked milestone "${milestone.title}" as ${milestone.completed ? 'complete' : 'pending'}.`,
        createdAt: new Date().toISOString(),
      });
    }

    this.notify();
  }

  public addInterventionMilestone(planId: string, title: string) {
    const plan = this.state.interventions.find((i) => i.id === planId);
    if (!plan) return;

    if (!plan.milestones) plan.milestones = [];
    const newMs = {
      id: `ms-${Date.now()}`,
      title,
      completed: false,
    };
    plan.milestones.push(newMs);
    plan.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'PLAN_MILESTONE_ADDED',
      'Intervention',
      planId,
      `Added milestone: "${title}"`
    );

    this.notify();
  }

  public addInterventionProgressUpdate(planId: string, message: string) {
    const plan = this.state.interventions.find((i) => i.id === planId);
    if (!plan) return;

    if (!plan.progressUpdates) plan.progressUpdates = [];
    const update = {
      id: `prog-${Date.now()}`,
      date: new Date().toISOString(),
      studentUid: this.state.currentUser.uid,
      studentName: this.state.currentUser.displayName,
      message,
    };
    plan.progressUpdates.push(update);
    plan.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'STUDENT_PROGRESS_LOGGED',
      'Intervention',
      planId,
      `${update.studentName} logged progress update: "${message.slice(0, 40)}..."`
    );

    // Notify mentor
    this.state.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientUid: plan.mentorUid,
      type: 'academic',
      title: 'Student Progress Reflection Logged',
      message: `${plan.studentName} added an update to their support plan: "${message.slice(0, 80)}"`,
      createdAt: new Date().toISOString(),
    });

    this.notify();
  }

  public addInterventionCheckIn(
    planId: string,
    notes: string,
    outcomeStatus?: 'recovering' | 'stable' | 'needs-revision' | 'resolved'
  ) {
    const plan = this.state.interventions.find((i) => i.id === planId);
    if (!plan) return;

    if (!plan.checkIns) plan.checkIns = [];
    const checkIn = {
      id: `chk-${Date.now()}`,
      date: new Date().toISOString(),
      mentorUid: this.state.currentUser.uid,
      mentorName: this.state.currentUser.displayName,
      notes,
      outcomeStatus,
    };
    plan.checkIns.push(checkIn);
    plan.updatedAt = new Date().toISOString();

    if (outcomeStatus === 'resolved') {
      plan.status = 'resolved';
      plan.resolvedAt = new Date().toISOString();
    }

    this.addAuditLog(
      'MENTOR_CHECKIN_RECORDED',
      'Intervention',
      planId,
      `Check-in recorded by ${checkIn.mentorName}. Outcome assessment: ${outcomeStatus || 'reviewed'}`
    );

    // Notify student
    const student = this.state.students.find((s) => s.studentId === plan.studentId);
    if (student) {
      this.state.notifications.unshift({
        id: `notif-${Date.now()}`,
        recipientUid: student.uid,
        type: 'academic',
        title: 'Mentor Check-in Recorded',
        message: `${this.state.currentUser.displayName} recorded a check-in on your support plan: "${notes.slice(0, 80)}"`,
        createdAt: new Date().toISOString(),
      });
    }

    this.notify();
  }

  public reviseInterventionPlan(
    planId: string,
    actionPlan: string,
    followUpAt: string,
    goal?: string
  ) {
    const plan = this.state.interventions.find((i) => i.id === planId);
    if (!plan) return;

    plan.actionPlan = actionPlan;
    plan.followUpAt = followUpAt;
    if (goal) plan.goal = goal;
    plan.status = 'in-progress';
    plan.updatedAt = new Date().toISOString();

    this.addAuditLog(
      'SUPPORT_PLAN_REVISED',
      'Intervention',
      planId,
      `Plan revised by ${this.state.currentUser.displayName}. New follow-up: ${followUpAt}`
    );

    this.notify();
  }

  public addMentoringNote(studentId: string, content: string) {
    const newNote: MentoringNote = {
      id: `note-${Date.now()}`,
      studentId,
      mentorUid: this.state.currentUser.uid,
      isPrivate: true,
      content,
      createdAt: new Date().toISOString(),
    };

    this.state.mentoringNotes.unshift(newNote);
    this.addAuditLog(
      'CONFIDENTIAL_NOTE_ADDED',
      'MentoringNote',
      newNote.id,
      `Confidential mentor note recorded by ${this.state.currentUser.displayName}`
    );
    this.notify();
  }

  public createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt' | 'createdBy' | 'creatorRole'>) {
    const newAnn: Announcement = {
      ...announcement,
      id: `anc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: this.state.currentUser.uid,
      creatorRole: this.state.currentUser.role,
    };

    this.state.announcements.unshift(newAnn);
    this.addAuditLog(
      'ANNOUNCEMENT_PUBLISHED',
      'Announcement',
      newAnn.id,
      `Published "${newAnn.title}" for ${newAnn.audience}`
    );
    this.notify();
  }

  public toggleUserStatus(uid: string) {
    const user = this.state.users.find((u) => u.uid === uid);
    if (!user) return;

    user.status = user.status === 'active' ? 'inactive' : 'active';
    this.addAuditLog(
      'USER_STATUS_TOGGLED',
      'User',
      uid,
      `Changed status of ${user.displayName} to ${user.status}`
    );
    this.notify();
  }

  public addAuditLog(action: string, recordType: string, recordId: string, details: string) {
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      actorUid: this.state.currentUser?.uid || 'system',
      actorName: this.state.currentUser?.displayName || 'System Process',
      actorRole: this.state.currentUser?.role || 'admin',
      action,
      recordType,
      recordId,
      details,
      createdAt: new Date().toISOString(),
    };

    this.state.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.state.auditLogs.length > 200) {
      this.state.auditLogs.pop();
    }
  }

  public setFirebaseConfig(config: AppState['firebaseConfig']) {
    this.state.firebaseConfig = config;
    this.addAuditLog(
      'FIREBASE_CONFIG_UPDATED',
      'Configuration',
      'firebase',
      `Firebase configuration updated: Project ID ${config?.projectId || 'Not set'}`
    );
    this.notify();
  }

  public setGeminiApiKey(key: string) {
    this.state.geminiApiKey = key;
    this.notify();
  }

  public resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = {
      currentUser: INITIAL_USERS[1],
      users: [...INITIAL_USERS],
      departments: [...INITIAL_DEPARTMENTS],
      students: [...INITIAL_STUDENTS],
      faculty: [...INITIAL_FACULTY],
      courses: [...INITIAL_COURSES],
      classes: [...INITIAL_CLASSES],
      attendance: [...INITIAL_ATTENDANCE],
      assignments: [...INITIAL_ASSIGNMENTS],
      submissions: [...INITIAL_SUBMISSIONS],
      grades: [...INITIAL_GRADES],
      timetable: [...INITIAL_TIMETABLE],
      announcements: [...INITIAL_ANNOUNCEMENTS],
      placementProfiles: [...INITIAL_PLACEMENT_PROFILES],
      placementDrives: [...INITIAL_PLACEMENT_DRIVES],
      applications: [...INITIAL_APPLICATIONS],
      interventions: [...INITIAL_INTERVENTIONS],
      mentoringNotes: [...INITIAL_MENTOR_NOTES],
      auditLogs: [...INITIAL_AUDIT_LOGS],
      notifications: [...INITIAL_NOTIFICATIONS],
    };
    this.notify();
  }
}

export const storage = new StorageManager();
