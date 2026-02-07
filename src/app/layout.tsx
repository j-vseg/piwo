import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/contexts/queryProvider";
import { BottomNavigation } from "@/components/BottomNavigation";

export const metadata: Metadata = {
  title: "Piwo",
  description:
    "In deze app kun je je aanwezigheid opgeven voor de Pivo's van Scouting Mierlo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>
        <QueryProvider>
          {children}
          <BottomNavigation />
        </QueryProvider>
      </body>
    </html>
  );
}
