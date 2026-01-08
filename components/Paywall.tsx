
import React from 'react';

interface PaywallProps {
  onSubscribe: (success: boolean) => void;
}

const Paywall: React.FC<PaywallProps> = ({ onSubscribe }) => {
  const features = [
    "Gemini 3 Pro Executive Brain",
    "Practical Ritual Time-Boxing",
    "Elite Discipline Tier Analysis",
    "Mission Accomplished Victory States",
    "Infinite Strategic Goal Tracking",
    "Detailed Behavioral Stats & Insights",
    "No Ads, No Limits, Total Focus"
  ];

  const CheckIcon = () => (
    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
      <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8 animate-fade">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            <h2 className="text-4xl font-bold tracking-tighter text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Habit Up
            </h2>
            <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full -z-10"></div>
          </div>
          <h2 className="text-5xl font-extralight text-white mb-4 leading-tight">Elite Access</h2>
          <p className="text-slate-400 font-light leading-relaxed">The ultimate system for those who <br/>refuse to settle for average productivity.</p>
        </div>

        <div className="premium-glass p-10 rounded-[3rem] border-emerald-500/30 bg-emerald-950/10 mb-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6">
             <div className="px-4 py-1.5 bg-emerald-500 text-[10px] font-black text-emerald-950 rounded-full uppercase tracking-widest shadow-lg">Annual Plan</div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-4xl font-black text-white mb-1">$25.00<span className="text-sm font-light text-slate-500 ml-2">/ year</span></h3>
            <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Equivalent to $2.08 per month</p>
          </div>

          <div className="space-y-4 mb-10 border-t border-white/5 pt-8">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Everything included:</p>
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <CheckIcon />
                <span className="text-sm text-slate-300 font-light">{feature}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onSubscribe(true)}
            className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-[2rem] transition-all shadow-2xl shadow-emerald-900/40 active:scale-95 flex flex-col items-center justify-center"
          >
            <span className="flex items-center gap-2">
              Start My 3-Day Free Trial
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </span>
            <span className="text-[10px] opacity-60 font-normal uppercase tracking-widest mt-1">Pay nothing for 72 hours</span>
          </button>
        </div>

        <div className="text-center space-y-6">
          <p className="text-[10px] text-slate-700 text-center uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
            Secure SSL Encryption • Cancel anytime online <br/> Full access granted immediately
          </p>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
