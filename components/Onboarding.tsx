
import React, { useState } from 'react';
import { OnboardingAnswers, ExperienceLevel } from '../types';

interface Option {
  label: string;
  icon: string;
}

interface OnboardingQuestion {
  id: keyof OnboardingAnswers;
  question: string;
  sub?: string;
  options: Option[];
  multi?: boolean;
}

const QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'lifeFeeling',
    question: 'How does your day usually feel?',
    sub: 'Pick the one that fits you best right now.',
    options: [
      { label: 'Too much to do', icon: '🌊' },
      { label: 'Busy but not getting far', icon: '🎡' },
      { label: 'School / Work stress', icon: '😫' },
      { label: 'A bit messy', icon: '🌪️' },
      { label: 'Calm but bored', icon: '☁️' }
    ]
  },
  {
    id: 'frustration',
    question: 'What is your biggest struggle?',
    options: [
      { label: 'Putting things off (Procrastinating)', icon: '⏳' },
      { label: 'Not knowing where to start', icon: '🧭' },
      { label: 'Getting distracted easily', icon: '📱' },
      { label: 'Too much homework / tasks', icon: '📚' },
      { label: 'Doing everything last minute', icon: '🔥' }
    ]
  },
  {
    id: 'areasOfFocus',
    question: 'What matters most to you right now?',
    options: [
      { label: 'Good Grades / School', icon: '🎓' },
      { label: 'Career & Work', icon: '💼' },
      { label: 'Health & Sports', icon: '🏃' },
      { label: 'Personal Skills', icon: '🎨' },
      { label: 'Friendships & Fun', icon: '🍻' }
    ],
    multi: true
  },
  {
    id: 'commonPlaces',
    question: 'Where do you spend most of your time?',
    options: [
      { label: 'My Room', icon: '🏠' },
      { label: 'School / College', icon: '🏫' },
      { label: 'The Library', icon: '📖' },
      { label: 'My Desk', icon: '🖥️' },
      { label: 'Commuting / Travel', icon: '🚌' },
      { label: 'The Gym', icon: '💪' }
    ],
    multi: true
  },
  {
    id: 'freeTimeSlots',
    question: 'When do you have a few minutes?',
    options: [
      { label: 'When I wake up', icon: '🌅' },
      { label: 'Between classes', icon: '🔔' },
      { label: 'Lunch break', icon: '🍱' },
      { label: 'After school / work', icon: '🌆' },
      { label: 'During study breaks', icon: '☕' },
      { label: 'Before bed', icon: '🌙' }
    ],
    multi: true
  },
  {
    id: 'routineLevel',
    question: 'How good are you at keeping habits?',
    options: [
      { label: 'Beginner: I struggle to be consistent.', icon: '🌱' },
      { label: 'Intermediate: I have a routine but want more.', icon: '🌿' },
      { label: 'Advanced: Elite discipline & performance.', icon: '🌳' }
    ]
  },
  {
    id: 'motivationStyle',
    question: 'What keeps you going?',
    options: [
      { label: 'Seeing my progress', icon: '📈' },
      { label: 'Rewards for hard work', icon: '🎁' },
      { label: 'Competition with others', icon: '🏁' },
      { label: 'Feeling organized', icon: '🗂️' },
      { label: 'Pressure from others', icon: '🤝' }
    ]
  },
  {
    id: 'focusBreakers',
    question: 'What usually breaks your focus?',
    options: [
      { label: 'Notifications', icon: '🔔' },
      { label: 'People interruptions', icon: '👥' },
      { label: 'Mental fatigue', icon: '🥱' },
      { label: 'Overthinking', icon: '🤯' },
      { label: 'No clear plan', icon: '🌫️' },
      { label: 'Social media', icon: '🤳' }
    ],
    multi: true
  },
  {
    id: 'overwhelmedBehavior',
    question: 'When you feel overwhelmed, what do you usually do?',
    options: [
      { label: 'Make a to-do list', icon: '📋' },
      { label: 'Ignore it and delay', icon: '💤' },
      { label: 'Work harder without planning', icon: '🏃‍♂️' },
      { label: 'Use productivity apps', icon: '📱' },
      { label: 'Talk to someone', icon: '🗣️' },
      { label: 'Nothing works', icon: '🏳️' }
    ]
  },
  {
    id: 'previousTools',
    question: 'Which tools have you tried before?',
    options: [
      { label: 'To-do apps', icon: '🗳️' },
      { label: 'Calendar apps', icon: '🗓️' },
      { label: 'Notes', icon: '📓' },
      { label: 'AI tools', icon: '🦾' },
      { label: 'None', icon: '🚫' },
      { label: 'Too many to count', icon: '😵‍💫' }
    ],
    multi: true
  }
];

interface OnboardingProps {
  onComplete: (answers: OnboardingAnswers) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<OnboardingAnswers>>({
    areasOfFocus: [],
    commonPlaces: [],
    freeTimeSlots: [],
    focusBreakers: [],
    previousTools: [],
    initialBrainDump: 'Generated from profile context',
    weekdayReality: 'Standard daily rhythm'
  });

  const currentQ = QUESTIONS[step];

  const handleSelect = (option: Option) => {
    let newAnswers = { ...answers };

    if (currentQ.id === 'routineLevel') {
      const level: ExperienceLevel = option.label.startsWith('Beginner') ? 'BEGINNER' : option.label.startsWith('Intermediate') ? 'INTERMEDIATE' : 'ADVANCED';
      newAnswers = { ...newAnswers, routineLevel: level };
    } else if (currentQ.multi) {
      const current = (answers[currentQ.id] as string[]) || [];
      if (current.includes(option.label)) {
        newAnswers = { ...newAnswers, [currentQ.id]: current.filter(o => o !== option.label) };
      } else {
        newAnswers = { ...newAnswers, [currentQ.id]: [...current, option.label] };
      }
    } else {
      newAnswers = { ...newAnswers, [currentQ.id]: option.label };
    }

    setAnswers(newAnswers);

    if (!currentQ.multi) {
      setTimeout(() => {
        if (step < QUESTIONS.length - 1) {
          setStep(step + 1);
        } else {
          onComplete(newAnswers as OnboardingAnswers);
        }
      }, 300);
    }
  };

  const isSelected = (label: string) => {
    if (currentQ.id === 'routineLevel') {
      const level: ExperienceLevel = label.startsWith('Beginner') ? 'BEGINNER' : label.startsWith('Intermediate') ? 'INTERMEDIATE' : 'ADVANCED';
      return answers.routineLevel === level;
    }
    if (currentQ.multi) return (answers[currentQ.id] as string[])?.includes(label);
    return answers[currentQ.id] === label;
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-20 min-h-screen flex flex-col justify-center animate-fade">
      <div className="mb-14">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Personalizing</span>
            <span className="text-[12px] font-bold text-emerald-500 tracking-tighter">Habit Up</span>
          </div>
          <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em]">{Math.round(((step + 1) / QUESTIONS.length) * 100)}%</span>
        </div>
        <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-700 ease-out"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <div key={step} className="animate-fade flex-1">
        <h2 className="text-4xl font-extralight text-white mb-6 leading-tight">
          {currentQ.question}
        </h2>
        {currentQ.sub && <p className="text-slate-400 mb-10 text-lg font-light italic">{currentQ.sub}</p>}

        <div className="grid grid-cols-1 gap-3">
          {currentQ.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left p-6 rounded-2xl transition-all border flex items-center gap-4 ${
                isSelected(opt.label) 
                ? 'bg-emerald-600/10 border-emerald-500/50 text-white translate-x-1' 
                : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl grayscale-[0.5]">{opt.icon}</span>
              <div className="flex-1 flex items-center justify-between">
                <span className="text-lg font-light">{opt.label}</span>
                {isSelected(opt.label) && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-950" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 flex gap-4">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="flex-1 py-5 bg-slate-900 text-slate-500 font-bold rounded-[1.5rem] border border-white/5">Back</button>
        )}
        {currentQ.multi && (
          <button
            disabled={!(answers[currentQ.id] as string[])?.length}
            onClick={() => {
              if (step < QUESTIONS.length - 1) {
                setStep(step + 1);
              } else {
                onComplete(answers as OnboardingAnswers);
              }
            }}
            className="flex-[2] py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-bold rounded-[1.5rem] transition-all shadow-xl flex items-center justify-center gap-2"
          >
            Continue
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7"/></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
