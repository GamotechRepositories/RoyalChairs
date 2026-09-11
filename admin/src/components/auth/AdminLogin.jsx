import { useState } from 'react';
import { Crown, Lock, Mail, ArrowRight, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { login, loading, authError } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    await login(email.trim(), password);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Subtle Background Elements */}
      <div className="absolute -top-48 -left-48 w-[500px] h-[500px] bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[420px] bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-9 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-amber-300/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/25">
            <Crown className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-serif tracking-wider text-slate-900">
              ROYAL<span className="text-emerald-700 font-light">CHAIRS</span>
            </h1>
            <p className="text-[11px] text-emerald-800 font-extrabold uppercase tracking-widest mt-1">
              Executive HQ Portal
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span className="font-semibold">{authError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@royalchairs.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-hidden text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 focus:outline-hidden text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-slate-600 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-emerald-700 focus:ring-emerald-500 w-3.5 h-3.5 border-slate-300"
              />
              <span>Remember session</span>
            </label>

            <span className="flex items-center space-x-1 text-[11px] text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted Access</span>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-600 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/20 flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-100">
          <a
            href={import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173'}
            className="text-xs text-slate-500 hover:text-emerald-800 font-bold transition inline-flex items-center space-x-1"
          >
            <span>← Return to Storefront</span>
          </a>
        </div>
      </div>
    </div>
  );
}
