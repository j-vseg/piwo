"use client";

import { BaseDetailScreen } from "@/components/BaseDetailScreen/BaseDetailScreen";

const FEATURE_SECTIONS: { title: string; items: string[] }[] = [
  {
    title: "Activiteiten",
    items: [
      "Je kan je aanwezigheid invullen per activiteit",
      "Je kan een 'Later'-status instellen voor activiteiten door dubbel te klikken op de 'Aanwezig'-optie",
      "Je kan zien wie aanwezig is per activiteit door op een activiteit te klikken",
      "Je kan activiteiten aanmaken",
      "Je kan activiteiten wijzigen of verwijderen",
    ],
  },
  {
    title: "Beheer",
    items: [
      "Beheer-tab is alleen zichtbaar voor adviseurs en bestuur",
      "Adviseurs en bestuur kunnen nieuwe gebruikers goedkeuren of afkeuren",
      "Adviseurs en bestuur kunnen de toegang van een gebruiker intrekken",
      "Adviseurs en bestuur kunnen rollen toewijzen aan gebruikers",
    ],
  },
  {
    title: "Instellingen",
    items: [
      "Je kan je persoonlijke gegevens aanpassen",
      "Je kan je account verwijderen",
    ],
  },
];

export default function FeatureListScreen() {
  return (
    <BaseDetailScreen
      heightClass="h-85"
      color="bg-pastelGreen"
      title="Wat kun je doen met de Piwo app?"
    >
      <div className="flex flex-col gap-4">
        {FEATURE_SECTIONS.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl p-4">
            <h2 className="mb-2">{section.title}</h2>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              {section.items.map((item) => (
                <li key={item} className="text-sm text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </BaseDetailScreen>
  );
}

