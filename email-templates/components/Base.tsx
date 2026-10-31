import { ReactNode } from "react";
import {
  Body,
  Container,
  Font,
  Head,
  Html,
  pixelBasedPreset,
  Section,
  Tailwind,
} from "react-email";
import { tailwindConfig } from "../tailwind.config";
import { Header } from "./Header";

export function Base({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Html>
      <Tailwind
        config={{
          ...tailwindConfig,
          presets: [pixelBasedPreset],
        }}
      >
        <Head>
          <Font
            fontFamily="Crimson Pro"
            fallbackFontFamily="Georgia"
            webFont={{
              url: "https://fonts.gstatic.com/s/crimsonpro/v28/q5uUsoa5M_tv7IihmnkabC5XiXCAlXGks1WZEGp8O5E_VNSgyQ.woff",
              format: "woff",
            }}
            fontWeight={600}
            fontStyle="normal"
          />
          <Font
            fontFamily="Poppins"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrFJXUdVNF.woff2",
              format: "woff2",
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <Font
            fontFamily="Poppins"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLGT9V15vEv-L.woff2",
              format: "woff2",
            }}
            fontWeight={500}
            fontStyle="normal"
          />
          <Font
            fontFamily="Poppins"
            fallbackFontFamily="Arial"
            webFont={{
              url: "https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLCz7V15vEv-L.woff2",
              format: "woff2",
            }}
            fontWeight={700}
            fontStyle="normal"
          />
        </Head>

        <Body>
          <Container>
            <Header />
            <Section>{children}</Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
