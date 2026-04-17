import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "./config";

export const setDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  return await setDoc(docRef, data);
};

export const getCollection = async <T = any>(collectionName: string): Promise<T[]> => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
};

export const subscribeToCollection = <T = any>(collectionName: string, callback: (data: T[]) => void) => {
  const q = collection(db, collectionName);
  return onSnapshot(q, 
    (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
      callback(data);
    },
    (error) => {
      console.error(`Snapshot collection error on ${collectionName}:`, error);
      callback([]); // Return empty array on error
    }
  );
};

export const getDocument = async <T = any>(collectionName: string, id: string): Promise<T | null> => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

export const subscribeToDocument = <T = any>(collectionName: string, id: string, callback: (data: T | null) => void) => {
  const docRef = doc(db, collectionName, id);
  return onSnapshot(docRef, 
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error(`Snapshot document error on ${collectionName}/${id}:`, error);
      callback(null); // Important: trigger callback with null to unblock UI
    }
  );
};

export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  return await deleteDoc(docRef);
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  return await updateDoc(docRef, data);
};
