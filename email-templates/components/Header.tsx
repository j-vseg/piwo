import { Column, Img, Row, Section, Text } from "react-email";

export function Header() {
  return (
    <Section className="my-[40px] px-[32px] py-[40px]">
      <Row>
        <Column className="w-[42px]">
          <Img
            alt="Piwo Logo"
            height="42"
            width="42"
            src="https://piwo-4487e.web.app/icon-512x512.png"
          />
        </Column>
        <Column>
          <Text className="font-crimson-pro text-h2 m-0 ml-[12px]">Piwo</Text>
        </Column>
      </Row>
    </Section>
  );
}
