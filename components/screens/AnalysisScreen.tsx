
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import SkillMap from '../SkillMap';
import { GoogleGenAI } from '@google/genai';

interface AnalysisScreenProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({ profile, updateProfile }) => {
  const hasSkills = profile.skills.length > 0;
  const [insight, setInsight] = useState<string>("Analyzing current trajectory...");

  useEffect(() => {
    if (!hasSkills) {
      setInsight("Observation: No skill nodes have been initialized.\nImpact: A growth trajectory cannot be synthesized without baseline data.\nNext Step: Map at least three core proficiencies to activate analysis.");
      return;
    }

    const generateInsight = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const result = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `Synthesize a grounded career analysis for ${profile.name}. 
          Profile: ${JSON.stringify(profile)}
          
          MANDATORY STRUCTURE:
          1. Observation: [What is evident from the data]
          2. Impact: [Why this matters in their career context]
          3. Next Step: [One concrete, realistic action]
          
          TONE: Senior career mentor. Grounded, precise, neutral. No destiny language.`,
          config: {
            thinkingConfig: { thinkingBudget: 16000 },
            systemInstruction: "You are Lyra, a senior career mentor. Use grounded, precise language without raw markdown symbols."
          }
        });
        setInsight(result.text || "Alignment data currently stabilizing.");
      } catch (e) {
        console.error(e);
      }
    };
    generateInsight();
  }, [profile, hasSkills]);

  return (
    <div className="animate-fade-in space-y-12">
      <header>
        <h2 className="text-3xl font-light text-white">Topology Synthesis</h2>
        <p className="text-slate-400 mt-2">Analytical grounding and visualization of your current trajectory.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="bg-black/30 p-12 rounded-[3rem] border border-[#D4AF37]/20 flex justify-center shadow-inner relative overflow-hidden group">
          {hasSkills ? (
            <SkillMap skills={profile.skills} />
          ) : (
            <div className="h-[320px] w-[320px] flex flex-col items-center justify-center text-center p-8">
               <div className="w-16 h-16 rounded-full border border-dashed border-[#D4AF37]/40 flex items-center justify-center mb-4 animate-slow-breath">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
               </div>
               <p className="text-xs text-slate-500 uppercase tracking-widest leading-relaxed">Topology Inactive.<br/>Initialize mapping to begin.</p>
            </div>
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent pointer-events-none" />
            <h3 className="text-[#D4AF37] font-medium mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Lyra Mentorship Sync
            </h3>
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap font-light">
              {insight.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('1. Observation') || trimmed.startsWith('2. Impact') || trimmed.startsWith('3. Next Step')) {
                   return <p key={i} className="mt-4 first:mt-0 mb-2 text-[#D4AF37] font-semibold text-xs uppercase tracking-widest">{trimmed}</p>;
                }
                return <p key={i} className="mb-2 last:mb-0">{line}</p>;
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Alignment Strategy</h4>
            <div className={`p-6 border rounded-2xl flex items-center justify-between transition-all ${hasSkills ? 'border-[#D4AF37]/30 bg-[#D4AF37]/5' : 'border-white/5 bg-white/5 opacity-50'}`}>
              <div>
                <p className="text-white font-medium">{hasSkills ? 'Execute Next Action' : 'Synthesis Pending'}</p>
                <p className="text-xs text-slate-400">{hasSkills ? 'Begin the next step outlined in your synthesis.' : 'Provide identity data to unlock.'}</p>
              </div>
              <button 
                disabled={!hasSkills}
                className={`px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-widest ${hasSkills ? 'bg-[#D4AF37] text-black hover:bg-[#E6C87A]' : 'bg-white/10 text-slate-500 cursor-not-allowed'}`}
              >
                Log Sync
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisScreen;
