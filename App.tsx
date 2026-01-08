
import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import Onboarding from './components/Onboarding';
import WhyDifferent from './components/WhyDifferent';
import Auth from './components/Auth';
import DiagnosisScreen from './components/Diagnosis';
import SolutionReveal from './components/SolutionReveal';
import Paywall from './components/Paywall';
import Layout from './components/Layout';
import TodayTab from './components/TodayTab';
import BrainDumpTab from './components/BrainDumpTab';
import PlanTab from './components/PlanTab';
import InsightsTab from './components/InsightsTab';
import { AppState, Tab, UserProfile, OnboardingAnswers, Task } from './types';
import { updateUserProfile } from './services/authService';

const INITIAL_PROFILE: UserProfile = {
  uid: '',
  name: 'Guest',
  isSubscribed: false,
  tasks: []
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('WELCOME');
  const [activeTab, setActiveTab] = useState<Tab>('TODAY');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);
  
  // Global Modal State
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Task | null>(null);
  const [habitForm, setHabitForm] = useState({ action: '', place: '', time: '' });

  // Persistence side effect
  useEffect(() => {
    if (userProfile.email && userProfile.tasks) {
      updateUserProfile(userProfile.email, { tasks: userProfile.tasks });
    }
  }, [userProfile.tasks, userProfile.email]);

  // NEW: Scroll to top on every navigation/state change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [appState, activeTab]);

  const handleOnboardingComplete = (answers: OnboardingAnswers) => {
    setUserProfile(prev => ({ ...prev, onboardingData: answers }));
    setAppState('WHY_DIFFERENT');
  };

  const handleAuthComplete = (profile: UserProfile) => {
    const mergedProfile = {
      ...profile,
      onboardingData: profile.onboardingData || userProfile.onboardingData
    };
    setUserProfile(mergedProfile);
    if (mergedProfile.onboardingData) {
      setAppState('SOLUTION_REVEAL');
    } else {
      setAppState('MAIN');
    }
  };

  const handleDiagnosisComplete = (tasks: Task[]) => {
    setUserProfile(prev => ({ ...prev, tasks }));
    setAppState('PAYWALL');
  };

  const setTasks = (newTasks: Task[]) => {
    setUserProfile(prev => ({ ...prev, tasks: newTasks }));
  };

  const openHabitModal = (habit?: Task) => {
    if (habit) {
      setEditingHabit(habit);
      setHabitForm({
        action: habit.title,
        place: habit.habitFormula?.split('at ')[1]?.split(' at')[0] || '',
        time: habit.habitFormula?.split('at ')[2]?.split(',')[0] || '',
      });
    } else {
      setEditingHabit(null);
      setHabitForm({ action: '', place: '', time: '' });
    }
    setIsHabitModalOpen(true);
  };

  const saveHabit = () => {
    const formula = `When I am at ${habitForm.place} at ${habitForm.time}, I will ${habitForm.action}.`;
    if (editingHabit) {
      setTasks(userProfile.tasks.map(t => t.id === editingHabit.id ? { 
        ...t, 
        title: habitForm.action, 
        habitFormula: formula 
      } : t));
    } else {
      const newHabit: Task = {
        id: Math.random().toString(36).substring(7),
        title: habitForm.action,
        reason: 'Personal ritual',
        importance: 3,
        completed: false,
        isHabit: true,
        habitFormula: formula
      };
      setTasks([newHabit, ...userProfile.tasks]);
    }
    setIsHabitModalOpen(false);
  };

  const renderContent = () => {
    switch (appState) {
      case 'WELCOME': return <Welcome onStart={() => setAppState('ONBOARDING')} />;
      case 'ONBOARDING': return <Onboarding onComplete={handleOnboardingComplete} />;
      case 'WHY_DIFFERENT': return <WhyDifferent onNext={() => setAppState('AUTH')} />;
      case 'AUTH': return <Auth onSuccess={handleAuthComplete} onboardingData={userProfile.onboardingData} />;
      case 'SOLUTION_REVEAL': return <SolutionReveal onNext={() => setAppState('DIAGNOSIS')} />;
      case 'DIAGNOSIS': return <DiagnosisScreen answers={userProfile.onboardingData!} onComplete={handleDiagnosisComplete} />;
      case 'PAYWALL': return <Paywall onSubscribe={() => { setUserProfile({...userProfile, isSubscribed: true}); setAppState('MAIN'); }} />;
      case 'MAIN': return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab} onPlusClick={() => openHabitModal()}>
          {activeTab === 'TODAY' && <TodayTab tasks={userProfile.tasks} setTasks={setTasks} onEditHabit={openHabitModal} isSubscribed={userProfile.isSubscribed} />}
          {activeTab === 'BRAIN_DUMP' && <BrainDumpTab tasks={userProfile.tasks} setTasks={setTasks} isSubscribed={userProfile.isSubscribed} />}
          {activeTab === 'PLAN' && <PlanTab tasks={userProfile.tasks} isSubscribed={userProfile.isSubscribed} />}
          {activeTab === 'INSIGHTS' && <InsightsTab tasks={userProfile.tasks} isSubscribed={userProfile.isSubscribed} />}
        </Layout>
      );
    }
  };

  return (
    <div className="min-h-screen selection:bg-emerald-500/30">
      {renderContent()}

      {/* Global Centered Habit Modal */}
      {isHabitModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-fade">
          <div className="premium-glass p-10 rounded-[3rem] w-full max-w-md border border-white/10 shadow-2xl relative">
            <h2 className="text-3xl font-light text-white mb-8">
              {editingHabit ? 'Edit Ritual' : 'New Ritual'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">I will...</label>
                <input 
                  type="text"
                  placeholder="e.g., meditate for 5 minutes"
                  value={habitForm.action}
                  onChange={(e) => setHabitForm({...habitForm, action: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">When I am at...</label>
                  <input 
                    type="text"
                    placeholder="e.g., My Desk"
                    value={habitForm.place}
                    onChange={(e) => setHabitForm({...habitForm, place: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">At...</label>
                  <input 
                    type="text"
                    placeholder="e.g., 9:00 AM"
                    value={habitForm.time}
                    onChange={(e) => setHabitForm({...habitForm, time: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <button 
                onClick={() => setIsHabitModalOpen(false)}
                className="flex-1 py-5 bg-slate-900 text-slate-500 font-bold rounded-[1.5rem] border border-white/5"
              >
                Cancel
              </button>
              <button 
                onClick={saveHabit}
                disabled={!habitForm.action || !habitForm.place || !habitForm.time}
                className="flex-[2] py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white font-bold rounded-[1.5rem] shadow-xl"
              >
                Save Ritual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
