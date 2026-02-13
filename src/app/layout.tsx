import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/contexts/queryProvider";
import { AuthProvider } from "@/contexts/auth";
import { auth } from "@/services/firebase/firebase";

export const metadata: Metadata = {
  title: "Piwo",
  description:
    "In deze app kun je je aanwezigheid opgeven voor de Pivo's van Scouting Mierlo",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className="select-none">
        <QueryProvider>
          <AuthProvider initialUser={auth.currentUser}>
            <div className="flex justify-center mb-22">
              <div className="w-full relative">{children}</div>
            </div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
