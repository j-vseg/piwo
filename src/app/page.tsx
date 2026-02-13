"use client";

import { Alert } from "@/components/Alert";
import { BottomNavigation } from "@/components/BottomNavigation";
import Button from "@/components/Button";
import { useAuth } from "@/contexts/auth";
import HomeScreen from "@/domians/home/home";
import OnboardingScreen from "@/domians/onboarding/onboarding";
import VerificationScreen from "@/domians/verification/verification";
import { Category } from "@/types/category";
import { getEventColor } from "@/utils/getEventColor";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { user, isApproved } = useAuth();
  const { replace } = useRouter();
  const [randomCategory] = useState(() => {
    const categoryValues = Object.values(Category);
    const randomIndex = Math.floor(Math.random() * 4);
    return categoryValues[randomIndex];
  });

  if (!user) {
    return <OnboardingScreen />;
  }

  if (user && !isApproved) {
    return <VerificationScreen />;
  }

  if (user && isApproved) {
    return (
      <>
        <HomeScreen />
        <BottomNavigation />
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div
        className={`absolute top-0 left-0 w-full h-[22vh] ${getEventColor(randomCategory)}`}
      ></div>
      <div className="flex flex-col gap-4 w-full max-w-3xl -mt-125 relative z-10">
        <h1 className="text-center my-4">Foutje!</h1>
        <Alert type="info">Er is iets misgegaan!</Alert>
        <Button
          className={`${getEventColor(randomCategory)}!`}
          onClick={() => replace("/")}
        >
          Navigeer naar home pagina
        </Button>
      </div>
    </div>
  );
}
