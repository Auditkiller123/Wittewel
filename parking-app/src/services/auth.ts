import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AppUser } from '../types';

export async function signInAndGetUser(): Promise<User> {
  const { user } = await signInAnonymously(auth);
  return user;
}

export async function saveUserProfile(uid: string, name: string, email: string): Promise<void> {
  await setDoc(doc(db, 'users', uid), {
    uid,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as AppUser;
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
