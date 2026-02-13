"use client";

import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/auth";
import { ReactNode } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isApproved } = useAuth();

  // Only show navigation for authenticated and approved users
  const showNavigation = user && isApproved;

  return (
    <>
      {children}
      {showNavigation && <BottomNavigation />}
    </>
  );
}
