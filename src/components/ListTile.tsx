import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonHTMLAttributes, ReactNode } from "react";

export default function ListTile({
  children,
  disabled,
  className,
  ...buttonProps
}: {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`w-full max-w-3xl mx-auto bg-white py-3 px-3 flex gap-4 items-center justify-between border-b border-b-gray-300 ${disabled ? "bg-gray-100!" : undefined} ${className}`}
      disabled={disabled}
      {...buttonProps}
    >
      <p className={`${disabled ? "text-gray-500!" : undefined}`}>{children}</p>
      <FontAwesomeIcon
        icon={faChevronRight}
        className={`max-h-3! text-gray-400 ${disabled ? "text-gray-500!" : undefined} ${className}`}
      />
    </button>
  );
}
