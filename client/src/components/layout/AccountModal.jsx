import { useState, useEffect } from 'react';
import { X, User, Lock, Mail, ArrowRight, Loader2, AlertCircle, LogOut } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

export default function AccountModal({ isOpen, onClose, onLoginSuccess }) {
  const { login, register, googleLogin, loading, authError, setAuthError, isAuthenticated } = useAuth();

  const [isLoginTab, setIsLoginTab] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsLoginTab(true);
      setAuthError(null);
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

  if (!isOpen || isAuthenticated) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginTab) {
      const res = await login(email, password);
      if (res?.success) {
        setPassword('');
        onClose();
        if (onLoginSuccess) onLoginSuccess();
      }
    } else {
      const res = await register(name, email, password);
      if (res?.success) {
        setName('');
        setPassword('');
        onClose();
        if (onLoginSuccess) onLoginSuccess();
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

          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-800 text-amber-300 flex items-center justify-center shadow-md flex-shrink-0">
              <User className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-white">
                {isLoginTab ? 'Sign In' : 'Sign Up'}
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-7">
          <div>
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
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 mb-1.5 flex items-center">
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
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 mb-1.5 flex items-center">
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
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-950 mb-1.5 flex items-center">
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
                        if (onLoginSuccess) onLoginSuccess();
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
        </div>
      </div>
    </div>
  );
}
