"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import {
  AuthenticatedUserProvider,
  useAuth,
} from "@/contexts/auth";
import VerificationScreen from "@/domians/verification/verification";
import { deletePastEvents } from "@/services/firebase/events";
import { ReactNode, useEffect } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isApproved } = useAuth();

  useEffect(() => {
    if (user && isApproved) {
      deletePastEvents().catch(console.error);
    }
  }, [user, isApproved]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (isApproved === false) {
    return <VerificationScreen />;
  }

  return (
    <AuthenticatedUserProvider user={user}>
      {children}
      <BottomNavigation />
    </AuthenticatedUserProvider>
  );
}
