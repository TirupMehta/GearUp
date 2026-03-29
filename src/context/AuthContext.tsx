import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { logActivity } from '../utils/activityLogger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await logActivity(cred.user.uid, email, 'LOGIN', 'Logged in to ShopGenie AI');
  };

  const signup = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const displayName = email.split('@')[0];
    await updateProfile(cred.user, { displayName });
    await logActivity(cred.user.uid, email, 'LOGIN', `New account created — ${displayName}`);
  };

  const logout = async () => {
    if (auth.currentUser) {
      await logActivity(
        auth.currentUser.uid,
        auth.currentUser.email ?? '',
        'LOGOUT',
        'Logged out of ShopGenie AI'
      );
    }
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
