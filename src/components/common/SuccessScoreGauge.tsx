import React from 'react';
import { Sparkles, HelpCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AcademicSuccessScore } from '../../types';

interface SuccessScoreGaugeProps {
  scoreData: AcademicSuccessScore;
  onOpenExplanation: () => void;
}

export const SuccessScoreGauge: React.FC<SuccessScoreGaugeProps> = ({
  scoreData,
  onOpenExplanation,
}) => {
  const { totalScore, isProvisional, availableDataPercent, riskAlerts } = scoreData;

  // Gauge colors based on score
  let scoreColor = '#6366f1'; // indigo
  let statusText = 'Good Academic Standing';
  let badgeBg = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300';

  if (totalScore >= 80) {
    scoreColor = '#10b981'; // emerald
    statusText = 'Distinction & High Momentum';
    badgeBg = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300';
  } else if (totalScore < 65 || riskAlerts.length > 0) {
    scoreColor = '#f43f5e'; // rose
    statusText = 'Academic Support Recommended';
    badgeBg = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300';
  }

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (totalScore / 100) * circumference;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800/80 relative overflow-hidden shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Academic Success Score</h3>
            <p className="text-[11px] text-slate-400">Multi-factor grounded student index</p>
          </div>
        </div>

        {isProvisional ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-semibold">
            <AlertTriangle className="w-3 h-3" />
            Provisional ({availableDataPercent}%)
          </span>
        ) : (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold">
            <ShieldCheck className="w-3 h-3" />
            Verified (100%)
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-2">
        {/* Radial SVG Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke={scoreColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalScore}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">out of 100</span>
          </div>
        </div>

        {/* Status & Factor Highlights */}
        <div className="space-y-3 flex-1 text-center sm:text-left">
          <div>
            <div className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${badgeBg}`}>
              {statusText}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Calculated across 6 institutional factors (Academic 35%, Attendance 20%, LMS 15%, Engagement 10%, Skills 10%, Placement 10%).
            </p>
          </div>

          <button
            onClick={onOpenExplanation}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Explain Score & Factors</span>
          </button>
        </div>
      </div>
    </div>
  );
};
