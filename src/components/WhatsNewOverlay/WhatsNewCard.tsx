import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import { WHATS_NEW_VERSION } from "./WhatsNewOverlay";

export function WhatsNewCard({
  headingId,
  footer,
  embedded,
}: {
  headingId: string;
  footer: ReactNode;
  /** Shorter scroll area on in-page card; full overlay uses remaining height. */
  embedded: boolean;
}) {
  return (
    <div
      className={
        embedded
          ? "flex w-full max-w-lg flex-col gap-4 rounded-3xl bg-white -mt-6 py-5"
          : "flex h-full min-h-0 w-full max-w-lg flex-1 flex-col gap-4 overflow-hidden rounded-3xl border border-pastelOrange/40 bg-white/90 shadow-lg pt-5"
      }
    >
      <div className="shrink-0 border-b border-greyYellow/30 px-5 pb-4 text-center">
        <div className="mb-2 flex justify-center text-pastelOrange">
          <FontAwesomeIcon icon={faWandMagicSparkles} className="h-8 w-8" />
        </div>
        <h1 id={headingId} className="text-h2">
          Wat is er nieuw?
        </h1>
        <p className="mt-1 text-body_sm text-gray-600">
          Even bijpraten over de laatste update.
        </p>
      </div>
      <div
        className={
          embedded
            ? "px-5 pb-4 pt-2"
            : "min-h-0 flex-1 overflow-y-auto px-5 py-4"
        }
      >
        <h2 className="text-h3 mb-1.5">v{WHATS_NEW_VERSION}</h2>
        <ul className="list-disc space-y-2 pl-5 text-body_md text-gray-800">
          <li>
            Goedkeuringsflow voor nieuwe leden
            <br />{" "}
            <span className="text-sm text-gray-500">
              De voorzitter en adviseurs kunnen nu gebruikers goedkeuren of
              afwijzen via het beheer-overzicht. Dit overzicht is alleen
              zichtbaar voor gebruikers met een rol die dit toestaat.
            </span>
          </li>
          <li>
            Gebruikers beheren
            <br />{" "}
            <span className="text-sm text-gray-500">
              De voorzitter en adviseurs kunnen nu ook de rollen van gebruikers
              aanpassen via het beheer-overzicht. Dit overzicht is alleen
              zichtbaar voor gebruikers met een rol die dit toestaat.
            </span>
          </li>
          <li>
            Verbeteringen op home scherm
            <br />{" "}
            <span className="text-sm text-gray-500">
              Niet-herhalende activiteiten blijven correct zichtbaar tot hun
              eindtijd.
            </span>
          </li>
        </ul>
      </div>
      {footer != null ? <div className="mt-auto shrink-0">{footer}</div> : null}
    </div>
  );
}
