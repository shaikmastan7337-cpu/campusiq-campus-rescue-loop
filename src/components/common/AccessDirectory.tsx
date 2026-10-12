import React, { useMemo, useState } from 'react';
import { Mail, Search, ShieldCheck, Users } from 'lucide-react';
import { User, UserRole } from '../../types';
import { storage } from '../../services/storageService';

interface AccessDirectoryProps {
  currentUser: User;
}

const roleLabels: Record<UserRole, string> = {
  'super-admin': 'Super Administrator',
  student: 'Student',
  faculty: 'Faculty Member',
  hod: 'Head of Department',
  admin: 'Campus Administrator',
  'placement-admin': 'Placement Officer',
  mentor: 'Academic Mentor',
  parent: 'Parent / Guardian',
};

export const AccessDirectory: React.FC<AccessDirectoryProps> = ({ currentUser }) => {
  const [search, setSearch] = useState('');
  const allUsers = storage.getState().users;
  const canViewAllUsers = currentUser.role === 'super-admin';
  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allUsers
      .filter((user) => canViewAllUsers || user.role === 'super-admin')
      .filter((user) =>
        !query ||
        user.displayName.toLowerCase().includes(query) ||
        roleLabels[user.role].toLowerCase().includes(query) ||
        (user.departmentName || '').toLowerCase().includes(query)
      )
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [allUsers, canViewAllUsers, search]);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-800 via-violet-700 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-white/15 p-3"><ShieldCheck className="h-6 w-6" /></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100">Role-aware directory · demo data</span>
            <h1 className="mt-1 text-2xl font-extrabold">Leadership & User Access</h1>
            <p className="mt-2 max-w-2xl text-sm text-indigo-100">
              {canViewAllUsers
                ? 'As a Super Administrator, you can review every demo user profile and contact detail.'
                : 'Find and contact the Super Administrator. Other users’ profiles are not listed in this directory.'}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card space-y-4 rounded-2xl border border-slate-200/80 p-5 dark:border-slate-800/80">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              {canViewAllUsers ? 'All campus users' : 'Super Administrator contact'}
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {visibleUsers.length}
            </span>
          </div>
          {canViewAllUsers && (
            <label className="relative block sm:w-72">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, role, or department"
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs dark:border-slate-700 dark:bg-slate-900"
              />
            </label>
          )}
        </div>

        {visibleUsers.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {visibleUsers.map((user) => (
              <article key={user.uid} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80'}
                  alt=""
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.displayName}</h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-300">{roleLabels[user.role]}</p>
                  <p className="truncate text-[11px] text-slate-500">{user.departmentName || 'Institutional leadership'}</p>
                  {canViewAllUsers && <p className="text-[10px] text-slate-400">Status: {user.status}</p>}
                </div>
                <a
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-2 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-300"
                  href={`mailto:${user.email}`}
                  aria-label={`Email ${user.displayName}`}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-slate-50 p-6 text-center text-xs text-slate-500 dark:bg-slate-900">No matching demo users.</p>
        )}
      </div>

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
        Prototype limitation: these role-based views are client-side display rules over fictional data. They are not server-enforced access controls. A production system needs authenticated APIs and backend authorization policies.
      </p>
    </section>
  );
};
