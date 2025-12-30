
import React from 'react';
import { AppSettings, LyraVoice, PERSONAS } from '../types';

interface SettingsMenuProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onUpdate: (s: Partial<AppSettings>) => void;
  onLogout: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, settings, onClose, onUpdate, onLogout }) => {
  if (!isOpen) return null;

  const activePersona = PERSONAS.find(p => p.name === settings.lyraVoice) || PERSONAS[0];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#1a1333] border border-[#D4AF37]/20 rounded-[2.5rem] p-10 space-y-8 shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh] custom-scrollbar">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-light text-[#D4AF37]">Intelligence Controls</h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Lyra Core Configuration</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-300">Resonance Profile</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PERSONAS.map(p => (
                <button
                  key={p.name}
                  onClick={() => onUpdate({ lyraVoice: p.name })}
                  className={`py-2 rounded-xl border transition-all text-xs font-medium ${
                    settings.lyraVoice === p.name 
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' 
                    : 'border-white/5 text-slate-500 hover:border-white/20'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/5">
              <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1">{activePersona.name} Profile</p>
              <p className="text-xs text-slate-300 leading-relaxed italic">{activePersona.description}</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex justify-between items-center">
              <div>
                <label className="text-sm font-medium text-slate-300">Thinking Mode</label>
                <p className="text-[10px] text-slate-500">Enable Gemini 3 Pro reasoning depth</p>
              </div>
              <button 
                onClick={() => onUpdate({ thinkingMode: !settings.thinkingMode })}
                className={`w-10 h-5 rounded-full p-0.5 transition-all flex items-center ${settings.thinkingMode ? 'bg-[#D4AF37]' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.thinkingMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <label className="text-sm font-medium text-slate-300">Search Grounding</label>
                <p className="text-[10px] text-slate-500">Real-time information retrieval</p>
              </div>
              <button 
                onClick={() => onUpdate({ searchGrounding: !settings.searchGrounding })}
                className={`w-10 h-5 rounded-full p-0.5 transition-all flex items-center ${settings.searchGrounding ? 'bg-[#D4AF37]' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.searchGrounding ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
            <button 
              onClick={onLogout}
              className="w-full py-4 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all uppercase tracking-widest text-xs font-bold"
            >
              Terminate Identity Session
            </button>
            <button 
              onClick={onClose}
              className="w-full py-5 bg-[#D4AF37] text-black font-bold rounded-2xl uppercase tracking-widest text-xs shadow-lg"
            >
              Update Core
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;
