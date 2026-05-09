"use client";

import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";
import { WhatsNewOverlay } from "@/components/WhatsNewOverlay/WhatsNewOverlay";

export default function WhatIsNewScreen() {
  return (
    <BaseDetailScreen heightClass="h-50" color="bg-pastelGreen">
      <WhatsNewOverlay mode="inline" />
    </BaseDetailScreen>
  );
}

