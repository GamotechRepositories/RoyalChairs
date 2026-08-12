import { useState } from 'react';
import { Crown, Send, ShieldCheck, Truck, RefreshCw, Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-emerald-900 text-emerald-100 pt-16 pb-8 border-t border-emerald-800">
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Newsletter */}
        <div className="bg-emerald-800/90 rounded-3xl p-8 lg:p-10 border border-emerald-700 shadow-2xl mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block bg-amber-400 text-emerald-950 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full mb-3">
              ROYAL MEMBER CLUB
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">
              Join for Exclusive Member Updates &amp; Secret Drops
            </h3>
            <p className="text-emerald-200 text-xs sm:text-sm mt-2">
              Subscribe to receive private showroom previews, maintenance guides, and members-only flash sales.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div className="bg-emerald-950 p-4 rounded-2xl border border-amber-300 text-amber-300 text-sm font-extrabold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                <span>Welcome to Royal Member Club! Check your inbox for updates.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-emerald-950/90 text-white placeholder-emerald-300 text-sm px-4 py-3.5 rounded-xl border border-emerald-700 focus:outline-hidden focus:border-amber-400 flex-1"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Subscribe</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center space-x-3">
              <img
                src="/logo.svg"
                alt="Royal Chairs and Sofa Maker Pune"
                className="w-12 h-12 object-contain rounded-full shadow-md border border-amber-300/60 bg-white"
              />
              <span className="text-xl font-black text-white font-serif">
                ROYAL CHAIRS <span className="text-amber-300 font-sans font-light">&amp; Sofa Maker • Pune</span>
              </span>
            </a>

            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-sm">
              Engineered luxury seating co-developed with British spine orthopedists. Handcrafted using sustainable English oak, Italian top-grain leathers, and rich plush velvets.
            </p>

            <div className="space-y-2 text-xs text-emerald-100 pt-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Concierge Support: +44 (0) 800 917 2026</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-amber-300" />
                <span>concierge@royalchairs.co.uk</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-amber-300" />
                <span>Flagship Showroom: 42 Mayfair Square, London W1K</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300 font-serif mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium text-emerald-100">
              <li><a href="#" className="hover:text-white transition">Home Dashboard</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Shop Categories</a></li>
              <li><a href="#best-sellers" className="hover:text-white transition">Best Seller Chairs</a></li>
              <li><a href="#new-collection" className="hover:text-white transition">2026 New Collection</a></li>
              <li><a href="#special-offers" className="hover:text-white font-bold text-amber-300 transition">Offers (Up to 50% OFF)</a></li>
              <li><a href="#why-choose-us" className="hover:text-white transition">Why Choose Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300 font-serif mb-4">
              Chair Ranges
            </h4>
            <ul className="space-y-2 text-xs font-medium text-emerald-100">
              <li><a href="#shop-by-category" className="hover:text-white transition">Wooden Chairs</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Ergonomic Task Chairs</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Plastic & Molded</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Pro Gaming Thrones</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Velvet & Loungers</a></li>
              <li><a href="#shop-by-category" className="hover:text-white transition">Executive Leather</a></li>
            </ul>
          </div>

          {/* Guarantees */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-300 font-serif mb-4">
              The Royal Guarantee
            </h4>
            <div className="space-y-3 text-xs text-emerald-100">
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <span>10-Year Master Frame Guarantee</span>
              </div>
              <div className="flex items-start space-x-2">
                <Truck className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <span>Free White-Glove Room Delivery</span>
              </div>
              <div className="flex items-start space-x-2">
                <RefreshCw className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <span>30-Day Ergonomic Home Trial</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/80 gap-4">
          <p>© 2026 RoyalChairs Ltd. Handcrafted Luxury Seating. All rights reserved.</p>

          <div className="flex items-center space-x-3">
            <span className="bg-emerald-950 px-2 py-1 rounded text-[10px] font-bold text-amber-200">Visa</span>
            <span className="bg-emerald-950 px-2 py-1 rounded text-[10px] font-bold text-amber-200">Mastercard</span>
            <span className="bg-emerald-950 px-2 py-1 rounded text-[10px] font-bold text-amber-200">Amex</span>
            <span className="bg-emerald-950 px-2 py-1 rounded text-[10px] font-bold text-amber-200">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
