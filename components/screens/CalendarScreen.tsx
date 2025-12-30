
import React, { useState } from 'react';
import { UserProfile, CalendarEvent, Priority } from '../../types';

interface CalendarScreenProps {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const CalendarScreen: React.FC<CalendarScreenProps> = ({ profile, updateProfile }) => {
  const [viewDate, setViewDate] = useState(new Date(2025, 11, 1)); // Default to Dec 2025 for demo
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [selectedDayForModal, setSelectedDayForModal] = useState<number>(1);

  const [form, setForm] = useState<Partial<CalendarEvent>>({
    title: '', description: '', time: '09:00', type: 'Task', priority: 'Medium', color: '#D4AF37', hasAlarm: false
  });

  const getEventsForDay = (day: number) => {
    return profile.events.filter(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === viewDate.getMonth() && d.getFullYear() === viewDate.getFullYear();
    });
  };

  const handleDayClick = (day: number) => {
    setSelectedDayForModal(day);
    setForm({ title: '', description: '', time: '09:00', type: 'Task', priority: 'Medium', color: '#D4AF37', hasAlarm: false });
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEventClick = (e: CalendarEvent) => {
    const d = new Date(e.date);
    setSelectedDayForModal(d.getDate());
    setEditingEvent(e);
    setForm(e);
    setShowModal(true);
  };

  const save = () => {
    if (!form.title) return;
    const eventDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), selectedDayForModal);
    const newEvent: CalendarEvent = {
      ...form as CalendarEvent,
      id: editingEvent?.id || `e-${Date.now()}`,
      date: eventDate.toISOString(),
    };
    const updated = editingEvent 
      ? profile.events.map(e => e.id === editingEvent.id ? newEvent : e)
      : [...profile.events, newEvent];
    updateProfile({ events: updated });
    setShowModal(false);
  };

  const deleteEv = () => {
    if (editingEvent) updateProfile({ events: profile.events.filter(e => e.id !== editingEvent.id) });
    setShowModal(false);
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  return (
    <div className="animate-fade-in space-y-12">
      <header>
        <h2 className="text-4xl font-light text-white">Scheduler</h2>
        <p className="text-slate-400 mt-2">Harmonize your execution cycles.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-black/20 p-10 rounded-[4rem] border border-white/5 shadow-2xl">
           <div className="flex justify-between items-center mb-10">
             <h3 className="text-2xl text-[#D4AF37] font-light">{viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}</h3>
             <div className="flex gap-4">
                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-3 bg-white/5 rounded-full hover:bg-[#D4AF37]/10 transition-all text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-3 bg-white/5 rounded-full hover:bg-[#D4AF37]/10 transition-all text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
             </div>
           </div>

           <div className="grid grid-cols-7 gap-3 mb-4 text-center text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
           </div>

           <div className="grid grid-cols-7 gap-3">
              {/* Padding for start day */}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`pad-${i}`} className="min-h-[100px] opacity-10" />
              ))}
              
              {Array.from({ length: daysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                const day = i + 1;
                const events = getEventsForDay(day);
                const isToday = day === new Date().getDate() && viewDate.getMonth() === new Date().getMonth() && viewDate.getFullYear() === new Date().getFullYear();
                
                return (
                  <div key={day} className={`min-h-[100px] p-3 rounded-2xl border flex flex-col gap-1 transition-all group cursor-pointer ${isToday ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/5 bg-white/5 hover:border-white/20'}`} onClick={() => handleDayClick(day)}>
                    <span className={`text-[10px] self-end ${isToday ? 'text-[#D4AF37] font-bold' : 'text-slate-500 group-hover:text-white'}`}>{day}</span>
                    <div className="flex flex-col gap-1 overflow-hidden">
                       {events.map(ev => (
                         <div key={ev.id} onClick={(e) => { e.stopPropagation(); handleEventClick(ev); }} className="px-2 py-1 rounded text-[8px] font-bold uppercase truncate border border-white/10 hover:brightness-110 transition-all" style={{ backgroundColor: `${ev.color}22`, color: ev.color, borderLeft: `2px solid ${ev.color}` }}>
                            {ev.time} {ev.title}
                         </div>
                       ))}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        <aside className="space-y-8">
           <div className="bg-[#D4AF37]/5 p-8 rounded-[3rem] border border-[#D4AF37]/20 shadow-xl">
              <h4 className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold mb-6">Upcoming Cycles</h4>
              <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                 {profile.events
                    .filter(e => new Date(e.date) >= viewDate)
                    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 8)
                    .map(e => (
                   <div key={e.id} className="p-4 bg-black/20 rounded-2xl border border-white/5 flex flex-col gap-1 hover:border-[#D4AF37]/30 transition-all cursor-pointer" onClick={() => handleEventClick(e)}>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold uppercase" style={{ color: e.color }}>{e.type}</span>
                        {e.hasAlarm && <span className="text-red-400 animate-pulse"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg></span>}
                      </div>
                      <p className="text-sm text-white font-medium truncate">{e.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{new Date(e.date).toLocaleDateString()} at {e.time}</p>
                   </div>
                 ))}
                 {profile.events.length === 0 && <p className="text-slate-500 text-xs italic p-4">No scheduled cycles detected.</p>}
              </div>
           </div>
        </aside>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-6 animate-fade-in">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowModal(false)} />
           <div className="relative w-full max-w-lg bg-[#1a1333] border border-[#D4AF37]/20 rounded-[3rem] p-10 space-y-8 shadow-2xl">
              <header>
                <h3 className="text-2xl font-light text-white">{editingEvent ? 'Calibrate Pulse' : 'Schedule Pulse'}</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                  Target: {viewDate.toLocaleString('default', { month: 'long' })} {selectedDayForModal}, {viewDate.getFullYear()}
                </p>
              </header>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Event Definition</label>
                    <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#D4AF37] transition-all" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Time</label>
                      <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-[#D4AF37] transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Classification</label>
                      <select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white appearance-none outline-none focus:border-[#D4AF37] transition-all">
                        <option value="Task">Task</option>
                        <option value="Schedule">Schedule</option>
                        <option value="Reminder">Reminder</option>
                        <option value="Skill">Skill Node</option>
                      </select>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Priority Tier</label>
                      <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value as any})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white appearance-none outline-none focus:border-[#D4AF37] transition-all">
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Visual Marker</label>
                      <div className="flex gap-2 p-2">
                        {['#D4AF37', '#EF4444', '#F59E0B', '#10B981', '#3B82F6'].map(color => (
                          <button 
                            key={color} 
                            onClick={() => setForm({...form, color})}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === color ? 'border-white scale-110' : 'border-transparent opacity-60'}`} 
                            style={{ backgroundColor: color }} 
                          />
                        ))}
                      </div>
                    </div>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${form.hasAlarm ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-slate-500'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                      </div>
                      <label className="text-xs text-slate-300 font-medium">Initialize Proximity Alert</label>
                    </div>
                    <button onClick={() => setForm({...form, hasAlarm: !form.hasAlarm})} className={`w-10 h-5 rounded-full p-0.5 flex items-center transition-all ${form.hasAlarm ? 'bg-red-500' : 'bg-white/10'}`}>
                       <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${form.hasAlarm ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                 </div>
                 <div className="flex gap-4 pt-4">
                    {editingEvent && <button onClick={deleteEv} className="flex-1 py-4 border border-red-500/30 text-red-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 transition-all">Decommission</button>}
                    <button onClick={save} className="flex-1 py-4 bg-[#D4AF37] text-black font-bold rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#E6C87A] transition-all shadow-lg active:scale-95">Confirm Synthesis</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CalendarScreen;
