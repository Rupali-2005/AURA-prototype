
export enum UserState {
  LANDING = 'LANDING',
  SIGN_UP = 'SIGN_UP',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD'
}

export enum Screen {
  HOME = 'HOME',
  SKILLS = 'SKILLS',
  ANALYSIS = 'ANALYSIS',
  EXPLORE = 'EXPLORE',
  CALENDAR = 'CALENDAR'
}

export enum LyraState {
  IDLE = 'IDLE',
  LISTENING = 'LISTENING',
  THINKING = 'THINKING',
  RESPONDING = 'RESPONDING',
  LIVE = 'LIVE'
}

export type LyraVoice = 'Zephyr' | 'Puck' | 'Charon' | 'Kore' | 'Fenrir';

export interface Persona {
  name: LyraVoice;
  description: string;
  tone: string;
  voiceName: string; // SDK prebuilt voice name
}

export const PERSONAS: Persona[] = [
  { name: 'Zephyr', description: 'Grounded and steady. Strategic reflection.', tone: 'Calm, patient.', voiceName: 'Zephyr' },
  { name: 'Puck', description: 'Energetic and playful. Creative risk-taking.', tone: 'Witty, encouraging.', voiceName: 'Puck' },
  { name: 'Charon', description: 'Stoic and direct. Direct feedback.', tone: 'Stoic, serious.', voiceName: 'Charon' },
  { name: 'Kore', description: 'Feminine Robotic. Warm, empathetic, professional.', tone: 'Empathetic, warm.', voiceName: 'Kore' },
  { name: 'Fenrir', description: 'Analytical and piercing. Logic-focused.', tone: 'Analytical, precise.', voiceName: 'Fenrir' }
];

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type Priority = 'Low' | 'Medium' | 'High';

export interface Resource {
  title: string;
  url: string;
  type: 'Video' | 'Article' | 'Doc';
}

export interface Skill {
  name: string;
  level: ProficiencyLevel;
  score: number;
  resources?: Resource[];
}

export interface Message {
  id: string;
  role: 'user' | 'lyra';
  text: string;
  timestamp: string;
  sources?: any[];
  isBranchPoint?: boolean;
}

export interface ChatSession {
  id: string;
  projectId: string;
  title: string;
  messages: Message[];
  createdAt: string;
  parentSessionId?: string;
  forkMessageId?: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export interface Task {
  id: string;
  label: string;
  completed: boolean;
  type: 'Task' | 'Schedule' | 'Reminder';
  priority: Priority;
  time?: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description?: string;
  type: 'Task' | 'Skill' | 'Reminder' | 'Schedule';
  priority: Priority;
  color: string;
  hasAlarm?: boolean;
}

export interface UserProfile {
  name: string;
  isNewUser: boolean;
  goals: string[];
  skills: Skill[];
  targetRole: string;
  weeklyFocus: string;
  nextStep: string;
  checklist: Task[];
  events: CalendarEvent[];
}

export interface AppSettings {
  highContrast: boolean;
  largerText: boolean;
  reduceMotion: boolean;
  voiceGuidance: boolean; 
  voicePinned: boolean;   
  nightVision: boolean;
  speechSpeed: number;
  lyraVoice: LyraVoice;
  thinkingMode: boolean;
  searchGrounding: boolean;
  isMuted: boolean;
  showCaptions: boolean;
  autoSpeak: boolean;
  // Added showTranscript to AppSettings to fix property missing error in AccessibilityMenu
  showTranscript: boolean;
}

// Added ExploreFilter interface to fix missing export error in ExploreScreen
export interface ExploreFilter {
  cost: 'All' | 'Free' | 'Paid';
  duration: 'All' | 'Short' | 'Medium' | 'Long';
  level: 'All' | ProficiencyLevel;
}

export enum Modality {
  AUDIO = 'AUDIO',
  TEXT = 'TEXT'
}
