"use client";

import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import OnboardingScreen from "@/domians/onboarding/onboarding";
import VerificationScreen from "@/domians/verification/verification";
import { Approval } from "@/types/approval";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function Home() {
  const { user, approval, isLoading } = useAuth();
  const { replace } = useRouter();

  useLayoutEffect(() => {
    if (user && approval === Approval.Accepted) {
      replace("/home");
    }
  }, [user, approval, replace]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (!user) {
    return <OnboardingScreen />;
  }

  if (
    user &&
    (approval === Approval.Declined || approval === Approval.Unknown)
  ) {
    return <VerificationScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingIndicator />
    </div>
  );
}
