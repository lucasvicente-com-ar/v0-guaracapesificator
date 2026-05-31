import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Configuración del Sistema - Guaraca Pesificator",
  description: "Página de configuración y setup del sistema de logs de Guaraca Pesificator",
  robots: "noindex, nofollow", // Private setup page
}

export default function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
