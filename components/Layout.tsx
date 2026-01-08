
import React from 'react';
import { Tab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onPlusClick: () => void;
}

interface TabButtonProps {
  tab: { id: Tab; label: string; icon: React.ReactNode };
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(tab.id)}
    className={`relative flex-1 py-3 flex flex-col items-center gap-1 transition-all duration-500 rounded-2xl ${
      activeTab === tab.id ? 'text-white' : 'text-slate-500'
    }`}
  >
    {activeTab === tab.id && (
      <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl animate-fade"></div>
    )}
    <div className={`transition-transform duration-300 ${activeTab === tab.id ? '-translate-y-1' : ''}`}>
      {tab.icon}
    </div>
    <span className="text-[8px] font-semibold tracking-widest uppercase opacity-80">{tab.label}</span>
    {activeTab === tab.id && (
      <div className="w-1 h-1 bg-emerald-500 rounded-full mt-0.5 glow-emerald"></div>
    )}
  </button>
);

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onPlusClick }) => {
  const tabsLeft: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'TODAY', 
      label: 'Focus',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg> 
    },
    { 
      id: 'BRAIN_DUMP', 
      label: 'Dump',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> 
    }
  ];

  const tabsRight: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'PLAN', 
      label: 'Plan',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
      id: 'INSIGHTS', 
      label: 'Stats',
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg> 
    }
  ];

  return (
    <div className="pb-36 pt-4 min-h-screen">
      <main className="max-w-xl mx-auto px-6">
        {children}
      </main>
      
      <div className="fixed bottom-8 left-0 right-0 px-6 z-50">
        <nav className="max-w-md mx-auto premium-glass rounded-[2.5rem] p-2 flex justify-between items-center border border-white/10 shadow-2xl relative">
          {tabsLeft.map(tab => (
            <TabButton 
              key={tab.id} 
              tab={tab} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          ))}
          
          <div className="flex-none flex justify-center -mt-10 px-2">
            <button 
              onClick={onPlusClick}
              className="w-16 h-16 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all hover:scale-110 active:scale-95 border-4 border-slate-950"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v12M6 12h12"/></svg>
            </button>
          </div>

          {tabsRight.map(tab => (
            <TabButton 
              key={tab.id} 
              tab={tab} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
