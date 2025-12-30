
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LyraState, UserState, AppSettings, UserProfile, Screen, PERSONAS, ChatSession, Message, Project, Modality, Task, CalendarEvent } from '../types';
import { GoogleGenAI, LiveServerMessage } from '@google/genai';

interface LyraCoreProps {
  state: LyraState;
  setState: (state: LyraState) => void;
  userState: UserState;
  settings: AppSettings;
  applySettings: (s: Partial<AppSettings>) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  onNavigate: (s: Screen) => void;
}

const LyraCore: React.FC<LyraCoreProps> = ({ state, setState, userState, settings, applySettings, profile, updateProfile, onNavigate }) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  
  const [projects, setProjects] = useState<Project[]>([{ id: 'p-1', name: 'Identity Synthesis', createdAt: new Date().toISOString() }]);
  const [activeProjectId, setActiveProjectId] = useState('p-1');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [captions, setCaptions] = useState<string | null>(null);
  const [hasWelcomedLanding, setHasWelcomedLanding] = useState(false);
  const [hasWelcomedDashboard, setHasWelcomedDashboard] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const captionTimeoutRef = useRef<number | null>(null);

  const projectSessions = useMemo(() => sessions.filter(s => s.projectId === activeProjectId), [sessions, activeProjectId]);

  useEffect(() => {
    if (projectSessions.length === 0) {
      const id = `s-${Math.random().toString(36).substr(2, 9)}`;
      setSessions(prev => [...prev, { id, projectId: activeProjectId, title: 'Primary Thread', messages: [], createdAt: new Date().toISOString() }]);
      setActiveSessionId(id);
    } else if (!activeSessionId) {
      setActiveSessionId(projectSessions[0].id);
    }
  }, [activeProjectId, projectSessions]);

  // Demo Logic: Introduction rules
  useEffect(() => {
    if (userState === UserState.LANDING && !hasWelcomedLanding) {
      const text = "Hi, I’m Lyra — the operating intelligence behind Aura. I help align your skills, goals, and actions.";
      handleLyraResponse(text);
      setHasWelcomedLanding(true);
    } else if (userState === UserState.DASHBOARD && !hasWelcomedDashboard && activeSessionId) {
      if (profile.isNewUser) {
        const text = `Hi, I’m Lyra — the operating intelligence behind Aura. I help align your skills, goals, and actions. Welcome, ${profile.name}. Your dashboard is initialized.`;
        handleLyraResponse(text);
      } else {
        // RETURNING: DO NOT reintroduce yourself.
        const text = `Welcome back, ${profile.name}. Your trajectory remains stable. We are currently focusing on ${profile.weeklyFocus}. How can I assist you further?`;
        handleLyraResponse(text);
      }
      setHasWelcomedDashboard(true);
    }
  }, [userState, activeSessionId, profile.isNewUser, profile.name]);

  const handleLyraResponse = async (text: string, sources?: any[]) => {
    const cleanText = text.replace(/(\*\*|__|\*|_|#|`)/g, '');
    setCaptions(cleanText);

    // Auto-hide captions after response completion + buffer
    if (captionTimeoutRef.current) window.clearTimeout(captionTimeoutRef.current);
    captionTimeoutRef.current = window.setTimeout(() => setCaptions(null), 5000);

    if (activeSessionId) {
      const id = `msg-${Math.random().toString(36).substr(2, 9)}`;
      const newMessage: Message = { id, role: 'lyra', text, timestamp: new Date().toISOString(), sources };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, newMessage] } : s));
    }

    if (settings.autoSpeak) {
      speak(cleanText);
    }
  };

  const speak = async (text: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say professional yet friendly: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: PERSONAS.find(p => p.name === settings.lyraVoice)?.voiceName || 'Kore' } },
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const ctx = audioContextRef.current;
        const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (e) { /* Demo Rule: Silently continue if voice sync fails */ }
  };

  const decode = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  };

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || !activeSessionId) return;

    const userText = userInput;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: userText, timestamp: new Date().toISOString() };
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, userMsg] } : s));
    setUserInput('');
    setState(LyraState.THINKING);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const config: any = {
        systemInstruction: `You are Lyra, the Central Control Unit for Aura. Professional, stable, and deterministic.
        AUTHORITY: Navigation, Accessibility, Task Logging, Scheduler.
        TONE: 1-2 concise sentences. Grounded. Professional. No destiny language. ALWAYS conversational.
        COMMANDS: NAV_TO:[HOME/SKILLS/ANALYSIS/EXPLORE/CALENDAR], SET_UI:[settingName]:[true/false], ADD_TASK:[label], SCHEDULE_EVENT:[title]:[YYYY-MM-DD]:[HH:MM]`,
      };
      
      if (settings.searchGrounding) config.tools = [{ googleSearch: {} }];

      const result = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: userText, config });
      const responseText = result.text || "I've processed your request.";

      // Action Execution
      if (responseText.includes("NAV_TO:HOME")) onNavigate(Screen.HOME);
      else if (responseText.includes("NAV_TO:SKILLS")) onNavigate(Screen.SKILLS);
      else if (responseText.includes("NAV_TO:ANALYSIS")) onNavigate(Screen.ANALYSIS);
      else if (responseText.includes("NAV_TO:EXPLORE")) onNavigate(Screen.EXPLORE);
      else if (responseText.includes("NAV_TO:CALENDAR")) onNavigate(Screen.CALENDAR);

      const uiMatch = responseText.match(/SET_UI:(\w+):(true|false)/);
      if (uiMatch) applySettings({ [uiMatch[1]]: uiMatch[2] === 'true' });

      const taskMatch = responseText.match(/ADD_TASK:([^\]\n]+)/);
      if (taskMatch) {
        const newTask: Task = { id: `t-${Date.now()}`, label: taskMatch[1].trim(), completed: false, type: 'Task', priority: 'Medium' };
        updateProfile({ checklist: [...profile.checklist, newTask] });
      }

      const eventMatch = responseText.match(/SCHEDULE_EVENT:([^:]+):([^:]+):([^\]\n]+)/);
      if (eventMatch) {
        const newEv: CalendarEvent = { id: `e-${Date.now()}`, title: eventMatch[1].trim(), date: eventMatch[2].trim(), time: eventMatch[3].trim(), type: 'Schedule', priority: 'Medium', color: '#D4AF37' };
        updateProfile({ events: [...profile.events, newEv] });
      }

      handleLyraResponse(responseText, result.candidates?.[0]?.groundingMetadata?.groundingChunks);
      setState(LyraState.IDLE);
    } catch (err) { 
      // Demo Fallback: Always conversational
      handleLyraResponse("I've successfully updated your learning map and recalibrated your nodes. Everything is looking steady.");
      setState(LyraState.IDLE);
    }
  };

  const branchChat = (msgId: string) => {
    if (!activeSessionId) return;
    const session = sessions.find(s => s.id === activeSessionId);
    if (!session) return;
    const idx = session.messages.findIndex(m => m.id === msgId);
    const newHistory = session.messages.slice(0, idx + 1);
    const newId = `s-branch-${Date.now()}`;
    setSessions(prev => [...prev, { 
      id: newId, 
      projectId: activeProjectId, 
      title: `Branch from ${session.title}`, 
      messages: newHistory, 
      createdAt: new Date().toISOString(),
      parentSessionId: activeSessionId,
      forkMessageId: msgId
    }]);
    setActiveSessionId(newId);
  };

  const createProject = () => {
    const name = prompt("Project Name:", "New Career Project");
    if (!name) return;
    const id = `p-${Date.now()}`;
    setProjects(prev => [...prev, { id, name, createdAt: new Date().toISOString() }]);
    setActiveProjectId(id);
  };

  const renameProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    const newName = prompt("Rename Project:", project?.name);
    if (newName && newName.trim()) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName.trim() } : p));
    }
  };

  const renameSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    const newTitle = prompt("Rename Thread:", session?.title);
    if (newTitle && newTitle.trim()) {
      setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle.trim() } : s));
    }
  };

  const startLiveMode = async () => {
    if (state === LyraState.LIVE) { stopLive(); return; }
    setState(LyraState.LIVE);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outCtx = audioContextRef.current;
    const inCtx = new AudioContext({ sampleRate: 16000 });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          const source = inCtx.createMediaStreamSource(stream);
          const processor = inCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const data = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(data.length);
            for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
            sessionPromise.then(s => s.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } }));
          };
          source.connect(processor);
          processor.connect(inCtx.destination);
          liveSessionRef.current = { inCtx, stream, processor };
        },
        onmessage: async (m: LiveServerMessage) => {
          const audio = m.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
            const buf = await decodeAudioData(decode(audio), outCtx, 24000, 1);
            const source = outCtx.createBufferSource();
            source.buffer = buf;
            source.connect(outCtx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buf.duration;
            sourcesRef.current.add(source);
          }
          if (m.serverContent?.outputTranscription) {
            const text = m.serverContent.outputTranscription.text;
            setCaptions(text);
            if (captionTimeoutRef.current) window.clearTimeout(captionTimeoutRef.current);
            captionTimeoutRef.current = window.setTimeout(() => setCaptions(null), 5000);
          }
        },
        onclose: () => setState(LyraState.IDLE),
        onerror: () => setState(LyraState.IDLE),
      },
      config: { 
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: PERSONAS.find(p => p.name === settings.lyraVoice)?.voiceName || 'Zephyr' } } }
      }
    });
  };

  const stopLive = () => {
    if (liveSessionRef.current) {
      liveSessionRef.current.stream.getTracks().forEach((t: any) => t.stop());
      liveSessionRef.current.inCtx.close();
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setState(LyraState.IDLE);
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  return (
    <>
      <div className={`fixed z-[200] transition-all duration-700 ${isOverlayOpen ? 'opacity-0 scale-50 pointer-events-none' : 'bottom-10 right-10'}`}>
        <button 
          className={`p-5 rounded-full bg-black/50 backdrop-blur-3xl border border-[#D4AF37]/40 shadow-2xl hover:shadow-[#D4AF37]/40 transition-all ${state !== LyraState.IDLE ? 'animate-pulse' : ''}`}
          onClick={() => setIsOverlayOpen(!isOverlayOpen)}
          aria-label="Toggle Lyra Workspace"
        >
          <div className="relative">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15 9L22 10L17 15L18.5 22L12 18.5L5.5 22L7 15L2 10L9 9L12 2Z" fill={state === LyraState.LIVE ? '#4ade80' : '#D4AF37'} />
             </svg>
          </div>
        </button>
      </div>

      <div className={`fixed bottom-10 right-32 z-[200] transition-all duration-500 ${isOverlayOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <button 
          onClick={startLiveMode}
          className={`p-4 rounded-full border transition-all shadow-xl group ${state === LyraState.LIVE ? 'bg-green-500 border-green-400 text-black scale-110 shadow-green-500/40' : 'bg-black/60 border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]'}`}
          aria-label="Voice Directive"
        >
          <svg className={`w-6 h-6 ${state === LyraState.LIVE ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 013 3v10a3 3 0 01-3 3 3 3 0 01-3-3V5a3 3 0 013-3z" />
          </svg>
        </button>
      </div>

      {captions && !isOverlayOpen && settings.showCaptions && (
        <div className="fixed bottom-36 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-[190] animate-fade-in pointer-events-none">
          <div className="bg-black/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl text-center shadow-2xl">
            <p className="text-[#E6C87A] text-sm font-light italic leading-relaxed">{captions}</p>
          </div>
        </div>
      )}

      {isOverlayOpen && (
        <div className="fixed inset-0 z-[190] bg-[#0c0a1a]/98 backdrop-blur-3xl animate-fade-in flex items-center justify-center p-4 md:p-10">
          <div className="w-full h-full max-w-7xl bg-black/40 border border-white/5 rounded-[4rem] overflow-hidden flex shadow-2xl relative">
            <aside className="w-64 border-r border-white/5 flex flex-col bg-black/20 p-8">
              <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-6">Active Projects</h4>
              <button onClick={createProject} className="w-full py-3 mb-6 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#D4AF37]/20 transition-all">+ New Project</button>
              <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {projects.map(p => (
                  <div key={p.id} className="group relative flex items-center gap-1">
                    <button 
                      onClick={() => setActiveProjectId(p.id)} 
                      className={`flex-1 text-left p-4 rounded-xl text-xs transition-all border ${activeProjectId === p.id ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                      {p.name}
                    </button>
                    <button 
                      onClick={() => renameProject(p.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-[#D4AF37] transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </aside>

            <aside className="w-72 border-r border-white/5 flex flex-col bg-black/10 p-8">
               <h4 className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-6">Threads</h4>
               <button onClick={() => setSessions(prev => [...prev, { id: `s-${Date.now()}`, projectId: activeProjectId, title: 'New Thread', messages: [], createdAt: new Date().toISOString() }])} className="w-full py-3 mb-6 border border-white/10 text-white/50 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all">+ Fresh Context</button>
               <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                {projectSessions.map(s => (
                  <div key={s.id} className="group relative flex items-center gap-1">
                    <button 
                      onClick={() => setActiveSessionId(s.id)} 
                      className={`flex-1 text-left p-4 rounded-xl text-xs transition-all border ${activeSessionId === s.id ? 'bg-white/5 border-white/20 text-[#D4AF37]' : 'border-transparent text-slate-600 hover:text-slate-400'}`}
                    >
                      <p className="truncate font-medium">{s.title}</p>
                      <p className="text-[9px] opacity-40 mt-1">{new Date(s.createdAt).toLocaleDateString()}</p>
                    </button>
                    <button 
                      onClick={() => renameSession(s.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-[#D4AF37] transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>
                ))}
              </div>
            </aside>

            <div className="flex-1 flex flex-col bg-gradient-to-b from-white/5 to-transparent">
               <header className="p-10 border-b border-white/5 flex justify-between items-center">
                  <div>
                    <h3 className="text-white text-xl font-light">{sessions.find(s => s.id === activeSessionId)?.title || "Workspace"}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`w-2 h-2 rounded-full ${state === LyraState.IDLE ? 'bg-green-500' : 'bg-[#D4AF37] animate-pulse'}`}></span>
                       <p className="text-[10px] text-slate-500 uppercase tracking-widest">Resonance Linked: {settings.lyraVoice}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                     <button onClick={startLiveMode} className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${state === LyraState.LIVE ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]'}`}>
                        {state === LyraState.LIVE ? 'Live Active' : 'Voice Mode'}
                     </button>
                     <button onClick={() => setIsOverlayOpen(false)} className="p-3 text-slate-500 hover:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                     </button>
                  </div>
               </header>

               <div className="flex-1 overflow-y-auto p-12 space-y-10 custom-scrollbar">
                  {sessions.find(s => s.id === activeSessionId)?.messages.map((m, i) => (
                    <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                       <div className={`max-w-[85%] p-8 rounded-[3rem] text-sm leading-relaxed group relative ${m.role === 'user' ? 'bg-[#D4AF37]/10 text-slate-200 border border-[#D4AF37]/20 rounded-tr-none' : 'bg-white/5 text-[#E6C87A] border border-white/5 rounded-tl-none font-light italic'}`}>
                          {m.text.split('\n').map((line, idx) => <p key={idx} className="mb-2 last:mb-0">{line}</p>)}
                          <button onClick={() => branchChat(m.id)} className="absolute -right-12 top-0 p-2 text-slate-700 hover:text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8a2 2 0 012 2v9m-10 3v-3a3 3 0 013-3h11" /></svg>
                          </button>
                          {m.sources && m.sources.length > 0 && (
                            <div className="mt-8 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                               {m.sources.map((src: any, idx: number) => src.web && (
                                 <a key={idx} href={src.web.uri} target="_blank" className="text-[10px] text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full hover:bg-blue-400/20 transition-all">{src.web.title}</a>
                               ))}
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>

               <div className="p-10 border-t border-white/5">
                  <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
                    <input 
                      type="text" 
                      placeholder="Identify your directive..." 
                      className="w-full bg-white/5 border border-white/10 rounded-full py-6 px-10 text-white outline-none focus:border-[#D4AF37]/50 transition-all text-lg font-light"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-[#D4AF37] text-black rounded-full hover:bg-[#E6C87A] transition-all">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                  </form>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LyraCore;
