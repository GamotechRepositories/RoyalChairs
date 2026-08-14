import { useState, useEffect } from 'react';
import { X, User, Lock, Mail, Crown, ArrowRight, Loader2, AlertCircle, LogOut } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

export default function AccountModal({ isOpen, onClose }) {
  const { user, login, register, googleLogin, logout, loading, authError, setAuthError, isAuthenticated } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginTab) {
      const res = await login(email, password);
      if (res?.success) {
        setPassword('');
        onClose();
      }
    } else {
      const res = await register(name, email, password);
      if (res?.success) {
        setName('');
        setPassword('');
        onClose();
      }
    }
  };

  const handleSwitchTab = (toLogin) => {
    setIsLoginTab(toLogin);
    setAuthError(null);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/15 relative cursor-default transition-all duration-300 max-h-[90vh] overflow-y-auto"
      >
        {/* Luxury Banner Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white p-6 sm:p-7 relative overflow-hidden">
          {/* Subtle Ambient Light Circle */}
          <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/90 transition backdrop-blur-xs cursor-pointer z-10"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <div className="w-13 h-13 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-lg border border-emerald-700 flex-shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                  User Dashboard
                </span>
                <h3 className="text-xl font-black font-serif text-white leading-tight">
                  Welcome, {user.name}!
                </h3>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-md flex-shrink-0">
                <User className="w-6 h-6 stroke-[2.4]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300">
                  User Account Portal
                </span>
                <h3 className="text-xl font-black font-serif text-white">
                  {isLoginTab ? 'Member Sign In' : 'Create Member Account'}
                </h3>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-7">
          {isAuthenticated && user ? (
            /* LOGGED IN USER PROFILE VIEW */
            <div className="space-y-5">
              <div className="bg-slate-50 p-5 rounded-2xl text-xs space-y-3.5 border border-slate-200 shadow-2xs">
                <div className="flex justify-between items-center border-b border-slate-200/80 pb-3">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Account Holder</span>
                  <span className="font-extrabold text-slate-900 text-sm">{user.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200/80 pb-2.5">
                  <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Email Address</span>
                  <span className="font-bold text-gray-800">{user.email}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200/80 pb-2.5">
                  <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Membership Tier</span>
                  <span className="font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    VIP ROYAL MEMBER
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Account Status</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                    Active Member
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          ) : (
            /* LOGIN & REGISTER FORM VIEW */
            <div>
              {/* Tab Selector */}
              <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-6 border border-gray-200/80">
                <button
                  type="button"
                  onClick={() => handleSwitchTab(true)}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition cursor-pointer ${isLoginTab
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'text-gray-600 hover:text-emerald-950 font-bold'
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchTab(false)}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition cursor-pointer ${!isLoginTab
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'text-gray-600 hover:text-emerald-950 font-bold'
                    }`}
                >
                  Register
                </button>
              </div>

              {/* Express Error Notification */}
              {authError && (
                <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name field (Register mode only) */}
                {!isLoginTab && (
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 block mb-1.5 flex items-center">
                      <User className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Sterling"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-emerald-600 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-3 focus:ring-emerald-600/10 transition"
                    />
                  </div>
                )}

                {/* Email Address field */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 block mb-1.5 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@royalchairs.co.uk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-emerald-600 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-3 focus:ring-emerald-600/10 transition"
                  />
                </div>

                {/* Password field */}
                <div>
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 block mb-1.5 flex items-center">
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-white focus:bg-white border border-gray-200 focus:border-emerald-600 rounded-xl text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-hidden focus:ring-3 focus:ring-emerald-600/10 transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition transform active:scale-98 disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <span>{isLoginTab ? 'Sign In to Account' : 'Register Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-5 flex items-center justify-center">
                <div className="border-t border-gray-200/80 w-full"></div>
                <span className="bg-white px-3 text-[10px] font-black text-gray-400 uppercase tracking-widest absolute">
                  OR CONTINUE WITH
                </span>
              </div>

              {/* Google Sign-In Button */}
              <div className="flex justify-center w-full min-h-[44px]">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    if (credentialResponse.credential) {
                      const res = await googleLogin(credentialResponse.credential);
                      if (res?.success) {
                        onClose();
                      }
                    }
                  }}
                  onError={() => {
                    setAuthError('Google sign-in was cancelled or failed.');
                  }}
                  shape="pill"
                  theme="outline"
                  size="large"
                  width="100%"
                  text={isLoginTab ? "signin_with" : "signup_with"}
                />
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 text-center">
                <button
                  type="button"
                  onClick={() => handleSwitchTab(!isLoginTab)}
                  className="text-xs font-extrabold text-emerald-800 hover:text-emerald-950 hover:underline transition cursor-pointer"
                >
                  {isLoginTab ? "Don't have an account? Create Account Here" : 'Already a member? Sign In'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
