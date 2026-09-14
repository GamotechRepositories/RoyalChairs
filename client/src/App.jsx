import { useState, useEffect, useCallback } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import BannerSlideshow from './components/home/BannerSlideshow';
import ShopByCategory from './components/home/ShopByCategory';
import BestSellers from './components/home/BestSellers';
import NewCollection from './components/home/NewCollection';
import CategorySpotlight from './components/home/CategorySpotlight';
import HighDiscountOffers from './components/home/HighDiscountOffers';
import LifestyleGallery from './components/home/LifestyleGallery';
import WhyChooseUs from './components/home/WhyChooseUs';
import Footer from './components/layout/Footer';

import ProductDetailPage from './components/shop/ProductDetailPage';
import CategoryShopPage from './components/shop/CategoryShopPage';
import CartPage from './components/shop/CartPage';
import WishlistPage from './components/shop/WishlistPage';
import AccountPage from './components/shop/AccountPage';
import CheckoutPage from './components/shop/CheckoutPage';
import SearchModal from './components/layout/SearchModal';
import TrackOrderModal from './components/layout/TrackOrderModal';
import AccountModal from './components/layout/AccountModal';
import WishlistModal from './components/layout/WishlistModal';
import CartDrawer from './components/ui/CartDrawer';
import QuickViewModal from './components/home/QuickViewModal';
import { ProductDetailSkeleton } from './components/ui/Skeletons';
import { Sparkles } from 'lucide-react';

const HOMEPAGE_ANCHORS = [
  'shop-by-category',
  'best-sellers',
  'new-collection',
  'category-spotlight',
  'special-offers',
  'lifestyle-gallery',
  'why-choose-us',
];

function parseClientHash() {
  try {
    const raw = (window.location.hash || '').replace(/^#\/?/, '').trim();
    if (!raw || raw === 'home') {
      return { view: 'dashboard', categoryId: null, productSlugOrId: null, isAnchor: false };
    }
    if (raw === 'cart') {
      return { view: 'cart-page', categoryId: null, productSlugOrId: null, isAnchor: false };
    }
    if (raw === 'wishlist') {
      return { view: 'wishlist-page', categoryId: null, productSlugOrId: null, isAnchor: false };
    }
    if (raw === 'account') {
      return { view: 'account-page', categoryId: null, productSlugOrId: null, isAnchor: false };
    }
    if (raw === 'checkout') {
      return { view: 'checkout-page', categoryId: null, productSlugOrId: null, isAnchor: false };
    }
    if (raw.startsWith('category/')) {
      const catId = decodeURIComponent(raw.replace('category/', '').trim());
      return { view: 'category-page', categoryId: catId || 'gaming', productSlugOrId: null, isAnchor: false };
    }
    if (raw.startsWith('product/')) {
      const prodId = decodeURIComponent(raw.replace('product/', '').trim());
      return { view: 'product-page', categoryId: null, productSlugOrId: prodId, isAnchor: false };
    }
    if (HOMEPAGE_ANCHORS.includes(raw)) {
      return { view: 'dashboard', categoryId: null, productSlugOrId: null, isAnchor: true, anchorId: raw };
    }
  } catch (e) {
    // fallback
  }
  return { view: 'dashboard', categoryId: null, productSlugOrId: null, isAnchor: false };
}

function DashboardContent() {
  const { products, isLoading: isStoreLoading } = useStore();

  const [activeView, setActiveView] = useState(() => {
    const parsed = parseClientHash();
    if (parsed.view !== 'dashboard' || parsed.isAnchor) {
      return parsed.view;
    }
    const saved = localStorage.getItem('royal_client_active_view');
    return saved || 'dashboard';
  });

  const [previousView, setPreviousView] = useState('dashboard');

  const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
    const parsed = parseClientHash();
    if (parsed.categoryId) return parsed.categoryId;
    return localStorage.getItem('royal_client_selected_category') || 'gaming';
  });

  const [selectedProduct, setSelectedProduct] = useState(() => {
    try {
      const cached = sessionStorage.getItem('royal_client_selected_product');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      // ignore
    }
    return null;
  });

  const [appliedCouponForCheckout, setAppliedCouponForCheckout] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [trackOrderOpen, setTrackOrderOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [pendingPostLoginAction, setPendingPostLoginAction] = useState(null);

  const { toastMessage } = useCart();
  const { isAuthenticated } = useAuth();

  // Listen to browser hash changes (Back/Forward navigation and in-page anchor jumps)
  useEffect(() => {
    const handleHashChange = () => {
      const parsed = parseClientHash();
      setActiveView(parsed.view);
      try {
        localStorage.setItem('royal_client_active_view', parsed.view);
      } catch (e) {}

      if (parsed.categoryId) {
        setSelectedCategoryId(parsed.categoryId);
        try {
          localStorage.setItem('royal_client_selected_category', parsed.categoryId);
        } catch (e) {}
      }

      if (parsed.view === 'product-page' && parsed.productSlugOrId) {
        if (products && products.length > 0) {
          const match = products.find(
            (p) =>
              p._id === parsed.productSlugOrId ||
              p.id === parsed.productSlugOrId ||
              p.slug === parsed.productSlugOrId
          );
          if (match) {
            setSelectedProduct(match);
            try {
              sessionStorage.setItem('royal_client_selected_product', JSON.stringify(match));
            } catch (e) {}
          }
        }
      }

      if (parsed.isAnchor && parsed.anchorId) {
        setTimeout(() => {
          const el = document.getElementById(parsed.anchorId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [products]);

  // Synchronize URL hash and localStorage on initial mount if opened with saved view but empty hash
  useEffect(() => {
    const parsed = parseClientHash();
    if (!window.location.hash || window.location.hash === '#') {
      const saved = localStorage.getItem('royal_client_active_view');
      if (saved && saved !== 'dashboard') {
        if (saved === 'cart-page') window.location.hash = 'cart';
        else if (saved === 'wishlist-page') window.location.hash = 'wishlist';
        else if (saved === 'account-page') window.location.hash = 'account';
        else if (saved === 'checkout-page') window.location.hash = 'checkout';
        else if (saved === 'category-page') {
          const cat = localStorage.getItem('royal_client_selected_category') || 'gaming';
          window.location.hash = `category/${cat}`;
        } else if (saved === 'product-page' && selectedProduct) {
          const id = selectedProduct.slug || selectedProduct.id || selectedProduct._id;
          if (id) window.location.hash = `product/${id}`;
        }
      }
    } else if (parsed.isAnchor && parsed.anchorId) {
      setTimeout(() => {
        const el = document.getElementById(parsed.anchorId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, []);

  // Hydrate product from database products list when visiting #product/:id
  useEffect(() => {
    const parsed = parseClientHash();
    if (parsed.view === 'product-page' && parsed.productSlugOrId) {
      if (products && products.length > 0) {
        const match = products.find(
          (p) =>
            p._id === parsed.productSlugOrId ||
            p.id === parsed.productSlugOrId ||
            p.slug === parsed.productSlugOrId
        );
        if (match) {
          setSelectedProduct(match);
          try {
            sessionStorage.setItem('royal_client_selected_product', JSON.stringify(match));
          } catch (e) {}
        }
      }
    }
  }, [products]);

  const handleOpenCategory = (catId) => {
    const target = catId || 'gaming';
    setSelectedCategoryId(target);
    setActiveView('category-page');
    try {
      localStorage.setItem('royal_client_active_view', 'category-page');
      localStorage.setItem('royal_client_selected_category', target);
      window.location.hash = `category/${target}`;
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateView = (viewName) => {
    setActiveView(viewName);
    try {
      localStorage.setItem('royal_client_active_view', viewName);
    } catch (e) {}

    if (viewName === 'dashboard') {
      const currentHash = (window.location.hash || '').replace(/^#\/?/, '').trim();
      if (!HOMEPAGE_ANCHORS.includes(currentHash)) {
        if (window.history.pushState) {
          window.history.pushState(null, '', window.location.pathname);
        } else {
          window.location.hash = '';
        }
      }
    } else if (viewName === 'cart-page') {
      window.location.hash = 'cart';
    } else if (viewName === 'wishlist-page') {
      window.location.hash = 'wishlist';
    } else if (viewName === 'account-page') {
      window.location.hash = 'account';
    } else if (viewName === 'checkout-page') {
      window.location.hash = 'checkout';
    } else if (viewName === 'category-page') {
      window.location.hash = `category/${selectedCategoryId || 'gaming'}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (product) => {
    if (!product) return;
    setPreviousView(activeView);
    setSelectedProduct(product);
    setActiveView('product-page');
    try {
      localStorage.setItem('royal_client_active_view', 'product-page');
      sessionStorage.setItem('royal_client_selected_product', JSON.stringify(product));
    } catch (e) {}

    const id = product.slug || product.id || product._id;
    if (id) {
      window.location.hash = `product/${id}`;
    } else {
      window.location.hash = 'product/item';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequireLogin = (actionCallback) => {
    setPendingPostLoginAction(() => actionCallback);
    setAccountOpen(true);
  };

  const handleLoginSuccess = () => {
    if (pendingPostLoginAction && typeof pendingPostLoginAction === 'function') {
      const action = pendingPostLoginAction;
      setPendingPostLoginAction(null);
      action();
    } else {
      handleNavigateView('account-page');
    }
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
        {activeView === 'product-page' ? (
          selectedProduct ? (
            /* DEDICATED PRODUCT DETAIL PAGE VIEW */
            <ProductDetailPage
              product={selectedProduct}
              onBack={() => handleNavigateView(previousView || 'dashboard')}
              onNavigateHome={() => handleNavigateView('dashboard')}
              onNavigateCategory={(catId) => handleOpenCategory(catId)}
              onOpenProduct={(prod) => handleOpenProduct(prod)}
            />
          ) : (
            <ProductDetailSkeleton />
          )
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
            onProceedToCheckout={(coupon) => {
              setAppliedCouponForCheckout(coupon);
              handleNavigateView('checkout-page');
            }}
            onRequireLogin={handleRequireLogin}
          />
        ) : activeView === 'checkout-page' ? (
          /* DEDICATED CHECKOUT & PAYMENT PAGE VIEW (COD & RAZORPAY) */
          <CheckoutPage
            appliedCoupon={appliedCouponForCheckout}
            onBackToCart={() => handleNavigateView('cart-page')}
            onNavigateHome={() => handleNavigateView('dashboard')}
            onNavigateAccount={() => handleNavigateView('account-page')}
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

            {/* 6. Featured Best Category Spotlight */}
            <CategorySpotlight
              onSelectCategory={(catId) => handleOpenCategory(catId)}
              onOpenProduct={(prod) => handleOpenProduct(prod)}
            />

            {/* 7. Offers */}
            <HighDiscountOffers onQuickView={(prod) => handleOpenProduct(prod)} />

            {/* 8. Lifestyle Gallery (Static 10-photo 2-second auto-slide) */}
            <LifestyleGallery />

            {/* 9. Why Choose Us */}
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
        onClose={() => setSearchOpen(false) || setAccountOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <WishlistModal
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        onQuickView={(prod) => handleOpenProduct(prod)}
      />

      <CartDrawer
        onNavigateCheckout={() => handleNavigateView('checkout-page')}
        onRequireLogin={handleRequireLogin}
        onOpenCartPage={() => handleNavigateView('cart-page')}
      />

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