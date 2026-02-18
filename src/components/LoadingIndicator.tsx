import Lottie from "lottie-react";
import loadingDots from "@/../assets/loading_dots.json";

export function LoadingIndicator() {
  return (
    <div className="flex justify-center">
      <Lottie
        animationData={loadingDots}
        className="flex justify-center items-center w-6 h-6"
        loop
      />
    </div>
  );
}
