import { Hr, Link, Section } from "react-email";
import { ThemedText } from "./ThemedText";

export function Footer() {
  return (
    <Section className="px-[32px] pb-[32px]">
      <Hr className="border-dark-grey-light my-[24px]" />
      <ThemedText
        type="bodySmaller"
        className="font-crimson-pro text-dark-grey-medium m-0 text-center mb-[4px]"
      >
        Kom je er niet uit? Neem gerust contact op!
      </ThemedText>
      <ThemedText
        type="bodySmaller"
        className="text-dark-grey-medium m-0 text-center"
      >
        Janne van Seggelen
      </ThemedText>
      <ThemedText
        type="bodySmaller"
        className="text-dark-grey-medium m-0 text-center"
      >
        <Link
          href="mailto:vanseggelenjanne@gmail.com"
          className="text-dark-grey-medium underline"
        >
          vanseggelenjanne@gmail.com
        </Link>
      </ThemedText>
      <ThemedText
        type="bodySmaller"
        className="text-dark-grey-medium m-0 text-center"
      >
        <Link
          href="tel:+31631513327"
          className="text-dark-grey-medium underline"
        >
          +31 6 31513327
        </Link>
      </ThemedText>
    </Section>
  );
}
