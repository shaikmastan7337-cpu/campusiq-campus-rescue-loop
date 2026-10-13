import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  HelpCircle,
  Info,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { storage } from '../../services/storageService';

interface LoginPageProps {
  onLogin: (user: User) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, isDark, onToggleDark }) => {
  const state = storage.getState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoHelp, setShowDemoHelp] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const roleColors: Record<UserRole, { bg: string; text: string; border: string; ring: string }> = {
    'super-admin': {
      bg: 'bg-rose-500/10',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-500/30',
      ring: 'hover:ring-rose-500/40',
    },
    'student': {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'border-indigo-500/30',
      ring: 'hover:ring-indigo-500/40',
    },
    'faculty': {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-500/30',
      ring: 'hover:ring-emerald-500/40',
    },
    'hod': {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-500/30',
      ring: 'hover:ring-amber-500/40',
    },
    'admin': {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-500/30',
      ring: 'hover:ring-cyan-500/40',
    },
    'placement-admin': {
      bg: 'bg-purple-500/10',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'border-purple-500/30',
      ring: 'hover:ring-purple-500/40',
    },
    'mentor': {
      bg: 'bg-teal-500/10',
      text: 'text-teal-600 dark:text-teal-400',
      border: 'border-teal-500/30',
      ring: 'hover:ring-teal-500/40',
    },
    'parent': {
      bg: 'bg-blue-500/10',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-500/30',
      ring: 'hover:ring-blue-500/40',
    },
  };

  const roleTitles: Record<UserRole, string> = {
    'super-admin': 'Super Administrator',
    'student': 'Student',
    'faculty': 'Faculty Member',
    'hod': 'Head of Department',
    'admin': 'General Administrator',
    'placement-admin': 'Placement Officer',
    'mentor': 'Academic Mentor',
    'parent': 'Parent / Guardian',
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your registered institutional email or account ID.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const matchedUser = state.users.find(
        (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim() || u.loginId?.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (matchedUser) {
        if (matchedUser.status === 'inactive') {
          setErrorMessage('This account is marked inactive in seed data.');
          setLoading(false);
          return;
        }

        storage.switchUser(matchedUser);
        onLogin(matchedUser);
      } else {
        setErrorMessage(
            `No account matches "${email}". Enter a registered institutional email or account ID, or select a demo persona.`
        );
      }
      setLoading(false);
    }, 250);
  };

  const handleQuickPersonaSelect = (user: User) => {
    setLoading(true);
    setTimeout(() => {
      storage.switchUser(user);
      onLogin(user);
      setLoading(false);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Top minimal header */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 py-4 px-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/20">
              <Sparkles className="w-4 h-4 text-indigo-100" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CampusIQ
              </span>
              <span className="ml-2 px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                Demo Mode
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDemoHelp(!showDemoHelp)}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Demo Credentials</span>
            </button>
            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle theme"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center">
        {/* Hero title banner */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-xs font-semibold text-amber-800 dark:text-amber-300 shadow-sm">
            <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Hackathon Evaluation Sandbox • Local Browser Persistence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Demo Persona Sign-In
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Select any persona below to preview role-specific views. Passwords are not verified in Demo Mode.
          </p>
        </div>

        {/* Demo Credentials Helper Dropdown */}
        {showDemoHelp && (
          <div className="max-w-4xl mx-auto w-full mb-6 p-4 rounded-2xl glass-card border border-indigo-200 dark:border-indigo-900/60 text-xs animate-in fade-in">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Available Demo Accounts for Testing
              </span>
              <button
                onClick={() => setShowDemoHelp(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
              {state.users.map((u) => (
                <div
                  key={u.uid}
                  onClick={() => {
                    setEmail(u.email);
                    setShowDemoHelp(false);
                  }}
                  className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-indigo-500 transition"
                >
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{u.displayName}</div>
                  <div className="text-[10px] text-slate-400 truncate font-mono">{u.email}</div>
                  <div className="text-[9px] font-bold uppercase text-indigo-600 dark:text-indigo-400 mt-0.5">{u.role}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form and Persona Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (5 cols) */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Enter Email or Account ID
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Demo sign-in matches registered emails or institutional IDs (no real authentication server)
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                  Institutional Email or ID
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="name@campusiq.edu or STU-205"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                  Password (Optional for Demo)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    placeholder="Any password accepted in demo mode"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition disabled:opacity-50"
              >
                {loading ? 'Accessing Demo Session...' : 'Enter Demo Mode'}
              </button>
            </form>

            {/* Truthful Architecture Notice */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Evaluation Sandbox Notice</span>
              </div>
              <p>
                Client-side state is stored in browser localStorage. Real authentication, 2FA, and server-side RBAC are out of hackathon prototype scope.
              </p>
            </div>
          </div>

          {/* Right Column: 1-Click Demo Personas (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  1-Click Role Switcher
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select any persona to immediately inspect their role-specific view
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                Demo Personas
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.users.map((u) => {
                const color = roleColors[u.role] || roleColors.student;
                const isStoryMentor = u.email === 'shweta.rao@campusiq.edu';
                const isStoryStudent = u.email === 'neha.patel@campusiq.edu';

                return (
                  <div
                    key={u.uid}
                    onClick={() => handleQuickPersonaSelect(u)}
                    className={`group relative p-3.5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${
                      isStoryMentor || isStoryStudent ? 'ring-2 ring-teal-500/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
                        alt={u.displayName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            {u.displayName}
                          </h3>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${color.bg} ${color.text} border ${color.border} shrink-0`}
                          >
                            {u.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {roleTitles[u.role]}
                          {isStoryMentor && <span className="ml-1 text-teal-600 font-bold">★ Rescue Mentor</span>}
                          {isStoryStudent && <span className="ml-1 text-amber-600 font-bold">★ Support Case</span>}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate font-mono mt-0.5">
                          {u.email}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      <span className="text-[10px] text-slate-400">
                        {u.departmentName || 'Institutional'}
                      </span>
                      <span className="font-semibold flex items-center gap-1">
                        Open View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-6 bg-white/40 dark:bg-slate-900/40 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CampusIQ Hackathon Prototype • Closed-Loop Student Support Demo</span>
          <span>Client-side localStorage store • Self-contained</span>
        </div>
      </footer>
    </div>
  );
};
