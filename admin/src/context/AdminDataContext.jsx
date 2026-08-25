import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminDataContext = createContext();

const INITIAL_COUPONS = [
  { id: 'CPN-1', code: 'ROYAL50', type: 'percentage', value: 50, minSpend: 500, usageCount: 84, limit: 200, active: true, expiry: '2026-12-31' },
  { id: 'CPN-2', code: 'WELCOME10', type: 'percentage', value: 10, minSpend: 100, usageCount: 312, limit: 1000, active: true, expiry: '2026-12-31' },
  { id: 'CPN-3', code: 'LUXURY20', type: 'percentage', value: 20, minSpend: 800, usageCount: 65, limit: 150, active: true, expiry: '2026-09-30' },
  { id: 'CPN-4', code: 'FREESHIP', type: 'fixed', value: 45, minSpend: 300, usageCount: 140, limit: 500, active: true, expiry: '2026-10-15' },
];

const INITIAL_SETTINGS = {
  storeName: 'RoyalChairs London Ltd.',
  tagline: 'Purveyors of Handcrafted British & European Seating',
  currency: 'INR (₹)',
  currencySymbol: '₹',
  taxRate: 8.5,
  freeShippingThreshold: 500,
  standardShippingFee: 45,
  supportEmail: 'concierge@royalchairs.co.uk',
  supportPhone: '+44 20 7946 0990',
  headquarters: 'Gloucestershire & Mayfair, London, United Kingdom',
  maintenanceMode: false,
  freeDelivery: true,
};

export function AdminDataProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('royal_admin_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('royal_admin_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState(false);

  // 1. Fetch Categories from Database
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setCategories(res.data.data);
        localStorage.setItem('royal_admin_categories', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.log('Using local category storage:', err.message);
    }
  };

  // 2. Fetch Products from Database
  const fetchProducts = async () => {
    try {
      const res = await api.get('/products?limit=100');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
        localStorage.setItem('royal_admin_products', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.log('Using local product storage:', err.message);
    }
  };

  // 3. Fetch Orders from Database
  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setOrders(res.data.data);
        localStorage.setItem('royal_admin_orders', JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.log('Using local order storage:', err.message);
    }
  };

  // 4. Fetch Reviews from Database
  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews?status=all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.log('Error fetching reviews:', err.message);
    }
  };

  // 5. Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const fetchedUsers = response.data.data.map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          tier: u.role === 'admin' ? 'Admin / Executive' : 'Registered Member',
          ordersCount: 0,
          totalSpent: 0,
          joinedDate: new Date(u.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
          }),
          avatar:
            u.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=2E6B4D&color=fff`,
        }));
        setCustomers(fetchedUsers);
      }
    } catch (err) {
      console.log('Error fetching admin users from backend:', err.message);
    }
  };

  // Load all data on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
    fetchReviews();
    fetchUsers();
  }, []);

  // Category Operations
  const addCategory = async (catData) => {
    try {
      const res = await api.post('/categories', catData);
      if (res.data?.success && res.data.data) {
        setCategories((prev) => [res.data.data, ...prev]);
        return res.data.data;
      }
    } catch (err) {
      console.error('API category create error:', err);
    }
    const fallback = { ...catData, id: catData.slug || `cat-${Date.now()}` };
    setCategories((prev) => [fallback, ...prev]);
    return fallback;
  };

  const updateCategory = async (idOrSlug, catData) => {
    try {
      const res = await api.put(`/categories/${idOrSlug}`, catData);
      if (res.data?.success && res.data.data) {
        setCategories((prev) =>
          prev.map((c) => (c.id === idOrSlug || c.slug === idOrSlug ? res.data.data : c))
        );
        return res.data.data;
      }
    } catch (err) {
      console.error('API category update error:', err);
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === idOrSlug || c.slug === idOrSlug ? { ...c, ...catData } : c))
    );
  };

  const deleteCategory = async (idOrSlug) => {
    try {
      await api.delete(`/categories/${idOrSlug}`);
    } catch (err) {
      console.error('API category delete error:', err);
    }
    setCategories((prev) => prev.filter((c) => c.id !== idOrSlug && c.slug !== idOrSlug));
  };

  // Product Operations
  const addProduct = async (prodData) => {
    try {
      const res = await api.post('/products', prodData);
      if (res.data?.success && res.data.data) {
        setProducts((prev) => [res.data.data, ...prev]);
        return res.data.data;
      }
    } catch (err) {
      console.error('API product create error:', err);
    }
    const fallback = {
      ...prodData,
      id: `rc-${Date.now().toString().slice(-4)}`,
      sku: prodData.sku || `RC-${(prodData.category || 'GEN').toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      rating: 5.0,
      reviewCount: 0,
    };
    setProducts((prev) => [fallback, ...prev]);
    return fallback;
  };

  const updateProduct = async (id, updatedFields) => {
    try {
      const res = await api.put(`/products/${id}`, updatedFields);
      if (res.data?.success && res.data.data) {
        setProducts((prev) => prev.map((p) => (p.id === id ? res.data.data : p)));
        return res.data.data;
      }
    } catch (err) {
      console.error('API product update error:', err);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (err) {
      console.error('API product delete error:', err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStock = async (id, newStock) => {
    try {
      await api.patch(`/products/${id}/stock`, { stock: newStock });
    } catch (err) {
      console.error('API stock update error:', err);
    }
    updateProduct(id, { stock: Math.max(0, newStock) });
  };

  const toggleProductFlag = (id, flagName) => {
    const prod = products.find((p) => p.id === id);
    if (prod) {
      updateProduct(id, { [flagName]: !prod[flagName] });
    }
  };

  // Order Operations
  const updateOrderStatus = async (orderId, newStatus, trackingNumber) => {
    try {
      await api.patch(`/orders/${orderId}/status`, {
        orderStatus: newStatus,
        trackingNumber,
      });
    } catch (err) {
      console.error('API order update error:', err);
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: newStatus || o.orderStatus,
              trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
            }
          : o
      )
    );
  };

  // Review Operations
  const deleteReview = async (id) => {
    try {
      await api.delete(`/reviews/${id}`);
    } catch (err) {
      console.error('API review delete error:', err);
    }
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const moderateReview = (id, status, featured) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: status !== undefined ? status : r.status,
              featured: featured !== undefined ? featured : r.featured,
            }
          : r
      )
    );
  };

  // Coupon Operations
  const addCoupon = (coupon) => {
    const newCoupon = {
      ...coupon,
      id: `CPN-${Date.now().toString().slice(-4)}`,
      usageCount: 0,
      active: true,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const toggleCouponStatus = (id) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const deleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <AdminDataContext.Provider
      value={{
        products,
        setProducts,
        orders,
        setOrders,
        categories,
        setCategories,
        customers,
        coupons,
        reviews,
        setReviews,
        settings,
        isLoading,
        addCategory,
        updateCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductFlag,
        updateStock,
        updateOrderStatus,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        moderateReview,
        deleteReview,
        updateSettings,
        refetchCategories: fetchCategories,
        refetchProducts: fetchProducts,
        refetchOrders: fetchOrders,
        refetchReviews: fetchReviews,
        refetchUsers: fetchUsers,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  return useContext(AdminDataContext);
}
