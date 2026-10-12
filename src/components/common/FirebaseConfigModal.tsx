import React, { useState } from 'react';
import {
  X,
  Database,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  Server,
  Cloud,
  Info,
} from 'lucide-react';
import { storage } from '../../services/storageService';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  const currentConfig = storage.getState().firebaseConfig || {
    projectId: 'campusiq-demo-schema',
    authDomain: 'campusiq-demo.example.edu',
    storageBucket: 'campusiq-demo.appspot.com',
  };

  const [projectId, setProjectId] = useState(currentConfig.projectId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig.storageBucket || '');
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    storage.setFirebaseConfig({
      projectId,
      authDomain,
      storageBucket,
    });
    setStatusMessage('Configuration saved locally to browser state.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const collections = [
    { name: 'users', count: storage.getState().users.length, desc: 'Login-linked profiles & roles' },
    { name: 'students', count: storage.getState().students.length, desc: 'Student academic profiles & CGPA' },
    { name: 'faculty', count: storage.getState().faculty.length, desc: 'Faculty profiles & assigned classes' },
    { name: 'departments', count: storage.getState().departments.length, desc: 'Department management' },
    { name: 'courses', count: storage.getState().courses.length, desc: 'Course syllabus & credits' },
    { name: 'classes', count: storage.getState().classes.length, desc: 'Class sections & teachers' },
    { name: 'attendance', count: storage.getState().attendance.length, desc: 'Session attendance marks' },
    { name: 'assignments', count: storage.getState().assignments.length, desc: 'Tasks & deadlines' },
    { name: 'submissions', count: storage.getState().submissions.length, desc: 'Student submissions & evaluations' },
    { name: 'grades', count: storage.getState().grades.length, desc: 'Internal assessment marks' },
    { name: 'timetables', count: storage.getState().timetable.length, desc: 'Class schedules' },
    { name: 'announcements', count: storage.getState().announcements.length, desc: 'Targeted notices' },
    { name: 'placementProfiles', count: storage.getState().placementProfiles.length, desc: 'Skills & certifications' },
    { name: 'placementDrives', count: storage.getState().placementDrives.length, desc: 'Recruitment drives & criteria' },
    { name: 'applications', count: storage.getState().applications.length, desc: 'Job applications & stages' },
    { name: 'interventions', count: storage.getState().interventions.length, desc: 'Campus Rescue Loop support plans' },
    { name: 'mentoringNotes', count: storage.getState().mentoringNotes.length, desc: 'Confidential mentor records' },
    { name: 'notifications', count: storage.getState().notifications.length, desc: 'In-app user alerts' },
    { name: 'auditLogs', count: storage.getState().auditLogs.length, desc: 'Local audit log records' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Data Architecture & Collection Schema Map
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Schema reference & local storage configuration (Demo Simulator)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Truthful Architecture Notice Banner */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-amber-900 dark:text-amber-200">
                Demo Architecture Simulator Notice
              </span>
              <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                In this hackathon prototype, all data is persisted in browser <strong>localStorage</strong>. This configuration dialog demonstrates the target schema mapping for Cloud Firestore collections without establishing remote network connections or exposing private API keys.
              </p>
            </div>
          </div>

          {/* Collection Schema Map */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Firestore Collection Schema & Local Record Counts
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
              {collections.map((col) => (
                <div
                  key={col.name}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono font-bold text-slate-900 dark:text-white">
                      <span>{col.name}</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {col.count} records
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {col.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Configuration Form (Simulated) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Target Environment Schema Settings (Simulated)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Project ID
                </label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Auth Domain
                </label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Storage Bucket
                </label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-600 font-semibold">{statusMessage}</span>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-semibold text-xs transition"
              >
                Save Local Settings
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
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
