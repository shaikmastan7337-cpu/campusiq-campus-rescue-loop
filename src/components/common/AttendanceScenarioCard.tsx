import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  PlusCircle,
  HelpCircle,
  Target,
  Sparkles,
} from 'lucide-react';
import { StudentProfile, AttendanceRecord } from '../../types';

interface AttendanceScenarioCardProps {
  student: StudentProfile;
  attendanceRecords: AttendanceRecord[];
  onAddMilestone?: (milestoneTitle: string) => void;
  className?: string;
}

export const AttendanceScenarioCard: React.FC<AttendanceScenarioCardProps> = ({
  student,
  attendanceRecords,
  onAddMilestone,
  className = '',
}) => {
  const [sessionsAhead, setSessionsAhead] = useState<number>(6);
  const [addedNotice, setAddedNotice] = useState<string>('');

  // 1. Calculate actual observed numbers (deduplicated)
  const seenSessions = new Set<string>();
  const studentSessions: AttendanceRecord[] = [];
  for (const att of attendanceRecords.filter((a) => a.studentId === student.studentId)) {
    const key = `${att.classId || 'cls'}_${att.date}_${att.session || 's'}`;
    if (!seenSessions.has(key)) {
      seenSessions.add(key);
      studentSessions.push(att);
    }
  }

  const denominator = studentSessions.length;
  const presentCount = studentSessions.filter(
    (a) => a.status === 'present' || a.status === 'excused'
  ).length;
  const lateCount = studentSessions.filter((a) => a.status === 'late').length;
  const numerator = presentCount + lateCount * 0.7;

  const currentRate = denominator > 0 ? (numerator / denominator) * 100 : 80;

  // 2. Compute what N is required to cross 75%
  // (numerator + N) / (denominator + N) >= 0.75
  // N >= (0.75 * denominator - numerator) / 0.25
  let sessionsToReach75 = 0;
  if (denominator > 0 && currentRate < 75) {
    const needed = (0.75 * denominator - numerator) / 0.25;
    sessionsToReach75 = Math.ceil(Math.max(0, needed));
  }

  // 3. Scenario calculation for chosen sessionsAhead N
  const scenarioDenominator = denominator + sessionsAhead;
  const scenarioNumerator = numerator + sessionsAhead;
  const scenarioRate = scenarioDenominator > 0 ? (scenarioNumerator / scenarioDenominator) * 100 : currentRate;
  const delta = scenarioRate - currentRate;

  const handleTurnIntoMilestone = () => {
    const milestoneTitle = `Attend next ${sessionsAhead} scheduled sessions on-time without absence (Scenario Target: ${scenarioRate.toFixed(1)}%)`;
    if (onAddMilestone) {
      onAddMilestone(milestoneTitle);
      setAddedNotice(`Milestone added: "Attend next ${sessionsAhead} scheduled sessions"`);
      setTimeout(() => setAddedNotice(''), 4000);
    }
  };

  return (
    <div
      className={`glass-card rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800/90 space-y-4 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Attendance Recovery "What If?" Scenario Tool
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive deterministic modeling: Estimate attendance recovery rate if student attends upcoming sessions
            </p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
          Hypothetical Model
        </span>
      </div>

      {addedNotice && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Observed vs Forecast Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* Current Observed */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Current Observed Record
          </span>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
            {currentRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {numerator.toFixed(1)} / {denominator} verified sessions
          </div>
        </div>

        {/* Hypothetical Scenario */}
        <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900">
          <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1">
            <Target className="w-3 h-3" />
            Hypothetical Outcome (+{sessionsAhead} sessions)
          </span>
          <div className="text-xl font-extrabold text-teal-700 dark:text-teal-400 mt-1 flex items-baseline gap-2">
            <span>{scenarioRate.toFixed(1)}%</span>
            <span className="text-xs font-semibold text-emerald-600">
              +{delta.toFixed(1)}%
            </span>
          </div>
          <div className="text-[11px] text-teal-800 dark:text-teal-300 mt-0.5">
            {scenarioNumerator.toFixed(1)} / {scenarioDenominator} sessions in scenario
          </div>
        </div>

        {/* Milestone Threshold Target */}
        <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900">
          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
            75% Institutional Threshold
          </span>
          <div className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 mt-1">
            {currentRate >= 75 ? (
              <span className="text-emerald-600">Threshold Met</span>
            ) : (
              <span>Need {sessionsToReach75} sessions</span>
            )}
          </div>
          <div className="text-[11px] text-indigo-800 dark:text-indigo-300 mt-0.5">
            {currentRate >= 75
              ? 'Above minimum requirement'
              : `At least ${sessionsToReach75} consecutive present sessions required`}
          </div>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="space-y-2 pt-1 text-xs">
        <div className="flex items-center justify-between">
          <label htmlFor="scenario-sessions-slider" className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span>Assume student attends next</span>
            <span className="px-2 py-0.5 rounded-lg bg-teal-600 text-white font-extrabold">
              {sessionsAhead}
            </span>
            <span>scheduled sessions on-time:</span>
          </label>
          <span className="text-[11px] text-slate-400">Range: 1 - 20 sessions</span>
        </div>

        <input
          id="scenario-sessions-slider"
          type="range"
          min={1}
          max={20}
          value={sessionsAhead}
          onChange={(e) => setSessionsAhead(parseInt(e.target.value, 10))}
          className="w-full accent-teal-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-slate-400 px-1">
          <span>1 session</span>
          <span>5 sessions</span>
          <span>10 sessions</span>
          <span>15 sessions</span>
          <span>20 sessions</span>
        </div>
      </div>

      {/* Assumptions & Action Footer */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Assumptions:</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Assumes 100% on-time attendance (weight 1.0) with zero absences across the upcoming {sessionsAhead} lecture and lab blocks. Distinct from observed historical records; not an automated guarantee.
          </p>
        </div>

        {onAddMilestone && (
          <button
            onClick={handleTurnIntoMilestone}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Turn into Support Plan Milestone</span>
          </button>
        )}
      </div>
    </div>
  );
};
