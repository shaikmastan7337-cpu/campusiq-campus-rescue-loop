import React, { useState } from 'react';
import {
  ClipboardCheck,
  FileText,
  Users,
  CheckCircle2,
  PlusCircle,
  Save,
  MessageSquare,
  AlertTriangle,
  Calendar,
  Layers,
} from 'lucide-react';
import { User, ClassSection, StudentProfile, AttendanceStatus } from '../../types';
import { storage } from '../../services/storageService';
import { StatCard } from '../common/StatCard';

interface FacultyDashboardProps {
  currentUser: User;
  currentTab: string;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  currentUser,
  currentTab,
}) => {
  const state = storage.getState();
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [sessionName, setSessionName] = useState<string>('Morning (09:00 - 10:30 AM)');
  const [attendanceDraft, setAttendanceDraft] = useState<Record<string, AttendanceStatus>>({
    'stu-101': 'present',
    'stu-102': 'absent',
    'stu-103': 'present',
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Grading states
  const [evaluatingSubId, setEvaluatingSubId] = useState<string | null>(null);
  const [evalMarks, setEvalMarks] = useState<number>(35);
  const [evalFeedback, setEvalFeedback] = useState<string>('Well structured approach.');

  // New assignment modal
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueAt, setNewDueAt] = useState('2026-10-30T23:59');
  const [newMaxMarks, setNewMaxMarks] = useState(50);

  const assignedClasses = state.classes.filter((c) => c.facultyUid === currentUser.uid);
  const currentClass = assignedClasses.find((c) => c.classId === selectedClassId) || assignedClasses[0];
  const currentClassStudents = currentClass
    ? state.students.filter((student) =>
        student.departmentId === currentClass.departmentId &&
        student.section === currentClass.section &&
        student.semester === currentClass.semester &&
        student.academicYear === currentClass.academicYear
      )
    : [];
  const assignedStudentCount = new Set(state.students
    .filter((student) => assignedClasses.some((classSection) =>
      classSection.departmentId === student.departmentId &&
      classSection.section === student.section &&
      classSection.semester === student.semester &&
      classSection.academicYear === student.academicYear
    ))
    .map((student) => student.studentId)).size;

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = () => {
    if (!currentClass) return;
    Object.entries(attendanceDraft).forEach(([studentId, status]) => {
      if (currentClassStudents.some((student) => student.studentId === studentId)) {
        storage.markAttendance(studentId, currentClass.classId, status, sessionName, attendanceDate);
      }
    });
    setSaveSuccessMsg(`Attendance saved locally for ${currentClassStudents.length} ${currentClass.section} students.`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleGradeSubmit = (submissionId: string) => {
    storage.gradeSubmission(submissionId, evalMarks, evalFeedback);
    setEvaluatingSubId(null);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !currentClass) return;

    storage.createAssignment({
      classId: currentClass.classId,
      courseName: currentClass.courseName,
      title: newTitle,
      description: newDesc,
      dueAt: newDueAt,
      maxMarks: newMaxMarks,
      allowedFormats: ['PDF', 'ZIP'],
    });

    setShowNewAssignment(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Faculty Portal • {currentUser.departmentName || 'Computer Science'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Welcome, {currentUser.displayName}
            </h1>
            <p className="text-sm text-emerald-100 max-w-xl mt-1 leading-relaxed">
              Managing {assignedClasses.length} course sections: {Array.from(new Set(assignedClasses.map((classSection) => classSection.section))).join(', ') || 'none assigned'}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewAssignment(true)}
              className="px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Assignment</span>
            </button>
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Classes"
          value={assignedClasses.length}
          subtitle={`${Array.from(new Set(assignedClasses.map((classSection) => classSection.section))).join(', ') || 'No section'} assigned`}
          icon={Layers}
          colorTheme="emerald"
        />
        <StatCard
          title="Active Students"
          value={assignedStudentCount}
          subtitle="Students in assigned sections"
          icon={Users}
          colorTheme="indigo"
        />
        <StatCard
          title="Submissions to Grade"
          value={state.submissions.filter((s) => s.status === 'submitted').length}
          subtitle="Awaiting evaluation"
          icon={FileText}
          colorTheme="amber"
          badge="Grading"
        />
        <StatCard
          title="Students Flagged"
          value="2 at Risk"
          subtitle="Attendance < 75%"
          icon={AlertTriangle}
          colorTheme="rose"
          badge="Attention"
        />
      </div>

      {/* TAB: ATTENDANCE MARKING */}
      {(currentTab === 'attendance' || currentTab === 'overview' || !currentTab) && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Attendance Marking Roster
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mark present/absent/late per class session and commit to records
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={currentClass?.classId || ''}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              >
                {assignedClasses.map((c) => (
                  <option key={c.classId} value={c.classId}>
                    {c.section} · {c.courseCode} · Sem {c.semester} ({c.courseName})
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
              />

              <button
                onClick={handleSaveAttendance}
                disabled={!currentClass}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Attendance</span>
              </button>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {currentClassStudents.map((stu) => {
              const currentStatus = attendanceDraft[stu.studentId] || 'present';
              return (
                <div key={stu.studentId} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                      {stu.rollNumber.slice(-2)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-200">
                        {state.users.find((u) => u.uid === stu.uid)?.displayName || 'Student'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Roll: {stu.rollNumber} • CGPA: {stu.cgpa}
                      </div>
                    </div>
                  </div>

                  {/* Radio buttons for Status */}
                  <div className="flex items-center gap-1.5">
                    {(['present', 'absent', 'late'] as AttendanceStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(stu.studentId, st)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition ${
                          currentStatus === st
                            ? st === 'present'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : st === 'late'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {currentClassStudents.length === 0 && (
              <p className="py-6 text-center text-xs text-slate-500">No students are enrolled in this assigned section yet.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB: ASSIGNMENTS & GRADING */}
      {(currentTab === 'assignments' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Student Assignment Submissions & Grading
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review submitted archives, enter marks, and provide constructive feedback
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {state.submissions.map((sub) => (
              <div
                key={sub.submissionId}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{sub.studentName}</span>
                    <span className="text-slate-400 font-mono">({sub.rollNumber})</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sub.status === 'evaluated'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  File: <span className="font-semibold">{sub.fileName}</span> ({sub.fileSize}) • Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                </div>

                {evaluatingSubId === sub.submissionId ? (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Marks (Max {sub.maxMarks || 50})
                        </label>
                        <input
                          type="number"
                          value={evalMarks}
                          onChange={(e) => setEvalMarks(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Constructive Feedback
                        </label>
                        <input
                          type="text"
                          value={evalFeedback}
                          onChange={(e) => setEvalFeedback(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEvaluatingSubId(null)}
                        className="px-2.5 py-1 text-slate-500 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleGradeSubmit(sub.submissionId)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold"
                      >
                        Publish Grade
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      {sub.marks !== undefined ? `Awarded Marks: ${sub.marks}` : 'Not evaluated yet'}
                    </span>
                    <button
                      onClick={() => {
                        setEvaluatingSubId(sub.submissionId);
                        setEvalMarks(sub.marks || 38);
                        setEvalFeedback(sub.feedback || 'Great solution methodology.');
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-100 transition"
                    >
                      {sub.marks !== undefined ? 'Update Grade' : 'Grade Submission'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: AT-RISK STUDENTS */}
      {(currentTab === 'students' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                At-Risk Students & Early Academic Alerts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Identified through attendance threshold violations (&lt;75%) and academic backlog metrics
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[11px] font-bold">
              2 Actionable Cases
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.students.filter((s) => s.backlogs > 0 || s.cgpa < 7.0).map((stu) => {
              const u = state.users.find((user) => user.uid === stu.uid);
              const stuAtt = state.attendance.filter((a) => a.studentId === stu.studentId);
              const attRate = stuAtt.length > 0 ? Math.round((stuAtt.filter((a) => a.status === 'present').length / stuAtt.length) * 100) : 62;

              return (
                <div
                  key={stu.studentId}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{u?.displayName || 'Student'}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Roll: {stu.rollNumber} • Sem {stu.semester}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      Attendance: {attRate}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-[10px] text-slate-400">Current CGPA</div>
                      <div className="font-bold text-slate-900 dark:text-white">{stu.cgpa.toFixed(2)}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                      <div className="text-[10px] text-slate-400">Active Arrears</div>
                      <div className="font-bold text-rose-600 dark:text-rose-400">{stu.backlogs} Backlogs</div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-500">Mentor: Dr. Shweta Rao</span>
                    <button
                      onClick={() => alert(`Initiated remediation follow-up notice for ${u?.displayName}.`)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-[11px] transition"
                    >
                      Trigger Intervention
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: TIMETABLE & SCHEDULE */}
      {(currentTab === 'timetable' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                Faculty Lecture Schedule & Timetable
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekly scheduled lectures, lab modules, and classroom assignments
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Semester 6 • Spring 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.timetable.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {item.day}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {item.startTime} - {item.endTime}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">
                  {item.courseName}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                  <span>Room: <strong className="text-slate-700 dark:text-slate-300">{item.room}</strong></span>
                  <span className="font-mono text-[10px]">{item.courseCode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Creating Assignment */}
      {showNewAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create New Course Assignment
            </h3>
            <form onSubmit={handleCreateAssignment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Consensus Engine"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Instructions & Rubrics</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide complete task specifications..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Submission Deadline</label>
                  <input
                    type="datetime-local"
                    value={newDueAt}
                    onChange={(e) => setNewDueAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={newMaxMarks}
                    onChange={(e) => setNewMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAssignment(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
