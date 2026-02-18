"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import VerificationScreen from "@/domians/verification/verification";
import { deletePastEvents } from "@/services/firebase/events";
import { ReactNode, useEffect } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isApproved, isLoading } = useAuth();

  useEffect(() => {
    deletePastEvents().catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (user && !isApproved) {
    return <VerificationScreen />;
  }

  if (user && isApproved) {
    return (
      <>
        {children}
        <BottomNavigation />
      </>
    );
  }
}