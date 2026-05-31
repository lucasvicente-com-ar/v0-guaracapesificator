"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, RefreshCw, Settings, FileText, BarChart3, AlertTriangle, Database } from "lucide-react"

export default function SetupPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const initializeLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/init-logs")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        error: "Failed to initialize logs",
        details: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const checkLogStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/logs?type=analytics&password=guaraca2024")
      const analyticsData = await response.json()

      const visitsResponse = await fetch("/api/logs?type=visits&password=guaraca2024")
      const visitsData = await visitsResponse.json()

      const conversionsResponse = await fetch("/api/logs?type=conversions&password=guaraca2024")
      const conversionsData = await conversionsResponse.json()

      setStatus({
        success: true,
        message: "Sistema de logs funcionando",
        analytics: analyticsData,
        visitsCount: Array.isArray(visitsData) ? visitsData.length : 0,
        conversionsCount: Array.isArray(conversionsData) ? conversionsData.length : 0,
      })
    } catch (error) {
      setStatus({
        error: "Failed to check log status",
        details: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <Settings className="h-8 w-8" />
            Configuración del Sistema
          </h1>
          <p className="text-slate-300">Sistema de logs en memoria para Guaraca Pesificator</p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Importante:</strong> En Vercel, los datos se almacenan en memoria y se reinician con cada deploy.
            Para persistencia real, considera usar una base de datos como Supabase, Neon, o Upstash.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Sistema en Memoria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                El sistema está configurado para funcionar en memoria. Los datos se mantienen durante la sesión actual.
              </p>
              <Button onClick={initializeLogs} disabled={loading} className="w-full">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Verificar Sistema
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Estado Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Verifica el estado actual del sistema de analytics.</p>
              <Button onClick={checkLogStatus} disabled={loading} variant="outline" className="w-full bg-transparent">
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Verificar Estado
              </Button>
            </CardContent>
          </Card>
        </div>

        {status && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Resultado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {status.success ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      ✅ Sistema Activo
                    </Badge>
                    <span className="text-sm">{status.message}</span>
                  </div>

                  {status.note && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">{status.note}</AlertDescription>
                    </Alert>
                  )}

                  {status.analytics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{status.analytics.totalVisits}</div>
                        <div className="text-xs text-muted-foreground">Visitas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{status.visitsCount}</div>
                        <div className="text-xs text-muted-foreground">Registros</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{status.conversionsCount}</div>
                        <div className="text-xs text-muted-foreground">Conversiones</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{status.analytics.uniqueSessions}</div>
                        <div className="text-xs text-muted-foreground">Sesiones</div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button asChild size="sm">
                      <a href="/logs">Ver Dashboard</a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href="/">Ir a la App</a>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">❌ Error</Badge>
                    <span className="text-sm">{status.error}</span>
                  </div>
                  {status.details && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-sm text-red-700">
                        <strong>Detalles:</strong> {status.details}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Recomendación para Producción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Para una aplicación en producción, te recomendamos usar una base de datos persistente:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded p-3">
                <h4 className="font-medium">Supabase</h4>
                <p className="text-xs text-muted-foreground">PostgreSQL con tiempo real</p>
              </div>
              <div className="border rounded p-3">
                <h4 className="font-medium">Neon</h4>
                <p className="text-xs text-muted-foreground">PostgreSQL serverless</p>
              </div>
              <div className="border rounded p-3">
                <h4 className="font-medium">Upstash</h4>
                <p className="text-xs text-muted-foreground">Redis para datos rápidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instrucciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">1. Sistema Actual</h4>
              <p className="text-sm text-muted-foreground">El sistema funciona en memoria y está listo para usar.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Generar Datos</h4>
              <p className="text-sm text-muted-foreground">
                Visita la aplicación principal y haz conversiones para ver datos en el dashboard.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. Ver Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Accede al dashboard en <code>/logs</code> con la contraseña <code>guaraca2024</code>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
