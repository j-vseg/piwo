"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/auth";
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
