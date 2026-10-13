import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  History,
  Lock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Server,
  Cloud,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { User } from '../../types';
import { storage } from '../../services/storageService';
import { StatCard } from '../common/StatCard';

interface SuperAdminDashboardProps {
  currentUser: User;
  currentTab: string;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  currentUser,
  currentTab,
}) => {
  const state = storage.getState();
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(30);
  const [enforce2Fa, setEnforce2Fa] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [staffForm, setStaffForm] = useState({ staffId: '', displayName: '', email: '', departmentId: state.departments[0]?.departmentId || '', role: 'faculty' as 'faculty' | 'hod', designation: 'Assistant Professor' });

  const handleCreateStaff = (event: React.FormEvent) => {
    event.preventDefault();
    const result = storage.createStaffAccount(staffForm);
    setSuccessMsg(result.message);
    if (result.ok) setStaffForm({ ...staffForm, staffId: '', displayName: '', email: '' });
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    storage.addAuditLog(
      'SECURITY_POLICY_UPDATED',
      'SecurityPolicy',
      'global',
      `Session timeout set to ${sessionTimeoutMins}m, 2FA: ${enforce2Fa}, Maintenance: ${maintenanceMode}`
    );
    setSuccessMsg('Demo policy values recorded in the browser-local audit log; authentication policies were not changed.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset entire platform state back to factory defaults?')) {
      storage.resetToDefaults();
      setSuccessMsg('Platform restored to default seed state.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const rolesMatrix = [
    { role: 'super-admin', desc: 'System-level access, policy, and tenant config', level: 'Full Access', count: state.users.filter(u => u.role === 'super-admin').length },
    { role: 'student', desc: 'Personal academics, submissions, attendance, drives', level: 'Self-Isolated', count: state.users.filter(u => u.role === 'student').length },
    { role: 'faculty', desc: 'Assigned courses, attendance marking, grading', level: 'Class Scoped', count: state.users.filter(u => u.role === 'faculty').length },
    { role: 'hod', desc: 'Department cohorts, faculty workloads, risk reports', level: 'Dept Scoped', count: state.users.filter(u => u.role === 'hod').length },
    { role: 'admin', desc: 'Campus records, accounts, schedules, audit explorer', level: 'Campus Scope', count: state.users.filter(u => u.role === 'admin').length },
    { role: 'placement-admin', desc: 'Recruitment drives, eligibility engine, applications', level: 'Placement Domain', count: state.users.filter(u => u.role === 'placement-admin').length },
    { role: 'mentor', desc: 'Assigned students, action plans, confidential notes', level: 'Mentee Caseload', count: state.users.filter(u => u.role === 'mentor').length },
    { role: 'parent', desc: 'Read-only summary of linked student\'s progress', level: 'Student Linked', count: state.users.filter(u => u.role === 'parent').length },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-rose-800 via-rose-700 to-red-900 p-6 sm:p-8 text-white shadow-xl shadow-rose-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Demo Administration • Local Preview
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Platform Configuration & Role Preview
            </h1>
            <p className="text-sm text-rose-100 max-w-xl mt-1 leading-relaxed">
              This view demonstrates administrative concepts. Settings and activity stay in this browser and do not configure a live service.
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Demo Personas"
          value="8 Roles"
          subtitle="Switchable preview views"
          icon={Users}
          colorTheme="rose"
        />
        <StatCard
          title="Schema Preview"
          value="18 Schemas"
          subtitle="Illustrative; no live database"
          icon={Server}
          colorTheme="indigo"
        />
        <StatCard
          title="Security Events"
          value={state.auditLogs.length}
          subtitle="Auditable operations"
          icon={History}
          colorTheme="purple"
        />
        <StatCard
          title="Data Store"
          value="Browser"
          subtitle="localStorage demo state"
          icon={CheckCircle2}
          colorTheme="emerald"
        />
      </div>

      {/* TAB: OVERVIEW */}
      {(currentTab === 'overview' || !currentTab) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Firestore Schema Preview</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Illustrative collection map only; app records are stored in this browser and are not synced to Firestore.</p>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Role Preview</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Personas show different dashboards for the demo; the client does not enforce security boundaries.</p>
          </div>
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Local Audit History</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Actions are recorded in browser-local state; this history is editable and is not a secure audit ledger.</p>
          </div>
        </div>
      )}

      {/* TAB: ROLES & RBAC POLICY */}
      {(currentTab === 'roles' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-600" />
                Demo Personas & Intended Scope
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Describes the views shown for each persona; this client-side preview does not enforce permissions
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Role Key</th>
                  <th className="py-3 px-4">Permission Scope Description</th>
                  <th className="py-3 px-4">Active Users</th>
                  <th className="py-3 px-4 text-right">Access Boundary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rolesMatrix.map((r) => (
                  <tr key={r.role} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {r.role}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {r.desc}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {r.count} Registered
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {r.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {currentTab === 'accounts' && (
        <div className="space-y-5">
          <form onSubmit={handleCreateStaff} className="glass-card rounded-2xl border border-rose-200 p-5 dark:border-rose-900/60 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Faculty provisioning & HOD appointment</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Create a staff account by institutional ID. Choosing HOD assigns the person to that department and updates its HOD record. Demo sign-in accepts the ID or email without a password.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <input required placeholder="Staff ID (e.g. FAC-205)" value={staffForm.staffId} onChange={(e) => setStaffForm({ ...staffForm, staffId: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" />
              <input required placeholder="Full name" value={staffForm.displayName} onChange={(e) => setStaffForm({ ...staffForm, displayName: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" />
              <input required type="email" placeholder="Institutional email" value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" />
              <select value={staffForm.departmentId} onChange={(e) => setStaffForm({ ...staffForm, departmentId: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900">{state.departments.map((department) => <option key={department.departmentId} value={department.departmentId}>{department.code} — {department.name}</option>)}</select>
              <select value={staffForm.role} onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value as 'faculty' | 'hod', designation: e.target.value === 'hod' ? 'Head of Department' : 'Assistant Professor' })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"><option value="faculty">Faculty Member</option><option value="hod">Appoint as HOD</option></select>
              <input required placeholder="Designation" value={staffForm.designation} onChange={(e) => setStaffForm({ ...staffForm, designation: e.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900" />
            </div>
            <button type="submit" className="rounded-xl bg-rose-700 px-4 py-2 text-xs font-bold text-white hover:bg-rose-800">{staffForm.role === 'hod' ? 'Create account & appoint HOD' : 'Create faculty account'}</button>
          </form>

          <div className="glass-card rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
            <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Department leadership assignments</h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">{state.departments.map((department) => {
              const hod = state.users.find((user) => user.uid === department.hodUid);
              return <div key={department.departmentId} className="flex flex-wrap items-center justify-between gap-2 py-3 text-xs"><span className="font-semibold text-slate-700 dark:text-slate-200">{department.code} · {department.name}</span><span className="text-slate-500 dark:text-slate-400">HOD: {hod?.displayName || department.hodName} {hod?.loginId ? `(${hod.loginId})` : ''}</span></div>;
            })}</div>
          </div>
        </div>
      )}

      {/* TAB: AUDIT & SECURITY LOGS */}
      {(currentTab === 'audit' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                Immutable System Audit Trail
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Traceable event timeline of administrative operations, policy changes, and permission transitions
              </p>
            </div>
            <span className="px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
              {state.auditLogs.length} Events Logged
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
            {state.auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/20 px-2 rounded">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-[11px]">
                      {log.action}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
                      {log.recordType}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{log.details}</p>
                  <div className="text-[10px] text-slate-400">
                    By {log.actorName} ({log.actorRole})
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 flex-shrink-0 font-mono">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: PLATFORM SETTINGS */}
      {(currentTab === 'settings' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-600" />
            Simulated Policy Form (No Authentication Settings Applied)
          </h3>

          <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Session Inactivity Timeout (Minutes)</label>
                <input
                  type="number"
                  value={sessionTimeoutMins}
                  onChange={(e) => setSessionTimeoutMins(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="flex items-center gap-3 pt-5">
                <input
                  type="checkbox"
                  id="enforce2Fa"
                  checked={enforce2Fa}
                  onChange={(e) => setEnforce2Fa(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded"
                />
                <label htmlFor="enforce2Fa" className="font-semibold text-slate-800 dark:text-slate-200">
                  Enforce Two-Factor Authentication (2FA) for Faculty & Staff
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 font-bold transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Factory Defaults</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-sm"
              >
                Apply Security Policies
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
