import React, { useState } from 'react';
import {
  GraduationCap,
  ClipboardCheck,
  FileText,
  Briefcase,
  AlertTriangle,
  Upload,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Send,
  HeartHandshake,
  Check,
  X,
  Info,
} from 'lucide-react';
import { User, StudentProfile, Application } from '../../types';
import { storage } from '../../services/storageService';
import { calculateStudentSuccessScore } from '../../services/analyticsService';
import { checkPlacementEligibility } from '../../services/placementEligibility';
import { StatCard } from '../common/StatCard';
import { SuccessScoreGauge } from '../common/SuccessScoreGauge';
import { ScoreExplanationModal } from '../common/ScoreExplanationModal';
import { SupportPlanCard } from '../common/SupportPlanCard';
import { AttendanceScenarioCard } from '../common/AttendanceScenarioCard';

interface StudentDashboardProps {
  currentUser: User;
  currentTab: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  currentTab,
}) => {
  const state = storage.getState();
  const [showExplanationModal, setShowExplanationModal] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [submissionFeedbackMsg, setSubmissionFeedbackMsg] = useState('');

  // Find student profile linked to this user
  const student = state.students.find((s) => s.uid === currentUser.uid) || state.students[0];
  const studentPlacementProfile = state.placementProfiles.find(
    (p) => p.studentId === student.studentId
  );

  // Student records
  const studentAttendance = state.attendance.filter((a) => a.studentId === student.studentId);
  const studentSubmissions = state.submissions.filter((s) => s.studentId === student.studentId);
  const studentGrades = state.grades.filter((g) => g.studentId === student.studentId);
  const studentApplications = state.applications.filter((a) => a.studentId === student.studentId);
  const studentPlans = state.interventions.filter((i) => i.studentId === student.studentId);

  // Calculate attendance %
  const seenSessions = new Set<string>();
  const uniqueAttendance: typeof studentAttendance = [];
  studentAttendance.forEach((att) => {
    const key = `${att.classId || 'cls'}_${att.date}_${att.session || 's'}`;
    if (!seenSessions.has(key)) {
      seenSessions.add(key);
      uniqueAttendance.push(att);
    }
  });

  const totalClasses = uniqueAttendance.length;
  const attendedClasses = uniqueAttendance.filter(
    (a) => a.status === 'present' || a.status === 'excused'
  ).length;
  const lateClasses = uniqueAttendance.filter((a) => a.status === 'late').length;
  const attendancePercentage =
    totalClasses > 0 ? Math.round(((attendedClasses + lateClasses * 0.7) / totalClasses) * 100) : 85;

  // Calculate Success Score using honest, transparent formula
  const scoreData = calculateStudentSuccessScore(
    student,
    state.attendance,
    state.assignments,
    state.submissions,
    state.grades,
    studentPlacementProfile,
    state.classes
  );

  const pendingAssignments = state.assignments.filter(
    (a) => !studentSubmissions.some((s) => s.assignmentId === a.assignmentId)
  );

  const handleUploadAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId || !uploadFileName) return;

    storage.submitAssignment(
      selectedAssignmentId,
      uploadFileName.endsWith('.pdf') || uploadFileName.endsWith('.zip')
        ? uploadFileName
        : `${uploadFileName}.pdf`,
      '2.4 MB'
    );

    setSubmissionFeedbackMsg('Assignment submitted successfully! Persistent record stored.');
    setUploadFileName('');
    setSelectedAssignmentId(null);
    setTimeout(() => setSubmissionFeedbackMsg(''), 4000);
  };

  const handleApplyDrive = (driveId: string) => {
    storage.applyToDrive(driveId, student.studentId);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-700/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Semester {student.semester} • {student.academicYear}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-400/30 text-indigo-100 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Roll: {student.rollNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Demo Student Mode
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.displayName}!
            </h1>
            <p className="text-sm text-indigo-100 max-w-xl leading-relaxed">
              {student.departmentName}. Your next lecture is <span className="font-semibold text-white">Distributed Systems</span> in Hall B-204.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <div className="text-[11px] font-medium text-indigo-200">Current CGPA</div>
              <div className="text-xl font-bold text-white">{student.cgpa.toFixed(2)}</div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <div className="text-[11px] font-medium text-indigo-200">Attendance</div>
              <div className={`text-xl font-bold ${attendancePercentage < 75 ? 'text-amber-300' : 'text-white'}`}>
                {attendancePercentage}%
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
              <div className="text-[11px] font-medium text-indigo-200">Active Arrears</div>
              <div className="text-xl font-bold text-white">{student.backlogs}</div>
            </div>
          </div>
        </div>
      </div>

      {submissionFeedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{submissionFeedbackMsg}</span>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {(currentTab === 'overview' || !currentTab) && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Attendance Rate"
              value={`${attendancePercentage}%`}
              subtitle={`${attendedClasses + Math.round(lateClasses * 0.7)} of ${totalClasses} sessions attended`}
              icon={ClipboardCheck}
              colorTheme={attendancePercentage >= 75 ? 'emerald' : 'amber'}
            />
            <StatCard
              title="Cumulative GPA"
              value={student.cgpa.toFixed(2)}
              subtitle="10.0 grading scale"
              icon={GraduationCap}
              colorTheme="indigo"
            />
            <StatCard
              title="Success Index"
              value={`${scoreData.totalScore}/100`}
              subtitle={scoreData.isProvisional ? 'Provisional (<70% data)' : 'Normalized index'}
              icon={Sparkles}
              colorTheme="purple"
              badge={scoreData.isProvisional ? 'Provisional' : 'Verified'}
            />
            <StatCard
              title="Placement Readiness"
              value={`${scoreData.placementReadinessScore}/100`}
              subtitle={scoreData.placementReadinessStatus}
              icon={Briefcase}
              colorTheme="amber"
              badge="Separate Track"
            />
          </div>

          {/* CAMPUS RESCUE LOOP: SHARED SUPPORT PLAN (IF STUDENT HAS AN ACTIVE PLAN) */}
          {studentPlans.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-teal-600" />
                    <span>Campus Rescue Loop: Your Shared Support Plan</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Agreed action steps with your faculty mentor. Update milestones and share reflections below.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 text-[10px] font-bold">
                  Shared Support Active
                </span>
              </div>

              {studentPlans.map((plan) => (
                <SupportPlanCard
                  key={plan.id}
                  plan={plan}
                  currentUser={currentUser}
                  student={student}
                  attendanceRecords={state.attendance}
                />
              ))}
            </div>
          )}

          {/* Interactive Attendance Scenario Tool on Student View */}
          <AttendanceScenarioCard
            student={student}
            attendanceRecords={state.attendance}
          />

          {/* Review Prompts Card if triggered */}
          {scoreData.supportSignals.length > 0 && (
            <div className="glass-card rounded-2xl p-5 border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Support Signals & Review Prompts
                  </h4>
                </div>
                <button
                  onClick={() => setShowExplanationModal(true)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Explain Formula & Records</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {scoreData.supportSignals.map((sig) => (
                  <div
                    key={sig.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/60 space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{sig.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{sig.dateWindow}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {sig.description}
                    </p>
                    <div className="text-[11px] text-teal-700 dark:text-teal-400 font-medium">
                      Next Step: {sig.suggestedAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pending Deliverables */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Pending Assignments & Lab Deliverables</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ensure deliverables are submitted before due timestamps</p>
              </div>
            </div>

            {pendingAssignments.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                All course assignments submitted on schedule!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingAssignments.map((asg) => (
                  <div
                    key={asg.assignmentId}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{asg.title}</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold">
                          {asg.courseName}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">{asg.description}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Due: {new Date(asg.dueAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Max Marks: {asg.maxMarks}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedAssignmentId(asg.assignmentId);
                        setUploadFileName(`${asg.title.replace(/\s+/g, '_')}_${student.rollNumber}.zip`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Submit Work</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ACADEMICS & GRADES */}
      {currentTab === 'academics' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Semester 6 Enrolled Courses & Results
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Verified internal marks and examination records
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Course Code</th>
                    <th className="py-3 px-4">Course Name</th>
                    <th className="py-3 px-4">Credits</th>
                    <th className="py-3 px-4">Internal 1</th>
                    <th className="py-3 px-4">Internal 2</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {state.courses.map((crs) => {
                    const crsGrades = studentGrades.filter((g) => g.courseId === crs.courseId);
                    const int1 = crsGrades.find((g) => g.assessmentType === 'Internal 1');
                    const int2 = crsGrades.find((g) => g.assessmentType === 'Internal 2');
                    return (
                      <tr key={crs.courseId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{crs.code}</td>
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{crs.name}</td>
                        <td className="py-3 px-4 text-slate-500">{crs.credits}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {int1 ? `${int1.marks}/${int1.maxMarks}` : '—'}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {int2 ? `${int2.marks}/${int2.maxMarks}` : '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Enrolled
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ATTENDANCE */}
      {currentTab === 'attendance' && (
        <div className="space-y-6">
          <AttendanceScenarioCard
            student={student}
            attendanceRecords={state.attendance}
          />

          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Recorded Attendance Session Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Individual class marks recorded by teaching faculty
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Session</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Faculty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {uniqueAttendance.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-mono">{att.date}</td>
                      <td className="py-3 px-4 font-medium">{att.courseName || 'Lecture Block'}</td>
                      <td className="py-3 px-4 text-slate-500">{att.session}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            att.status === 'present'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : att.status === 'late'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{att.markedByName || 'Course Faculty'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASSIGNMENTS */}
      {currentTab === 'assignments' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Your Submissions & Faculty Evaluations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Track grades, rubrics, and instructor feedback
            </p>

            <div className="space-y-3">
              {studentSubmissions.map((sub) => (
                <div
                  key={sub.submissionId}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{sub.fileName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sub.status === 'evaluated'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Submitted: {new Date(sub.submittedAt).toLocaleString()} • Size: {sub.fileSize}
                  </div>
                  {sub.marks !== undefined && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-[11px]">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300">
                        Score Awarded: {sub.marks} / {sub.maxMarks || 40}
                      </div>
                      {sub.feedback && (
                        <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                          <strong>Feedback:</strong> {sub.feedback}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PLACEMENTS - DATA DRIVEN ELIGIBILITY */}
      {currentTab === 'placements' && (
        <div className="space-y-6">
          {/* Profile Overview */}
          {studentPlacementProfile && (
            <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                Placement Profile & Verified Skills
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {studentPlacementProfile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div><strong>Resume on File:</strong> {studentPlacementProfile.resumeName}</div>
                <div><strong>LeetCode Solved:</strong> {studentPlacementProfile.leetcodeSolved ?? 0} Problems</div>
                <div><strong>Aptitude Score:</strong> {studentPlacementProfile.aptitudeScore !== undefined ? `${studentPlacementProfile.aptitudeScore}%` : 'Unrecorded'}</div>
              </div>
            </div>
          )}

          {/* Active Placement Drives with Shared Deterministic Eligibility */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Campus Recruitment Drives
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Eligibility is calculated deterministically against each employer's saved rules (CGPA, backlogs, department)
            </p>

            <div className="space-y-4">
              {state.placementDrives.map((drv) => {
                const eligibilityRes = checkPlacementEligibility(student, drv);
                const hasApplied = studentApplications.some((a) => a.driveId === drv.driveId);

                return (
                  <div
                    key={drv.driveId}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white text-sm">{drv.companyName}</span>
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                          {drv.packageLpa} LPA
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            eligibilityRes.isEligible
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {eligibilityRes.isEligible ? 'Eligible' : 'Ineligible'}
                        </span>
                      </div>
                      <p className="font-medium text-slate-700 dark:text-slate-300">{drv.role}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{drv.description}</p>
                      <div className="text-[11px] text-slate-400">
                        Rule: Min CGPA {drv.eligibility.minCgpa} • Max {drv.eligibility.maxBacklogs} Backlogs • Deadline: {new Date(drv.deadline).toLocaleDateString()}
                      </div>

                      {!eligibilityRes.isEligible && (
                        <div className="p-2 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-[11px] text-rose-800 dark:text-rose-300">
                          <strong>Unmet Criteria:</strong> {eligibilityRes.unmetCriteria.join(' • ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {hasApplied ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Applied
                        </span>
                      ) : eligibilityRes.isEligible ? (
                        <button
                          onClick={() => handleApplyDrive(drv.driveId)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
                        >
                          Apply Now
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-semibold">
                          Criteria Not Met
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: AI SUCCESS & SUPPORT PLANS */}
      {currentTab === 'success' && (
        <div className="space-y-6">
          <SuccessScoreGauge
            scoreData={scoreData}
            onOpenExplanation={() => setShowExplanationModal(true)}
          />

          {/* Mentoring Support Plans */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-teal-600" />
                  <span>Campus Rescue Loop: Shared Support Plans</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Collaborative support agreements coordinated by your academic mentor
                </p>
              </div>
            </div>

            {studentPlans.length === 0 ? (
              <div className="p-8 text-center rounded-2xl glass-card border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                No active support interventions currently flagged.
              </div>
            ) : (
              studentPlans.map((plan) => (
                <SupportPlanCard
                  key={plan.id}
                  plan={plan}
                  currentUser={currentUser}
                  student={student}
                  attendanceRecords={state.attendance}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Explanation Modal */}
      <ScoreExplanationModal
        isOpen={showExplanationModal}
        onClose={() => setShowExplanationModal(false)}
        student={student}
        studentName={currentUser.displayName}
        scoreData={scoreData}
      />
    </div>
  );
};
