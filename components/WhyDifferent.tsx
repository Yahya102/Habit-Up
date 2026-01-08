
import React from 'react';

interface WhyDifferentProps {
  onNext: () => void;
}

const WhyDifferent: React.FC<WhyDifferentProps> = ({ onNext }) => {
  const points = [
    {
      title: "Real Execution, Not Just Lists",
      description: "Habit Up converts vague goals into practical, time-boxed rituals. You don't just 'study'; you 'Solve 10 problems' at exactly 9:00 AM.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      title: "Elite AI Coaching",
      description: "Our Gemini-powered brain analyzes your discipline tier (Beginner to Elite) to suggest rituals that actually fit your current capability.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "The Strategic Path",
      description: "While other apps treat every task the same, Habit Up maps out your 'Today's Path'—a motivational sequence of high-impact goals.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A2 2 0 013 15.447V6.553a2 2 0 011.553-1.944L9 3m0 17l6-3m-6 3V3m6 14l5.447 2.724A2 2 0 0021 17.894V9a2 2 0 00-1.553-1.944L15 3m0 14V3" />
        </svg>
      )
    },
    {
      title: "Achievement Rewards",
      description: "Build elite momentum with visual victory states. Finish your boxed rituals and feel the dopamine of the Mission Accomplished state.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.143-7.714L1 12l6.857-2.286L9 3z" />
        </svg>
      )
    }
  ];

  return (
    <div className="max-w-xl mx-auto px-6 py-20 min-h-screen animate-fade">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extralight text-white mb-6">
          Why 
          <span className="text-emerald-500 font-bold tracking-tighter mx-2 align-middle">Habit Up</span>
          <br/> is the best
        </h1>
        <div className="h-1 w-20 bg-emerald-500 mx-auto rounded-full mt-4"></div>
      </header>

      <div className="space-y-6 mb-16">
        {points.map((point, index) => (
          <div 
            key={index} 
            className="premium-glass p-8 rounded-[2.5rem] border-white/5 animate-fade" 
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/20">
                {point.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                <p className="text-slate-400 font-light leading-relaxed text-sm">
                  {point.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-12">
        <p className="text-2xl text-slate-300 font-extralight italic leading-relaxed">
          “Practical action is the only <br/>
          <span className="font-semibold text-white">bridge to your dreams.</span>”
        </p>

        <button
          onClick={onNext}
          className="w-full py-7 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xl rounded-[2.5rem] transition-all shadow-2xl flex items-center justify-center gap-4 group active:scale-95"
        >
          Secure My Protocol
          <svg className="w-7 h-7 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WhyDifferent;
