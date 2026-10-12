import React, { useState } from 'react';
import {
  HeartHandshake,
  Lock,
  Calendar,
  AlertTriangle,
  PlusCircle,
  CheckCircle2,
  Users,
  Send,
  Eye,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Info,
  Sliders,
  FileCheck,
} from 'lucide-react';
import { User, StudentProfile } from '../../types';
import { storage } from '../../services/storageService';
import { calculateStudentSuccessScore } from '../../services/analyticsService';
import { StatCard } from '../common/StatCard';
import { ScoreExplanationModal } from '../common/ScoreExplanationModal';
import { AttendanceScenarioCard } from '../common/AttendanceScenarioCard';
import { SupportPlanCard } from '../common/SupportPlanCard';

interface MentorDashboardProps {
  currentUser: User;
  currentTab: string;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  currentUser,
  currentTab,
}) => {
  const state = storage.getState();
  // Default to Neha Patel (stu-102) for the seeded demo story
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stu-102');
  const [showExplanationModal, setShowExplanationModal] = useState(false);

  // New Support Plan Form state
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);
  const [planGoal, setPlanGoal] = useState('');
  const [actionPlanText, setActionPlanText] = useState('');
  const [planCategory, setPlanCategory] = useState<'Attendance' | 'Academic' | 'Placement' | 'Personal'>('Attendance');
  const [followUpDate, setFollowUpDate] = useState('2026-10-25');
  const [initialMilestone, setInitialMilestone] = useState('');

  // Confidential notes state
  const [privateNoteText, setPrivateNoteText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const assignedStudents = state.students.filter((s) => s.mentorUid === currentUser.uid);
  const selectedStudent =
    state.students.find((s) => s.studentId === selectedStudentId) || assignedStudents[0] || state.students[0];
  const selectedStudentUser = state.users.find((u) => u.uid === selectedStudent.uid);

  const studentPlacementProfile = state.placementProfiles.find(
    (p) => p.studentId === selectedStudent.studentId
  );

  // Calculate explainable score and support signals using honest formula
  const scoreData = calculateStudentSuccessScore(
    selectedStudent,
    state.attendance,
    state.assignments,
    state.submissions,
    state.grades,
    studentPlacementProfile,
    state.classes
  );

  const studentInterventions = state.interventions.filter(
    (i) => i.studentId === selectedStudent.studentId
  );
  const studentPrivateNotes = state.mentoringNotes.filter(
    (n) => n.studentId === selectedStudent.studentId
  );

  // Calculate student attendance for quick stats
  const seenAtt = new Set<string>();
  const studentAttRecords = state.attendance.filter((a) => {
    if (a.studentId !== selectedStudent.studentId) return false;
    const key = `${a.classId || 'cls'}_${a.date}_${a.session || 's'}`;
    if (seenAtt.has(key)) return false;
    seenAtt.add(key);
    return true;
  });
  const attTotal = studentAttRecords.length;
  const attPresent = studentAttRecords.filter((a) => a.status === 'present' || a.status === 'excused').length;
  const attLate = studentAttRecords.filter((a) => a.status === 'late').length;
  const attNumerator = attPresent + attLate * 0.7;
  const attRate = attTotal > 0 ? Math.round((attNumerator / attTotal) * 100) : 0;

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionPlanText.trim()) return;

    // Snapshot current baseline
    const baselineSnapshot = {
      recordedAt: new Date().toISOString(),
      attendanceRate: attRate,
      attendanceNumerator: Math.round(attNumerator),
      attendanceDenominator: attTotal,
      attendanceDetail: `${Math.round(attNumerator)}/${attTotal} sessions attended (${attRate}%) at baseline`,
      cgpa: selectedStudent.cgpa,
      academicScore: scoreData.totalScore,
    };

    const milestones = initialMilestone.trim()
      ? [
          {
            id: `ms-${Date.now()}`,
            title: initialMilestone.trim(),
            completed: false,
          },
        ]
      : [];

    storage.addIntervention({
      studentId: selectedStudent.studentId,
      studentName: selectedStudentUser?.displayName || 'Student',
      rollNumber: selectedStudent.rollNumber,
      mentorUid: currentUser.uid,
      mentorName: currentUser.displayName,
      goal: planGoal.trim() || `${planCategory} Support Plan`,
      actionPlan: actionPlanText.trim(),
      actionOwner: `${currentUser.displayName} (Mentor)`,
      status: 'in-progress',
      followUpAt: followUpDate,
      category: planCategory,
      milestones,
      baselineSnapshot,
    });

    setFeedbackMsg(`Shared support plan created for ${selectedStudentUser?.displayName}. Baseline snapshot preserved.`);
    setActionPlanText('');
    setPlanGoal('');
    setInitialMilestone('');
    setShowCreatePlanModal(false);
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleAddPrivateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateNoteText.trim()) return;

    storage.addMentoringNote(selectedStudent.studentId, privateNoteText.trim());
    setPrivateNoteText('');
    setFeedbackMsg('Confidential mentor note recorded. Isolated from student accounts.');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleAddScenarioMilestoneToPlan = (milestoneTitle: string) => {
    if (studentInterventions.length > 0) {
      storage.addInterventionMilestone(studentInterventions[0].id, milestoneTitle);
      setFeedbackMsg(`Scenario milestone added to ${studentInterventions[0].goal || 'Support Plan'}.`);
      setTimeout(() => setFeedbackMsg(''), 4000);
    } else {
      // If no plan exists, open the plan creation form with milestone pre-filled
      setInitialMilestone(milestoneTitle);
      setPlanGoal('Attendance Recovery Strategy');
      setActionPlanText('Focus on scheduled lecture and makeup blocks.');
      setShowCreatePlanModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-900 p-6 sm:p-8 text-white shadow-xl shadow-teal-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Campus Rescue Loop • Mentor Caseload
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Closed-Loop Student Support & Evidence Tracking
            </h1>
            <p className="text-sm text-teal-100 max-w-xl leading-relaxed">
              Identify students who may benefit from support, examine auditable records, co-create actionable plans, and evaluate longitudinal indicators.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setShowCreatePlanModal(true)}
              className="px-4 py-2 rounded-xl bg-white text-teal-900 font-bold text-xs shadow-md hover:bg-teal-50 transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-teal-700" />
              <span>Create Support Plan</span>
            </button>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Cohort Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Mentees"
          value={assignedStudents.length}
          subtitle="Cohort under mentorship"
          icon={Users}
          colorTheme="teal"
        />
        <StatCard
          title="Active Support Plans"
          value={state.interventions.filter((i) => i.status !== 'resolved').length}
          subtitle="Closed-loop action plans"
          icon={HeartHandshake}
          colorTheme="indigo"
        />
        <StatCard
          title="Support Signals"
          value={scoreData.supportSignals.length}
          subtitle={`For selected ${selectedStudentUser?.displayName?.split(' ')[0] || 'student'}`}
          icon={AlertTriangle}
          colorTheme={scoreData.supportSignals.length > 0 ? 'amber' : 'emerald'}
        />
        <StatCard
          title="Confidential Records"
          value={state.mentoringNotes.length}
          subtitle="Mentor-only notes"
          icon={Lock}
          colorTheme="purple"
          badge="Private"
        />
      </div>

      {/* Student Selector Card with Demo Context */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Mentee Case Record & Support Signals
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an assigned mentee to review verified evidence and manage their shared support loop
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="mentor-student-selector" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Select Mentee:
            </label>
            <select
              id="mentor-student-selector"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              {assignedStudents.map((s) => {
                const u = state.users.find((user) => user.uid === s.uid);
                const isStoryCase = s.studentId === 'stu-102';
                return (
                  <option key={s.studentId} value={s.studentId}>
                    {u?.displayName} ({s.rollNumber}) {isStoryCase ? '★ Seeded Support Case' : '• Healthy Record'}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Selected Mentee Summary Row */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                {selectedStudentUser?.displayName}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {selectedStudent.rollNumber}
              </span>
              {selectedStudent.studentId === 'stu-102' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  May benefit from support
                </span>
              )}
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5">
              {selectedStudent.departmentName} • Semester {selectedStudent.semester} ({selectedStudent.academicYear})
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">Attendance</div>
              <div className={`font-extrabold text-sm ${attRate >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {attRate}% ({attPresent + Math.round(attLate * 0.7)}/{attTotal} sessions)
              </div>
            </div>

            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">CGPA</div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                {selectedStudent.cgpa.toFixed(2)}/10
              </div>
            </div>

            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">Backlogs</div>
              <div className={`font-extrabold text-sm ${selectedStudent.backlogs > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {selectedStudent.backlogs}
              </div>
            </div>

            <div>
              <div className="text-slate-400 text-[10px] uppercase font-bold">Success Index</div>
              <div className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                {scoreData.totalScore}/100 {scoreData.isProvisional && <span className="text-[10px] text-amber-500 font-normal">(Prov)</span>}
              </div>
            </div>

            <button
              onClick={() => setShowExplanationModal(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition flex items-center gap-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Evidence Trail</span>
            </button>
          </div>
        </div>

        {/* Support Signals Notice if any */}
        {scoreData.supportSignals.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Active Review Prompts ({scoreData.supportSignals.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {scoreData.supportSignals.map((sig) => (
                <div
                  key={sig.id}
                  className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                    <span>{sig.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{sig.dateWindow}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                    {sig.description}
                  </p>
                  <div className="text-[10px] text-amber-800 dark:text-amber-300 font-medium">
                    Evidence: {sig.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Primary Section: Interactive Attendance "What If?" Scenario Card */}
      <AttendanceScenarioCard
        student={selectedStudent}
        attendanceRecords={state.attendance}
        onAddMilestone={handleAddScenarioMilestoneToPlan}
      />

      {/* Closed-Loop Support Plans for Selected Student */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-teal-600" />
              <span>Campus Rescue Loop: Shared Support Plans ({studentInterventions.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Co-created with student; includes milestones, check-ins, and baseline comparison
            </p>
          </div>

          <button
            onClick={() => setShowCreatePlanModal(true)}
            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Support Plan</span>
          </button>
        </div>

        {studentInterventions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl glass-card border border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-2">
            <HeartHandshake className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-600 dark:text-slate-300">
              No active support plans currently recorded for {selectedStudentUser?.displayName}.
            </p>
            <p className="text-[11px]">
              Click "New Support Plan" above to initiate a closed-loop plan with a baseline snapshot and milestones.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {studentInterventions.map((plan) => (
              <SupportPlanCard
                key={plan.id}
                plan={plan}
                currentUser={currentUser}
                student={selectedStudent}
                attendanceRecords={state.attendance}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confidential Mentor Notes Section (Strictly Private) */}
      <div className="glass-card rounded-2xl p-6 border border-purple-200/80 dark:border-purple-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>Confidential Mentor Observations ({selectedStudentUser?.displayName})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Strictly confidential: Isolated from student views and external portals
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
            Mentor-Only Visibility
          </span>
        </div>

        <form onSubmit={handleAddPrivateNote} className="space-y-3 text-xs p-4 rounded-xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
          <div>
            <label className="block font-semibold mb-1 text-purple-900 dark:text-purple-200">
              Record Confidential Observation for {selectedStudentUser?.displayName}
            </label>
            <textarea
              rows={2}
              required
              placeholder="Record private context (e.g. personal difficulties, health concerns, counseling referrals)..."
              value={privateNoteText}
              onChange={(e) => setPrivateNoteText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition text-xs shadow-sm"
            >
              Save Confidential Note
            </button>
          </div>
        </form>

        <div className="space-y-2 pt-1">
          {studentPrivateNotes.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No confidential records logged for this student.</p>
          ) : (
            studentPrivateNotes.map((note) => (
              <div
                key={note.id}
                className="p-3.5 rounded-xl bg-white dark:bg-slate-900/60 border border-purple-200/80 dark:border-purple-900/40 text-xs space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                  <span>Confidential Record</span>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">{note.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Support Plan Modal */}
      {showCreatePlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                Initiate Closed-Loop Support Plan
              </h3>
              <button
                onClick={() => setShowCreatePlanModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Student</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedStudentUser?.displayName} (${selectedStudent.rollNumber})`}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 dark:bg-slate-800 text-slate-600 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Support Category</label>
                  <select
                    value={planCategory}
                    onChange={(e) => setPlanCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="Attendance">Attendance Support</option>
                    <option value="Academic">Academic Tutoring</option>
                    <option value="Placement">Placement Preparation</option>
                    <option value="Personal">Personal Wellbeing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Follow-up Target Date</label>
                  <input
                    type="date"
                    required
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Concise Measurable Goal</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Recover CS601 attendance above 75% before Midterm 2"
                  value={planGoal}
                  onChange={(e) => setPlanGoal(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Agreed Support Strategy & Actions</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Specific actions, faculty makeup schedule, study plan..."
                  value={actionPlanText}
                  onChange={(e) => setActionPlanText(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Initial Milestone (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Attend next 5 consecutive lectures without absence"
                  value={initialMilestone}
                  onChange={(e) => setInitialMilestone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 text-[11px] text-teal-800 dark:text-teal-300">
                <strong>Automatic Baseline:</strong> Preserves current attendance ({attRate}%) and academic indicators as a fixed starting reference point for future check-ins.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreatePlanModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
                >
                  Launch Support Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Explainable Score Modal */}
      <ScoreExplanationModal
        isOpen={showExplanationModal}
        onClose={() => setShowExplanationModal(false)}
        student={selectedStudent}
        studentName={selectedStudentUser?.displayName || 'Student'}
        scoreData={scoreData}
      />
    </div>
  );
};
