import { type ReactNode } from "react";
import { Button as ReactEmailButton } from "react-email";
import { ThemedText } from "./ThemedText";

type ButtonType = "primary" | "secondary";

const typeClasses: Record<ButtonType, string> = {
  primary: "bg-tertiary border-tertiary text-white",
  secondary: "bg-secondary border-secondary text-white",
};

export function Button({
  href,
  children,
  type = "primary",
  className,
}: Readonly<{
  href: string;
  children: ReactNode;
  type?: ButtonType;
  className?: string;
}>) {
  return (
    <ReactEmailButton
      href={href}
      className={`box-border block w-full border border-solid px-[24px] py-[10px] no-underline rounded-full ${typeClasses[type]} ${className ?? ""}`}
      style={{
        textAlign: "center",
        minHeight: "48px",
        lineHeight: "28px",
      }}
    >
      <ThemedText type="button" className="m-0 text-inherit">
        {children}
      </ThemedText>
    </ReactEmailButton>
  );
}
