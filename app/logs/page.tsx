"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Download, Eye, BarChart3 } from "lucide-react"

export default function LogsPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)
  const [visits, setVisits] = useState<any[]>([])
  const [conversions, setConversions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const authenticate = () => {
    if (password === "guaraca2024") {
      setIsAuthenticated(true)
      loadData()
    } else {
      alert("Contraseña incorrecta")
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      // Load analytics
      const analyticsRes = await fetch(`/api/logs?type=analytics&password=${password}`)
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      } else {
        console.error("Error loading analytics:", await analyticsRes.text())
        // Set empty analytics if error
        setAnalytics({
          totalVisits: 0,
          uniqueSessions: 0,
          visits24h: 0,
          visits7d: 0,
          topBrowsers: [],
          deviceTypes: {},
          topCountries: [],
          avgLoadTime: 0,
          mobilePercentage: 0,
        })
      }

      // Load visits (last 50)
      const visitsRes = await fetch(`/api/logs?type=visits&password=${password}`)
      if (visitsRes.ok) {
        const visitsData = await visitsRes.json()
        setVisits(Array.isArray(visitsData) ? visitsData.slice(-50).reverse() : [])
      } else {
        console.error("Error loading visits:", await visitsRes.text())
        setVisits([])
      }

      // Load conversions (last 100)
      const conversionsRes = await fetch(`/api/logs?type=conversions&password=${password}`)
      if (conversionsRes.ok) {
        const conversionsData = await conversionsRes.json()
        setConversions(Array.isArray(conversionsData) ? conversionsData.slice(-100).reverse() : [])
      } else {
        console.error("Error loading conversions:", await conversionsRes.text())
        setConversions([])
      }
    } catch (error) {
      console.error("Error loading data:", error)
      // Set empty data on error
      setAnalytics({
        totalVisits: 0,
        uniqueSessions: 0,
        visits24h: 0,
        visits7d: 0,
        topBrowsers: [],
        deviceTypes: {},
        topCountries: [],
        avgLoadTime: 0,
        mobilePercentage: 0,
      })
      setVisits([])
      setConversions([])
    } finally {
      setLoading(false)
    }
  }

  const downloadLogs = async (type: string) => {
    try {
      const response = await fetch(`/api/logs?type=${type}&password=${password}`)
      const data = await response.text()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${type}-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading logs:", error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Acceso a Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && authenticate()}
            />
            <Button onClick={authenticate} className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Acceder
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <Button onClick={loadData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{analytics.totalVisits}</div>
                <p className="text-sm text-muted-foreground">Total Visitas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{analytics.uniqueSessions}</div>
                <p className="text-sm text-muted-foreground">Sesiones Únicas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{analytics.visits24h}</div>
                <p className="text-sm text-muted-foreground">Últimas 24h</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold">{analytics.avgLoadTime}ms</div>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="visits">Visitas ({visits.length})</TabsTrigger>
            <TabsTrigger value="conversions">Conversiones ({conversions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Browsers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.topBrowsers.map(([browser, count]: [string, number]) => (
                        <div key={browser} className="flex justify-between items-center">
                          <span>{browser}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Países</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {analytics.topCountries.map(([country, count]: [string, number]) => (
                        <div key={country} className="flex justify-between items-center">
                          <span>{country}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tipos de Dispositivo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(analytics.deviceTypes).map(([device, count]) => (
                        <div key={device} className="flex justify-between items-center">
                          <span>{device}</span>
                          <Badge variant="secondary">{count as number}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="visits">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Últimas Visitas</CardTitle>
                  <Button onClick={() => downloadLogs("visits")} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {visits.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay visitas registradas aún.</p>
                    <p className="text-sm mt-2">
                      Los logs se crearán automáticamente cuando alguien visite la aplicación.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {visits.map((visit, index) => (
                      <div key={index} className="border-b pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {visit.browser?.name || "Unknown"} {visit.browser?.version || ""} -{" "}
                              {visit.device?.os || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {visit.country || "Unknown"} • {visit.device?.type || "Unknown"} •{" "}
                              {visit.screen?.viewport || "Unknown"}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{new Date(visit.timestamp).toLocaleString()}</p>
                            {visit.performance?.loadTime && (
                              <p className="text-xs text-muted-foreground">{visit.performance.loadTime}ms</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Últimas Conversiones</CardTitle>
                  <Button onClick={() => downloadLogs("conversions")} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {conversions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No hay conversiones registradas aún.</p>
                    <p className="text-sm mt-2">
                      Las conversiones se registrarán cuando los usuarios usen el convertidor.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {conversions.map((conversion, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <span className="font-medium">
                            {conversion.fromCurrency} → {conversion.toCurrency}
                          </span>
                          <span className="ml-2 text-muted-foreground">
                            {conversion.amount?.toLocaleString() || "N/A"}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(conversion.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
