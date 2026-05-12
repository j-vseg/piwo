"use client";

import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import OnboardingScreen from "@/domians/onboarding/onboarding";
import VerificationScreen from "@/domians/verification/verification";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function Home() {
  const { user, isApproved, isLoading } = useAuth();
  const { replace } = useRouter();

  useLayoutEffect(() => {
    if (user && isApproved) {
      replace("/home");
    }
  }, [user, isApproved, replace]);

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

  if (user && !isApproved) {
    return <VerificationScreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingIndicator />
    </div>
  );
}
