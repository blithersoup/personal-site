import type { Metadata } from "next";
import { Castoro, Archivo } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css';
import { SP } from "next/dist/shared/lib/utils";

const castoro = Castoro({
  subsets: ['latin'],
  variable: '--font-castoro',
  display: 'swap',
  weight: '400'
})
 
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Grady Arnold",
  description: "Personal website for Grady Arnold",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${castoro.variable} ${archivo.variable}`}>
        <body className="antialiased flex-auto min-w-0 mt-6 flex flex-col px-4 md:px-8">
          <main className="w-full max-w-screen-2xl mx-auto font-main">
              {children}
          </main>
          <Analytics />
          <SpeedInsights />
        </body>
    </html>
  );
}