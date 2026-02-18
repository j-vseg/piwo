"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
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
    staleTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
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

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isApproved: accountData?.isApproved ?? null,
      isLoading: authLoading || accountLoading,
    }),
    [user, accountData?.isApproved, authLoading, accountLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Only provided by the authenticated layout when user && isApproved.
// Use this inside (authenticated) routes so you never wait for "user" again.
const AuthenticatedUserContext = createContext<User | undefined>(undefined);

export function AuthenticatedUserProvider({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  return (
    <AuthenticatedUserContext.Provider value={user}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}

export function useAuthenticatedUser(): User {
  const user = useContext(AuthenticatedUserContext);
  if (user === undefined) {
    throw new Error(
      "useAuthenticatedUser must be used within AuthenticatedUserProvider (i.e. inside the authenticated layout)"
    );
  }
  return user;
}
