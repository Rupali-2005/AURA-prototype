
import React, { useState, useMemo } from 'react';
import { UserProfile, Skill, ProficiencyLevel } from '../../types';

interface SkillsScreenProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const SkillsScreen: React.FC<SkillsScreenProps> = ({ profile, updateProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'All' | ProficiencyLevel>('All');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const filteredSkills = useMemo(() => {
    return profile.skills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = levelFilter === 'All' || skill.level === levelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [profile.skills, searchTerm, levelFilter]);

  const getNextLevelInfo = (score: number, currentLevel: ProficiencyLevel) => {
    if (currentLevel === 'Advanced' && score >= 90) return { next: 'Mastery', remaining: 0, percentToNext: 100 };
    
    let next: string = 'Intermediate';
    let target = 34;
    let base = 0;

    if (score >= 67) {
      next = 'Advanced (Peak)';
      target = 100;
      base = 67;
    } else if (score >= 34) {
      next = 'Advanced';
      target = 67;
      base = 34;
    } else {
      next = 'Intermediate';
      target = 34;
      base = 0;
    }

    const range = target - base;
    const progressInLevel = score - base;
    const percentToNext = Math.min(100, Math.max(0, (progressInLevel / range) * 100));
    
    return { next, remaining: Math.max(0, target - score), percentToNext };
  };

  return (
    <div className="animate-fade-in space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-light text-white">Skill Inventory</h2>
          <p className="text-slate-400 mt-2">A comprehensive list of your mapped proficiencies.</p>
        </div>
        <button className="px-6 py-2 border border-[#D4AF37]/50 text-[#D4AF37] rounded-full text-sm hover:bg-[#D4AF37]/10 transition-colors uppercase font-bold tracking-widest text-xs">
          Map new skill
        </button>
      </header>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="Search skills..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-[#D4AF37]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(l => (
            <button 
              key={l}
              onClick={() => setLevelFilter(l)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${levelFilter === l ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-slate-400 border border-white/5'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill) => (
            <div key={skill.name} className="p-6 bg-white/5 border border-white/10 rounded-2xl group hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-lg font-medium text-white group-hover:text-[#D4AF37] transition-colors">{skill.name}</h4>
                  <span className="text-[10px] px-2 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-bold uppercase tracking-widest">{skill.level}</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Proficiency Score</span>
                    <span className="text-slate-300 font-bold">{skill.score}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#D4AF37]/5 to-[#D4AF37]" 
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedSkill(skill)}
                className="w-full mt-8 py-2 rounded-lg text-xs border border-white/5 hover:bg-white/5 text-slate-400 transition-all uppercase tracking-widest font-bold"
              >
                Open Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <p className="text-slate-500 italic">No skills found matching your filters.</p>
        </div>
      )}

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-[#0c0a1a]/90 backdrop-blur-xl" onClick={() => setSelectedSkill(null)} />
          <div className="relative w-full max-w-2xl bg-[#1a1333] border border-[#D4AF37]/20 rounded-[2.5rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-between items-start mb-10">
              <div>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.3em] mb-2 block">Skill Intelligence</span>
                <h3 className="text-4xl font-light text-white">{selectedSkill.name}</h3>
              </div>
              <button onClick={() => setSelectedSkill(null)} className="p-3 hover:bg-white/5 rounded-full text-slate-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-8">
                {/* Advanced Progress Visualization */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-1">Global Standing</h4>
                      <p className="text-4xl font-light text-[#D4AF37]">{selectedSkill.score}%</p>
                    </div>
                    <div className="text-right">
                      <h4 className="text-xs text-slate-500 uppercase tracking-widest mb-1">Status</h4>
                      <p className="text-sm text-slate-300 font-bold uppercase tracking-widest">{selectedSkill.level}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest">
                      <span>Tier Progress</span>
                      <span className="text-[#E6C87A]">To {getNextLevelInfo(selectedSkill.score, selectedSkill.level).next}</span>
                    </div>
                    
                    {/* Segmented Progress Bar */}
                    <div className="flex gap-1 h-3">
                      {[1, 2, 3].map((segment) => {
                        let fill = 0;
                        const score = selectedSkill.score;
                        if (segment === 1) fill = Math.min(100, (score / 33) * 100);
                        else if (segment === 2) fill = score > 33 ? Math.min(100, ((score - 33) / 33) * 100) : 0;
                        else if (segment === 3) fill = score > 66 ? Math.min(100, ((score - 66) / 33) * 100) : 0;
                        return (
                          <div key={segment} className="flex-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#D4AF37]" style={{ width: `${fill}%` }} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Resource Mapping */}
                <div className="space-y-4">
                   <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Recommended Nodes</h4>
                   <div className="space-y-2">
                      {selectedSkill.resources?.map((r, i) => (
                        <a key={i} href={r.url} className="block p-4 bg-white/5 border border-white/5 rounded-xl hover:border-[#D4AF37]/30 transition-all group">
                           <div className="flex justify-between items-center mb-1">
                             <span className="text-[9px] text-[#D4AF37] uppercase font-bold tracking-widest">{r.type}</span>
                           </div>
                           <p className="text-sm text-white font-medium group-hover:text-[#D4AF37] transition-colors">{r.title}</p>
                        </a>
                      ))}
                      {!selectedSkill.resources?.length && <p className="text-xs text-slate-600 italic">No nodes identified for this level yet.</p>}
                   </div>
                </div>
              </div>

              <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5 space-y-6">
                 <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Topology Insight</h4>
                 <p className="text-sm text-slate-300 font-light leading-relaxed italic">
                   Current calibration suggests a strong foundation in {selectedSkill.name}. 
                   To achieve the next resonance tier ({getNextLevelInfo(selectedSkill.score, selectedSkill.level).next}), focus on specialized architectural patterns and peer synthesis.
                 </p>
                 <div className="pt-6 border-t border-white/5">
                   <button 
                    onClick={() => {
                      const newScore = Math.min(100, selectedSkill.score + 5);
                      const newLevel: ProficiencyLevel = newScore > 66 ? 'Advanced' : newScore > 33 ? 'Intermediate' : 'Beginner';
                      updateProfile({
                        skills: profile.skills.map(s => s.name === selectedSkill.name ? { ...s, score: newScore, level: newLevel } : s)
                      });
                      setSelectedSkill({ ...selectedSkill, score: newScore, level: newLevel });
                    }}
                    className="w-full py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37]/20 transition-all"
                   >
                     Synthesize Progress (+5%)
                   </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsScreen;
