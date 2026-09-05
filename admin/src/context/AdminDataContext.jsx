import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AdminDataContext = createContext();

const INITIAL_COUPONS = [
  { id: 'CPN-1', code: 'ROYAL50', type: 'percentage', value: 50, minSpend: 500, usageCount: 84, limit: 200, active: true, expiry: '2026-12-31' },
  { id: 'CPN-2', code: 'WELCOME10', type: 'percentage', value: 10, minSpend: 100, usageCount: 312, limit: 1000, active: true, expiry: '2026-12-31' },
  { id: 'CPN-3', code: 'LUXURY20', type: 'percentage', value: 20, minSpend: 800, usageCount: 65, limit: 150, active: true, expiry: '2026-09-30' },
  { id: 'CPN-4', code: 'FREESHIP', type: 'fixed', value: 45, minSpend: 300, usageCount: 140, limit: 500, active: true, expiry: '2026-10-15' },
];

const normalizeOrder = (o) => {
  const totalVal = Number(o.totalAmount !== undefined ? o.totalAmount : (o.total || 0));
  const rawStatus = (o.fulfillmentStatus || o.orderStatus || 'Pending').toLowerCase();
  let displayStatus = 'Pending';
  if (rawStatus === 'in production' || rawStatus === 'confirmed') displayStatus = 'In Production';
  else if (rawStatus === 'dispatched' || rawStatus === 'shipped') displayStatus = 'Dispatched';
  else if (rawStatus === 'delivered') displayStatus = 'Delivered';
  else if (rawStatus === 'cancelled') displayStatus = 'Cancelled';
  else displayStatus = 'Pending';

  return {
    _id: o._id || o.id,
    id: o.orderNumber || o.id || `ORD-${Date.now().toString().slice(-6)}`,
    orderNumber: o.orderNumber || o.id || `RC-${Date.now().toString().slice(-6)}`,
    date: o.createdAt || o.date || new Date().toISOString(),
    createdAt: o.createdAt || o.date || new Date().toISOString(),
    customer: {
      name: o.customer?.name || 'Valued Client',
      email: o.customer?.email || 'client@royalchairs.com',
      phone: o.customer?.phone || '+91 98765 43210',
      address: o.customer?.address || 'Royal Villa, Luxury Estate, London',
      city: o.customer?.city || 'London',
      state: o.customer?.state || 'Greater London',
      pincode: o.customer?.pincode || 'SW1A 1AA',
    },
    items: Array.isArray(o.items)
      ? o.items.map((i) => ({
          name: i.name || 'Royal Luxury Chair',
          price: Number(i.price) || 0,
          quantity: Number(i.quantity) || 1,
          color: typeof i.color === 'string' ? i.color : (i.color?.hex || '#1E3E2B'),
          image: i.image || i.mainImage || 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=800&q=85',
        }))
      : [],
    total: totalVal,
    totalAmount: totalVal,
    subtotal: Number(o.subtotal || totalVal),
    discount: Number(o.discount || 0),
    paymentMethod: (o.paymentMethod || 'ONLINE').toUpperCase(),
    paymentStatus: (o.paymentStatus || 'PAID').toUpperCase(),
    fulfillmentStatus: displayStatus,
    orderStatus: o.orderStatus || (displayStatus === 'In Production' ? 'confirmed' : displayStatus.toLowerCase()),
    trackingNumber: o.trackingNumber || `TRK-UK-${Date.now().toString().slice(-6)}`,
    carrier: o.carrier || 'Royal Express Logistics',
  };
};

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
  const [orders, setOrders] = useState(() => {
    try {
      const savedAdmin = localStorage.getItem('royal_admin_orders');
      if (savedAdmin) {
        const parsed = JSON.parse(savedAdmin);
        // Filter out any mock starter IDs
        const realAdmin = Array.isArray(parsed) ? parsed.filter(p => !['RC-998241', 'RC-997120', 'RC-995408'].includes(p.id || p.orderNumber)) : [];
        if (realAdmin.length > 0) return realAdmin.map(normalizeOrder);
      }
      const savedUser = localStorage.getItem('royal_user_orders');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const realUser = Array.isArray(parsed) ? parsed.filter(p => !['RC-998241', 'RC-997120', 'RC-995408'].includes(p.id || p.orderNumber)) : [];
        if (realUser.length > 0) return realUser.map(normalizeOrder);
      }
    } catch {}
    return [];
  });

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

  // 3. Fetch Orders from Database & sync with localStorage
  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const realOrders = res.data.data
          .filter(p => !['RC-998241', 'RC-997120', 'RC-995408'].includes(p.orderNumber || p.id))
          .map(normalizeOrder);
        setOrders(realOrders);
        localStorage.setItem('royal_admin_orders', JSON.stringify(realOrders));
        return;
      }
    } catch (err) {
      console.log('Using local order storage:', err.message);
    }

    // Fallback: check localStorage for real user orders
    try {
      const savedUser = localStorage.getItem('royal_user_orders');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const realUser = Array.isArray(parsed) ? parsed.filter(p => !['RC-998241', 'RC-997120', 'RC-995408'].includes(p.id || p.orderNumber)) : [];
        if (realUser.length > 0) {
          const normalized = realUser.map(normalizeOrder);
          setOrders(normalized);
          localStorage.setItem('royal_admin_orders', JSON.stringify(normalized));
          return;
        }
      }
      setOrders([]);
      localStorage.setItem('royal_admin_orders', JSON.stringify([]));
    } catch {}
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

  // Load all data on mount and on storage events
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
    fetchReviews();
    fetchUsers();

    const handleStorage = () => {
      fetchOrders();
      fetchReviews();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('royal_storage_update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('royal_storage_update', handleStorage);
    };
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
        setProducts((prev) =>
          prev.map((p) => (p._id === id || p.id === id ? res.data.data : p))
        );
        return res.data.data;
      }
    } catch (err) {
      console.error('API product update error:', err);
    }
    setProducts((prev) =>
      prev.map((p) => (p._id === id || p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const toggleAvailability = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    return updateProduct(id, {
      isAvailable: newStatus,
      inStock: newStatus,
      stock: newStatus ? 20 : 0,
    });
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
    } catch (err) {
      console.error('API product delete error:', err);
    }
    setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
  };

  const updateStock = async (id, newStock) => {
    const isAvail = Number(newStock) > 0;
    try {
      await api.patch(`/products/${id}/stock`, { stock: newStock });
    } catch (err) {
      console.error('API stock update error:', err);
    }
    updateProduct(id, {
      stock: Math.max(0, newStock),
      isAvailable: isAvail,
      inStock: isAvail,
    });
  };

  const toggleProductFlag = (id, flagName) => {
    const prod = products.find((p) => p.id === id);
    if (prod) {
      updateProduct(id, { [flagName]: !prod[flagName] });
    }
  };

  // Order Operations
  const updateOrderStatus = async (orderId, newStatus, trackingNumber) => {
    const targetOrder = orders.find((o) => o.id === orderId || o.orderNumber === orderId || o._id === orderId);
    const apiId = targetOrder?._id || targetOrder?.id || orderId;

    let backendStatus = (newStatus || 'Pending').toLowerCase();
    if (newStatus === 'Pending') backendStatus = 'placed';
    else if (newStatus === 'In Production') backendStatus = 'confirmed';
    else if (newStatus === 'Dispatched') backendStatus = 'shipped';
    else if (newStatus === 'Delivered') backendStatus = 'delivered';
    else if (newStatus === 'Cancelled') backendStatus = 'cancelled';

    try {
      await api.patch(`/orders/${apiId}/status`, {
        orderStatus: backendStatus,
        trackingNumber,
      });
    } catch (err) {
      console.error('API order update error:', err);
    }

    setOrders((prev) => {
      const updated = prev.map((o) =>
        o.id === orderId || o._id === apiId || o.orderNumber === orderId
          ? {
              ...o,
              fulfillmentStatus: newStatus || o.fulfillmentStatus,
              orderStatus: backendStatus,
              trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
            }
          : o
      );
      localStorage.setItem('royal_admin_orders', JSON.stringify(updated));
      return updated;
    });
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
        toggleAvailability,
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
