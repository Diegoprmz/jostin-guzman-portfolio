import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jostin Guzmán — Portafolio de Arquitectura",
  description:
    "Portafolio inmersivo del arquitecto Jostin Guzmán. Una experiencia showroom con WebGL, parallax de profundidad e iluminación dinámica.",
  authors: [{ name: "Jostin Guzmán" }],
  keywords: ["arquitectura", "portafolio", "diseño", "Jostin Guzmán", "México"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
