import { Link, Section } from "react-email";
import { Base } from "../components/Base";
import { Button } from "../components/Button";
import { Signature } from "../components/Signature";
import { ThemedText } from "../components/ThemedText";

export default function ForgotPassword() {
  return (
    <Base>
      <ThemedText type="h3" className="mb-0">
        Whoops!
      </ThemedText>
      <ThemedText type="h3" className="mt-[4px] mb-6">
        Wachtwoord vergeten?
      </ThemedText>

      <ThemedText>
        We hebben je verzoek ontvangen om het wachtwoord van je
        %APP_NAME%-account (%EMAIL%) te resetten. Klik op de knop hieronder om
        een nieuw wachtwoord in te stellen.
      </ThemedText>

      <Section>
        <Button href="https://example.com">Reset wachtwoord</Button>
      </Section>
      <Section className="mt-[8px]">
        <Link href="%LINK%" className="text-tertiary underline">
          %LINK%
        </Link>
      </Section>

      <Signature />

      <ThemedText type="bodySmall" className="text-dark-grey-medium">
        Heb je dit niet aangevraagd? Geen zorgen, dan kun je deze e-mail gewoon
        negeren.
      </ThemedText>
    </Base>
  );
}
