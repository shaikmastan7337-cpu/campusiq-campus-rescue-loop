import React from 'react';
import {
  GraduationCap,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
} from 'lucide-react';
import { User, StudentProfile } from '../../types';
import { storage } from '../../services/storageService';
import { StatCard } from '../common/StatCard';

interface ParentDashboardProps {
  currentUser: User;
  currentTab: string;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  currentUser,
  currentTab,
}) => {
  const state = storage.getState();
  // Find linked student (Aarav Sharma)
  const linkedStudent = state.students[0];
  const linkedStudentUser = state.users.find((u) => u.uid === linkedStudent.uid);

  const studentAttendance = state.attendance.filter((a) => a.studentId === linkedStudent.studentId);
  const totalClasses = studentAttendance.length;
  const attendedClasses = studentAttendance.filter((a) => a.status === 'present' || a.status === 'excused').length;
  const attPct = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 85;

  const studentGrades = state.grades.filter((g) => g.studentId === linkedStudent.studentId);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 sm:p-8 text-white shadow-xl shadow-blue-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Parent & Guardian Portal • Secure Read-Only Access
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              {linkedStudentUser?.displayName}&apos;s Progress Report
            </h1>
            <p className="text-sm text-blue-100 max-w-xl mt-1 leading-relaxed">
              Roll No: {linkedStudent.rollNumber} • Semester {linkedStudent.semester} • Computer Science & Engineering.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Verified Institution Record</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Attendance Record"
          value={`${attPct}%`}
          subtitle={`${attendedClasses} of ${totalClasses} lectures attended`}
          icon={ClipboardCheck}
          colorTheme={attPct >= 75 ? 'emerald' : 'rose'}
          badge="Verified"
        />
        <StatCard
          title="Current CGPA"
          value={linkedStudent.cgpa.toFixed(2)}
          subtitle="Out of 10.0 scale"
          icon={GraduationCap}
          colorTheme="indigo"
          badge="First Class"
        />
        <StatCard
          title="Active Backlogs"
          value={linkedStudent.backlogs}
          subtitle="Zero arrears cleared"
          icon={CheckCircle2}
          colorTheme="emerald"
          badge="Clear"
        />
        <StatCard
          title="Semester Status"
          value="In Progress"
          subtitle="Semester 6 examinations"
          icon={Calendar}
          colorTheme="blue"
        />
      </div>

      {/* TAB: ATTENDANCE REPORT */}
      {(currentTab === 'attendance' || currentTab === 'overview' || !currentTab) && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4 text-blue-600" />
                Lecture Attendance Log & Session History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live attendance records marked by course instructors
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold">
              {attPct}% Overall
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Class Session</th>
                  <th className="py-3 px-4">Marked By</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                      {rec.date}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {rec.session}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {rec.markedByName || 'Course Faculty'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rec.status === 'present'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : rec.status === 'absent'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ACADEMICS REPORT */}
      {(currentTab === 'academics' || currentTab === 'overview' || !currentTab) && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Semester Internal Evaluations & Examination Results
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official marks published by course instructors
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
              CGPA {linkedStudent.cgpa.toFixed(2)}
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {studentGrades.map((g) => (
              <div key={g.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{g.courseName}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {g.assessmentType} • Course Code: <span className="font-mono">{g.courseCode}</span> • Evaluated by {g.updatedBy}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    {g.marks} / {g.maxMarks}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">
                    {Math.round((g.marks / g.maxMarks) * 100)}% Pass Score
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: NOTICES */}
      {(currentTab === 'notices' || currentTab === 'overview' || !currentTab) && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Institutional Notices for Parents
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Academic calendar updates, exam schedules, and holiday announcements
          </p>

          <div className="space-y-3">
            {state.announcements.map((anc) => (
              <div
                key={anc.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{anc.title}</span>
                  <span className="text-[10px] text-slate-400">{new Date(anc.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{anc.body}</p>
                <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold pt-1">
                  Issued by {anc.createdBy} ({anc.creatorRole})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
