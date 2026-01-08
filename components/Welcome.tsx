
import React from 'react';

interface WelcomeProps {
  onStart: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center animate-fade">
      <div className="max-w-md w-full">
        {/* Logo Area */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <h2 className="text-6xl font-bold tracking-tighter text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              Habit Up
            </h2>
            <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full -z-10 animate-pulse"></div>
          </div>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-5xl font-extralight text-white mb-6 leading-tight tracking-tight">
          AI Smart <br/>
          <span className="font-semibold italic text-emerald-500">Assistant.</span>
        </h1>
        
        <div className="space-y-4 mb-16">
          <p className="text-xl text-slate-300 font-light leading-relaxed">
            Let’s make your daily life easier and clearer.
          </p>
          <div className="flex items-center justify-center gap-3 text-slate-500">
            <div className="h-px w-6 bg-slate-800"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Takes about 2 minutes</span>
            <div className="h-px w-6 bg-slate-800"></div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-[2rem] transition-all shadow-2xl shadow-emerald-950/40 flex items-center justify-center gap-4 group active:scale-95"
        >
          Let’s start
          <svg className="w-6 h-6 transition-transform group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        {/* Footnote */}
        <p className="mt-12 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] opacity-50">
          Built for you. Powered by AI.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
