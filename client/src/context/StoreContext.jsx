import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStoreData = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Categories from Database
      const catRes = await api.get('/categories');
      if (catRes.data?.success && Array.isArray(catRes.data.data)) {
        setCategories(catRes.data.data);
      } else {
        setCategories([]);
      }

      // 2. Fetch Products from Database
      const prodRes = await api.get('/products?limit=100');
      if (prodRes.data?.success && Array.isArray(prodRes.data.data)) {
        setProducts(prodRes.data.data);
      } else {
        setProducts([]);
      }

      // 3. Fetch Reviews from Database
      const revRes = await api.get('/reviews?status=approved');
      if (revRes.data?.success && Array.isArray(revRes.data.data)) {
        const formatted = revRes.data.data.map((r) => ({
          id: r.id || r._id,
          name: r.userName || r.name || r.customer || '',
          customer: r.userName || r.name || r.customer || '',
          role: r.userRole || r.role || 'Verified Buyer',
          location: r.location || 'London, UK',
          rating: r.rating || 5,
          comment: r.comment || '',
          productName: r.productName || r.product || 'Royal Handcrafted Seating',
          product: r.productName || r.product || 'Royal Handcrafted Seating',
          avatar:
            r.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        }));
        setReviews(formatted);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.log('Database fetch note:', err.message);
      setCategories([]);
      setProducts([]);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  // Synchronize with storage & live events from Admin
  useEffect(() => {
    const handleStorage = () => {
      fetchStoreData();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('royal_storage_update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('royal_storage_update', handleStorage);
    };
  }, [fetchStoreData]);

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        reviews,
        isLoading,
        refetchStoreData: fetchStoreData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
