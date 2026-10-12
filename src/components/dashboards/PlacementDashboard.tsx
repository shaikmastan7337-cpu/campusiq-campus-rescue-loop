import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  ShieldCheck,
  Layers,
  PlusCircle,
  CheckCircle2,
  TrendingUp,
  UserCheck,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { User, PlacementDrive, Application, StudentProfile } from '../../types';
import { storage } from '../../services/storageService';
import { StatCard } from '../common/StatCard';
import { checkPlacementEligibility } from '../../services/placementEligibility';

interface PlacementDashboardProps {
  currentUser: User;
  currentTab: string;
}

export const PlacementDashboard: React.FC<PlacementDashboardProps> = ({
  currentUser,
  currentTab,
}) => {
  const state = storage.getState();
  const [showNewDriveModal, setShowNewDriveModal] = useState(false);
  const [compName, setCompName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [packageVal, setPackageVal] = useState(18);
  const [minCgpa, setMinCgpa] = useState(7.5);
  const [maxBacklogs, setMaxBacklogs] = useState(0);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [selectedDriveId, setSelectedDriveId] = useState<string>(
    state.placementDrives[0]?.driveId || 'drv-01'
  );
  const [detailStudentId, setDetailStudentId] = useState<string | null>(null);

  const totalDrives = state.placementDrives.length;
  const totalApplications = state.applications.length;
  const totalShortlisted = state.applications.filter(
    (a) => a.stage === 'technical' || a.stage === 'hr' || a.stage === 'offered'
  ).length;

  const highestPackage = Math.max(...state.placementDrives.map((d) => d.packageLpa), 0);

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName) return;

    storage.createPlacementDrive({
      companyName: compName,
      role: roleTitle,
      packageLpa: packageVal,
      eligibility: {
        minCgpa,
        maxBacklogs,
        departments: ['dept-cse', 'dept-ece', 'dept-ds'],
      },
      deadline: '2026-11-15T23:59:00Z',
      driveDate: '2026-11-20',
      location: 'Campus Tech Hub / Virtual',
      status: 'upcoming',
      description: `Campus recruitment drive for ${compName} - ${roleTitle}.`,
    });

    setShowNewDriveModal(false);
    setCompName('');
    setRoleTitle('');
  };

  const handleAdvanceStage = (appId: string, nextStage: Application['stage']) => {
    storage.updateApplicationStage(appId, nextStage);
  };

  const selectedDrive =
    state.placementDrives.find((d) => d.driveId === selectedDriveId) || state.placementDrives[0];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-950 p-6 sm:p-8 text-white shadow-xl shadow-purple-950/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Placement Cell & Corporate Relations (Demo Mode)
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Data-Driven Recruitment Drives & Eligibility Verification
            </h1>
            <p className="text-sm text-purple-100 max-w-xl leading-relaxed">
              Evaluating student academic records dynamically against company-specific criteria using unified deterministic verification rules.
            </p>
          </div>

          <button
            onClick={() => setShowNewDriveModal(true)}
            className="px-4 py-2 rounded-xl bg-white text-purple-900 font-bold text-xs shadow-md hover:bg-purple-50 transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-purple-700" />
            <span>Post New Drive</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Drives"
          value={totalDrives}
          subtitle="Corporate employer pipelines"
          icon={Building2}
          colorTheme="purple"
        />
        <StatCard
          title="Total Applications"
          value={totalApplications}
          subtitle="Registered student applications"
          icon={Layers}
          colorTheme="indigo"
        />
        <StatCard
          title="Interview Pipeline"
          value={totalShortlisted}
          subtitle="Cleared OA stage"
          icon={UserCheck}
          colorTheme="emerald"
          badge="Shortlisted"
        />
        <StatCard
          title="Top CTC Package"
          value={`${highestPackage.toFixed(1)} LPA`}
          subtitle="Highest verified drive CTC"
          icon={TrendingUp}
          colorTheme="amber"
          badge="Demo Record"
        />
      </div>

      {/* TAB: DRIVES & OVERVIEW */}
      {(currentTab === 'drives' || currentTab === 'overview' || !currentTab) && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Recruitment Drives
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Drive criteria and deadlines sourced directly from state records
              </p>
            </div>
            <button
              onClick={() => setShowNewDriveModal(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Drive</span>
            </button>
          </div>

          <div className="space-y-3">
            {state.placementDrives.map((drv) => (
              <div
                key={drv.driveId}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white text-sm">{drv.companyName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-[10px]">
                      {drv.packageLpa} LPA
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {drv.status}
                    </span>
                  </div>
                  <div className="font-medium text-slate-700 dark:text-slate-300">{drv.role}</div>
                  <div className="text-[11px] text-slate-500">
                    Rule: Min CGPA {drv.eligibility.minCgpa} • Max {drv.eligibility.maxBacklogs} Backlogs • Departments: {drv.eligibility.departments.map(d => d.replace('dept-', '').toUpperCase()).join(', ')} • Drive Date: {drv.driveDate}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {state.applications.filter((a) => a.driveId === drv.driveId).length} Registered
                  </span>
                  <button
                    onClick={() => {
                      setSelectedDriveId(drv.driveId);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 font-semibold"
                  >
                    Inspect Eligibility
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: DYNAMIC DATA-DRIVEN ELIGIBILITY MATRIX */}
      {(currentTab === 'eligibility' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Data-Driven Placement Eligibility Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Calculated strictly from each company's saved rules (CGPA, backlogs, department). No hard-coded outcomes.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 text-[11px]">Dynamic Drives:</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold text-[10px]">
                {state.placementDrives.length} Configured Drives
              </span>
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">CGPA</th>
                  <th className="py-3 px-4">Arrears</th>
                  {state.placementDrives.map((drv) => (
                    <th key={drv.driveId} className="py-3 px-4">
                      <div>{drv.companyName}</div>
                      <div className="text-[9px] text-slate-400 font-normal">
                        ≥ {drv.eligibility.minCgpa} CGPA, ≤ {drv.eligibility.maxBacklogs} backlogs
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {state.students.map((stu) => {
                  const u = state.users.find((user) => user.uid === stu.uid);
                  return (
                    <tr key={stu.studentId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{u?.displayName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {stu.rollNumber} • {stu.departmentName?.split('&')[0]}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold">{stu.cgpa.toFixed(2)}</td>
                      <td className="py-3 px-4 font-semibold">{stu.backlogs}</td>

                      {state.placementDrives.map((drv) => {
                        const res = checkPlacementEligibility(stu, drv);
                        return (
                          <td key={drv.driveId} className="py-3 px-4">
                            {res.isEligible ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                <Check className="w-3 h-3" />
                                Eligible
                              </span>
                            ) : (
                              <div className="space-y-0.5">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                  <X className="w-3 h-3" />
                                  Ineligible
                                </span>
                                <div className="text-[9px] text-slate-500 max-w-[140px] truncate" title={res.unmetCriteria.join(', ')}>
                                  {res.unmetCriteria[0]}
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Deep-Dive Drive Inspector */}
          {selectedDrive && (
            <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-purple-900 dark:text-purple-200 text-sm">
                    {selectedDrive.companyName} ({selectedDrive.role}) Criteria Verification
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-[10px] font-bold">
                    {selectedDrive.packageLpa} LPA
                  </span>
                </div>
                <div className="text-slate-500 text-[11px]">
                  Rule Cutoff: Min CGPA {selectedDrive.eligibility.minCgpa} • Max {selectedDrive.eligibility.maxBacklogs} Backlogs
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {state.students.map((stu) => {
                  const u = state.users.find((user) => user.uid === stu.uid);
                  const res = checkPlacementEligibility(stu, selectedDrive);
                  return (
                    <div
                      key={stu.studentId}
                      className="p-3 rounded-lg bg-white dark:bg-slate-900/80 border border-purple-100 dark:border-purple-950 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{u?.displayName}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            res.isEligible
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {res.isEligible ? 'Eligible' : 'Ineligible'}
                        </span>
                      </div>

                      <div className="space-y-0.5 text-[11px] text-slate-500">
                        {res.criteriaDetails.map((c, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span>{c.name}:</span>
                            <span className={c.met ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                              {c.actual} ({c.required})
                            </span>
                          </div>
                        ))}
                      </div>

                      {!res.isEligible && (
                        <div className="text-[10px] text-rose-600 dark:text-rose-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <strong>Unmet:</strong> {res.unmetCriteria.join('; ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: APPLICATIONS PIPELINE */}
      {(currentTab === 'applications' || currentTab === 'overview') && (
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Student Application Pipeline & Stage Progression
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track interview rounds, OA progress, and verified offer stages
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {state.applications.map((app) => (
              <div key={app.applicationId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {app.studentName} ({app.rollNumber}) • {app.companyName}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Applied for {app.role} ({app.packageLpa} LPA) • {app.feedback || 'Under active consideration'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Stage: {app.stage}
                  </span>

                  {app.stage !== 'offered' && (
                    <button
                      onClick={() => {
                        const next = app.stage === 'applied' ? 'aptitude' : app.stage === 'aptitude' ? 'technical' : 'offered';
                        handleAdvanceStage(app.applicationId, next);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition"
                    >
                      Advance Round
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: New Drive */}
      {showNewDriveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Create Campus Recruitment Drive
              </h3>
              <button
                onClick={() => setShowNewDriveModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cisco Systems"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer (Networks)"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Package (LPA)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={packageVal}
                    onChange={(e) => setPackageVal(parseFloat(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Max Backlogs</label>
                  <input
                    type="number"
                    min="0"
                    value={maxBacklogs}
                    onChange={(e) => setMaxBacklogs(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewDriveModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold"
                >
                  Save Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
