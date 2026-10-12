import React from 'react';
import {
  Building2,
  Users,
  Layers,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Download,
  BookOpen,
  TrendingUp,
  Award,
} from 'lucide-react';
import { User, Department } from '../../types';
import { storage } from '../../services/storageService';
import { StatCard } from '../common/StatCard';

interface HodDashboardProps {
  currentUser: User;
  currentTab: string;
}

export const HodDashboard: React.FC<HodDashboardProps> = ({ currentUser, currentTab }) => {
  const state = storage.getState();
  const department =
    state.departments.find((d) => d.departmentId === currentUser.departmentId) ||
    state.departments[0];

  const deptStudents = state.students.filter((s) => s.departmentId === department.departmentId);
  const deptFaculty = state.faculty.filter((f) => f.departmentId === department.departmentId);
  const deptCourses = state.courses.filter((c) => c.departmentId === department.departmentId);

  const atRiskStudents = deptStudents.filter((s) => s.backlogs > 0 || s.cgpa < 6.5);

  const handleExportReport = () => {
    alert(`Exported Department Academic & Accreditation Dossier for ${department.name}.`);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 p-6 sm:p-8 text-white shadow-xl shadow-amber-900/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              HOD Oversight • {department.name} ({department.code})
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Department Operations & Analytics
            </h1>
            <p className="text-sm text-amber-100 max-w-xl mt-1 leading-relaxed">
              Monitoring academic performance, faculty teaching workload, and support interventions for {deptStudents.length} enrolled cohorts.
            </p>
          </div>

          <button
            onClick={handleExportReport}
            className="px-4 py-2 rounded-xl bg-white text-amber-900 font-bold text-xs shadow-md hover:bg-amber-50 transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Department Dossier</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={department.studentCount}
          subtitle="Undergraduate cohorts"
          icon={GraduationCap}
          colorTheme="amber"
        />
        <StatCard
          title="Faculty Members"
          value={department.facultyCount}
          subtitle="Teaching & Research Staff"
          icon={Users}
          colorTheme="indigo"
        />
        <StatCard
          title="Semester Pass Rate"
          value="93.8%"
          subtitle="Department average"
          icon={CheckCircle2}
          colorTheme="emerald"
          trend={{ value: '+2.1% vs last year', isPositive: true }}
        />
        <StatCard
          title="Students Under Support"
          value={atRiskStudents.length}
          subtitle="Active intervention plans"
          icon={AlertTriangle}
          colorTheme="rose"
          badge="Interventions"
        />
      </div>

      {/* TAB: OVERVIEW */}
      {(currentTab === 'overview' || !currentTab) && (
        <div className="space-y-6">
          {/* Department Courses Grid */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              Department Curriculum & Active Course Offerings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {deptCourses.map((course) => (
                <div
                  key={course.courseId}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      {course.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {course.credits} Credits • Sem {course.semester}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    {course.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: WORKLOAD (Faculty Allocation) */}
      {(currentTab === 'workload' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                Faculty Teaching Allocation & Workload Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Distribution of lecture hours, lab credits, and assigned courses
              </p>
            </div>
            <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold">
              Target: 12-16 Hrs/Wk
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Assigned Subjects</th>
                  <th className="py-3 px-4">Weekly Hours</th>
                  <th className="py-3 px-4">Mentoring Cohort</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Prof. Rajesh Verma</td>
                  <td className="py-3 px-4 text-slate-500">Associate Professor</td>
                  <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-medium">CS601 Distributed Systems, CS602 ML</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">14 Hrs / Wk</td>
                  <td className="py-3 px-4">12 Students</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Dr. Shweta Rao</td>
                  <td className="py-3 px-4 text-slate-500">Assistant Professor</td>
                  <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-medium">CS603 Compiler Design</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">12 Hrs / Wk</td>
                  <td className="py-3 px-4">18 Students</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">Dr. Arvind Sundaram (HOD)</td>
                  <td className="py-3 px-4 text-slate-500">Professor & Head</td>
                  <td className="py-3 px-4 text-indigo-600 dark:text-indigo-400 font-medium">CS604 Cybersecurity & Cryptography</td>
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">8 Hrs / Wk (Admin adjusted)</td>
                  <td className="py-3 px-4">25 Students</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: RISK (Academic Risk Oversight) */}
      {(currentTab === 'risk' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Department Risk & Escalation Register
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Students flagged for attendance shortfall or academic arrears requiring HOD endorsement
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              {atRiskStudents.length} Escalations
            </span>
          </div>

          <div className="space-y-3">
            {atRiskStudents.map((stu) => (
              <div
                key={stu.studentId}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {state.users.find((u) => u.uid === stu.uid)?.displayName} ({stu.rollNumber})
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    CGPA: <strong className="text-slate-700 dark:text-slate-300">{stu.cgpa}</strong> • Arrears: <strong className="text-rose-600 dark:text-rose-400">{stu.backlogs}</strong> • Mentor: Dr. Shweta Rao
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                    Attendance Notice Sent
                  </span>
                  <button
                    onClick={() => alert(`Endorsed remedial support plan for student ${stu.rollNumber}.`)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold transition"
                  >
                    Endorse Remediation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: REPORTS */}
      {(currentTab === 'reports' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                Accreditation & Quality Benchmark Dossier
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                NBA & NAAC Tier-1 Compliance metrics for Computer Science & Engineering
              </p>
            </div>
            <button
              onClick={handleExportReport}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Export Dossier
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Faculty-to-Student Ratio</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">1 : 14.1</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">✓ Meets NBA Criteria (&lt;1:15)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Placement Conversion Rate</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">88.4%</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">↑ 4.2% higher than college average</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 uppercase font-semibold">Publications & Patents</div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">28 Papers</div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Scopus & IEEE indexed this year</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
