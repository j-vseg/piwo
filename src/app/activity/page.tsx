"use client";

import { ActivityPage } from "@/domians/activity/activity";
import { useSearchParams } from "next/navigation";

function ActivityPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || undefined;

  if (!id) {
    return null;
  }

  return <ActivityPage id={id} />;
}

export default function Acitvity() {
  return (
      <ActivityPageContent />
  );
}