import { useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import BannerSlideshow from './components/home/BannerSlideshow';
import ShopByCategory from './components/home/ShopByCategory';
import BestSellers from './components/home/BestSellers';
import NewCollection from './components/home/NewCollection';
import HighDiscountOffers from './components/home/HighDiscountOffers';
import WhyChooseUs from './components/home/WhyChooseUs';
import Footer from './components/layout/Footer';

import CategoryShopPage from './components/shop/CategoryShopPage';
import SearchModal from './components/layout/SearchModal';
import TrackOrderModal from './components/layout/TrackOrderModal';
import AccountModal from './components/layout/AccountModal';
import WishlistModal from './components/layout/WishlistModal';
import CartDrawer from './components/ui/CartDrawer';
import QuickViewModal from './components/home/QuickViewModal';
import { Sparkles } from 'lucide-react';

function DashboardContent() {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' or 'category-page'
  const [selectedCategoryId, setSelectedCategoryId] = useState('gaming');

  const [searchOpen, setSearchOpen] = useState(false);
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { toastMessage } = useCart();

  const handleOpenCategory = (catId) => {
    setSelectedCategoryId(catId || 'gaming');
    setActiveView('category-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-amber-200 selection:text-emerald-950">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-300/40 flex items-center space-x-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="text-sm font-extrabold">{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenTrackOrder={() => setTrackOrderOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
        onNavigateHome={() => setActiveView('dashboard')}
        onNavigateShopCategories={() => handleOpenCategory('wooden')}
      />

      <main>
        {activeView === 'category-page' ? (
          /* DEDICATED CATEGORY SHOP PAGE VIEW (Category highlighted on left sidebar) */
          <CategoryShopPage
            initialCategory={selectedCategoryId}
            onBackToHome={() => setActiveView('dashboard')}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        ) : (
          /* MAIN HOMEPAGE DASHBOARD (All sections show complete catalog by default) */
          <>
            {/* 2. Banner Slideshow (Full Width edge-to-edge) */}
            <BannerSlideshow />

            {/* 3. Shop By List (Clean icon list, clicking any opens Category Page) */}
            <ShopByCategory
              onSelectCategory={(catId) => handleOpenCategory(catId)}
            />

            {/* 4. Best Seller (Displays ALL best sellers by default) */}
            <BestSellers
              onQuickView={(prod) => setQuickViewProduct(prod)}
            />

            {/* 5. New Collection */}
            <NewCollection onQuickView={(prod) => setQuickViewProduct(prod)} />

            {/* 6. Offers (High to Low % wise) */}
            <HighDiscountOffers onQuickView={(prod) => setQuickViewProduct(prod)} />

            {/* 7. Why Choose Us */}
            <WhyChooseUs />
          </>
        )}
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* Modals & Drawers */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      <TrackOrderModal
        isOpen={trackOrderOpen}
        onClose={() => setTrackOrderOpen(false)}
      />

      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
      />

      <WishlistModal
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      <CartDrawer />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <AuthProvider>
          <DashboardContent />
        </AuthProvider>
      </WishlistProvider>
    </CartProvider>
  );
}