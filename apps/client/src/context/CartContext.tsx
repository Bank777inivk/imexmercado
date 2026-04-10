import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, getDocument, setDocument } from '@imexmercado/firebase';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('imex_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('imex_cart', JSON.stringify(items));
  }, [items]);

  // Sync with Firestore if logged in
  useEffect(() => {
    async function syncWithFirestore() {
      if (user) {
        // 1. Fetch remote cart
        const remoteCart = await getDocument<{ items: CartItem[] }>('carts', user.uid);
        if (remoteCart && remoteCart.items) {
          // Merge logic: Simple override for now, or sophisticated merging
          setItems(remoteCart.items);
        } else if (items.length > 0) {
          // 2. If no remote cart but local items exist, save local to remote
          await setDocument('carts', user.uid, { items, updatedAt: new Date() });
        }
      }
    }
    syncWithFirestore();
  }, [user]);

  // Save to Firestore on change
  useEffect(() => {
    if (user && items.length >= 0) {
      setDocument('carts', user.uid, { items, updatedAt: new Date() });
    }
  }, [items, user]);

  const addItem = (product: any) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image,
        category: product.category,
        quantity: 1 
      }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, addItem, removeItem, updateQuantity, clearCart, 
      totalItems, totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
