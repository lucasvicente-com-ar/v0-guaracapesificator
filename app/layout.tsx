import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Guaraca Pesificator - Convertidor de Monedas PYG/ARS/USD",
  description:
    "Convertidor de monedas en tiempo real entre Guaraníes Paraguayos (PYG), Pesos Argentinos (ARS) y Dólares Estadounidenses (USD). Tasas actualizadas automáticamente.",
  generator: "v0.app",
  keywords: ["convertidor", "monedas", "guaraníes", "pesos", "dólares", "PYG", "ARS", "USD", "Paraguay", "Argentina"],
  authors: [{ name: "LV", url: "https://guaracapesificator.vercel.app" }],
  creator: "LV made with iA and Brain",
  publisher: "Vercel",
  robots: "index, follow",
  openGraph: {
    title: "Guaraca Pesificator - Convertidor de Monedas",
    description:
      "Convierte entre Guaraníes Paraguayos, Pesos Argentinos y Dólares con tasas actualizadas en tiempo real",
    url: "https://guaracapesificator.vercel.app",
    siteName: "Guaraca Pesificator",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200&text=Guaraca+Pesificator",
        width: 1200,
        height: 630,
        alt: "Guaraca Pesificator - Convertidor de Monedas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guaraca Pesificator - Convertidor de Monedas",
    description: "Convierte entre PYG, ARS y USD con tasas actualizadas en tiempo real",
    images: ["/placeholder.svg?height=630&width=1200&text=Guaraca+Pesificator"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1e293b",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Guaraca Pesificator" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1e293b" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
