import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { AcademicSuccessScore, StudentProfile } from '../../types';
import { generateGroundedRecommendations, GroundedRecommendation } from '../../services/geminiService';

interface ScoreExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  studentName: string;
  scoreData: AcademicSuccessScore;
}

export const ScoreExplanationModal: React.FC<ScoreExplanationModalProps> = ({
  isOpen,
  onClose,
  student,
  studentName,
  scoreData,
}) => {
  const [recommendations, setRecommendations] = useState<GroundedRecommendation[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRecommendations();
    }
  }, [isOpen, scoreData]);

  const loadRecommendations = async () => {
    setLoadingAi(true);
    try {
      const recs = await generateGroundedRecommendations(student, studentName, scoreData);
      setRecommendations(recs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Explainable Success Score & Support Signal Evidence Trail
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transparent evaluation trail for {studentName} ({student.rollNumber}) • {student.departmentName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Formula & Normalization Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 border border-indigo-500/20">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Auditable Mathematical Formula
                </span>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  Total Score = ∑ (Component_Score_i × Weight_i) / ∑ (Available_Weights)
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                  Missing components are never replaced with fictitious default values. Total score is normalized across available weights ({scoreData.availableDataPercent}% coverage).
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Evaluation Window: <strong>{scoreData.evidenceDateWindow || 'Current Semester'}</strong></span>
                </div>
              </div>

              <div className="text-right flex-shrink-0 bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-indigo-100 dark:border-indigo-950">
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {scoreData.totalScore}
                  <span className="text-sm text-slate-400 font-normal">/100</span>
                </div>
                <div className="text-[10px] font-semibold mt-0.5">
                  <span
                    className={`px-2 py-0.5 rounded-full ${
                      scoreData.isProvisional
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {scoreData.isProvisional ? 'Provisional (<70% data)' : 'Sufficient Coverage'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Data Coverage: {scoreData.availableDataPercent}%
                </div>
              </div>
            </div>
          </div>

          {/* Component Breakdown Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Component Weights & Input Breakdown
              </h4>
              <span className="text-[11px] text-slate-500">
                6 Defined Indicator Pillars
              </span>
            </div>

            <div className="space-y-2.5">
              {scoreData.components.map((comp) => (
                <div
                  key={comp.name}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{comp.name}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                        Nominal: {comp.weight}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Raw: {comp.status === 'missing' ? 'N/A' : `${comp.rawScore}/100`}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          comp.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : comp.status === 'partial'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {comp.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {comp.status !== 'missing' ? (
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          comp.rawScore >= 75
                            ? 'bg-emerald-500'
                            : comp.rawScore >= 60
                            ? 'bg-indigo-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${comp.rawScore}%` }}
                      ></div>
                    </div>
                  ) : (
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full border border-dashed border-slate-300 dark:border-slate-700"></div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>{comp.description}</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{comp.dataCoverageText}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Triggered Support Signals (Evidence-Based Review Prompts) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              Evidence-Based Support Signals & Review Prompts
            </h4>

            {scoreData.supportSignals.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No active support signals triggered. Indicators meet institutional thresholds.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {scoreData.supportSignals.map((signal) => (
                  <div
                    key={signal.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      signal.severity === 'high'
                        ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60'
                        : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{signal.title}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-white/70 dark:bg-slate-900/70 border">
                          {signal.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {signal.dateWindow}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {signal.description}
                    </p>

                    <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400">
                      <strong>Underlying Evidence:</strong> {signal.evidence}
                    </div>

                    <div className="text-[11px] font-medium text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>Suggested Review Action: {signal.suggestedAction}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grounded Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Grounded Support Recommendations (Advisory Only)
              </h4>
              <span className="text-[10px] text-slate-400">
                Deterministic local reasoning • No external telemetry
              </span>
            </div>

            {loadingAi ? (
              <div className="py-6 text-center text-xs text-slate-400 animate-pulse">
                Analyzing verified records...
              </div>
            ) : (
              <div className="space-y-2.5">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{rec.title}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {rec.category}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rec.priority === 'High'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {rec.priority} Priority
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rec.recommendation}
                    </p>

                    <div className="p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-200">
                      <strong>Grounded Basis:</strong> {rec.groundedReason}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Next Actionable Step: {rec.actionableStep}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Campus Rescue Loop • Transparent Evaluation Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white text-xs font-semibold hover:bg-slate-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
