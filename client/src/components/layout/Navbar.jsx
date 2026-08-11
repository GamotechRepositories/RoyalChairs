import { useState, useId } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Sparkles, Percent, Truck, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar({ onOpenSearch, onOpenTrackOrder, onOpenAccount, onNavigateHome, onNavigateShopCategories }) {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputId = useId();

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      {/* Top Banner Notice */}
      <div className="bg-emerald-700 text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center space-x-2 border-b border-emerald-600">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>
          Royal Craftsmanship Event: Save up to <strong className="text-amber-300 font-extrabold">50% OFF</strong> + Free White-Glove Room Delivery!
        </span>
        <button onClick={onNavigateShopCategories} className="underline font-bold text-amber-200 hover:text-white ml-2">
          View Offers
        </button>
      </div>

      {/* Main Glass Header */}
      <nav className="glass-header border-b border-emerald-500/20 shadow-xs px-3 sm:px-6 lg:px-8 py-3">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* 1. Logo */}
          <button onClick={onNavigateHome} className="flex items-center space-x-3 flex-shrink-0 group text-left">
            <img
              src="/logo.svg"
              alt="Royal Chairs and Sofa Maker Pune"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-full shadow-md group-hover:scale-105 transition border border-amber-300/60"
            />
            <div className="hidden sm:block">
              <span className="text-lg sm:text-xl font-black tracking-tight text-emerald-900 block font-serif leading-tight">
                ROYAL <span className="text-emerald-700 font-sans font-light">CHAIRS</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-amber-700 font-bold block -mt-0.5">
                &amp; Sofa Maker • Pune
              </span>
            </div>
          </button>

          {/* 2. Inline Searchbar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-4">
            <div
              onClick={onOpenSearch}
              className="relative flex items-center bg-emerald-50/70 hover:bg-emerald-100/60 text-gray-600 rounded-xl px-3.5 py-2 text-xs border border-emerald-200/80 cursor-pointer transition shadow-xs group"
            >
              <label htmlFor={searchInputId} className="sr-only">Search Chairs</label>
              <Search className="w-4 h-4 text-emerald-700 mr-2 flex-shrink-0 group-hover:scale-110 transition" />
              <input
                id={searchInputId}
                type="text"
                readOnly
                placeholder="Search wooden, plastic, gaming, velvet chairs..."
                className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-hidden cursor-pointer text-xs font-medium"
              />
              <span className="hidden md:inline-block bg-white text-emerald-800 font-semibold px-2 py-0.5 rounded-md border border-emerald-200 text-[10px]">
                Search ↵
              </span>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
            
            {/* 3. Best Deal Button */}
            <a
              href="#special-offers"
              className="hidden lg:flex items-center space-x-1 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-emerald-900 text-xs font-black rounded-xl transition border border-amber-300/60 shadow-xs"
            >
              <Percent className="w-3.5 h-3.5 text-amber-600" />
              <span>Best Deals</span>
            </a>

            {/* 4. Track Order Button */}
            <button
              onClick={onOpenTrackOrder}
              className="hidden md:flex items-center space-x-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition border border-emerald-200/80 shadow-xs"
              title="Track Order"
            >
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Track Order</span>
            </button>

            {/* 5. Account Button */}
            <button
              onClick={onOpenAccount}
              className="flex items-center space-x-1 p-2 sm:px-3 sm:py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition border border-emerald-200/80 shadow-xs"
              title="Account / VIP Sign In"
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Account</span>
            </button>

            {/* 6. Wishlist Icon */}
            <a
              href="#best-sellers"
              className="relative p-2 text-gray-700 hover:text-rose-600 transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-800" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </a>

            {/* 7. Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition flex items-center space-x-1.5 shadow-md"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold">Bag</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-emerald-950 text-[11px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center ml-0.5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-emerald-800 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-emerald-100 space-y-2 pb-2 animate-fadeIn">
            <a
              href="#special-offers"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-black text-emerald-900 bg-amber-100 rounded-lg"
            >
              <Percent className="w-4 h-4 text-amber-600" />
              <span>Best Deals (Up to 50% OFF)</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackOrder();
              }}
              className="w-full text-left flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-emerald-50 rounded-lg"
            >
              <Truck className="w-4 h-4 text-emerald-700" />
              <span>Track Delivery Status</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAccount();
              }}
              className="w-full text-left flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-emerald-50 rounded-lg"
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span>Account / VIP Login</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
