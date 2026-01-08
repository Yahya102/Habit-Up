
import React from 'react';
import { Task } from '../types';

interface PlanTabProps {
  tasks: Task[];
  isSubscribed: boolean;
}

const PlanTab: React.FC<PlanTabProps> = ({ tasks, isSubscribed }) => {
  const sections = [
    { id: 'MORNING', label: 'Morning', sub: 'Deep Work Focus', time: '08:00 - 12:00', tasks: tasks.filter(t => t.timeOfDay === 'MORNING') },
    { id: 'AFTERNOON', label: 'Afternoon', sub: 'Collaborative Flow', time: '13:00 - 17:00', tasks: tasks.filter(t => t.timeOfDay === 'AFTERNOON') },
    { id: 'EVENING', label: 'Evening', sub: 'Mindful Reflection', time: '18:00 - 21:00', tasks: tasks.filter(t => t.timeOfDay === 'EVENING') }
  ];

  return (
    <div className="animate-cinematic">
      <header className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-8 bg-emerald-500/50"></div>
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">Daily Rhythm</span>
        </div>
        <h2 className="text-5xl font-extralight text-white leading-tight">
          Executive <br/><span className="font-semibold italic">Timeline</span>
        </h2>
      </header>

      <div className="space-y-16 relative">
        {/* Central vertical line */}
        <div className="absolute left-[11px] top-4 bottom-4 w-px bg-gradient-to-b from-emerald-500/50 via-slate-800 to-transparent"></div>

        {sections.map((section) => (
          <div key={section.id} className="relative pl-10">
            {/* Timeline dot */}
            <div className="absolute left-0 top-1.5 w-[23px] h-[23px] rounded-full border-4 border-slate-950 bg-emerald-500 glow-emerald z-10"></div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-2xl font-bold text-white tracking-tight">{section.label}</h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{section.time}</span>
              </div>
              <p className="text-emerald-500/60 text-xs font-medium uppercase tracking-[0.1em]">{section.sub}</p>
            </div>
            
            <div className="space-y-4">
              {section.tasks.length > 0 ? (
                section.tasks.map((task) => (
                  <div key={task.id} className="task-card p-5 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-1.5 rounded-full ${task.completed ? 'bg-slate-700' : 'bg-emerald-500 glow-emerald'}`}></div>
                      <span className={`text-sm font-light transition-all ${task.completed ? 'text-slate-600 line-through' : 'text-slate-200'}`}>
                        {task.title}
                      </span>
                    </div>
                    {!task.completed && (
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">High Impact</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-4 px-6 rounded-2xl border border-dashed border-slate-800 flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  <p className="text-slate-600 text-sm font-light italic">Reserved for emergent high-value tasks.</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 premium-glass p-8 rounded-[2.5rem] border-white/5 text-center">
        <p className="text-slate-400 text-[13px] leading-relaxed font-light italic">
          "The AI brain balances your energy signature with your objectives. <br/>Skipped items are gracefully deferred, not failed."
        </p>
      </div>
    </div>
  );
};

export default PlanTab;
