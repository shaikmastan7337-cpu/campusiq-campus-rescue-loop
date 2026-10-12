import React, { useState, useEffect } from 'react';
import { storage, AppState } from './services/storageService';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { AcceptanceTestTrackerModal } from './components/common/AcceptanceTestTrackerModal';
import { FirebaseConfigModal } from './components/common/FirebaseConfigModal';

import { LoginPage } from './components/auth/LoginPage';

// Role Dashboards
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { FacultyDashboard } from './components/dashboards/FacultyDashboard';
import { HodDashboard } from './components/dashboards/HodDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { PlacementDashboard } from './components/dashboards/PlacementDashboard';
import { MentorDashboard } from './components/dashboards/MentorDashboard';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';
import { ParentDashboard } from './components/dashboards/ParentDashboard';

export function App() {
  const [appState, setAppState] = useState<AppState>(storage.getState());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('campusiq_is_authenticated');
    return saved === 'true';
  });
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to storage updates
    const unsubscribe = storage.subscribe(() => {
      setAppState({ ...storage.getState() });
    });
    return () => unsubscribe();
  }, []);

  // Reset tab to overview when switching role
  useEffect(() => {
    setCurrentTab('overview');
  }, [appState.currentUser.role]);

  // Toggle dark mode class on HTML document root
  const handleToggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const handleLogin = (user: any) => {
    storage.switchUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('campusiq_is_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('campusiq_is_authenticated', 'false');
  };

  const renderDashboardByRole = () => {
    switch (appState.currentUser.role) {
      case 'student':
        return <StudentDashboard currentUser={appState.currentUser} currentTab={currentTab} />;
      case 'faculty':
        return <FacultyDashboard currentUser={appState.currentUser} currentTab={currentTab} />;
      case 'hod':
        return <HodDashboard currentUser={appState.currentUser} currentTab={currentTab} />;
      case 'admin':
        return <AdminDashboard currentUser={appState.currentUser} currentTab={currentTab} />;
      case 'placement-admin':
        return <PlacementDashboard currentUser={appState.currentUser} currentTab={currentTab} />;
      case 'mentor':
        return <MentorDashboard currentUser={appState.currentUser} currentTab={currentTab} />;
      case 'super-admin':
        return <SuperAdminDashboard currentUser={appState.currentUser} currentTab={currentTab} />;
      case 'parent':
        return <ParentDashboard currentUser={appState.currentUser} currentTab={currentTab} />;
      default:
        return <StudentDashboard currentUser={appState.currentUser} currentTab={currentTab} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        isDark={isDark}
        onToggleDark={handleToggleDark}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentUser={appState.currentUser}
        onOpenTestModal={() => setShowTestModal(true)}
        onOpenFirebaseModal={() => setShowFirebaseModal(true)}
        isDark={isDark}
        onToggleDark={handleToggleDark}
        onSignOut={handleLogout}
      />

      {/* Main Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Role-Specific Navigation Sidebar */}
          <Sidebar
            role={appState.currentUser.role}
            currentTab={currentTab}
            onSelectTab={(tab) => setCurrentTab(tab)}
          />

          {/* Active Role Dashboard View */}
          <main className="flex-1 w-full min-w-0">
            {renderDashboardByRole()}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 mt-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">CampusIQ Enterprise</span>
            <span>•</span>
            <span>AI-Powered Smart Campus Management & Student Success Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowTestModal(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              Demo Checks (local prototype)
            </button>
            <button
              onClick={() => setShowFirebaseModal(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium"
            >
              Firestore Schema Map
            </button>
            <span>v2.4.0</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AcceptanceTestTrackerModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
      />

      <FirebaseConfigModal
        isOpen={showFirebaseModal}
        onClose={() => setShowFirebaseModal(false)}
      />
    </div>
  );
}

export default App;
