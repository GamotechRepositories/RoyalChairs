import { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminDataProvider } from './context/AdminDataContext';
import AdminNavbar from './components/layout/AdminNavbar';
import AdminSidebar from './components/layout/AdminSidebar';
import AdminLogin from './components/auth/AdminLogin';

import DashboardOverview from './components/dashboard/DashboardOverview';
import ProductsManager from './components/products/ProductsManager';
import OrdersManager from './components/orders/OrdersManager';
import CategoriesManager from './components/categories/CategoriesManager';
import CustomersManager from './components/customers/CustomersManager';
import CouponsManager from './components/coupons/CouponsManager';
import ReviewsManager from './components/reviews/ReviewsManager';
import SettingsManager from './components/settings/SettingsManager';
import ProductModal from './components/products/ProductModal';

// Client Dashboard Section Controllers
import BannerSlideshowManager from './components/dashboard-sections/BannerSlideshowManager';
import CategoryHandlingManager from './components/dashboard-sections/CategoryHandlingManager';
import BestSellerManager from './components/dashboard-sections/BestSellerManager';
import NewCollectionManager from './components/dashboard-sections/NewCollectionManager';
import SpotlightManager from './components/dashboard-sections/SpotlightManager';
import OffersDiscountsManager from './components/dashboard-sections/OffersDiscountsManager';
import WhyChooseUsManager from './components/dashboard-sections/WhyChooseUsManager';

const VALID_TABS = [
  'overview',
  'banner-slideshow',
  'category-handling',
  'best-seller',
  'new-collection',
  'category-spotlight',
  'offers-discounts',
  'why-choose-us',
  'products',
  'orders',
  'categories',
  'customers',
  'coupons',
  'reviews',
  'settings',
];

const getInitialTab = () => {
  const hash = window.location.hash.replace('#', '').trim();
  if (hash && VALID_TABS.includes(hash)) {
    return hash;
  }
  const saved = localStorage.getItem('royal_admin_active_tab');
  if (saved && VALID_TABS.includes(saved)) {
    return saved;
  }
  return 'overview';
};

function AdminShell() {
  const { isAuthenticated } = useAdminAuth();
  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync activeTab with URL hash & localStorage on tab changes
  useEffect(() => {
    localStorage.setItem('royal_admin_active_tab', activeTab);
    if (window.location.hash.replace('#', '') !== activeTab) {
      window.location.hash = activeTab;
    }
  }, [activeTab]);

  // Support browser Back/Forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && VALID_TABS.includes(hash) && hash !== activeTab) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <DashboardOverview
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewProductModal={() => setActiveTab('products')}
          />
        );
      case 'banner-slideshow':
        return <BannerSlideshowManager />;
      case 'category-handling':
        return <CategoryHandlingManager />;
      case 'best-seller':
        return <BestSellerManager />;
      case 'new-collection':
        return <NewCollectionManager />;
      case 'category-spotlight':
        return <SpotlightManager />;
      case 'offers-discounts':
        return <OffersDiscountsManager />;
      case 'why-choose-us':
        return <WhyChooseUsManager />;
      case 'products':
        return <ProductsManager />;
      case 'orders':
        return <OrdersManager />;
      case 'categories':
        return <CategoryHandlingManager />;
      case 'customers':
        return <CustomersManager />;
      case 'coupons':
        return <CouponsManager />;
      case 'reviews':
        return <WhyChooseUsManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return (
          <DashboardOverview
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewProductModal={() => setActiveTab('products')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-800 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <AdminNavbar
          activeTab={activeTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminDataProvider>
        <AdminShell />
      </AdminDataProvider>
    </AdminAuthProvider>
  );
}
