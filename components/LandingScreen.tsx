
import React, { useState, useEffect } from 'react';

interface LandingScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

type Stage = 'WELCOME' | 'AUTH';
type AuthMode = 'SIGNUP' | 'LOGIN';

const LandingScreen: React.FC<LandingScreenProps> = ({ onSignUp, onLogin }) => {
  const [stage, setStage] = useState<Stage>('WELCOME');
  const [authMode, setAuthMode] = useState<AuthMode>('SIGNUP');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthClick = (mode: AuthMode) => {
    setAuthMode(mode);
    setStage('AUTH');
  };

  const finalizeAuth = () => {
    if (authMode === 'SIGNUP') onSignUp();
    else onLogin();
  };

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center text-center p-6 overflow-hidden">
      {/* Immersive Entry Atmosphere */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-cyan-400/5 blur-[150px] rounded-full animate-slow-float"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] bg-gold-400/5 blur-[150px] rounded-full animate-slow-float-reverse"></div>
      </div>

      <div className={`z-10 transition-all duration-1000 transform ${isInitialized ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {stage === 'WELCOME' ? (
          <div className="flex flex-col items-center">
            <h1 className="aura-logo text-[11rem] md:text-[15rem] text-[#D4AF37] gold-glow leading-none select-none tracking-tighter drop-shadow-2xl">
              Aura
            </h1>
            
            <p className="text-slate-400 tracking-[1em] uppercase text-[10px] md:text-xs mt-2 opacity-0 animate-fade-in-delayed">
              Clarity Over Chaos
            </p>

            <div className="mt-24 flex flex-col md:flex-row gap-6 w-full max-w-md opacity-0 animate-fade-in-delayed-more">
              <button 
                onClick={() => handleAuthClick('SIGNUP')}
                className="group relative flex-1 px-12 py-5 bg-[#D4AF37] text-[#1a1835] font-bold rounded-full hover:bg-[#E6C87A] transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest text-[11px] shadow-2xl"
              >
                <span className="relative z-10">Initialize Identity</span>
                <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button 
                onClick={() => handleAuthClick('LOGIN')}
                className="flex-1 px-12 py-5 border border-[#D4AF37]/30 text-[#D4AF37] font-bold rounded-full hover:bg-[#D4AF37]/10 transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest text-[11px] backdrop-blur-md"
              >
                Sync Session
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg space-y-8 animate-fade-in p-10 bg-black/30 backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-2xl ring-1 ring-white/10">
            {/* Clear distinction between Signup and Login */}
            <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 mx-auto max-w-[240px]">
              <button 
                onClick={() => setAuthMode('SIGNUP')}
                className={`flex-1 py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all ${authMode === 'SIGNUP' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                New Node
              </button>
              <button 
                onClick={() => setAuthMode('LOGIN')}
                className={`flex-1 py-2.5 text-[9px] font-bold uppercase tracking-widest rounded-full transition-all ${authMode === 'LOGIN' ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Returning
              </button>
            </div>

            <header className="space-y-3">
              <h2 className="text-white text-4xl font-light tracking-tight">
                {authMode === 'SIGNUP' ? 'Create Identity' : 'Resume Alignment'}
              </h2>
              <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium">Verify your frequency with Lyra</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
              {/* Social Auth Options */}
              <div className="flex flex-col gap-3">
                <AuthOption icon="google" label="Continue with Google" onClick={finalizeAuth} />
                <div className="grid grid-cols-2 gap-3">
                  <AuthOption icon="github" label="GitHub" onClick={finalizeAuth} />
                  <AuthOption icon="linkedin" label="LinkedIn" onClick={finalizeAuth} />
                </div>
              </div>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center"><span className="bg-[#1a1835] px-4 text-[9px] uppercase tracking-widest text-slate-600">or direct entry</span></div>
              </div>

              {/* Email Entry */}
              <div className="space-y-4">
                 <input 
                  type="email" 
                  placeholder="identity@aura.net" 
                  className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-5 text-sm text-white outline-none focus:border-[#D4AF37]/40 placeholder:text-slate-700 transition-all" 
                />
                <button 
                  onClick={finalizeAuth}
                  className="w-full py-5 bg-white/5 border border-white/10 text-[#D4AF37] font-bold rounded-full hover:bg-[#D4AF37] hover:text-black transition-all uppercase tracking-widest text-[10px] shadow-sm"
                >
                  {authMode === 'SIGNUP' ? 'Initialize Network' : 'Sync Profile'}
                </button>
              </div>
            </div>

            <button 
              onClick={() => setStage('WELCOME')}
              className="text-slate-600 hover:text-[#D4AF37] text-[10px] uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto pt-2"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Return to Core
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in-delayed {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 0.6; transform: translateY(0); }
        }
        @keyframes fade-in-delayed-more {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slow-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        @keyframes slow-float-reverse {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        .animate-fade-in-delayed { animation: fade-in-delayed 1.5s ease-out 1.2s forwards; }
        .animate-fade-in-delayed-more { animation: fade-in-delayed-more 1.5s ease-out 1.8s forwards; }
        .animate-slow-float { animation: slow-float 20s ease-in-out infinite; }
        .animate-slow-float-reverse { animation: slow-float-reverse 24s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

const AuthOption: React.FC<{ icon: 'google' | 'github' | 'linkedin', label: string, onClick: () => void }> = ({ icon, label, onClick }) => {
  const icons = {
    google: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.91 3.22-1.91 4.21-1.27 1.27-3.23 2.65-6.93 2.65-5.6 0-10.03-4.52-10.03-10.12s4.43-10.12 10.03-10.12c3.12 0 5.4 1.23 7.07 2.81l2.31-2.31c-2.3-2.14-5.35-3.5-9.38-3.5-7.31 0-13.39 5.92-13.39 13.24s6.08 13.24 13.39 13.24c4.01 0 7.07-1.33 9.49-3.86 2.49-2.5 3.24-6.03 3.24-8.87 0-.85-.07-1.65-.2-2.36h-12.48z"/></svg>,
    github: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
    linkedin: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
  };

  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-center gap-3 py-3.5 px-6 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-[#D4AF37]/40 transition-all active:scale-[0.98] group"
    >
      <span className="text-slate-400 group-hover:text-white transition-colors">{icons[icon]}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{label}</span>
    </button>
  );
};

export default LandingScreen;
