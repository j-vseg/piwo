import { Section } from "react-email";
import { ThemedText } from "./ThemedText";

export function Signature() {
  return (
    <Section className="mt-[24px]">
      <ThemedText className="m-0 leading-[20px]">
        Met vriendelijke groet,
      </ThemedText>
      <ThemedText className="m-0 leading-[22px]">
        Het %APP_NAME% App Team
      </ThemedText>
    </Section>
  );
}
