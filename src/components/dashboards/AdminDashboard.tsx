import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Download,
  PlusCircle,
  History,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  Filter,
  Building2,
  BookOpen,
  Calendar,
  AlertTriangle,
  Mail,
  Phone,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { User } from '../../types';
import { storage } from '../../services/storageService';
import { StatCard } from '../common/StatCard';

interface AdminDashboardProps {
  currentUser: User;
  currentTab: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, currentTab }) => {
  const state = storage.getState();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annBody, setAnnBody] = useState('');
  const [annAudience, setAnnAudience] = useState<'all' | 'students' | 'faculty'>('all');
  const [assignmentFacultyUid, setAssignmentFacultyUid] = useState('');
  const [assignmentClassId, setAssignmentClassId] = useState('');
  const [assignmentMessage, setAssignmentMessage] = useState('');

  const selectedAssignmentFaculty = state.faculty.find((profile) => profile.uid === assignmentFacultyUid) || state.faculty[0];
  const assignableClasses = state.classes.filter((classSection) =>
    !selectedAssignmentFaculty || classSection.departmentId === selectedAssignmentFaculty.departmentId
  );
  const selectedAssignmentClassId = assignmentClassId || assignableClasses[0]?.classId || '';
  const handleAssignClass = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedAssignmentFaculty || !selectedAssignmentClassId) {
      setAssignmentMessage('Choose a faculty member and a class section.');
      return;
    }
    const didAssign = storage.assignFacultyToClass(selectedAssignmentClassId, selectedAssignmentFaculty.uid);
    setAssignmentMessage(didAssign
      ? `Assignment saved: ${state.classes.find((item) => item.classId === selectedAssignmentClassId)?.section} is now assigned to ${state.users.find((item) => item.uid === selectedAssignmentFaculty.uid)?.displayName}.`
      : 'Assignment was not saved. Faculty and class must belong to the same department.');
  };

  const filteredUsers = state.users.filter((u) => {
    const matchesSearch =
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    const matchesDept = selectedDeptFilter === 'all' || u.departmentId === selectedDeptFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  const studentsList = state.students.map((s) => {
    const u = state.users.find((user) => user.uid === s.uid);
    return { ...s, user: u };
  }).filter((s) => {
    const matchesSearch =
      (s.user?.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDeptFilter === 'all' || s.departmentId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const facultyList = state.faculty.map((f) => {
    const u = state.users.find((user) => user.uid === f.uid);
    return { ...f, user: u };
  }).filter((f) => {
    const matchesSearch =
      (f.user?.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDeptFilter === 'all' || f.departmentId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const handleExportCsv = (type: 'all' | 'students' | 'faculty' = 'all') => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = `campusiq_${type}_roster_${new Date().toISOString().split('T')[0]}.csv`;

    if (type === 'students') {
      headers = ['Student ID', 'Roll Number', 'Name', 'Email', 'Department', 'Section', 'Semester', 'CGPA', 'Backlogs'];
      rows = state.students.map((s) => {
        const u = state.users.find((user) => user.uid === s.uid);
        return [
          s.studentId,
          s.rollNumber,
          `"${u?.displayName || 'Unknown'}"`,
          u?.email || '',
          `"${s.departmentName}"`,
          s.section,
          s.semester,
          s.cgpa,
          s.backlogs,
        ];
      });
    } else if (type === 'faculty') {
      headers = ['Faculty ID', 'Name', 'Email', 'Department', 'Designation', 'Assigned Classes'];
      rows = state.faculty.map((f) => {
        const u = state.users.find((user) => user.uid === f.uid);
        return [
          f.facultyId,
          `"${u?.displayName || 'Unknown'}"`,
          u?.email || '',
          `"${f.departmentName}"`,
          `"${f.designation}"`,
          `"${f.assignedClasses.join('; ')}"`,
        ];
      });
    } else {
      headers = ['UID', 'Name', 'Email', 'Role', 'Status', 'Department'];
      rows = state.users.map((u) => [
        u.uid,
        `"${u.displayName}"`,
        u.email,
        u.role,
        u.status,
        `"${u.departmentName || 'Campus Wide'}"`,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    storage.addAuditLog('DATA_EXPORTED', 'Roster', type, `Exported ${type} roster to CSV`);
  };

  const handlePublishAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle) return;

    storage.createAnnouncement({
      title: annTitle,
      body: annBody,
      audience: annAudience,
      category: 'academic',
      important: true,
    });

    setShowAnnounceModal(false);
    setAnnTitle('');
    setAnnBody('');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-700 via-teal-700 to-cyan-900 p-6 sm:p-8 text-white shadow-xl shadow-cyan-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              General Administration • Institutional Registrar
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Campus Operations & Master Records
            </h1>
            <p className="text-sm text-cyan-100 max-w-xl mt-1 leading-relaxed">
              Supervising student rosters, department courses, campus broadcast notices, and verifiable audit event histories.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExportCsv('all')}
              className="px-4 py-2 rounded-xl bg-white text-cyan-900 font-bold text-xs shadow-md hover:bg-cyan-50 transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Roster CSV</span>
            </button>
            <button
              onClick={() => setShowAnnounceModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Broadcast</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {(currentTab === 'overview' || !currentTab) && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Campus Accounts"
              value={state.users.length}
              subtitle="Registered accounts"
              icon={Users}
              colorTheme="cyan"
            />
            <StatCard
              title="Enrolled Students"
              value={state.students.length}
              subtitle="Undergraduate cohorts"
              icon={GraduationCap}
              colorTheme="indigo"
            />
            <StatCard
              title="Active Announcements"
              value={state.announcements.length}
              subtitle="Campus wide"
              icon={FileText}
              colorTheme="emerald"
            />
            <StatCard
              title="Audit Trail Logs"
              value={state.auditLogs.length}
              subtitle="Logged events"
              icon={History}
              colorTheme="purple"
            />
          </div>

          {/* Quick Department Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {state.departments.map((dept) => (
              <div
                key={dept.departmentId}
                className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                    {dept.code}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    HOD: {dept.hodName}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{dept.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                    <div><span className="font-bold text-slate-900 dark:text-white">{dept.studentCount}</span> Students</div>
                    <div>•</div>
                    <div><span className="font-bold text-slate-900 dark:text-white">{dept.facultyCount}</span> Faculty</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* User Directory Quick Table */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Campus User Account Directory & Lifecycle
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Activate/deactivate access, inspect authorized scopes, and review department bindings
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>

                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="faculty">Faculty</option>
                  <option value="hod">HODs</option>
                  <option value="admin">Admins</option>
                  <option value="placement-admin">Placement</option>
                  <option value="mentor">Mentors</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.slice(0, 5).map((u) => (
                    <tr key={u.uid} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
                            alt={u.displayName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{u.displayName}</div>
                            <div className="text-[10px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {u.departmentName || 'Institutional'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => storage.toggleUserStatus(u.uid)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            u.status === 'active'
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                          }`}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {currentTab === 'students' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Master Student Directory & Academic Profiles
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive listing of all enrolled students, CGPAs, active backlogs, and department records
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, roll no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>

                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                >
                  <option value="all">All Departments</option>
                  {state.departments.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>{d.code}</option>
                  ))}
                </select>

                <button
                  onClick={() => handleExportCsv('students')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Students CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Section</th>
                    <th className="py-3 px-4">Semester</th>
                    <th className="py-3 px-4">CGPA</th>
                    <th className="py-3 px-4">Backlogs</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {studentsList.map((s) => (
                    <tr key={s.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={s.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
                            alt={s.user?.displayName || 'Student'}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{s.user?.displayName || 'Student'}</div>
                            <div className="text-[10px] text-slate-400">{s.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {s.rollNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {s.departmentName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">{s.section}</span>
                      </td>
                      <td className="py-3 px-4">
                        Sem {s.semester}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold ${s.cgpa >= 8.0 ? 'text-emerald-600 dark:text-emerald-400' : s.cgpa >= 6.5 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {s.cgpa.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {s.backlogs > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
                            {s.backlogs} Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                            Clean (0)
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-md bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-[10px] font-semibold">
                          Enrolled
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Tab */}
      {currentTab === 'faculty' && (
        <div className="space-y-6">
          <form onSubmit={handleAssignClass} className="glass-card space-y-4 rounded-2xl border border-indigo-200 p-5 dark:border-indigo-900/60">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assign faculty to a branch section</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Choose a faculty member and a course section. Students in that branch/section will appear on the faculty roster.</p>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto]">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Faculty member
                <select
                  value={assignmentFacultyUid || state.faculty[0]?.uid || ''}
                  onChange={(event) => { setAssignmentFacultyUid(event.target.value); setAssignmentClassId(''); }}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  {state.faculty.map((profile) => (
                    <option key={profile.uid} value={profile.uid}>{state.users.find((user) => user.uid === profile.uid)?.displayName || profile.uid} · {profile.departmentName}</option>
                  ))}
                </select>
              </label>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Branch, section, course and semester
                <select
                  required
                  value={selectedAssignmentClassId}
                  onChange={(event) => setAssignmentClassId(event.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                >
                  {assignableClasses.map((classSection) => {
                    const studentsInSection = state.students.filter((student) => student.departmentId === classSection.departmentId && student.section === classSection.section && student.semester === classSection.semester && student.academicYear === classSection.academicYear).length;
                    const branchCode = state.departments.find((department) => department.departmentId === classSection.departmentId)?.code || classSection.departmentId;
                    return <option key={classSection.classId} value={classSection.classId}>{branchCode} · {classSection.section} · {classSection.courseCode} · Sem {classSection.semester} · {studentsInSection} students</option>;
                  })}
                </select>
              </label>
              <button type="submit" className="self-end rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700">Save assignment</button>
            </div>
            {assignmentMessage && <p role="status" className="text-xs font-medium text-indigo-700 dark:text-indigo-300">{assignmentMessage}</p>}
          </form>

          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Institutional Faculty & Instructors Directory
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Teaching staff, course assignments, designations, and department affiliations
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCsv('faculty')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Faculty CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Faculty ID</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Designation</th>
                    <th className="py-3 px-4">Assigned Classes</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {facultyList.map((f) => (
                    <tr key={f.facultyId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={f.user?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80'}
                            alt={f.user?.displayName || 'Faculty'}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{f.user?.displayName || 'Faculty'}</div>
                            <div className="text-[10px] text-slate-400">{f.user?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {f.facultyId}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {f.departmentName}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {f.designation}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {f.assignedClasses.map((clsId) => (
                            <span key={clsId} className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px]">
                              {state.classes.find((classSection) => classSection.classId === clsId)?.section || clsId} · {state.classes.find((classSection) => classSection.classId === clsId)?.courseCode || 'Class'}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Announcements Tab */}
      {currentTab === 'announcements' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Campus Broadcasts & Official Notices
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Institutional communications published to students, faculty, or all campus members
                </p>
              </div>

              <button
                onClick={() => setShowAnnounceModal(true)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Notice</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
                      Audience: {ann.audience}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(ann.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ann.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{ann.body}</p>
                  <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span>Published by {ann.createdBy}</span>
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400 uppercase">{ann.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audit Tab */}
      {currentTab === 'audit' && (
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Security & Operational Audit Trail (Section 5 Spec)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Chronological record of privileged modifications, attendance updates, and role switches
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Total Events: {state.auditLogs.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
              {state.auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
                        {log.recordType}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-xs">{log.details}</p>
                    <div className="text-[10px] text-slate-400">
                      By <span className="font-semibold text-slate-600 dark:text-slate-300">{log.actorName}</span> ({log.actorRole}) • Record ID: <span className="font-mono">{log.recordId}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 flex-shrink-0 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Announcement */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Publish Campus Announcement
            </h3>
            <form onSubmit={handlePublishAnnouncement} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Exam Registration Notice"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Announcement Body</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Official notice details..."
                  value={annBody}
                  onChange={(e) => setAnnBody(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Audience</label>
                <select
                  value={annAudience}
                  onChange={(e) => setAnnAudience(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                >
                  <option value="all">All Campus Members</option>
                  <option value="students">Students Only</option>
                  <option value="faculty">Faculty & Staff</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 text-white font-bold hover:bg-cyan-700"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
