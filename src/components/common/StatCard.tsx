import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorTheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple' | 'cyan' | 'teal' | 'blue';
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorTheme = 'indigo',
  badge,
}) => {
  const colorMap = {
    indigo: {
      bg: 'from-indigo-500/10 to-indigo-500/5',
      border: 'border-indigo-500/20',
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      glow: 'group-hover:shadow-indigo-500/10',
    },
    emerald: {
      bg: 'from-emerald-500/10 to-emerald-500/5',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      glow: 'group-hover:shadow-emerald-500/10',
    },
    amber: {
      bg: 'from-amber-500/10 to-amber-500/5',
      border: 'border-amber-500/20',
      iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      glow: 'group-hover:shadow-amber-500/10',
    },
    rose: {
      bg: 'from-rose-500/10 to-rose-500/5',
      border: 'border-rose-500/20',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      glow: 'group-hover:shadow-rose-500/10',
    },
    purple: {
      bg: 'from-purple-500/10 to-purple-500/5',
      border: 'border-purple-500/20',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      glow: 'group-hover:shadow-purple-500/10',
    },
    cyan: {
      bg: 'from-cyan-500/10 to-cyan-500/5',
      border: 'border-cyan-500/20',
      iconBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      glow: 'group-hover:shadow-cyan-500/10',
    },
    teal: {
      bg: 'from-teal-500/10 to-teal-500/5',
      border: 'border-teal-500/20',
      iconBg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
      glow: 'group-hover:shadow-teal-500/10',
    },
    blue: {
      bg: 'from-blue-500/10 to-blue-500/5',
      border: 'border-blue-500/20',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      glow: 'group-hover:shadow-blue-500/10',
    },
  };

  const currentTheme = colorMap[colorTheme];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl glass-card p-5 border ${currentTheme.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${currentTheme.glow}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</span>
            {badge && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                {badge}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${currentTheme.iconBg} transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100 dark:border-slate-800/80">
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1">{subtitle}</span>
          )}
          {trend && (
            <span
              className={`font-semibold text-[11px] flex items-center gap-0.5 ${
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
