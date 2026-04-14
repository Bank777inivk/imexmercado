import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth, subscribeToDocument, setDocument } from '@imexmercado/firebase';

export interface CartItem {
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
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  isSyncing: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('imex_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Track if we just logged in to prevent infinite loops during merge
  const isInitialSyncDone = useRef(false);

  // Persist to localStorage for guests and backup
  useEffect(() => {
    localStorage.setItem('imex_cart', JSON.stringify(items));
  }, [items]);

  // --- REAL-TIME SYNC & MERGE ---
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      isInitialSyncDone.current = false;
      if (localStorage.getItem('imex_last_uid')) {
        localStorage.removeItem('imex_last_uid');
        setItems([]);
      }
      return;
    }

    setIsSyncing(true);
    const unsubscribe = subscribeToDocument<{ items: CartItem[] }>('carts', user.uid, async (remoteCart) => {
      const savedUid = localStorage.getItem('imex_last_uid');
      
      if (!isInitialSyncDone.current && savedUid !== user.uid) {
        // FIRST TIME LOGIN / SWITCH: Merge
        const remoteItems = remoteCart?.items || [];
        const localItems = items;
        const mergedMap = new Map<string, CartItem>();

        remoteItems.forEach(item => mergedMap.set(item.id, { ...item }));
        localItems.forEach(localItem => {
          const existing = mergedMap.get(localItem.id);
          if (existing) {
            mergedMap.set(localItem.id, { ...existing, quantity: existing.quantity + localItem.quantity });
          } else {
            mergedMap.set(localItem.id, { ...localItem });
          }
        });

        const finalItems = Array.from(mergedMap.values());
        setItems(finalItems);
        localStorage.setItem('imex_last_uid', user.uid);
        isInitialSyncDone.current = true;

        // Push merged state back to Firestore
        await setDocument('carts', user.uid, { 
          items: finalItems, 
          updatedAt: new Date(),
          mergedAt: new Date()
        });
      } else {
        // ALREADY SYNCED: Just follow remote
        if (remoteCart && remoteCart.items) {
          // Compare to avoid state update loops if possible, though React handles simple identity well
          setItems(remoteCart.items);
        }
        isInitialSyncDone.current = true;
        localStorage.setItem('imex_last_uid', user.uid);
      }
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [user, authLoading]);

  // Helper to persist changes
  const persistItems = async (newItems: CartItem[]) => {
    setItems(newItems);
    if (user && isInitialSyncDone.current) {
      try {
        await setDocument('carts', user.uid, { 
          items: newItems, 
          updatedAt: new Date() 
        });
      } catch (err) {
        console.error("Cart persistence error:", err);
      }
    }
  };

  const addItem = (product: any) => {
    const existing = items.find(item => item.id === product.id);
    let newItems;
    if (existing) {
      newItems = items.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [...items, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image,
        category: product.category,
        quantity: 1 
      }];
    }
    persistItems(newItems);
  };

  const removeItem = (productId: string) => {
    const newItems = items.filter(item => item.id !== productId);
    persistItems(newItems);
  };

  const updateQuantity = (productId: string, delta: number) => {
    const newItems = items.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    persistItems(newItems);
  };

  const clearCart = () => persistItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, addItem, removeItem, updateQuantity, clearCart, 
      totalItems, totalPrice,
      isDrawerOpen, setDrawerOpen, isSyncing
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
