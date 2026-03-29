import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, UserPlus, Sun, Moon, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const LoginScreen: React.FC = () => {
  const { login, signup } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      const code = err.code || '';
      if (code === 'auth/user-not-found') setError('No account found. Sign up first.');
      else if (code === 'auth/wrong-password') setError('Wrong password.');
      else if (code === 'auth/invalid-credential') setError('Invalid credentials.');
      else if (code === 'auth/email-already-in-use') setError('Email already registered.');
      else if (code === 'auth/weak-password') setError('Password must be at least 6 characters.');
      else setError(err.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e40af] to-[#059669] flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-white font-black text-2xl">SG</span>
          </div>
          <h1 className="text-4xl font-extrabold text-primary mb-1">
            ShopGenie AI
          </h1>
          <p className="text-text-muted font-medium text-sm">Your AI-Powered Business StockBuddy</p>
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full bg-panel hover:bg-background border border-border text-text transition-all shadow-md"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-warning" />}
          </button>
        </div>

        <div className="bg-panel border border-border rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex gap-2 mb-6 bg-background/50 border border-border/50 rounded-xl p-1">
            <button
              onClick={() => { setIsSignup(false); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-sm font-bold ${
                !isSignup 
                  ? 'bg-[#1e40af] text-white shadow-md' 
                  : 'text-[#4b5563] hover:bg-gray-100'
              }`}
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
            <button
              onClick={() => { setIsSignup(true); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-sm font-bold ${
                isSignup 
                  ? 'bg-[#1e40af] text-white shadow-md' 
                  : 'text-[#4b5563] hover:bg-gray-100'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#111827] mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="name@store.com"
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-[#1e40af] focus:ring-4 focus:ring-[#1e40af]/10 outline-none transition-all placeholder:text-text-muted/50 text-[#111827]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#111827] mb-1.5 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border focus:border-[#1e40af] focus:ring-4 focus:ring-[#1e40af]/10 outline-none transition-all placeholder:text-text-muted/50 text-[#111827]"
              />
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-[#1e40af]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In to StockBuddy')}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 text-xs text-text-muted justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Secured by Firebase Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
