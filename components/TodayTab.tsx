
import React, { useState, useMemo } from 'react';
import { Task } from '../types';

const labels = {
  today: 'Today',
  rituals: 'Rituals',
  objectives: 'Objectives',
  rationale: 'Rationale'
};

interface TodayTabProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onEditHabit: (habit: Task) => void;
  isSubscribed: boolean;
  userIdentity?: string;
  onMenuClick?: () => void;
  lang?: string;
}

const TodayTab: React.FC<TodayTabProps> = ({ tasks, setTasks, onEditHabit, isSubscribed, userIdentity, onMenuClick, lang = 'en-US' }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const t = labels;

  const dateStrip = useMemo(() => {
    const days = [];
    for (let i = -7; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteHabit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTasks(tasks.filter(t => t.id !== id));
  };

  const isSameDay = (d1: Date, d2: Date) => 
    d1.getDate() === d2.getDate() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getFullYear() === d2.getFullYear();

  const rituals = tasks.filter(t => t.isHabit);
  const executiveTasks = tasks.filter(t => !t.isHabit).sort((a, b) => b.importance - a.importance).slice(0, 5);

  return (
    <div className={`transition-all duration-700 ${!isSubscribed ? 'blur-content' : 'animate-fade'}`}>
      <header className="mb-10 pt-4">
        {userIdentity && (
          <div className="mb-6 px-2">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] block mb-1">Elite Protocol for</span>
            <h2 className="text-3xl font-bold text-white italic tracking-tight">{userIdentity}</h2>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-8 px-2">
          <button onClick={onMenuClick} className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white active:bg-white/10 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <button onClick={() => setSelectedDate(new Date())} className="px-10 py-3 bg-emerald-500 rounded-full text-emerald-950 font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform">
            {t.today}
          </button>
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white active:bg-white/10 transition-colors" onClick={() => {
                const input = document.createElement('input');
                input.type = 'date';
                input.onchange = (e) => setSelectedDate(new Date((e.target as HTMLInputElement).value));
                input.click();
              }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </button>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide px-2">
          {dateStrip.map((date, idx) => {
            const active = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, new Date());
            return (
              <button key={idx} onClick={() => setSelectedDate(date)} className={`flex-shrink-0 w-[72px] h-[100px] rounded-[1.8rem] flex flex-col items-center justify-center transition-all duration-300 border ${active ? 'bg-emerald-500 border-emerald-400 text-emerald-950 scale-105 shadow-xl shadow-emerald-500/20' : 'bg-white/5 border-white/5 text-slate-500 active:bg-white/10'}`}>
                <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${active ? 'text-emerald-950/70' : 'text-slate-500'}`}>{date.toLocaleDateString(lang, { weekday: 'short' })}</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${active ? 'bg-emerald-400/30' : 'bg-slate-900/50'}`}>{date.getDate()}</div>
                {isToday && !active && <div className="mt-1 w-1 h-1 bg-emerald-500 rounded-full"></div>}
              </button>
            );
          })}
        </div>
      </header>
      <section className="mb-14">
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center gap-4 mb-6">{t.rituals}<div className="h-px flex-1 bg-white/5"></div></h3>
        <div className="space-y-4">
          {rituals.length > 0 ? rituals.map((ritual) => (
            <div key={ritual.id} onClick={() => toggleTask(ritual.id)} className={`premium-glass p-6 rounded-[2rem] border border-emerald-500/10 cursor-pointer transition-all active:scale-[0.98] group relative ${ritual.completed ? 'opacity-40' : ''}`}>
              <div className="flex items-start gap-5">
                 <div className={`mt-1 shrink-0 w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${ritual.completed ? 'bg-emerald-500 border-emerald-500 glow-emerald scale-105 shadow-lg shadow-emerald-500/30' : 'border-white/10'}`}>
                  {ritual.completed && (
                    <svg className="w-5 h-5 text-emerald-950 animate-checkmark" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                    </svg>
                  )}
                </div>
                <div className="flex-1 pr-16">
                  <p className={`text-emerald-500 text-[15px] font-medium leading-relaxed italic transition-all ${ritual.completed ? 'opacity-60 line-through' : ''}`}>
                    {ritual.habitFormula || ritual.title}
                  </p>
                </div>
                <div className="absolute top-6 right-4 flex gap-2 opacity-40 hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); onEditHabit(ritual); }} className="p-2 bg-white/5 rounded-xl text-slate-400 active:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg></button>
                  <button onClick={(e) => deleteHabit(e, ritual.id)} className="p-2 bg-white/5 rounded-xl text-slate-400 active:text-red-400 transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg></button>
                </div>
              </div>
            </div>
          )) : <div className="text-center py-10 premium-glass rounded-[2rem] border-dashed border-white/5 opacity-50"><p className="text-sm italic">Build your rituals...</p></div>}
        </div>
      </section>
      <section>
        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-4">{t.objectives}<div className="h-px flex-1 bg-white/5"></div></h3>
        <div className="space-y-6">
          {executiveTasks.map((task, idx) => (
            <div key={task.id} className={`task-card p-7 rounded-[2.5rem] relative overflow-hidden active:scale-[0.99] group ${task.completed ? 'opacity-50' : ''}`} onClick={() => toggleTask(task.id)}>
              <div className="flex gap-6">
                <div className={`mt-1 shrink-0 w-8 h-8 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${task.completed ? 'bg-emerald-500 border-emerald-500 glow-emerald scale-105 shadow-lg shadow-emerald-500/30' : 'border-white/10'}`}>
                  {task.completed && (
                    <svg className="w-5 h-5 text-emerald-950 animate-checkmark" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-medium mb-3 transition-all ${task.completed ? 'line-through text-slate-500 opacity-60' : ''}`}>{task.title}</h3>
                  <div className="flex items-start gap-2">
                    <span className="text-emerald-500/60 text-xs font-bold shrink-0 mt-0.5">{t.rationale}:</span>
                    <p className={`text-slate-400 text-[13px] leading-relaxed font-light transition-opacity ${task.completed ? 'opacity-40' : ''}`}>{task.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TodayTab;
