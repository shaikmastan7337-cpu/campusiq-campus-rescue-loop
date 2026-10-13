import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  FileText,
  Briefcase,
  Sparkles,
  Users,
  ClipboardCheck,
  Building2,
  ShieldCheck,
  Calendar,
  Layers,
  HeartHandshake,
  Lock,
  History,
  FileCheck2,
  BookOpen,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  role: UserRole;
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, currentTab, onSelectTab }) => {
  const getNavItems = (): NavItem[] => {
    switch (role) {
      case 'student':
        return [
          { id: 'overview', label: 'Dashboard Home', icon: LayoutDashboard },
          { id: 'academics', label: 'Academic & Grades', icon: GraduationCap },
          { id: 'attendance', label: 'Attendance Log', icon: ClipboardCheck },
          { id: 'assignments', label: 'Assignments', icon: FileText },
          { id: 'placements', label: 'Placement Portal', icon: Briefcase },
          { id: 'success', label: 'AI Success Analytics', icon: Sparkles, badge: 'AI' },
        ];
      case 'faculty':
        return [
          { id: 'overview', label: 'Faculty Overview', icon: LayoutDashboard },
          { id: 'attendance', label: 'Mark Attendance', icon: ClipboardCheck },
          { id: 'assignments', label: 'Assignments & Grading', icon: FileCheck2 },
          { id: 'students', label: 'At-Risk Students', icon: Users, badge: 'Alerts' },
          { id: 'timetable', label: 'Schedule & Timetable', icon: Calendar },
        ];
      case 'hod':
        return [
          { id: 'overview', label: 'Department Analytics', icon: Building2 },
          { id: 'workload', label: 'Faculty Allocation', icon: Layers },
          { id: 'risk', label: 'Academic Risk Oversight', icon: Sparkles },
          { id: 'reports', label: 'Department Reports', icon: FileText },
        ];
      case 'admin':
        return [
          { id: 'overview', label: 'Campus Overview', icon: LayoutDashboard },
          { id: 'students', label: 'Student Directory', icon: GraduationCap },
          { id: 'faculty', label: 'Faculty Directory', icon: Users },
          { id: 'announcements', label: 'Campus Broadcasts', icon: FileText },
          { id: 'audit', label: 'Audit Trail', icon: History },
        ];
      case 'placement-admin':
        return [
          { id: 'overview', label: 'Placement Dashboard', icon: Briefcase },
          { id: 'drives', label: 'Recruitment Drives', icon: Building2 },
          { id: 'eligibility', label: 'Eligibility Engine', icon: ShieldCheck },
          { id: 'applications', label: 'Applications Pipeline', icon: Layers },
        ];
      case 'mentor':
        return [
          { id: 'overview', label: 'Mentoring Caseload', icon: HeartHandshake },
          { id: 'sessions', label: 'Action Plans & Follow-ups', icon: ClipboardCheck },
          { id: 'private-notes', label: 'Confidential Notes', icon: Lock, badge: 'Private' },
          { id: 'escalations', label: 'Escalations', icon: Sparkles },
        ];
      case 'super-admin':
        return [
          { id: 'overview', label: 'System Overview', icon: ShieldCheck },
          { id: 'roles', label: 'Roles & RBAC Policy', icon: Users },
          { id: 'accounts', label: 'Faculty & HOD Accounts', icon: GraduationCap },
          { id: 'audit', label: 'Audit & Security Logs', icon: History },
          { id: 'settings', label: 'Platform Settings', icon: Layers },
        ];
      case 'parent':
        return [
          { id: 'overview', label: 'Student Progress', icon: LayoutDashboard },
          { id: 'attendance', label: 'Attendance Report', icon: ClipboardCheck },
          { id: 'academics', label: 'Academic Scores', icon: GraduationCap },
          { id: 'notices', label: 'College Notices', icon: FileText },
        ];
      default:
        return [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }];
    }
  };

  const navItems: NavItem[] = [
    ...getNavItems(),
    { id: 'access-directory', label: 'Leadership Directory', icon: Users },
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="glass-panel rounded-2xl p-3 border border-slate-200/80 dark:border-slate-800/80 shadow-sm sticky top-20">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation Modules
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
