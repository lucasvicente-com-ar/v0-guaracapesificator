import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics Dashboard - Guaraca Pesificator",
  description: "Dashboard de analytics y estadísticas de uso de Guaraca Pesificator",
  robots: "noindex, nofollow", // Private dashboard
}

export default function LogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
