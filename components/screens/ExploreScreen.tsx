
import React, { useState, useMemo } from 'react';
import { UserProfile, ExploreFilter } from '../../types';

interface ExploreItem {
  id: number;
  title: string;
  org: string;
  type: 'Course' | 'Internship' | 'Event';
  cost: 'Free' | 'Paid';
  duration: 'Short' | 'Medium' | 'Long';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  img: string;
  recommended?: boolean;
}

const EXPLORE_DATA: ExploreItem[] = [
  { id: 1, title: 'The Future of Systems Design', org: 'Stanford Online', type: 'Course', cost: 'Paid', duration: 'Long', level: 'Advanced', tags: ['High Match', 'Advanced', 'Technical'], img: 'bg-indigo-900/40', recommended: true },
  { id: 2, title: 'Junior UX Architect', org: 'Aura Labs', type: 'Internship', cost: 'Paid', duration: 'Long', level: 'Intermediate', tags: ['Career Shift', 'Design Tool', 'Technical'], img: 'bg-cyan-900/40', recommended: true },
  { id: 3, title: 'Responsive Foundations', org: 'Frontend Masters', type: 'Course', cost: 'Paid', duration: 'Medium', level: 'Beginner', tags: ['Foundation', 'Technical'], img: 'bg-violet-900/40', recommended: true },
  { id: 4, title: 'Design Ethics Workshop', org: 'Local Chapter', type: 'Event', cost: 'Free', duration: 'Short', level: 'Beginner', tags: ['Community', 'Strategy'], img: 'bg-emerald-900/40' },
  { id: 5, title: 'Node.js Performance', org: 'Deep Dive', type: 'Course', cost: 'Paid', duration: 'Medium', level: 'Advanced', tags: ['Technical'], img: 'bg-red-900/40' },
  { id: 6, title: 'Intro to Product Strategy', org: 'Mind the Product', type: 'Course', cost: 'Free', duration: 'Short', level: 'Beginner', tags: ['Strategy', 'Foundation'], img: 'bg-amber-900/40' },
  { id: 7, title: 'Figma for Advanced Users', org: 'Figma', type: 'Course', cost: 'Free', duration: 'Medium', level: 'Advanced', tags: ['Design Tool', 'Technical'], img: 'bg-pink-900/40' },
  { id: 8, title: 'Sustainability in Tech', org: 'GreenTech', type: 'Internship', cost: 'Paid', duration: 'Long', level: 'Beginner', tags: ['Impact', 'Community'], img: 'bg-teal-900/40' },
];

interface ExploreScreenProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const ExploreScreen: React.FC<ExploreScreenProps> = ({ profile, updateProfile }) => {
  const [filters, setFilters] = useState<ExploreFilter>({
    cost: 'All',
    duration: 'All',
    level: 'All'
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Derived unique tags from dataset
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    EXPLORE_DATA.forEach(item => item.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredItems = useMemo(() => {
    return EXPLORE_DATA.filter(item => {
      const matchCost = filters.cost === 'All' || item.cost === filters.cost;
      const matchDuration = filters.duration === 'All' || item.duration === filters.duration;
      const matchLevel = filters.level === 'All' || item.level === filters.level;
      const matchTags = selectedTags.length === 0 || selectedTags.some(t => item.tags.includes(t));
      return matchCost && matchDuration && matchLevel && matchTags;
    });
  }, [filters, selectedTags]);

  const topRecommendations = useMemo(() => {
    return EXPLORE_DATA.filter(item => item.recommended).slice(0, 3);
  }, []);

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-light text-white">Opportunities</h2>
          <p className="text-slate-400 mt-2">Curated pathways based on your current trajectory.</p>
        </div>
      </header>

      {/* Recommendations Banner */}
      <section className="space-y-4">
        <h3 className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.3em]">Lyra's Top Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topRecommendations.map((item) => (
            <div key={item.id} className="relative group p-6 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all cursor-pointer overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                 <svg className="w-12 h-12 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
               </div>
               <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">{item.type}</span>
               <h4 className="text-white font-medium mt-2 leading-snug">{item.title}</h4>
               <p className="text-slate-400 text-xs mt-1">{item.org}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filters Container */}
      <section className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-8">
        <div className="flex flex-wrap gap-8 items-start">
          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Cost</label>
            <div className="flex gap-2">
              {(['All', 'Free', 'Paid'] as const).map(c => (
                <button 
                  key={c}
                  onClick={() => setFilters(prev => ({ ...prev, cost: c }))}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all ${filters.cost === c ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-slate-400 border border-white/5'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Duration</label>
            <div className="flex gap-2">
              {(['All', 'Short', 'Medium', 'Long'] as const).map(d => (
                <button 
                  key={d}
                  onClick={() => setFilters(prev => ({ ...prev, duration: d }))}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all ${filters.duration === d ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-slate-400 border border-white/5'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Level</label>
            <div className="flex gap-2">
              {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map(l => (
                <button 
                  key={l}
                  onClick={() => setFilters(prev => ({ ...prev, level: l }))}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all ${filters.level === l ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-slate-400 border border-white/5'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tags Multi-select */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Refine by Tags</label>
            {selectedTags.length > 0 && (
              <button 
                onClick={() => setSelectedTags([])} 
                className="text-[9px] text-[#D4AF37] uppercase font-bold tracking-widest hover:underline"
              >
                Clear all tags
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                  selectedTags.includes(tag) 
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                    : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/20'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="group overflow-hidden rounded-3xl border border-white/5 bg-white/5 hover:border-[#D4AF37]/30 transition-all cursor-pointer flex flex-col sm:flex-row h-full">
              <div className={`w-full sm:w-40 h-40 sm:h-auto ${item.img} flex items-center justify-center`}>
                <div className="aura-logo text-white/20 text-4xl group-hover:scale-125 transition-transform">A</div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map(t => (
                      <span key={t} className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        selectedTags.includes(t) ? 'bg-[#D4AF37]/30 text-white' : 'bg-white/10 text-slate-300'
                      }`}>
                        {t}
                      </span>
                    ))}
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] uppercase font-bold">{item.cost}</span>
                  </div>
                  <h4 className="text-white font-medium text-lg leading-snug group-hover:text-[#D4AF37] transition-colors">{item.title}</h4>
                  <p className="text-slate-500 text-sm mt-1">{item.org}</p>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#E6C87A] font-bold uppercase tracking-widest">{item.type}</span>
                    <span className="text-[9px] text-slate-500 uppercase">{item.duration} Duration</span>
                  </div>
                  <button className="text-xs uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Apply Guidance →</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-500 italic">
            No opportunities match your current criteria. Try adjusting your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreScreen;
