"use client";

import { Alert } from "@/components/Alert";
import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";
import { Event } from "@/types/event";
import { ActivityList } from "./components/ActivityList";
import { useState } from "react";

export function UpdateActivityPage() {
  const [selected, setSelected] = useState<Event | null>(null);

  return (
    <BaseDetailScreen
      heightClass="h-22"
      title="Wijzig activiteit"
      color="bg-pastelBlue"
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <ActivityList selected={selected} setSelected={setSelected} />

          {!selected && (
            <Alert type="info" size="small">
              Selecteer een activiteit om te wijzigen of verwijderen.
            </Alert>
          )}
        </div>
      </div>
    </BaseDetailScreen>
  );
}
