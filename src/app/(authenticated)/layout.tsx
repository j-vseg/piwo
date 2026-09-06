"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { WhatsNewOverlay } from "@/components/WhatsNewOverlay/WhatsNewOverlay";
import { useAuth } from "@/contexts/auth";
import { deletePastEvents } from "@/services/firebase/events";
import { Approval } from "@/types/approval";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, approval, isLoading } = useAuth();
  const { replace } = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || approval !== Approval.Accepted)) {
      replace("/");
    }
  }, [user, approval, isLoading, replace]);

  useEffect(() => {
    deletePastEvents().catch(console.error);
  }, []);

  if (isLoading || !user || approval !== Approval.Accepted) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <>
      {children}
      <BottomNavigation />
      <WhatsNewOverlay />
    </>
  );
}
