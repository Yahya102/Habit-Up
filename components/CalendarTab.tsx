
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Task } from '../types';
import { format, isSameDay, startOfWeek, addDays, isToday } from 'date-fns';

interface CalendarTabProps {
  tasks: Task[];
  isSubscribed: boolean;
}

const CalendarTab: React.FC<CalendarTabProps> = ({ tasks, isSubscribed }) => {
  const [value, setValue] = useState<Date>(new Date());
  const [view, setView] = useState<'MONTH' | 'WEEK'>('MONTH');

  const selectedDateTasks = tasks.filter(task => {
    // For demo purposes, we show habits every day and specific tasks on their dueDate (if any)
    if (task.isHabit) return true;
    if (task.dueDate) return isSameDay(new Date(task.dueDate), value);
    // If no due date, show on Today for simplicity in this demo
    return isSameDay(new Date(), value) && !task.isHabit;
  });

  const getDayEnergy = (date: Date) => {
    const dayTasks = tasks.filter(t => t.isHabit || (t.dueDate && isSameDay(new Date(t.dueDate), date)));
    if (dayTasks.length > 3) return 'high';
    if (dayTasks.length > 0) return 'low';
    return 'none';
  };

  const renderTileContent = ({ date, view: calendarView }: { date: Date, view: string }) => {
    if (calendarView === 'month') {
      const energy = getDayEnergy(date);
      if (energy === 'none') return null;
      return (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5">
          <div className={`w-1 h-1 rounded-full ${energy === 'high' ? 'bg-emerald-400' : 'bg-emerald-800'}`}></div>
        </div>
      );
    }
    return null;
  };

  const renderWeeklyView = () => {
    const start = startOfWeek(value, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i));

    return (
      <div className="flex justify-between gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {weekDays.map((day, idx) => {
          const active = isSameDay(day, value);
          const today = isToday(day);
          return (
            <button
              key={idx}
              onClick={() => setValue(day)}
              className={`flex-shrink-0 w-16 h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border ${
                active 
                  ? 'bg-emerald-500 border-emerald-400 text-emerald-950 scale-105 shadow-xl shadow-emerald-500/20' 
                  : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'
              }`}
            >
              <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${active ? 'text-emerald-950/70' : 'text-slate-500'}`}>
                {format(day, 'EEE')}
              </span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${active ? 'bg-emerald-400/30' : 'bg-slate-900/50'}`}>
                {format(day, 'd')}
              </div>
              {today && !active && <div className="mt-1 w-1 h-1 bg-emerald-500 rounded-full"></div>}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-fade">
      <header className="mb-10 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-8 bg-emerald-500/50"></div>
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">Temporal Clarity</span>
        </div>
        <div className="flex items-end justify-between">
          <h2 className="text-5xl font-extralight text-white leading-tight">
            Schedule <br/><span className="font-semibold italic">Dynamics</span>
          </h2>
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setView('MONTH')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'MONTH' ? 'bg-emerald-500 text-emerald-950' : 'text-slate-500 hover:text-white'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setView('WEEK')}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'WEEK' ? 'bg-emerald-500 text-emerald-950' : 'text-slate-500 hover:text-white'}`}
            >
              Week
            </button>
          </div>
        </div>
      </header>

      <div className="premium-glass p-6 rounded-[2.5rem] mb-12 border-white/5 shadow-2xl">
        {view === 'MONTH' ? (
          <Calendar
            onChange={(val) => setValue(val as Date)}
            value={value}
            tileContent={renderTileContent}
            locale="en-US"
            prev2Label={null}
            next2Label={null}
          />
        ) : (
          renderWeeklyView()
        )}
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">
            {format(value, 'MMMM d, yyyy')}
          </h3>
          <span className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">
            {selectedDateTasks.length} Events
          </span>
        </div>

        <div className="space-y-4">
          {selectedDateTasks.length > 0 ? (
            selectedDateTasks.map((task) => (
              <div key={task.id} className="task-card p-6 rounded-[2rem] border-white/5 group transition-all">
                <div className="flex gap-5 items-start">
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center border-2 border-white/10 ${task.isHabit ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white/5 text-slate-500'}`}>
                    {task.isHabit ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{task.title}</h4>
                    <p className="text-slate-500 text-[11px] leading-relaxed italic">{task.isHabit ? task.habitFormula : task.reason}</p>
                  </div>
                  {task.completed && (
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center premium-glass rounded-[2rem] border-dashed border-white/5 opacity-40">
              <p className="text-sm italic font-light">White space for mental restoration.</p>
            </div>
          )}
        </div>
      </section>

      {!isSubscribed && (
        <div className="mt-8 p-6 premium-glass rounded-[2rem] bg-emerald-950/20 border-emerald-500/20 text-center">
          <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mb-2">Pro Feature</p>
          <p className="text-slate-400 text-[11px] font-light">Historical consistency tracking and multi-week forecasting require Elite Access.</p>
        </div>
      )}
    </div>
  );
};

export default CalendarTab;
