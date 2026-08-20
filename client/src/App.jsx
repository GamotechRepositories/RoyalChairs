import { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import BannerSlideshow from './components/home/BannerSlideshow';
import ShopByCategory from './components/home/ShopByCategory';
import BestSellers from './components/home/BestSellers';
import NewCollection from './components/home/NewCollection';
import HighDiscountOffers from './components/home/HighDiscountOffers';
import WhyChooseUs from './components/home/WhyChooseUs';
import Footer from './components/layout/Footer';

import ProductDetailPage from './components/shop/ProductDetailPage';
import CategoryShopPage from './components/shop/CategoryShopPage';
import CartPage from './components/shop/CartPage';
import WishlistPage from './components/shop/WishlistPage';
import AccountPage from './components/shop/AccountPage';
import SearchModal from './components/layout/SearchModal';
import TrackOrderModal from './components/layout/TrackOrderModal';
import AccountModal from './components/layout/AccountModal';
import WishlistModal from './components/layout/WishlistModal';
import CartDrawer from './components/ui/CartDrawer';
import QuickViewModal from './components/home/QuickViewModal';
import { Sparkles } from 'lucide-react';

function DashboardContent() {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'category-page', 'cart-page', 'wishlist-page', 'account-page', 'product-page'
  const [previousView, setPreviousView] = useState('dashboard');
  const [selectedCategoryId, setSelectedCategoryId] = useState('gaming');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const { toastMessage } = useCart();
  const { isAuthenticated } = useAuth();

  const handleOpenCategory = (catId) => {
    setSelectedCategoryId(catId || 'gaming');
    setActiveView('category-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateView = (viewName) => {
    setActiveView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (product) => {
    if (!product) return;
    setPreviousView(activeView);
    setSelectedProduct(product);
    setActiveView('product-page');
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
        onOpenAccount={() => {
          if (isAuthenticated) {
            handleNavigateView('account-page');
          } else {
            setAccountOpen(true);
          }
        }}
        onOpenWishlist={() => handleNavigateView('wishlist-page')}
        onOpenCart={() => handleNavigateView('cart-page')}
        onNavigateHome={() => handleNavigateView('dashboard')}
        onNavigateShopCategories={() => handleOpenCategory('wooden')}
      />

      <main>
        {activeView === 'product-page' && selectedProduct ? (
          /* DEDICATED PRODUCT DETAIL PAGE VIEW */
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => handleNavigateView(previousView || 'dashboard')}
            onNavigateHome={() => handleNavigateView('dashboard')}
            onNavigateCategory={(catId) => handleOpenCategory(catId)}
            onOpenProduct={(prod) => handleOpenProduct(prod)}
          />
        ) : activeView === 'category-page' ? (
          /* DEDICATED CATEGORY SHOP PAGE VIEW */
          <CategoryShopPage
            initialCategory={selectedCategoryId}
            onBackToHome={() => handleNavigateView('dashboard')}
            onQuickView={(prod) => handleOpenProduct(prod)}
          />
        ) : activeView === 'cart-page' ? (
          /* DEDICATED SHOPPING CART PAGE VIEW */
          <CartPage
            onBackToHome={() => handleNavigateView('dashboard')}
            onQuickView={(prod) => handleOpenProduct(prod)}
          />
        ) : activeView === 'wishlist-page' ? (
          /* DEDICATED MY WISHLIST PAGE VIEW */
          <WishlistPage
            onBackToHome={() => handleNavigateView('dashboard')}
            onQuickView={(prod) => handleOpenProduct(prod)}
          />
        ) : activeView === 'account-page' ? (
          /* DEDICATED MEMBER ACCOUNT FULL PAGE VIEW */
          <AccountPage
            onBackToHome={() => handleNavigateView('dashboard')}
            onNavigateCart={() => handleNavigateView('cart-page')}
            onNavigateWishlist={() => handleNavigateView('wishlist-page')}
            onNavigateShop={() => handleOpenCategory('wooden')}
            onOpenTrackOrder={() => setTrackOrderOpen(true)}
          />
        ) : (
          /* MAIN HOMEPAGE DASHBOARD */
          <>
            {/* 2. Banner Slideshow */}
            <BannerSlideshow />

            {/* 3. Shop By List */}
            <ShopByCategory
              onSelectCategory={(catId) => handleOpenCategory(catId)}
            />

            {/* 4. Best Seller */}
            <BestSellers
              onQuickView={(prod) => handleOpenProduct(prod)}
            />

            {/* 5. New Collection */}
            <NewCollection onQuickView={(prod) => handleOpenProduct(prod)} />

            {/* 6. Offers */}
            <HighDiscountOffers onQuickView={(prod) => handleOpenProduct(prod)} />

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
        onQuickView={(prod) => handleOpenProduct(prod)}
      />

      <TrackOrderModal
        isOpen={trackOrderOpen}
        onClose={() => setTrackOrderOpen(false)}
      />

      <AccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        onLoginSuccess={() => handleNavigateView('account-page')}
      />

      <WishlistModal
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onQuickView={(prod) => handleOpenProduct(prod)}
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
    <StoreProvider>
      <CartProvider>
        <WishlistProvider>
          <AuthProvider>
            <DashboardContent />
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </StoreProvider>
  );
}