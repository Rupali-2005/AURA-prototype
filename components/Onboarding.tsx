
import React, { useState } from 'react';
import { UserProfile, Skill, ProficiencyLevel } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const COMMON_SKILLS = [
  'UI Design', 'Frontend Development', 'React', 'TypeScript', 'Node.js', 
  'Python', 'Data Visualization', 'Product Management', 'UX Research', 
  'Graphic Design', 'Machine Learning', 'Public Speaking', 'System Design',
  'Software Engineering', 'Data Science', 'Marketing', 'Finance', 'Psychology',
  'Mechanical Engineering', 'Biomedical Science', 'Architecture', 'Creative Writing',
  'Cyber Security', 'Cloud Computing', 'Blockchain Development', 'Game Design'
].sort();

const CAREER_GOALS = [
  'Design', 'Engineering', 'Business', 'Arts', 'Science', 'Writing', 
  'Medicine', 'Law', 'Research', 'Entrepreneurship'
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    isNewUser: true,
    goals: [],
    skills: [],
    // Added missing targetRole to satisfy UserProfile interface
    targetRole: '',
    weeklyFocus: '',
    nextStep: '',
    checklist: [],
    events: []
  });

  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel>('Beginner');

  const addSkill = () => {
    if (!selectedSkill) return;
    const scores: Record<ProficiencyLevel, number> = { Beginner: 25, Intermediate: 60, Advanced: 90 };
    const newSkill: Skill = { 
      name: selectedSkill, 
      level: selectedLevel, 
      score: scores[selectedLevel],
      resources: [] 
    };
    
    if (!profile.skills.find(s => s.name === selectedSkill)) {
      setProfile(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    }
    setSelectedSkill('');
  };

  const removeSkill = (name: string) => {
    setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s.name !== name) }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen flex items-center justify-start p-12 md:p-24 overflow-y-auto w-full">
      <div className="max-w-2xl w-full bg-black/30 backdrop-blur-xl border border-[#D4AF37]/10 rounded-3xl p-10 md:p-16 shadow-2xl space-y-12">
        
        {/* Progress Indicator */}
        <div className="flex gap-2">
           {[1, 2, 3, 4].map(i => (
             <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />
           ))}
        </div>

        {step === 1 && (
          <div className="space-y-10 animate-fade-in text-left">
            <header className="space-y-4">
              <h2 className="text-4xl font-light text-slate-100">Initialize Identity.</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Lyra functions best when we speak with mutual respect. <br/>How shall I address you?
              </p>
            </header>
            <form onSubmit={(e) => { e.preventDefault(); if(profile.name) nextStep(); }}>
              <input 
                type="text" 
                placeholder="Your name"
                autoFocus
                className="w-full bg-transparent border-b border-[#D4AF37]/30 py-6 text-3xl outline-none focus:border-[#D4AF37] transition-all font-light text-white placeholder:text-slate-700"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
              />
            </form>
            <button 
              disabled={!profile.name}
              onClick={nextStep}
              className="px-12 py-4 bg-[#D4AF37] text-black font-bold rounded-xl disabled:opacity-30 transition-all hover:bg-[#E6C87A] uppercase tracking-widest text-xs"
            >
              Begin Journey
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-fade-in text-left">
            <header className="space-y-4">
              <h2 className="text-4xl font-light text-slate-100">Directional Focus.</h2>
              <p className="text-slate-400 text-lg">
                Identify your primary cognitive goals, {profile.name}.
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CAREER_GOALS.map(goal => (
                <button 
                  key={goal}
                  onClick={() => {
                    const exists = profile.goals.includes(goal);
                    setProfile({
                      ...profile, 
                      goals: exists ? profile.goals.filter(g => g !== goal) : [...profile.goals, goal],
                      // Update target role based on first goal selected if empty
                      targetRole: profile.targetRole || (exists ? '' : `${goal} Specialist`)
                    });
                  }}
                  className={`py-4 px-6 text-left rounded-xl border transition-all ${profile.goals.includes(goal) ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/20'}`}
                >
                  {goal}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
               <button onClick={prevStep} className="px-6 py-4 text-slate-500 uppercase text-xs tracking-widest">Back</button>
               <button 
                disabled={profile.goals.length === 0}
                onClick={nextStep}
                className="px-12 py-4 bg-[#D4AF37] text-black font-bold rounded-xl transition-all hover:bg-[#E6C87A] uppercase tracking-widest text-xs"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-fade-in text-left">
            <header className="space-y-4">
              <h2 className="text-4xl font-light text-slate-100">Topology Mapping.</h2>
              <p className="text-slate-400">Map your existing proficiencies for Lyra's synthesis.</p>
            </header>
            
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Search Skill Nodes</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#D4AF37]/50 appearance-none cursor-pointer"
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                    >
                      <option value="">Select a skill...</option>
                      {COMMON_SKILLS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedSkill && (
                  <div className="space-y-4 animate-fade-in">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Calibration Level</label>
                    <div className="flex gap-2">
                      {(['Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
                        <button 
                          key={level}
                          onClick={() => setSelectedLevel(level)}
                          className={`flex-1 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${selectedLevel === level ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/5 text-slate-500 bg-white/5'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={addSkill}
                      className="w-full py-4 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded-xl hover:bg-[#D4AF37]/30 text-xs font-bold uppercase tracking-widest transition-all"
                    >
                      + Add to Mapping
                    </button>
                  </div>
                )}
              </div>

              {/* Real-time feedback for entered skills */}
              <div className="space-y-3">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active Mapping ({profile.skills.length})</p>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {profile.skills.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 bg-[#D4AF37]/10 px-4 py-2 rounded-xl border border-[#D4AF37]/20 group animate-fade-in">
                      <div className="flex flex-col">
                        <span className="text-xs text-white font-medium">{s.name}</span>
                        <span className="text-[9px] text-[#D4AF37] uppercase tracking-tighter">{s.level}</span>
                      </div>
                      <button onClick={() => removeSkill(s.name)} className="text-slate-600 hover:text-red-500 p-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  {profile.skills.length === 0 && <p className="text-slate-600 text-xs italic">No nodes defined yet.</p>}
                </div>
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button onClick={prevStep} className="px-6 py-4 text-slate-500 uppercase text-xs tracking-widest">Back</button>
              <button 
                disabled={profile.skills.length === 0}
                onClick={nextStep}
                className="flex-1 py-4 bg-[#D4AF37] text-black font-bold rounded-xl transition-all hover:bg-[#E6C87A] uppercase tracking-widest text-xs"
              >
                Review Alignment
              </button>
            </div>
          </div>
        )}

        {/* New Review Step */}
        {step === 4 && (
          <div className="space-y-10 animate-fade-in text-left">
            <header className="space-y-4">
              <h2 className="text-4xl font-light text-slate-100">Final Alignment.</h2>
              <p className="text-slate-400">Review your topology before Lyra initializes the dashboard.</p>
            </header>

            <div className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/5">
              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Identity</p>
                <p className="text-xl text-white font-light">{profile.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Directions</p>
                <p className="text-sm text-[#E6C87A] italic">{profile.goals.join(' • ')}</p>
              </div>
              <div className="space-y-3 pt-4 border-t border-white/5">
                 <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Mapped Topology Nodes</p>
                 <div className="grid grid-cols-2 gap-3">
                   {profile.skills.map((s, i) => (
                     <div key={i} className="bg-black/20 p-3 rounded-xl border border-white/5">
                        <p className="text-xs text-white font-medium">{s.name}</p>
                        <p className="text-[9px] text-[#D4AF37] uppercase">{s.level}</p>
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button onClick={prevStep} className="px-6 py-4 text-slate-500 uppercase text-xs tracking-widest">Edit</button>
              <button 
                onClick={() => onComplete({
                  ...profile,
                  isNewUser: true,
                  weeklyFocus: `Synthesizing ${profile.skills[0].name} foundations`,
                  nextStep: 'Lyra is preparing your multidimensional growth report.',
                  checklist: [
                    // Added missing type and priority to satisfy Task interface
                    { id: '1', label: 'Identity Verified', completed: true, type: 'Task', priority: 'High' },
                    { id: '2', label: 'Career Alignment Mapped', completed: true, type: 'Task', priority: 'High' },
                    { id: '3', label: 'Topology Nodes Initialized', completed: true, type: 'Task', priority: 'High' },
                    { id: '4', label: 'Lyra Sync Complete', completed: false, type: 'Task', priority: 'High' }
                  ]
                })}
                className="flex-1 py-5 bg-[#D4AF37] text-black font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
              >
                Initialize Dashboard
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Onboarding;
