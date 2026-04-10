import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./config";

import { getDocument } from "./firestore";

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const profileData = await getDocument("users", firebaseUser.uid);
          setProfile(profileData);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, profile, isAdmin: profile?.role === 'admin', loading };
};

export const logout = () => signOut(auth);
