import { createContext, useContext, useState, useEffect } from 'react';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { showNotification } = useCart();
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      // Check if we need to purge old mock data
      const isCleaned = localStorage.getItem('royal_wishlist_cleaned_v3');
      if (!isCleaned) {
        localStorage.removeItem('royalchairs_wishlist');
        localStorage.setItem('royal_wishlist_cleaned_v3', 'true');
        return [];
      }
      const saved = localStorage.getItem('royalchairs_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('royalchairs_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Wishlist write error:', e);
    }
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    const pId = product._id || product.id;
    setWishlistItems((prev) => {
      const exists = prev.some((item) => (item._id === pId || item.id === pId));
      if (exists) {
        showNotification(`Removed "${product.name}" from Wishlist`);
        return prev.filter((item) => !((item._id === pId || item.id === pId)));
      } else {
        showNotification(`Saved "${product.name}" to your Wishlist`);
        return [...prev, { ...product, id: pId, _id: pId }];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId || item.id === productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        setWishlistItems,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
