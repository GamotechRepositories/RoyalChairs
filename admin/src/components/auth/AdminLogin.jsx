import { useState } from 'react';
import { Crown, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { login, loading, authError } = useAdminAuth();

  const [email, setEmail] = useState('admin@royalchairs.co.uk');
  const [password, setPassword] = useState('admin123');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-900 border border-amber-300/60 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/20">
            <Crown className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-serif tracking-wider text-slate-900">
              ROYAL<span className="text-emerald-700 font-light">CHAIRS</span>
            </h1>
            <p className="text-xs text-emerald-800 font-extrabold uppercase tracking-widest mt-1">
              Executive HQ Command Portal
            </p>
          </div>
        </div>

        {/* Error message */}
        {authError && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@royalchairs.co.uk"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:outline-hidden text-sm"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-900 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Executive Access:</span>
            </div>
            <p>Email: <span className="font-mono text-slate-900 font-bold">admin@royalchairs.co.uk</span></p>
            <p>Password: <span className="font-mono text-slate-900 font-bold">admin123</span></p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-900/20 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Enter Command Center</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <a
            href="http://localhost:5173"
            className="text-xs text-slate-500 hover:text-emerald-800 font-bold transition"
          >
            ← Return to Customer Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
