import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Clear any legacy mock localStorage data so only database data is shown
  useEffect(() => {
    try {
      const isCleaned = localStorage.getItem('royal_static_cleaned_v2');
      if (!isCleaned) {
        localStorage.removeItem('royal_admin_products');
        localStorage.removeItem('royal_admin_categories');
        localStorage.removeItem('royal_admin_orders');
        localStorage.removeItem('royal_admin_reviews');
        localStorage.setItem('royal_static_cleaned_v2', 'true');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchStoreData = async () => {
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
        setReviews(revRes.data.data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.log('Database fetch response:', err.message);
      setCategories([]);
      setProducts([]);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

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
