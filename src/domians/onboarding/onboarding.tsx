"use client";

import Button from "@/components/Button";
import Slider from "./components/Slider";
import { useRouter } from "next/navigation";

export default function OnboardingScreen() {
  const { push } = useRouter();

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <Slider />
      <div className="flex-1 flex-col gap-4 items-center p-4 mt-8">
        <Button onClick={() => push(`/login`)}>Inloggen</Button>
      </div>
    </div>
  );
}
