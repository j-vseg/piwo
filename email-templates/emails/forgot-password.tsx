import { Link, Section } from "react-email";
import { Base } from "../components/Base";
import { Button } from "../components/Button";
import { ThemedText } from "../components/ThemedText";

export default function ForgotPassword() {
  return (
    <Base>
      <ThemedText>
        Volg deze link om het %APP_NAME%-wachtwoord voor uw account %EMAIL% te
        resetten
      </ThemedText>

      <Section>
        <Button href="https://example.com">Reset wachtwoord</Button>
      </Section>
      <Section className="mt-[8px]">
        <Link href="%LINK%">%LINK%</Link>
      </Section>

      <ThemedText type="bodySmall">
        Als u niet heeft gevraagd uw wachtwoord te resetten, kunt u deze e-mail
        negeren.
      </ThemedText>
    </Base>
  );
}
