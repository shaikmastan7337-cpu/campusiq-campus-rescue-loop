import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Database,
  Flame,
  Moon,
  Sun,
  UserCheck,
  ChevronDown,
  Sparkles,
  RotateCcw,
  LogOut,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { storage } from '../../services/storageService';

interface NavbarProps {
  currentUser: User;
  onOpenTestModal: () => void;
  onOpenFirebaseModal: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenTestModal,
  onOpenFirebaseModal,
  isDark,
  onToggleDark,
  onSignOut,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const state = storage.getState();

  const userNotifications = state.notifications.filter(
    (n) => n.recipientUid === currentUser.uid || currentUser.role === 'super-admin'
  );

  const roleColors: Record<UserRole, string> = {
    'super-admin': 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    'student': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
    'faculty': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    'hod': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    'admin': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
    'placement-admin': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
    'mentor': 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
    'parent': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
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

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-2 ring-indigo-500/20">
            <Sparkles className="w-5 h-5 text-indigo-100 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CampusIQ
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Demo Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Closed-Loop Student Success & Rescue Platform
            </p>
          </div>
        </div>

        {/* Center / Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium transition shadow-sm"
              title="Switch user role for testing"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-500 dark:text-slate-400 hidden md:inline">Role:</span>
              <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${roleColors[currentUser.role]}`}>
                {roleTitles[currentUser.role]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl glass-card shadow-2xl p-2 border border-slate-200 dark:border-slate-800 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Switch Authorized Profile</p>
                  <p className="text-[10px] text-slate-400">Select any role to test its individual view and access scopes</p>
                </div>
                <div className="max-h-80 overflow-y-auto py-1 space-y-1">
                  {state.users.map((u) => (
                    <button
                      key={u.uid}
                      onClick={() => {
                        storage.switchUser(u);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                        currentUser.uid === u.uid
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
                          alt={u.displayName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <div className="font-medium text-slate-800 dark:text-slate-200">{u.displayName}</div>
                          <div className="text-[10px] text-slate-400">{roleTitles[u.role]}</div>
                        </div>
                      </div>
                      {currentUser.uid === u.uid && (
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Test Acceptance Tracker Button */}
          <button
            onClick={onOpenTestModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition shadow-sm"
            title="Open illustrative checks against local demo data"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Demo Checks</span>
          </button>

          {/* Firebase / Cloud Firestore Schema Simulator Button */}
          <button
            onClick={onOpenFirebaseModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
            title="Firebase / Cloud Firestore Architecture & Schema Simulator"
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Cloud Schema</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (confirm('Reset CampusIQ data to initial demo state?')) {
                storage.resetToDefaults();
              }
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reset to default synthetic campus data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications Drawer */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {userNotifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl glass-card shadow-2xl p-3 border border-slate-200 dark:border-slate-800 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Campus Alerts & Notifications</h4>
                  <span className="text-[10px] text-slate-400">{userNotifications.length} recent</span>
                </div>
                <div className="max-h-64 overflow-y-auto py-2 space-y-2">
                  {userNotifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No unread notifications</p>
                  ) : (
                    userNotifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{n.title}</span>
                          <span className="text-[9px] text-slate-400">
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current User Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
              alt={currentUser.displayName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                {currentUser.displayName}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">{currentUser.role}</div>
            </div>

            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Sign Out to Login Page"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
