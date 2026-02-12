import Button from "@/components/Button";
import Slider from "./components/Slider";

export default function OnboardingScreen() {
  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto">
      <Slider />
      <div className="flex-1 flex-col gap-4 items-center p-4 mt-8">
        <Button>Inloggen</Button>
      </div>
    </div>
  );
}
