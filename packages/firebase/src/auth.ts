import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./config";

import { getDocument, subscribeToDocument } from "./firestore";

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;
    let authInitialized = false;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      authInitialized = true;
      
      // Nettoyer l'ancien abonnement au profil si nécessaire
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (firebaseUser) {
        try {
          // Écoute en temps réel du document utilisateur
          unsubscribeProfile = subscribeToDocument("users", firebaseUser.uid, (profileData) => {
            setProfile(profileData);
            setLoading(false); // On ne débloque le loading qu'après avoir reçu la donnée profil
          });
        } catch (error) {
          console.error("Error setting up profile listener:", error);
          setProfile(null);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  return { user, profile, isAdmin: profile?.role === 'admin', loading };
};

export const logout = () => signOut(auth);
