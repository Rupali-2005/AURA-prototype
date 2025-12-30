
import React, { useState } from 'react';
import { UserState, Screen, LyraState, UserProfile, AppSettings, Task, CalendarEvent } from './types';
import LandingScreen from './components/LandingScreen';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import HomeScreen from './components/screens/HomeScreen';
import SkillsScreen from './components/screens/SkillsScreen';
import AnalysisScreen from './components/screens/AnalysisScreen';
import ExploreScreen from './components/screens/ExploreScreen';
import CalendarScreen from './components/screens/CalendarScreen';
import LyraCore from './components/LyraCore';
import AccessibilityMenu from './components/AccessibilityMenu';
import SettingsMenu from './components/SettingsMenu';

const DEMO_TASKS: Task[] = [
  { id: 'dt-1', label: 'Resume refinement for TCS Global Internship', completed: false, type: 'Task', priority: 'High' },
  { id: 'dt-2', label: 'Complete Fake Job Posting Classifier project', completed: false, type: 'Task', priority: 'High' },
  { id: 'dt-3', label: 'Aura prototype feedback iteration', completed: false, type: 'Task', priority: 'Medium' },
  { id: 'dt-4', label: 'Forage Virtual Internship – Data & AI', completed: false, type: 'Task', priority: 'Medium' },
  { id: 'dt-5', label: 'Skill revision: Python + Data Analysis', completed: false, type: 'Task', priority: 'Low' },
  { id: 'dt-6', label: 'Weekly reflection & alignment check', completed: false, type: 'Task', priority: 'Low' }
];

const INITIAL_PROFILE: UserProfile = {
  name: '',
  isNewUser: true,
  goals: [],
  skills: [],
  targetRole: 'Full Stack Engineer',
  weeklyFocus: 'Awaiting initialization...',
  nextStep: 'Complete onboarding to begin.',
  checklist: [
    { id: '1', label: 'Verify Student Identity', completed: true, type: 'Task', priority: 'High' },
    { id: '2', label: 'Define Career Focus', completed: false, type: 'Task', priority: 'Medium' },
    { id: '3', label: 'Map 3 Core Proficiencies', completed: false, type: 'Task', priority: 'Medium' },
    { id: '4', label: 'Initialize Lyra Topology', completed: false, type: 'Task', priority: 'Medium' }
  ],
  events: []
};

const RETURNING_PROFILE: UserProfile = {
  name: 'Rupali',
  isNewUser: false,
  goals: ['UI/UX Design', 'AI Application Architecture'],
  targetRole: 'Product Designer & AI Architect',
  skills: [
    { 
      name: 'Visual Design', 
      level: 'Intermediate', 
      score: 75,
      resources: [
        { title: 'Typography Guide', url: '#', type: 'Doc' },
        { title: 'Grid Systems Masterclass', url: '#', type: 'Video' }
      ]
    },
    { 
      name: 'React', 
      level: 'Intermediate', 
      score: 60,
      resources: [
        { title: 'Official Documentation', url: '#', type: 'Doc' }
      ]
    },
    { name: 'AI Prompt Engineering', level: 'Intermediate', score: 65 },
    { name: 'System Thinking', level: 'Advanced', score: 85 },
  ],
  weeklyFocus: 'Finalizing TCS Internship Application',
  nextStep: 'Review the Material Design fundamentals.',
  checklist: DEMO_TASKS,
  events: [
    { id: 'de-1', date: '2025-12-15T10:00:00.000Z', time: '10:00', title: 'Resume refinement for TCS Global Internship', type: 'Task', priority: 'High', color: '#EF4444' },
    { id: 'de-2', date: '2025-12-20T14:00:00.000Z', time: '14:00', title: 'Complete Fake Job Posting Classifier project', type: 'Task', priority: 'High', color: '#EF4444' },
    { id: 'de-3', date: '2025-12-28T11:00:00.000Z', time: '11:00', title: 'Weekly reflection & alignment check', type: 'Reminder', priority: 'Low', color: '#10B981' },
    { id: 'de-4', date: '2026-01-05T09:00:00.000Z', time: '09:00', title: 'Forage Virtual Internship – Data & AI', type: 'Schedule', priority: 'Medium', color: '#F59E0B' },
    { id: 'de-5', date: '2026-01-12T15:00:00.000Z', time: '15:00', title: 'Aura prototype feedback iteration', type: 'Task', priority: 'Medium', color: '#F59E0B' },
    { id: 'de-6', date: '2026-01-18T10:30:00.000Z', time: '10:30', title: 'Skill revision: Python + Data Analysis', type: 'Skill', priority: 'Low', color: '#10B981' }
  ]
};

const App: React.FC = () => {
  const [userState, setUserState] = useState<UserState>(UserState.LANDING);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.HOME);
  const [lyraState, setLyraState] = useState<LyraState>(LyraState.IDLE);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [settings, setSettings] = useState<AppSettings>({
    highContrast: false,
    largerText: false,
    reduceMotion: false,
    voiceGuidance: false,
    voicePinned: false,
    nightVision: false,
    speechSpeed: 1.0,
    lyraVoice: 'Zephyr',
    thinkingMode: false,
    searchGrounding: false,
    isMuted: false,
    showCaptions: true,
    showTranscript: false,
    autoSpeak: true
  });

  const handleStartSignUp = () => {
    setProfile({ ...INITIAL_PROFILE, isNewUser: true });
    setUserState(UserState.SIGN_UP);
  };

  const handleStartLogin = () => {
    setProfile(RETURNING_PROFILE);
    setUserState(UserState.DASHBOARD);
    setCurrentScreen(Screen.HOME);
  };

  const handleLogout = () => {
    setUserState(UserState.LANDING);
    setProfile(INITIAL_PROFILE);
    setShowAccessibility(false);
    setShowSettings(false);
    setLyraState(LyraState.IDLE);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const applySettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const themeClasses = `
    min-h-screen transition-all duration-700 relative overflow-hidden flex
    ${settings.highContrast ? 'contrast-125 saturate-50' : ''}
    ${settings.largerText ? 'text-lg' : 'text-base'}
    ${settings.nightVision ? 'bg-[#000000] text-[#00ff00] grayscale brightness-75' : 'bg-[#0c0a1a] text-white'}
    ${settings.reduceMotion ? 'motion-reduce' : ''}
  `.trim();

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.HOME: return <HomeScreen profile={profile} updateProfile={updateProfile} />;
      case Screen.SKILLS: return <SkillsScreen profile={profile} updateProfile={updateProfile} />;
      case Screen.ANALYSIS: return <AnalysisScreen profile={profile} updateProfile={updateProfile} />;
      case Screen.EXPLORE: return <ExploreScreen profile={profile} updateProfile={updateProfile} />;
      case Screen.CALENDAR: return <CalendarScreen profile={profile} updateProfile={updateProfile} />;
      default: return <HomeScreen profile={profile} updateProfile={updateProfile} />;
    }
  };

  return (
    <div className={themeClasses}>
      {!settings.nightVision && (
        <div className="fixed inset-0 bg-gradient-to-br from-[#0c0a1a] via-[#1a1333] to-[#0f1c2b] -z-10" />
      )}

      {userState === UserState.DASHBOARD && (
        <div className="fixed top-6 right-6 z-[120] flex gap-3">
          <button 
            onClick={() => setShowAccessibility(true)}
            className="p-3 rounded-full border border-[#D4AF37]/30 hover:border-[#D4AF37] bg-black/40 backdrop-blur-md transition-all text-[#D4AF37]"
            title="Accessibility Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
            </svg>
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-3 rounded-full border border-[#D4AF37]/30 hover:border-[#D4AF37] bg-black/40 backdrop-blur-md transition-all text-[#D4AF37]"
            title="Session Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>
      )}

      {userState === UserState.DASHBOARD && (
        <Sidebar currentScreen={currentScreen} onNavigate={setCurrentScreen} onLogout={handleLogout} profileName={profile.name} />
      )}

      <main className={`flex-1 h-screen overflow-y-auto ${userState === UserState.DASHBOARD ? 'pt-24 px-6 md:px-12 pb-32' : ''} custom-scrollbar`}>
        <div className={userState === UserState.DASHBOARD ? "max-w-6xl mx-auto" : "w-full h-full"}>
          {userState === UserState.LANDING && <LandingScreen onSignUp={handleStartSignUp} onLogin={handleStartLogin} />}
          {userState === UserState.SIGN_UP && (
            <Onboarding onComplete={(newProfile) => {
              setProfile({ ...newProfile, isNewUser: true });
              setUserState(UserState.DASHBOARD);
              setCurrentScreen(Screen.HOME);
            }} />
          )}
          {userState === UserState.DASHBOARD && renderScreen()}
        </div>
      </main>

      <LyraCore 
        state={lyraState} 
        setState={setLyraState} 
        userState={userState}
        settings={settings}
        applySettings={applySettings}
        profile={profile}
        updateProfile={updateProfile}
        onNavigate={setCurrentScreen}
      />

      <AccessibilityMenu 
        isOpen={showAccessibility} 
        settings={settings} 
        onClose={() => setShowAccessibility(false)} 
        onUpdate={applySettings}
      />

      <SettingsMenu
        isOpen={showSettings}
        settings={settings}
        onClose={() => setShowSettings(false)}
        onUpdate={applySettings}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default App;
