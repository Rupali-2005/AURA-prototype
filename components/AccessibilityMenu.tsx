
import React from 'react';
import { AppSettings } from '../types';

interface AccessibilityMenuProps {
  isOpen: boolean;
  settings: AppSettings;
  onClose: () => void;
  onUpdate: (s: Partial<AppSettings>) => void;
}

const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ isOpen, settings, onClose, onUpdate }) => {
  if (!isOpen) return null;

  const handleToggle = (key: keyof AppSettings, value: any) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="fixed inset-0 z-[170] overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-auto"
        onClick={onClose}
      />
      
      <div className="absolute top-24 right-6 w-72 bg-[#1a1333] border border-[#D4AF37]/40 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-6 space-y-5 animate-pop-in pointer-events-auto">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <h2 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider">Sensory Tuning</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-full text-slate-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <AccessibilityToggle 
            label="High Contrast" 
            checked={settings.highContrast} 
            onChange={(v) => handleToggle('highContrast', v)} 
          />
          <AccessibilityToggle 
            label="Larger Text" 
            checked={settings.largerText} 
            onChange={(v) => handleToggle('largerText', v)} 
          />
          <AccessibilityToggle 
            label="Voice Guidance" 
            checked={settings.voiceGuidance} 
            onChange={(v) => handleToggle('voiceGuidance', v)} 
          />
          <AccessibilityToggle 
            label="Persistent Voice (Pinned)" 
            checked={settings.voicePinned} 
            onChange={(v) => handleToggle('voicePinned', v)} 
          />
          <AccessibilityToggle 
            label="Visual Captions" 
            checked={settings.showCaptions} 
            onChange={(v) => handleToggle('showCaptions', v)} 
          />
          <AccessibilityToggle 
            label="Conversation Log" 
            checked={settings.showTranscript} 
            onChange={(v) => handleToggle('showTranscript', v)} 
          />
          <AccessibilityToggle 
            label="Night Vision" 
            checked={settings.nightVision} 
            onChange={(v) => handleToggle('nightVision', v)} 
          />
        </div>

        <div className="pt-2 text-[9px] text-slate-500 text-center italic">
          Independently controlled sensory options
        </div>
      </div>

      <style>{`
        @keyframes pop-in {
          from { transform: scale(0.95) translateY(-10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-pop-in {
          animation: pop-in 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const AccessibilityToggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between group cursor-pointer" onClick={() => onChange(!checked)}>
    <span className={`text-xs font-medium transition-colors ${checked ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
      {label}
    </span>
    <div className={`w-8 h-4 rounded-full p-0.5 transition-all flex items-center ${checked ? 'bg-[#D4AF37]' : 'bg-white/10'}`}>
      <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  </div>
);

export default AccessibilityMenu;
