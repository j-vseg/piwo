"use client";

import { Alert } from "@/components/Alert";
import Button from "@/components/Button";
import { LoadingIndicator } from "@/components/LoadingIndicator";
import { useAuth } from "@/contexts/auth";
import OnboardingScreen from "@/domians/onboarding/onboarding";
import VerificationScreen from "@/domians/verification/verification";
import { getRandomEventColor } from "@/utils/getRandomEventColor";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isApproved, isLoading } = useAuth();
  const { replace } = useRouter();
  const eventColor = getRandomEventColor();

  useEffect(() => {
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
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className={`absolute top-0 left-0 w-full h-[22vh] ${eventColor}`}
      ></div>
      <div className="flex flex-col gap-4 w-full max-w-3xl -mt-125 relative z-10">
        <h1 className="text-center my-4">Foutje!</h1>
        <Alert type="info">Er is iets misgegaan!</Alert>
        <Button className={`${eventColor}!`} onClick={() => replace("/")}>
          Navigeer naar home pagina
        </Button>
      </div>
    </div>
  );
}
