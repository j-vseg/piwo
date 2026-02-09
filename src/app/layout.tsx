import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/contexts/queryProvider";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AuthProvider } from "@/contexts/auth";
import { auth } from "@/services/firebase/firebase";

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
          <AuthProvider initialUser={auth.currentUser}>
            <div className="mb-18">{children}</div>
          </AuthProvider>
          <BottomNavigation />
        </QueryProvider>
      </body>
    </html>
  );
}
