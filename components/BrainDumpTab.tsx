
import React, { useState } from 'react';
import { Task } from '../types';
import { processBrainDump } from '../services/geminiService';

interface BrainDumpTabProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  isSubscribed: boolean;
}

const BrainDumpTab: React.FC<BrainDumpTabProps> = ({ tasks, setTasks, isSubscribed }) => {
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleProcess = async () => {
    if (!input.trim()) return;
    setProcessing(true);
    try {
      const result = await processBrainDump(input);
      const newTasks: Task[] = result.tasks.map(t => ({
        id: Math.random().toString(36).substring(7),
        title: t.title || 'Untitled',
        reason: t.reason || 'Calculated high impact',
        importance: t.importance || 1,
        completed: false
      }));
      setTasks([...tasks, ...newTasks]);
      setInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="animate-fade">
      <header className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px w-8 bg-emerald-500/50"></div>
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-[0.2em]">Input Mode</span>
        </div>
        <h2 className="text-5xl font-extralight text-white leading-tight">
          Quiet the <br/><span className="font-semibold">Chaos</span>
        </h2>
      </header>

      <div className="premium-glass p-1 rounded-[3rem] overflow-hidden mb-12 shadow-inner group">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's weighing on you? Plans, tasks, anxieties, emotions..."
          className="w-full h-[28rem] bg-transparent p-10 text-xl font-light text-slate-100 placeholder-slate-600 focus:outline-none transition-all resize-none leading-relaxed"
        />
        
        <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            AI Active
          </div>
          
          <button
            onClick={handleProcess}
            disabled={processing || !input.trim()}
            className="px-10 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-950 flex items-center gap-3"
          >
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Synthesizing...</span>
              </>
            ) : (
              <>
                <span className="text-sm">Convert to Action</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-6 px-8 py-4 premium-glass rounded-full text-slate-500 text-xs font-semibold tracking-wider">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">{tasks.length}</span> TASKS
          </div>
          <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
          <div className="flex items-center gap-2 uppercase">
            Clarity Secured
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrainDumpTab;
