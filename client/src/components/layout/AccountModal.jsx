import { useState } from 'react';
import { X, User, Lock, Mail, Crown, Shield, ArrowRight } from 'lucide-react';

export default function AccountModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-emerald-900/10 relative p-6 sm:p-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-cream-soft hover:bg-gray-200 text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoggedIn ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-900 text-amber-300 flex items-center justify-center mx-auto shadow-lg">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-950 font-serif">Welcome, Royal Member</h3>
              <p className="text-xs text-emerald-800 font-semibold mt-1">Tier: Gold Ergonomic VIP • 10% Discount Active</p>
            </div>
            <div className="bg-cream-soft p-4 rounded-2xl text-left text-xs space-y-2 border border-gray-200">
              <p><strong>Email:</strong> {email || 'member@royalchairs.co.uk'}</p>
              <p><strong>Saved Delivery Addresses:</strong> 1 Showroom Address</p>
              <p><strong>Active Orders:</strong> 1 In Transit</p>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition"
            >
              Sign Out of Account
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-amber-300 flex items-center justify-center shadow-md">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-950 font-serif">
                  {isLogin ? 'Royal Member Login' : 'Create VIP Account'}
                </h3>
                <p className="text-xs text-gray-500">Access exclusive chair pricing & order history</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5 flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1 text-emerald-800" />
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

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block mb-1.5 flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1 text-emerald-800" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-cream-soft border border-gray-300 rounded-xl text-sm font-semibold focus:outline-hidden focus:border-emerald-700"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-900 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-lg transition text-sm flex items-center justify-center space-x-2"
              >
                <span>{isLogin ? 'Sign In to Account' : 'Register VIP Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                {isLogin ? "Don't have an account? Register Here" : 'Already a member? Sign In'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
