"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase/firebase";
import { skipToken, useQuery } from "@tanstack/react-query";
import { getAccount } from "@/services/firebase/accounts";

interface AuthContextType {
  user: User | null;
  isApproved: boolean | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export function AuthProvider({
  children,
  initialUser = null,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [authLoading, setAuthLoading] = useState(true);

  const { data: accountData, isLoading: accountLoading } = useQuery({
    queryKey: ["account", user?.uid],
    queryFn: user ? async () => getAccount(user.uid) : skipToken,
    enabled: !!user?.uid,
    staleTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    isApproved: accountData?.isApproved ?? null,
    isLoading: authLoading || accountLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
