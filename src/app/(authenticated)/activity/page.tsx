"use client";

import { LoadingIndicator } from "@/components/LoadingIndicator";
import { ActivityPage } from "@/domians/activity/activity";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ActivityPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || undefined;

  if (!id) {
    return null;
  }

  return <ActivityPage id={id} />;
}

export default function Activity() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <ActivityPageContent />
    </Suspense>
  );
}