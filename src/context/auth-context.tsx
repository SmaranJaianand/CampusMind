
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create a mock user for testing purposes
const mockUser: User = {
  uid: 'test-user-123',
  email: 'test@mannan.app',
  displayName: 'Test User',
  photoURL: `https://picsum.photos/seed/test-user/128/128`,
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  // Add dummy implementations for required methods
  getIdToken: async () => 'test-token',
  getIdTokenResult: async () => ({
    token: 'test-token',
    expirationTime: new Date().toISOString(),
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    signInProvider: null,
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  delete: async () => {},
  toJSON: () => ({}),
  providerId: 'firebase',
};


const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We are currently in a testing mode where login is disabled.
    // We'll set a mock user to enable testing of protected features.
    setUser(mockUser);
    setLoading(false);

    // The original logic is commented out below.
    // When you're ready to re-enable authentication, you can uncomment this
    // and remove the mock user logic above.
    /*
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
    */
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
