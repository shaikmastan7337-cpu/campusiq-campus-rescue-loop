import React, { useState } from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  PlusCircle,
  MessageSquare,
  CheckSquare,
  Square,
  RotateCcw,
  AlertTriangle,
  Send,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import {
  Intervention,
  User as UserType,
  StudentProfile,
  AttendanceRecord,
} from '../../types';
import { storage } from '../../services/storageService';

interface SupportPlanCardProps {
  plan: Intervention;
  currentUser: UserType;
  student: StudentProfile;
  attendanceRecords: AttendanceRecord[];
  onRefresh?: () => void;
}

export const SupportPlanCard: React.FC<SupportPlanCardProps> = ({
  plan,
  currentUser,
  student,
  attendanceRecords,
}) => {
  const isMentor = currentUser.role === 'mentor' || currentUser.role === 'super-admin';
  const isStudent = currentUser.role === 'student';

  const [newMilestoneText, setNewMilestoneText] = useState('');
  const [showAddMilestone, setShowAddMilestone] = useState(false);

  const [studentUpdateText, setStudentUpdateText] = useState('');
  const [showAddProgress, setShowAddProgress] = useState(false);

  const [checkInNotes, setCheckInNotes] = useState('');
  const [checkInOutcome, setCheckInOutcome] = useState<'recovering' | 'stable' | 'needs-revision' | 'resolved'>('recovering');
  const [showAddCheckIn, setShowAddCheckIn] = useState(false);

  const [showRevisePlan, setShowRevisePlan] = useState(false);
  const [revisedActionPlan, setRevisedActionPlan] = useState(plan.actionPlan);
  const [revisedFollowUpDate, setRevisedFollowUpDate] = useState(plan.followUpAt);
  const [revisedGoal, setRevisedGoal] = useState(plan.goal || '');

  const [statusFeedback, setStatusFeedback] = useState('');

  // Calculate current observed attendance
  const seenSessions = new Set<string>();
  const studentSessions: AttendanceRecord[] = [];
  for (const att of attendanceRecords.filter((a) => a.studentId === plan.studentId)) {
    const key = `${att.classId || 'cls'}_${att.date}_${att.session || 's'}`;
    if (!seenSessions.has(key)) {
      seenSessions.add(key);
      studentSessions.push(att);
    }
  }

  const currentTotal = studentSessions.length;
  const currentPresent = studentSessions.filter(
    (a) => a.status === 'present' || a.status === 'excused'
  ).length;
  const currentLate = studentSessions.filter((a) => a.status === 'late').length;
  const currentNumerator = currentPresent + currentLate * 0.7;
  const currentRate = currentTotal > 0 ? (currentNumerator / currentTotal) * 100 : 0;

  const baseline = plan.baselineSnapshot;
  const rateDelta = baseline ? currentRate - baseline.attendanceRate : null;

  const handleToggleMilestone = (milestoneId: string) => {
    storage.toggleInterventionMilestone(plan.id, milestoneId);
    setStatusFeedback('Milestone status updated and audit entry recorded.');
    setTimeout(() => setStatusFeedback(''), 3000);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneText.trim()) return;

    storage.addInterventionMilestone(plan.id, newMilestoneText.trim());
    setNewMilestoneText('');
    setShowAddMilestone(false);
    setStatusFeedback('New milestone added to shared support plan.');
    setTimeout(() => setStatusFeedback(''), 3000);
  };

  const handleAddStudentProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentUpdateText.trim()) return;

    storage.addInterventionProgressUpdate(plan.id, studentUpdateText.trim());
    setStudentUpdateText('');
    setShowAddProgress(false);
    setStatusFeedback('Progress update shared with your mentor.');
    setTimeout(() => setStatusFeedback(''), 3000);
  };

  const handleAddCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInNotes.trim()) return;

    storage.addInterventionCheckIn(plan.id, checkInNotes.trim(), checkInOutcome);
    setCheckInNotes('');
    setShowAddCheckIn(false);
    setStatusFeedback('Mentor check-in recorded and shared with student.');
    setTimeout(() => setStatusFeedback(''), 3000);
  };

  const handleRevisePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisedActionPlan.trim()) return;

    storage.reviseInterventionPlan(
      plan.id,
      revisedActionPlan.trim(),
      revisedFollowUpDate,
      revisedGoal.trim()
    );
    setShowRevisePlan(false);
    setStatusFeedback('Support plan revised and updated.');
    setTimeout(() => setStatusFeedback(''), 3000);
  };

  const handleStatusChange = (status: Intervention['status']) => {
    storage.updateInterventionStatus(plan.id, status);
    setStatusFeedback(`Plan transitioned to ${status.toUpperCase()}.`);
    setTimeout(() => setStatusFeedback(''), 3000);
  };

  return (
    <div className="glass-card rounded-2xl border border-teal-500/20 dark:border-teal-500/10 shadow-lg overflow-hidden space-y-4">
      {/* Plan Header */}
      <div className="p-5 bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                {plan.category} Rescue Loop
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  plan.status === 'resolved'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : plan.status === 'in-progress'
                    ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                Status: {plan.status}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {plan.goal || `${plan.category} Support Plan for ${plan.studentName}`}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Student: <strong className="text-slate-700 dark:text-slate-300">{plan.studentName} ({plan.rollNumber})</strong> • Action Owner: {plan.actionOwner}
            </p>
          </div>

          {/* Lifecycle Status Controls */}
          {isMentor && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {plan.status !== 'resolved' ? (
                <button
                  onClick={() => handleStatusChange('resolved')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('in-progress')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reopen Plan</span>
                </button>
              )}

              <button
                onClick={() => setShowRevisePlan(!showRevisePlan)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Revise</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {statusFeedback && (
        <div className="mx-5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusFeedback}</span>
        </div>
      )}

      {/* Plan Details & Baseline vs Current Indicators */}
      <div className="px-5 space-y-4">
        {/* Core Description */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Agreed Support Strategy
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {plan.actionPlan}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Logged on: {new Date(plan.createdAt).toLocaleDateString()}</span>
            <span>Target Follow-up Review: <strong>{plan.followUpAt}</strong></span>
          </div>
        </div>

        {/* Before / After Indicators */}
        {baseline && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-teal-500/5 via-indigo-500/5 to-transparent border border-teal-500/20 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Observed Indicators: Baseline vs Current Progress
              </span>
              <span className="text-[10px] text-slate-400">
                Tracked attendance records & academic index
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Baseline Snapshot */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Baseline at Plan Inception ({new Date(baseline.recordedAt).toLocaleDateString()})
                </span>
                <div className="text-lg font-extrabold text-slate-800 dark:text-slate-200">
                  {baseline.attendanceRate.toFixed(1)}% Attendance
                </div>
                <p className="text-[11px] text-slate-500">
                  {baseline.attendanceDetail} • Academic index {baseline.academicScore}/100
                </p>
              </div>

              {/* Current Observed */}
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Current Observed Snapshot</span>
                  {rateDelta !== null && (
                    <span className={`text-[11px] font-bold ${rateDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {rateDelta >= 0 ? `+${rateDelta.toFixed(1)}%` : `${rateDelta.toFixed(1)}%`} change
                    </span>
                  )}
                </span>
                <div className="text-lg font-extrabold text-teal-700 dark:text-teal-400">
                  {currentRate.toFixed(1)}% Attendance
                </div>
                <p className="text-[11px] text-slate-500">
                  {currentNumerator.toFixed(1)}/{currentTotal} sessions attended to date
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
              <strong>Evaluation Note:</strong> Before/after indicators represent tracked longitudinal observations. Changes reflect recorded association over time and do not prove direct causality.
            </div>
          </div>
        )}

        {/* Revise Plan Modal / Expandable Box */}
        {showRevisePlan && isMentor && (
          <form onSubmit={handleRevisePlanSubmit} className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs space-y-3 animate-in fade-in">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
              Revise Support Plan & Set Next Review Date
            </h4>

            <div>
              <label className="block font-semibold mb-1">Plan Goal</label>
              <input
                type="text"
                value={revisedGoal}
                onChange={(e) => setRevisedGoal(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Updated Action Plan</label>
              <textarea
                rows={2}
                value={revisedActionPlan}
                onChange={(e) => setRevisedActionPlan(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Next Follow-up Date</label>
              <input
                type="date"
                value={revisedFollowUpDate}
                onChange={(e) => setRevisedFollowUpDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRevisePlan(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold"
              >
                Save Revised Plan
              </button>
            </div>
          </form>
        )}

        {/* Milestones Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
              Agreed Milestones & Action Steps
            </h4>
            {isMentor && (
              <button
                onClick={() => setShowAddMilestone(!showAddMilestone)}
                className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3" />
                Add Milestone
              </button>
            )}
          </div>

          {/* Add Milestone Form */}
          {showAddMilestone && isMentor && (
            <form onSubmit={handleAddMilestone} className="flex gap-2 text-xs pt-1">
              <input
                type="text"
                placeholder="Specific measurable action milestone..."
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-semibold text-xs"
              >
                Add
              </button>
            </form>
          )}

          {/* Milestones List */}
          <div className="space-y-1.5">
            {(!plan.milestones || plan.milestones.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No milestones defined yet.</p>
            ) : (
              plan.milestones.map((ms) => (
                <div
                  key={ms.id}
                  onClick={() => handleToggleMilestone(ms.id)}
                  className={`p-2.5 rounded-lg border flex items-start gap-2.5 text-xs cursor-pointer transition ${
                    ms.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-teal-500'
                  }`}
                >
                  <button
                    type="button"
                    aria-label={`Toggle milestone: ${ms.title}`}
                    className="mt-0.5 text-teal-600 dark:text-teal-400 flex-shrink-0"
                  >
                    {ms.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className={ms.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'font-medium'}>
                      {ms.title}
                    </span>
                    {ms.completed && ms.completedAt && (
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                        Completed on {new Date(ms.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Student Progress Reflections */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              Student Progress Reflections ({plan.progressUpdates?.length || 0})
            </h4>
            {(isStudent || isMentor) && (
              <button
                onClick={() => setShowAddProgress(!showAddProgress)}
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3" />
                Add Reflection
              </button>
            )}
          </div>

          {showAddProgress && (
            <form onSubmit={handleAddStudentProgress} className="space-y-2 text-xs p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800">
              <textarea
                rows={2}
                placeholder="Share your progress, challenges, or milestones completed..."
                value={studentUpdateText}
                onChange={(e) => setStudentUpdateText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  Post Reflection
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1.5">
            {(!plan.progressUpdates || plan.progressUpdates.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No student progress updates posted yet.</p>
            ) : (
              plan.progressUpdates.map((prog) => (
                <div
                  key={prog.id}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">{prog.studentName}</span>
                    <span>{new Date(prog.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{prog.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mentor Check-ins */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              Mentor Follow-up Check-ins ({plan.checkIns?.length || 0})
            </h4>
            {isMentor && (
              <button
                onClick={() => setShowAddCheckIn(!showAddCheckIn)}
                className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3" />
                Record Check-in
              </button>
            )}
          </div>

          {showAddCheckIn && isMentor && (
            <form onSubmit={handleAddCheckIn} className="space-y-2 text-xs p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
              <textarea
                rows={2}
                required
                placeholder="Record check-in observations and assessment of student progress..."
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-semibold">Outcome Assessment:</label>
                  <select
                    value={checkInOutcome}
                    onChange={(e) => setCheckInOutcome(e.target.value as any)}
                    className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value="recovering">Recovering Trajectory</option>
                    <option value="stable">Stable / Satisfactory</option>
                    <option value="needs-revision">Needs Plan Revision</option>
                    <option value="resolved">Resolved / Goal Met</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-semibold text-xs"
                >
                  Save Check-in
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1.5">
            {(!plan.checkIns || plan.checkIns.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No mentor check-ins recorded yet.</p>
            ) : (
              plan.checkIns.map((chk) => (
                <div
                  key={chk.id}
                  className="p-3 rounded-lg bg-teal-50/40 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-900/40 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-teal-800 dark:text-teal-300">
                      Check-in by {chk.mentorName}
                    </span>
                    <span className="text-slate-400">
                      {new Date(chk.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{chk.notes}</p>
                  {chk.outcomeStatus && (
                    <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      Assessment: {chk.outcomeStatus}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 px-5">
        <span>Plan ID: {plan.id}</span>
        <span>Audit Trail: Recorded in browser audit log</span>
      </div>
    </div>
  );
};
