import type { Metadata } from "next"
import { Geist, Geist_Mono, Fredoka, Silkscreen } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/lib/ThemeContext"
import { LangProvider } from "@/lib/LangContext"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// Fontes do Pontindex, usadas so no estado ativo do card do projeto
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Leonardo Pontin - Full Stack Developer",
  description:
    "Full Stack Developer com foco em backend. Java, Spring Boot, React, Next.js. Líder de TI na Mave Company.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} ${silkscreen.variable}`}>
      <body>
        <ThemeProvider>
          <LangProvider>{children}</LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
