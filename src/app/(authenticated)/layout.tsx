"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
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
    </>
  );
}
