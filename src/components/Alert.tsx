import { faCheck, faExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

interface AlertProps {
  type: "success" | "danger" | "info";
  children: ReactNode;
  size?: "small" | "large";
}

export function Alert({ type, children, size = "large" }: AlertProps) {
  if (size === "small") {
    return (
      <div
        className={`flex gap-4 items-center px-4 py-2 rounded-lg ${type === "danger" ? "bg-orangeRed" : type === "success" ? "bg-background-success" : "bg-background-orange"}`}
      >
        <FontAwesomeIcon
          icon={type === "success" ? faCheck : faExclamation}
          shake={type === "danger" || type === "info"}
          className={`max-h-4! ${type === "success" ? "text-success" : undefined}`}
        />
        <p className="text-[14px]!">{children}</p>
      </div>
    );
  } else {
    return (
      <div
        className={`flex flex-col gap-5 items-center rounded-3xl p-6 ${type === "danger" ? "bg-orangeRed" : type === "success" ? "bg-background-success" : "bg-background-orange"}`}
      >
        <FontAwesomeIcon
          icon={type === "success" ? faCheck : faExclamation}
          shake={type === "danger" || type === "info"}
          className="`max-h-8!"
          size="2x"
        />
        <p>{children}</p>
      </div>
    );
  }
}
