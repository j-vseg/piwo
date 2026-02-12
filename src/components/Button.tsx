import { ButtonHTMLAttributes, ReactNode } from "react";
import { LoadingIndicator } from "./LoadingIndicator";

export default function Button({
  children,
  className,
  isPending,
  disabled,
  ...buttonProps
}: {
  children: ReactNode;
  isPending?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`w-full max-w-3xl mx-auto bg-pastelOrange py-2.5 px-6 rounded-3xl font-semibold ${className} ${isPending || disabled ? "bg-gray-300!" : undefined}`}
      disabled={disabled || isPending}
      {...buttonProps}
    >
      {isPending ? <LoadingIndicator /> : children}
    </button>
  );
}
