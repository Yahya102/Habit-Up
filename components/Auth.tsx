
import React, { useState } from 'react';
import { signUpUser, loginUser } from '../services/authService';
import { OnboardingAnswers, UserProfile } from '../types';

interface AuthProps {
  onSuccess: (profile: UserProfile) => void;
  onboardingData?: OnboardingAnswers;
}

const Auth: React.FC<AuthProps> = ({ onSuccess, onboardingData }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; type?: 'NOT_FOUND' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let profile: UserProfile;
      if (isLogin) {
        profile = await loginUser(email, password);
      } else {
        profile = await signUpUser(name, email, password, onboardingData);
      }
      onSuccess(profile);
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.message.includes("No account found")) {
        setError({ message: err.message, type: 'NOT_FOUND' });
      } else {
        setError({ message: err.message || 'Authentication failed.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    try {
      const profile = await loginUser('demo@ai.com', 'password');
      onSuccess(profile);
    } catch (err) {
      // In case bootstrap failed, just sign up a demo user
      const profile = await signUpUser('Demo User', 'demo@ai.com', 'password');
      onSuccess(profile);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-fade">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extralight text-white mb-2 leading-tight">
            {isLogin ? 'Welcome back' : 'Create Your Profile'}
          </h1>
          <p className="text-slate-400 font-light italic">
            {isLogin ? 'Sign in to access your cognitive map' : 'Your data is stored locally and securely'}
          </p>
        </div>

        <div className="premium-glass p-8 rounded-[3rem] border-white/5 shadow-2xl">
          {error && (
            <div className="mb-6 animate-fade">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center font-medium">
                {error.message}
              </div>
              {error.type === 'NOT_FOUND' && (
                <button
                  onClick={() => setIsLogin(false)}
                  className="w-full mt-3 py-3 bg-white/5 border border-white/10 rounded-xl text-emerald-500 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Create account with this email instead
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-4">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all font-light"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 ml-4">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all font-light"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2 ml-4 mr-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all font-light"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-lg rounded-[2rem] transition-all shadow-xl shadow-emerald-950/40 active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? 'Log In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-slate-600">
                <span className="bg-[#020617] px-4">Instant Access</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-center hover:bg-emerald-500/10 transition-all group"
            >
              <span className="text-[10px] font-bold text-emerald-500 group-hover:text-emerald-400 uppercase tracking-widest">Try Demo Dashboard</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm font-light">
            {isLogin ? "Don't have a profile?" : "Already have a profile?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-emerald-500 font-bold hover:text-emerald-400 transition-colors underline underline-offset-4"
            >
              {isLogin ? 'Create One' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
