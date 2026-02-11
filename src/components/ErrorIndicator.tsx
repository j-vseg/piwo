import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

interface ErrorIndicatorProps {
  type?: "small" | "large";
  children: ReactNode;
}

export function ErrorIndicator({
  type = "large",
  children,
}: ErrorIndicatorProps) {
  if (type === "small") {
    return (
      <div className="flex gap-2 items-center">
        <FontAwesomeIcon icon={faCircleInfo} className="max-h-4!" />
        <p className="text-[14px]!">{children}</p>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-5 items-center rounded-3xl p-6 bg-info">
        <FontAwesomeIcon icon={faCircleInfo} size="2x" className="max-h-8!" />
        <p>{children}</p>
      </div>
    );
  }
}
