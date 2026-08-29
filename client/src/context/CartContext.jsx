import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      // Check if we need to purge old mock data
      const isCleaned = localStorage.getItem('royal_cart_cleaned_v3');
      if (!isCleaned) {
        localStorage.removeItem('royalchairs_cart');
        localStorage.setItem('royal_cart_cleaned_v3', 'true');
        return [];
      }
      const saved = localStorage.getItem('royalchairs_cart');
      return saved ? JSON.parse(saved) : [];
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

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          (item._id === pId || item.id === pId) &&
          (item.color === selectedColor || item.colorKey === colorKey || item.color === colorKey)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity = (Number(updated[existingIndex].quantity) || 1) + (Number(quantity) || 1);
        return updated;
      } else {
        return [
          ...prev,
          {
            ...product,
            id: pId,
            _id: pId,
            color: selectedColor,
            colorKey: colorKey,
            quantity: Number(quantity) || 1,
            price: Number(product.price) || 0,
          },
        ];
      }
    });

    showNotification(`Added "${product.name || 'Chair'}" to your shopping bag!`);
  };

  const removeFromCart = (productId, color) => {
    const colorKey = typeof color === 'object' ? (color.hex || color.name) : String(color);
    setCartItems((prev) =>
      prev.filter((item) => {
        const matchId = item.id === productId || item._id === productId;
        const matchColor = !color || item.color === color || item.colorKey === colorKey || item.color === colorKey;
        return !(matchId && matchColor);
      })
    );
    showNotification('Item removed from bag');
  };

  const updateQuantity = (productId, color, delta) => {
    const colorKey = typeof color === 'object' ? (color.hex || color.name) : String(color);
    setCartItems((prev) =>
      prev
        .map((item) => {
          const matchId = item.id === productId || item._id === productId;
          const matchColor = !color || item.color === color || item.colorKey === colorKey || item.color === colorKey;
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
    const matching = cartItems.filter((item) => item.id === productId || item._id === productId);
    if (matching.length === 0) return 0;
    if (colorSelected) {
      const exact = matching.find((item) => item.color === colorSelected);
      return exact ? exact.quantity : 0;
    }
    return matching.reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
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

export const useCart = () => useContext(CartContext);
