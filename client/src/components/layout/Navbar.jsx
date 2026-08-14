import { useId } from "react";
import { Search, ShoppingCart, Heart, User, Crown } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onOpenSearch, onOpenTrackOrder, onOpenAccount, onOpenWishlist, onOpenCart, onNavigateHome, onNavigateShopCategories }) {
  const { cartCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const searchInputId = useId();

  return (
    <header className="sticky top-0 z-40 w-full transition-all">
      <nav className="glass-header border-b border-emerald-500/20 shadow-xs px-3 sm:px-6 lg:px-8 py-3">
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between gap-2 sm:gap-4">

          {/* Logo */}
          <button onClick={onNavigateHome} className="flex items-center flex-shrink-0 group text-left cursor-pointer" title="Royal Chairs Home">
            <img
              src="/logo.svg"
              alt="Royal Chairs and Sofa Maker Pune"
              className="w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain rounded-full shadow-md group-hover:scale-105 transition border-2 border-amber-300/80 bg-white"
            />
          </button>

          {/* Inline Searchbar - hidden on mobile, visible sm+ */}
          <div className="hidden sm:flex flex-1 max-w-2xl mx-3 sm:mx-6">
            <div
              onClick={onOpenSearch}
              className="relative flex items-center w-full bg-emerald-50/80 hover:bg-emerald-100/70 text-gray-600 rounded-2xl px-4 py-2.5 sm:py-3 text-sm border border-emerald-200 cursor-pointer transition shadow-xs group"
            >
              <label htmlFor={searchInputId} className="sr-only">Search Chairs</label>
              <Search className="w-5 h-5 text-emerald-700 mr-3 flex-shrink-0 group-hover:scale-110 transition" />
              <input
                id={searchInputId}
                type="text"
                readOnly
                placeholder="Search wooden, plastic, gaming, velvet chairs..."
                className="w-full bg-transparent text-gray-800 placeholder-gray-500 focus:outline-hidden cursor-pointer text-sm font-medium"
              />
              <span className="hidden md:inline-flex items-center space-x-1 bg-white text-emerald-800 font-bold px-2.5 py-1 rounded-lg border border-emerald-200/80 text-xs shadow-2xs">
                <span>Search</span>
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">

            {/* Mobile Search Icon - only on mobile */}
            <button
              onClick={onOpenSearch}
              className="sm:hidden p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition border border-emerald-200/80 shadow-xs cursor-pointer"
              title="Search"
              aria-label="Open search"
            >
              <Search className="w-5 h-5 text-emerald-700" />
            </button>

            {/* Account Button */}
            <button
              onClick={onOpenAccount}
              className="flex items-center justify-center p-2 sm:p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl transition border border-emerald-200/80 shadow-xs cursor-pointer"
              title={isAuthenticated ? "Account" : "Account / Sign In"}
            >
              {isAuthenticated ? (
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-amber-600" />
              ) : (
                <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-700" />
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-gray-700 hover:text-rose-600 transition cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-emerald-800" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-extrabold w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => {
                if (onOpenCart) onOpenCart();
                else setIsCartOpen(true);
              }}
              className="relative p-2 sm:p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition flex items-center justify-center shadow-md cursor-pointer"
              title="Shopping Cart Page"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-emerald-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}