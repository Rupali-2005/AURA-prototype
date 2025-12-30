
import React from 'react';
import { UserProfile } from '../types';
import SkillMap from './SkillMap';

interface DashboardProps {
  profile: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ profile }) => {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-32 space-y-12 animate-fade-in">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[#D4AF37] tracking-widest text-sm uppercase mb-2">Welcome Back</p>
          <h1 className="text-5xl font-light text-white">{profile.name}</h1>
        </div>
        <div className="bg-black/20 backdrop-blur-md border border-[#D4AF37]/20 p-4 rounded-xl max-w-sm">
          <p className="text-xs text-slate-500 uppercase tracking-tighter mb-1">Weekly Focus</p>
          <p className="text-[#E6C87A] font-medium">{profile.weeklyFocus}</p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Skill Map & Snapshot */}
        <section className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-light mb-8 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              Skill Topology
            </h3>
            <div className="h-[400px] flex items-center justify-center">
              <SkillMap skills={profile.skills} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <p className="text-sm text-slate-500 mb-4">Strongest Skills</p>
              <div className="space-y-3">
                {profile.skills.filter(s => s.score >= 70).map(s => (
                  <div key={s.name} className="flex justify-between items-center">
                    <span className="text-slate-200">{s.name}</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-3 h-1 rounded-full ${i <= (s.score / 20) ? 'bg-[#D4AF37]' : 'bg-white/10'}`}></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <p className="text-sm text-slate-500 mb-4">Areas for Growth</p>
              <div className="space-y-3">
                {profile.skills.filter(s => s.score < 70).map(s => (
                  <div key={s.name} className="flex justify-between items-center">
                    <span className="text-slate-200">{s.name}</span>
                    <span className="text-xs text-[#E6C87A]">{s.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar: Recommendations & Next Steps */}
        <aside className="space-y-8">
          <div className="bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-3xl p-8 border border-[#D4AF37]/30">
            <h3 className="text-xl font-light mb-6">Lyra's Recommendation</h3>
            <p className="text-slate-300 leading-relaxed mb-6">
              "Based on your proficiency in <strong>System Thinking</strong>, I suggest exploring <strong>Interaction Design</strong> to bridge the gap between structure and experience."
            </p>
            <button className="w-full py-3 bg-[#D4AF37] text-black font-semibold rounded-xl hover:bg-[#E6C87A] transition-colors">
              Accept Guidance
            </button>
          </div>

          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <h3 className="text-xl font-light mb-6">Explore</h3>
            <div className="space-y-4">
              {[
                { title: 'Advanced React Patterns', type: 'Course', dur: '4h' },
                { title: 'Product Strategy Sync', type: 'Workshop', dur: '2h' },
                { title: 'Visual Hierarchy Lab', type: 'Project', dur: '12h' }
              ].map((item, i) => (
                <div key={i} className="group p-4 rounded-xl border border-white/5 hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[#E6C87A] text-[10px] uppercase font-bold tracking-widest">{item.type}</span>
                    <span className="text-slate-500 text-xs">{item.dur}</span>
                  </div>
                  <h4 className="text-white font-medium group-hover:text-[#D4AF37] transition-colors">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
