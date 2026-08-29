import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

const cleanNumber = (val, fallback = 0) => {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (!val) return fallback;
  const num = Number(String(val).replace(/[^0-9.-]+/g, ''));
  return isNaN(num) ? fallback : num;
};

const isColorMatch = (c1, c2) => {
  if (!c1 || !c2) return true;
  const k1 = typeof c1 === 'object' ? (c1.hex || c1.name || '') : String(c1);
  const k2 = typeof c2 === 'object' ? (c2.hex || c2.name || '') : String(c2);
  return k1.trim().toUpperCase() === k2.trim().toUpperCase();
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('royalchairs_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter((item) => item && typeof item === 'object')
        .map((item, idx) => {
          const pId = item._id || item.id || `cart-item-${idx}-${Date.now()}`;
          const price = cleanNumber(item.price, 0);
          const originalPrice = cleanNumber(item.originalPrice, price);
          const quantity = Math.max(1, cleanNumber(item.quantity, 1));
          const rawColor = item.color || item.selectedColor || '#1E3E2B';
          const colorKey = typeof rawColor === 'object' ? (rawColor.hex || rawColor.name || '#1E3E2B') : String(rawColor);

          return {
            ...item,
            id: pId,
            _id: pId,
            name: typeof item.name === 'string' ? item.name : 'Handcrafted Luxury Chair',
            price,
            originalPrice,
            quantity,
            color: rawColor,
            colorKey,
            mainImage: typeof item.mainImage === 'string' ? item.mainImage : (typeof item.image === 'string' ? item.image : ''),
          };
        });
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('royalchairs_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }
  }, [cartItems]);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, colorSelected = null, quantity = 1) => {
    if (!product) return;
    const pId = product._id || product.id || `prod-${Date.now()}`;
    const selectedColor = colorSelected || (product.colors && product.colors[0]) || '#1E3E2B';
    const colorKey = typeof selectedColor === 'object' ? (selectedColor.hex || selectedColor.name || '#1E3E2B') : String(selectedColor);
    const itemPrice = cleanNumber(product.price, 0);
    const itemOriginalPrice = cleanNumber(product.originalPrice, itemPrice);
    const qty = Math.max(1, cleanNumber(quantity, 1));

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          (item._id === pId || item.id === pId) &&
          isColorMatch(item.color || item.colorKey, selectedColor)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = (Number(updated[existingIndex].quantity) || 1) + qty;
        return updated;
      } else {
        return [
          ...prev,
          {
            ...product,
            id: pId,
            _id: pId,
            name: typeof product.name === 'string' ? product.name : 'Handcrafted Luxury Chair',
            price: itemPrice,
            originalPrice: itemOriginalPrice,
            color: selectedColor,
            colorKey,
            quantity: qty,
            mainImage: typeof product.mainImage === 'string' ? product.mainImage : (typeof product.image === 'string' ? product.image : ''),
          },
        ];
      }
    });

    showNotification(`Added "${product.name || 'Chair'}" to your shopping bag!`);
  };

  const removeFromCart = (productId, color) => {
    setCartItems((prev) =>
      prev.filter((item) => {
        const matchId = item.id === productId || item._id === productId;
        const matchColor = !color || isColorMatch(item.color || item.colorKey, color);
        return !(matchId && matchColor);
      })
    );
    showNotification('Item removed from bag');
  };

  const updateQuantity = (productId, color, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          const matchId = item.id === productId || item._id === productId;
          const matchColor = !color || isColorMatch(item.color || item.colorKey, color);
          if (matchId && matchColor) {
            const newQty = (Number(item.quantity) || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const getItemQuantity = (productId, colorSelected = null) => {
    const matching = (cartItems || []).filter((item) => item.id === productId || item._id === productId);
    if (matching.length === 0) return 0;
    if (colorSelected) {
      const exact = matching.find((item) => isColorMatch(item.color || item.colorKey, colorSelected));
      return exact ? Number(exact.quantity) || 0 : 0;
    }
    return matching.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => {
    return (cartItems || []).reduce((acc, item) => acc + Math.max(1, Number(item?.quantity) || 1), 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return (cartItems || []).reduce((acc, item) => {
      const price = cleanNumber(item?.price, 0);
      const qty = Math.max(1, Number(item?.quantity) || 1);
      return acc + price * qty;
    }, 0);
  }, [cartItems]);

  const cartTotal = cartSubtotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        toastMessage,
        showNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cartItems: [],
      setCartItems: () => {},
      isCartOpen: false,
      setIsCartOpen: () => {},
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      getItemQuantity: () => 0,
      clearCart: () => {},
      cartCount: 0,
      cartSubtotal: 0,
      cartTotal: 0,
      toastMessage: null,
      showNotification: () => {},
    };
  }
  return context;
};
