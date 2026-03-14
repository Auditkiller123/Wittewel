import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, getUserProfile, signInAndGetUser } from '../services/auth';
import { AppUser } from '../types';

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const p = await getUserProfile(user.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const initialize = async (): Promise<User> => {
    return signInAndGetUser();
  };

  return { firebaseUser, profile, loading, initialize, setProfile };
}
