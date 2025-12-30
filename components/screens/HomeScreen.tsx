
import React, { useState, useEffect } from 'react';
import { UserProfile, Task, CalendarEvent } from '../../types';
import { GoogleGenAI } from '@google/genai';
import SkillMap from '../SkillMap';

interface HomeScreenProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ profile, updateProfile }) => {
  const [insight, setInsight] = useState("Analyzing professional resonance...");

  useEffect(() => {
    const fetchAlignment = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const res = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Analyze alignment for ${profile.name} targeting ${profile.targetRole} based on skills: ${JSON.stringify(profile.skills)}. 
          Provide a highly condensed summary of exactly 1-2 sentences. 1 strength and 1 gap. Tone: Professional mentor.`,
        });
        setInsight(res.text || "Alignment data currently syncing.");
      } catch (e) { console.error(e); }
    };
    if (profile.skills.length > 0) fetchAlignment();
  }, [profile.skills, profile.targetRole, profile.name]);

  return (
    <div className="animate-fade-in space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="text-[#D4AF37] tracking-[0.4em] text-[10px] uppercase mb-2 font-bold">Resonance Level 01</p>
          <h1 className="text-6xl font-light text-white leading-tight tracking-tight">
            Status, <br/>
            <span className="text-[#E6C87A] italic">{profile.name || 'Identity'}</span>.
          </h1>
        </div>
      </header>

      {/* Alignment Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-black/40 border border-[#D4AF37]/20 p-12 rounded-[4rem] flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden group">
           <div className="w-full max-w-[280px] aspect-square flex items-center justify-center relative scale-90 md:scale-100 transition-transform hover:scale-105 duration-700">
              <SkillMap skills={profile.skills} />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent pointer-events-none rounded-full"></div>
           </div>
           <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-1">Target Role Alignment</h3>
                <p className="text-3xl text-white font-light">{profile.targetRole}</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] relative">
                <p className="text-sm text-slate-300 font-light italic leading-relaxed">{insight}</p>
              </div>
              <div className="flex items-center gap-4">
                 <div className="max-w-[160px] flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]" style={{ width: '65%' }}></div>
                 </div>
                 <span className="text-[10px] text-[#D4AF37] font-bold">65% Aligned</span>
              </div>
           </div>
        </div>

        {/* Focus Node - Minimal focus bars */}
        <div className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-6 flex flex-col justify-between shadow-xl">
           <div>
             <h4 className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-4">Current Focus</h4>
             <p className="text-2xl font-light text-white leading-tight truncate">{profile.weeklyFocus}</p>
           </div>
           <div className="space-y-4">
              <p className="text-[10px] text-slate-600 uppercase tracking-widest">Next Milestone</p>
              <p className="text-xs text-slate-400 font-light leading-relaxed truncate">{profile.nextStep}</p>
              <button className="w-full py-4 bg-[#D4AF37] text-black font-bold rounded-2xl text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg active:scale-95">Execute Task</button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Execution Log */}
        <div className="p-10 bg-white/5 border border-white/5 rounded-[3rem] space-y-8 shadow-lg">
          <h3 className="text-xl font-light text-white flex items-center gap-3">
             <span className="text-[#D4AF37]"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></span>
             Execution Log
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
            {profile.checklist.map(t => (
              <div key={t.id} className="flex items-center justify-between p-5 bg-black/20 border border-white/5 rounded-2xl group hover:border-[#D4AF37]/30 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                   <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${t.completed ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'border-white/20'}`}>
                      {t.completed && <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                   </div>
                   <span className={`text-sm font-light transition-colors ${t.completed ? 'text-slate-600 line-through' : 'text-slate-300'}`}>{t.label}</span>
                </div>
                <span className={`text-[9px] uppercase font-bold tracking-widest ${t.priority === 'High' ? 'text-red-400' : 'text-[#D4AF37]'}`}>{t.priority}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Identity Nodes */}
        <div className="p-10 bg-white/5 border border-white/5 rounded-[3rem] space-y-8 shadow-lg">
           <h3 className="text-xl font-light text-white flex items-center gap-3">
             <span className="text-[#D4AF37]"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.082.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg></span>
             Identity Nodes
           </h3>
           <div className="grid grid-cols-2 gap-4">
              {profile.skills.slice(0, 4).map((s, i) => (
                <div key={i} className="p-5 bg-black/30 border border-white/5 rounded-2xl hover:border-[#D4AF37]/20 transition-all duration-500">
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{s.name}</p>
                   <p className="text-lg text-white font-light">{s.score}%</p>
                </div>
              ))}
           </div>
           <button onClick={() => updateProfile({ skills: [...profile.skills] })} className="w-full py-4 border border-white/5 text-slate-500 hover:text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-white/5 active:scale-95">Expand Topology →</button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
