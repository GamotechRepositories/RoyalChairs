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
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/10 relative p-6 sm:p-8 cursor-default"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-cream-soft hover:bg-gray-200 text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isAuthenticated && user ? (
          /* LOGGED IN USER PROFILE VIEW */
          <div className="text-center py-4 space-y-5">
            <div className="w-20 h-20 rounded-full bg-emerald-700 text-amber-300 flex items-center justify-center mx-auto shadow-lg border-2 border-amber-300">
              <Crown className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-emerald-950 font-serif">
                Welcome, {user.name}!
              </h3>
              <span className="inline-block mt-1 bg-amber-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
                ROYAL MEMBER • {user.role.toUpperCase()}
              </span>
            </div>

            <div className="bg-cream-soft p-5 rounded-2xl text-left text-xs space-y-2.5 border border-emerald-100 shadow-xs">
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-semibold">Account Email:</span>
                <span className="font-bold text-gray-900">{user.email}</span>
              </div>
              <div className="flex justify-between border-b border-gray-200/60 pb-2">
                <span className="text-gray-500 font-semibold">Member Status:</span>
                <span className="font-bold text-emerald-700">Verified Member</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-semibold">Room Delivery:</span>
                <span className="font-bold text-emerald-700">White-Glove Free</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        ) : (
          /* LOGIN & REGISTER FORM VIEW */
          <div>
            {/* Modal Brand Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-emerald-700 text-amber-300 flex items-center justify-center shadow-md flex-shrink-0">
                <Crown className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-950 font-serif">
                  {isLoginTab ? 'Member Login' : 'Create Account'}
                </h3>
                <p className="text-xs text-gray-500">Access your saved chairs &amp; order history</p>
              </div>
            </div>

            {/* Login / Register Toggle Tabs */}
            <div className="flex bg-cream-soft p-1 rounded-xl border border-gray-200 mb-5">
              <button
                type="button"
                onClick={() => handleSwitchTab(true)}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition ${
                  isLoginTab ? 'bg-emerald-700 text-white shadow-xs' : 'text-gray-600 hover:text-emerald-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleSwitchTab(false)}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition ${
                  !isLoginTab ? 'bg-emerald-700 text-white shadow-xs' : 'text-gray-600 hover:text-emerald-900'
                }`}
              >
                Register
              </button>
            </div>

            {/* Express Error Notification Banner */}
            {authError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name field (Register mode only) */}
              {!isLoginTab && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lord Sterling"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-cream-soft border border-gray-300 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-emerald-700"
                  />
                </div>
              )}

              {/* Email Address field */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.email@royalchairs.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-cream-soft border border-gray-300 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              {/* Password field */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-cream-soft border border-gray-300 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60 text-white font-extrabold rounded-xl shadow-lg transition text-sm flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Server...</span>
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
            <div className="relative my-4 flex items-center justify-center">
              <div className="border-t border-gray-200 w-full"></div>
              <span className="bg-white px-3 text-[11px] font-extrabold text-gray-400 uppercase tracking-wider absolute">
                OR
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

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <button
                type="button"
                onClick={() => handleSwitchTab(!isLoginTab)}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                {isLoginTab ? "Don't have an account? Register Here" : 'Already a member? Sign In'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
