
import React from 'react';

interface SolutionProps {
  onNext: () => void;
}

const SolutionReveal: React.FC<SolutionProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade">
      <div className="max-w-lg">
        <div className="mb-16 relative">
          <div className="w-32 h-32 bg-emerald-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl relative z-10 animate-pulse">
            <svg className="w-16 h-16 text-emerald-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full -z-10"></div>
        </div>

        <h2 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.6em] mb-10">Analysis Complete</h2>
        
        <h1 className="text-5xl font-extralight text-white mb-8 leading-tight">
          A better way to <br/><span className="font-semibold text-emerald-500 italic">handle your day.</span>
        </h1>
        
        <p className="text-2xl text-slate-300 font-light leading-relaxed mb-20">
          We have learned how you work best. Now, let's help you focus on what really matters.
        </p>

        <button 
          onClick={onNext}
          className="w-full py-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-[2.5rem] transition-all shadow-2xl flex items-center justify-center gap-4 group"
        >
          See My Plan
          <svg className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
};

export default SolutionReveal;
