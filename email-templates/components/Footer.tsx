import { Hr, Link, Section, Text } from "react-email";

export function Footer() {
  return (
    <Section className="px-[32px] pb-[32px]">
      <Hr className="border-dark-grey-light my-[24px]" />
      <Text className="font-crimson-pro text-h5 text-dark-grey-medium m-0 text-center mb-[4px]">
        Kom je er niet uit? Neem gerust contact op!
      </Text>
      <Text className="font-poppins text-body-smaller text-dark-grey-medium m-0 text-center">
        Janne van Seggelen{" · "}
        <Link
          href="mailto:vanseggelenjanne@gmail.com"
          className="text-dark-grey-medium underline"
        >
          vanseggelenjanne@gmail.com
        </Link>
        {" · "}
        <Link
          href="tel:+31631513327"
          className="text-dark-grey-medium underline"
        >
          +31 6 31513327
        </Link>
      </Text>
    </Section>
  );
}
