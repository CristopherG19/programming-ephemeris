import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Efemérides de Programación | Terminal Diario",
  description: "Descubre cada día un hecho histórico sobre programación y tecnología",
  generator: "Cristopher Gutierrez",
  authors: [{ name: "Cristopher Gutierrez", email: "cgch_1996@hotmail.com" }],
  creator: "Cristopher Gutierrez",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`font-mono ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
