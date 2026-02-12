import { ReactNode } from "react";

export default function Button({ children }: { children: ReactNode }) {
  return (
    <button className="w-full max-w-3xl mx-auto bg-pastelOrange py-2.5 px-6 rounded-3xl font-semibold">
      {children}
    </button>
  );
}
