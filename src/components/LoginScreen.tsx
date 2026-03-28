import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, UserPlus } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, signup } = useAuth();
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
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />

      <div className="w-full max-w-md relative z-10 animate-fadeIn">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20 ring-1 ring-white/10">
            <span className="text-white font-bold text-2xl">SG</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent tracking-tight">
            ShopGenie AI
          </h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Your AI-Powered Business Copilot</p>
        </div>

        <div className="bg-[#000000]/40 border border-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          <div className="flex gap-2 mb-8 bg-white/5 rounded-2xl p-1.5 border border-white/5">
            <button
              onClick={() => { setIsSignup(false); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                !isSignup ? 'bg-primary/90 text-white shadow-lg shadow-primary/20 ring-1 ring-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="w-4 h-4" /> Login
            </button>
            <button
              onClick={() => { setIsSignup(true); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                isSignup ? 'bg-accent/90 text-white shadow-lg shadow-accent/20 ring-1 ring-white/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-zinc-300 mb-2 block tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="owner@shop.com"
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-zinc-300 mb-2 block tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-5 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 hover:border-white/20"
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
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 mt-4"
            >
              {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Login Securely')}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-2 text-xs text-zinc-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-primary animate-pulse-glow" />
            <span className="uppercase tracking-widest font-semibold">Firebase Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
};
