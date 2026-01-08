
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { generateWeeklyInsights } from '../services/geminiService';

interface InsightsTabProps {
  tasks: Task[];
  isSubscribed: boolean;
}

const InsightsTab: React.FC<InsightsTabProps> = ({ tasks, isSubscribed }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      if (tasks.length === 0) {
        setInsight("Your focus history is currently empty. Complete tasks to unlock behavioral intelligence.");
        setLoading(false);
        return;
      }
      try {
        const res = await generateWeeklyInsights(tasks);
        setInsight(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [tasks]);

  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="animate-cinematic">
      <header className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-8 bg-emerald-500/50"></div>
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">Retrospective</span>
        </div>
        <h2 className="text-5xl font-extralight text-white leading-tight">
          Mindful <br/><span className="font-semibold">Insights</span>
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-5 mb-10">
        <div className="task-card p-8 rounded-[2.5rem] flex flex-col justify-between h-44">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Efficiency</p>
          <div>
            <p className="text-5xl font-light text-emerald-500 mb-1">{completionRate}<span className="text-xl">%</span></p>
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 glow-emerald" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>
        </div>
        <div className="task-card p-8 rounded-[2.5rem] flex flex-col justify-between h-44">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Focus Tempo</p>
          <div>
            <p className="text-5xl font-light text-white mb-1">{completedCount}<span className="text-xl">x</span></p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Completed Wins</p>
          </div>
        </div>
      </div>

      <div className="premium-glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden mb-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">Executive Summary</h3>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 0.8, 0.6].map((w, i) => (
              <div key={i} className="h-3 bg-slate-800/50 rounded-full animate-pulse" style={{ width: `${w * 100}%` }}></div>
            ))}
          </div>
        ) : (
          <div className="text-slate-300 font-light leading-relaxed whitespace-pre-wrap text-[15px]">
            {insight}
          </div>
        )}
      </div>

      <div>
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-8 px-2">Strategic Adjustments</h4>
        <div className="space-y-4">
          {[
            { label: 'Energy Management', text: 'Shift deep work to the 09:00 window.' },
            { label: 'Cognitive Load', text: 'Limit concurrent tasks to 3 maximum.' },
            { label: 'Wellness Anchor', text: 'Morning meditation improved focus by 20%.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2"></div>
              <div>
                <p className="text-white text-sm font-semibold mb-1">{item.label}</p>
                <p className="text-slate-500 text-xs font-light">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsTab;
