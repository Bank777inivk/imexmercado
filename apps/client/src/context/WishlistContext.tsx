import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth, updateDocument } from '@imexmercado/firebase';

interface WishlistContextType {
  wishlist: any[];
  toggleWishlist: (product: any) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, profile } = useAuth();
  const [localWishlist, setLocalWishlist] = React.useState<any[]>(() => {
    const saved = localStorage.getItem('imex_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist local wishlist to localStorage
  React.useEffect(() => {
    if (!user) {
      localStorage.setItem('imex_wishlist', JSON.stringify(localWishlist));
    }
  }, [localWishlist, user]);

  // Sync / Merge logic when user logs in
  React.useEffect(() => {
    if (user && profile && localWishlist.length > 0) {
      const mergeWishlists = async () => {
        const cloudWishlist = profile.wishlist || [];
        // Combine and remove duplicates by ID
        const merged = [...cloudWishlist];
        localWishlist.forEach(localItem => {
          if (!merged.find(m => m.id === localItem.id)) {
            merged.push(localItem);
          }
        });

        try {
          await updateDocument('users', user.uid, {
            wishlist: merged
          });
          // Clear local after successful merge
          setLocalWishlist([]);
          localStorage.removeItem('imex_wishlist');
        } catch (error) {
          console.error("Error merging wishlist:", error);
        }
      };
      mergeWishlists();
    }
  }, [user, profile, localWishlist]);

  const wishlist = user ? (profile?.wishlist || []) : localWishlist;

  const toggleWishlist = async (product: any) => {
    const isFavorite = wishlist.some((p: any) => p.id === product.id);
    let newWishlist;

    if (isFavorite) {
      newWishlist = wishlist.filter((p: any) => p.id !== product.id);
    } else {
      newWishlist = [...wishlist, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      }];
    }

    if (user) {
      try {
        await updateDocument('users', user.uid, {
          wishlist: newWishlist
        });
      } catch (error) {
        console.error("Error updating cloud wishlist:", error);
      }
    } else {
      setLocalWishlist(newWishlist);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p: any) => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
