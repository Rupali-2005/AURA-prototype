
import React from 'react';
import { Screen } from '../types';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (s: Screen) => void;
  onLogout: () => void;
  profileName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentScreen, onNavigate, onLogout, profileName }) => {
  const items = [
    { id: Screen.HOME, label: 'Overview', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { id: Screen.SKILLS, label: 'Skill Grid', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: Screen.ANALYSIS, label: 'Synthesis', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    )},
    { id: Screen.EXPLORE, label: 'Discovery', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    )},
    { id: Screen.CALENDAR, label: 'Scheduler', icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
  ];

  return (
    <nav className="hidden md:flex flex-col w-24 lg:w-72 h-screen border-r border-white/5 bg-black/20 backdrop-blur-3xl transition-all duration-500 hover:w-72 group relative z-40">
      <div className="p-10 mb-6">
        <div className="aura-logo text-4xl text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg select-none">Aura</div>
        <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center lg:hidden group-hover:hidden transition-all">
          <span className="text-[#D4AF37] text-xs aura-logo">A</span>
        </div>
      </div>
      
      <div className="flex-1 px-6 space-y-6 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-5 p-4 rounded-2xl transition-all relative group/item ${
              currentScreen === item.id 
              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-xl' 
              : 'text-slate-500 hover:text-slate-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className="flex-shrink-0 transition-transform group-hover/item:scale-110">{item.icon}</span>
            <span className="font-medium tracking-wide text-xs uppercase opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.label}</span>
            {currentScreen === item.id && (
              <div className="absolute left-0 w-1 h-6 bg-[#D4AF37] rounded-r-full"></div>
            )}
          </button>
        ))}
      </div>

      <div className="p-10 border-t border-white/5 space-y-6">
        <div className="flex items-center gap-4 group/user cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] text-xs font-bold uppercase ring-2 ring-transparent group-hover/user:ring-[#D4AF37]/30 transition-all">
            {profileName ? profileName.substring(0, 2) : 'ST'}
          </div>
          <div className="hidden lg:block group-hover:block transition-opacity overflow-hidden whitespace-nowrap">
            <p className="text-sm font-medium text-white">{profileName || 'Identity'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Node 01</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-5 p-4 text-slate-500 hover:text-red-400 hover:bg-red-400/5 rounded-2xl transition-all border border-transparent hover:border-red-500/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium tracking-wide text-xs uppercase opacity-0 lg:opacity-100 group-hover:opacity-100 transition-opacity">Disconnect</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
