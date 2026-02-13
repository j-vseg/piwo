"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { ReactNode } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <BottomNavigation />
    </>
  );
}
