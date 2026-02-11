import { ReactNode } from "react";
import { Header } from "./Header";

export function BaseDetailScreen({
  heightClass,
  children,
  title,
  color = "background-orange",
}: {
  heightClass: string;
  children: ReactNode;
  title?: string;
  color?: string;
}) {
  const parts = heightClass.split("-");
  const marginTopValue = `-${(Number(parts[1]) - 5) * 4}px`;

  return (
    <>
      <Header title={title} color={color} />
      <div className={`-z-1 w-full ${color} ${heightClass}`}></div>
      <div
        className="w-full max-w-3xl mx-auto p-4"
        style={{ marginTop: marginTopValue }}
      >
        {children}
      </div>
    </>
  );
}
