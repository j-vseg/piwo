"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { WhatsNewOverlay } from "@/components/WhatsNewOverlay/WhatsNewOverlay";
import { deletePastEvents } from "@/services/firebase/events";
import { ReactNode, useEffect } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    deletePastEvents().catch(console.error);
  }, []);

  return (
    <>
      {children}
      <BottomNavigation />
      <WhatsNewOverlay />
    </>
  );
}
