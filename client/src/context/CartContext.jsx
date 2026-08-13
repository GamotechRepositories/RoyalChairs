import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
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
    const selectedColor = colorSelected || (product.colors && product.colors[0]) || '#1E3E2B';

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.color === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            ...product,
            color: selectedColor,
            quantity: quantity,
          },
        ];
      }
    });

    showNotification(`Added "${product.name}" to your shopping bag!`);
  };

  const removeFromCart = (productId, color) => {
    setCartItems((prev) => prev.filter((item) => !(item.id === productId && item.color === color)));
    showNotification('Item removed from bag');
  };

  const updateQuantity = (productId, color, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === productId && item.color === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const getItemQuantity = (productId, colorSelected = null) => {
    const matching = cartItems.filter((item) => item.id === productId);
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
