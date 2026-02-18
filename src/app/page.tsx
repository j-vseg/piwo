"use client";

import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import OnboardingScreen from "@/domians/onboarding/onboarding";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const { replace } = useRouter();

  useEffect(() => {
    if (user && !isLoading) {
      replace("/home");
    }
  }, [user, isLoading, replace]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return <OnboardingScreen />;
  }

