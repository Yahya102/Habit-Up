
import React, { useEffect, useState } from 'react';
import { OnboardingAnswers, Diagnosis, Task } from '../types';
import { generateDiagnosis } from '../services/geminiService';

interface DiagnosisProps {
  answers: OnboardingAnswers;
  onComplete: (tasks: Task[], diagnosis: Diagnosis) => void;
}

const DiagnosisScreen: React.FC<DiagnosisProps> = ({ answers, onComplete }) => {
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!answers || !answers.routineLevel) {
      console.error("DiagnosisScreen: Missing onboarding answers.");
      setError("Something went wrong. Let's try again.");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const diagRes = await generateDiagnosis(answers);
        setDiagnosis(diagRes);
      } catch (err) {
        console.error(err);
        setError("Could not build your plan. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [answers]);

  const handleStartCalculation = async () => {
    if (!diagnosis) return;
    setCalculating(true);
    try {
      const habitTasks: Task[] = (diagnosis?.suggestedHabits || []).map(h => ({
        id: Math.random().toString(36).substring(7),
        title: h.title!,
        reason: h.reason!,
        importance: h.importance!,
        completed: false,
        isHabit: true,
        habitFormula: h.habitFormula
      }));
      
      const focusTasks: Task[] = (answers.areasOfFocus || []).slice(0, 2).map((focus, idx) => ({
        id: Math.random().toString(36).substring(7),
        title: `Check on my ${focus}`,
        reason: `Stay on track with ${focus}.`,
        importance: 4,
        completed: false,
        timeOfDay: idx === 0 ? 'MORNING' : 'AFTERNOON'
      }));

      const allInitialTasks = [...habitTasks, ...focusTasks];
      setTimeout(() => onComplete(allInitialTasks, diagnosis), 2500);
    } catch (err) {
      console.error("Calculation Error:", err);
      setCalculating(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade">
        <p className="text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold uppercase tracking-widest"
        >
          Start Over
        </button>
      </div>
    );
  }

  if (loading || calculating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade">
        <div className="w-24 h-24 border-2 border-emerald-500/20 rounded-[2.5rem] animate-spin mb-8"></div>
        <h2 className="text-3xl font-light text-white mb-3">{loading ? 'Creating your new profile' : 'Building your daily habits'}</h2>
        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">{loading ? 'Learning your habits' : 'Choosing the right times'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 animate-fade">
      <div className="text-center mb-16">
        <span className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-[0.4em] mb-10 inline-block">Your New Journey</span>
        <h2 className="text-2xl text-slate-400 font-light mb-4 uppercase tracking-[0.2em]">You are becoming</h2>
        <h1 className="text-6xl font-black text-white mb-8 italic text-emerald-500">{diagnosis?.identityName}</h1>
        <div className="flex justify-center items-center gap-2 mb-8 opacity-60">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Powered by</span>
          <span className="text-[12px] font-bold text-emerald-500 tracking-tighter brightness-150">Habit Up</span>
        </div>
        <p className="text-xl text-slate-400 font-light italic max-w-lg mx-auto leading-relaxed">"{diagnosis?.reflection}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">How You Work Best</h3>
          {[
            { label: 'Your Surroundings', val: diagnosis?.patterns.behavioral, icon: '🏠' },
            { label: 'Your Strength', val: diagnosis?.patterns.strength, icon: '🚀' },
            { label: 'What Stops You', val: diagnosis?.patterns.blocker, icon: '🛡️' }
          ].map((p, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex items-center gap-6">
              <span className="text-2xl">{p.icon}</span>
              <div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{p.label}</span>
                <p className="text-white font-medium leading-tight">{p.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">Your New Simple Habits</h3>
          <div className="grid grid-cols-1 gap-3">
            {diagnosis?.suggestedHabits.map((habit, idx) => (
              <div key={idx} className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-black text-emerald-950">!</span>
                  <h4 className="text-white font-bold text-sm">{habit.title}</h4>
                </div>
                <p className="text-emerald-500 text-xs font-medium italic leading-relaxed">"{habit.habitFormula}"</p>
                <p className="text-slate-500 text-[10px] font-light">Why: {habit.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleStartCalculation}
        className="w-full py-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xl rounded-[2.5rem] transition-all shadow-2xl flex items-center justify-center gap-6 group"
      >
        Start My Journey
        <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
      </button>
    </div>
  );
};

export default DiagnosisScreen;
