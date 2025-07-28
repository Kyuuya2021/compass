import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { AIOnboarding } from './components/AIOnboarding';
import { FutureVisionChat } from './components/FutureVisionChat';
import { VisionResult } from './components/VisionResult';
import { GoalManagement } from './components/GoalManagement';

interface VisionData {
  shortTerm: string[];
  mediumTerm: string[];
  longTerm: string[];
  coreValues: string[];
  motivation: string;
  obstacles: string[];
  resources: string[];
}
import { TaskManagement } from './components/TaskManagement';
import { TimeManagement } from './components/TimeManagement';
import { ProgressView } from './components/ProgressView';
import { LandingPage } from './components/LandingPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GoalProvider } from './contexts/GoalContext';
import { ThemeProvider } from './contexts/ThemeContext';

type View = 'landing' | 'onboarding' | 'dashboard' | 'goals' | 'tasks' | 'progress' | 'time' | 'future-vision' | 'vision-result';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<View>('landing');
  const [visionData, setVisionData] = useState<VisionData | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.hasCompletedOnboarding) {
        setCurrentView('onboarding');
      } else {
        setCurrentView('dashboard');
      }
    } else {
      setCurrentView('landing');
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <LandingPage onGetStarted={() => setCurrentView('onboarding')} />;
  }

  if (currentView === 'onboarding') {
    return <AIOnboarding onComplete={() => setCurrentView('dashboard')} />;
  }

  if (currentView === 'future-vision') {
    return (
      <FutureVisionChat 
        onComplete={(data) => {
          setVisionData(data);
          setCurrentView('vision-result');
        }}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'vision-result' && visionData) {
    return (
      <VisionResult 
        visionData={visionData}
        onEdit={() => setCurrentView('future-vision')}
        onBack={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="pt-[74px] sm:pt-16">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'goals' && <GoalManagement />}
        {currentView === 'tasks' && <TaskManagement />}
        {currentView === 'progress' && <ProgressView />}
        {currentView === 'time' && <TimeManagement />}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GoalProvider>
          <AppContent />
        </GoalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;