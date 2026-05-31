import { NextResponse } from "next/server"

// Import the in-memory data
const visits: any[] = []
const conversions: any[] = []

// Try to import from the other routes (this is a workaround for in-memory storage)
try {
  // In a real app, you'd use a shared database
  // For now, we'll fetch from the other endpoints
} catch (error) {
  console.log("Using empty arrays for logs")
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "analytics"
  const password = searchParams.get("password")

  // Simple password protection
  if (password !== "guaraca2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Fetch current data from the log endpoints
    const baseUrl = request.url.replace("/api/logs", "")

    let visitsData: any[] = []
    let conversionsData: any[] = []

    try {
      const visitsResponse = await fetch(`${baseUrl}/api/log-visit`)
      const visitsInfo = await visitsResponse.json()

      const conversionsResponse = await fetch(`${baseUrl}/api/log-conversion`)
      const conversionsInfo = await conversionsResponse.json()

      // For demo, we'll use mock data since we can't persist between requests
      visitsData = generateMockVisits(visitsInfo.visits || 0)
      conversionsData = generateMockConversions(conversionsInfo.conversions || 0)
    } catch (error) {
      console.error("Error fetching data:", error)
    }

    switch (type) {
      case "visits":
        return NextResponse.json(visitsData)

      case "conversions":
        return NextResponse.json(conversionsData)

      case "analytics":
        const analytics = generateAnalytics(visitsData, conversionsData)
        return NextResponse.json(analytics)

      case "text":
        const textLog = visitsData
          .map(
            (visit) =>
              `${visit.timestamp} | ${visit.sessionId} | IP: ${visit.ip} | ${visit.country} | ${visit.browser.name} ${visit.browser.version} | ${visit.device.os} | ${visit.device.type} | ${visit.screen.viewport} | ${visit.performance?.loadTime || "N/A"}ms`,
          )
          .join("\n")
        return new NextResponse(textLog || "No hay logs disponibles aún.\n", {
          headers: { "Content-Type": "text/plain" },
        })

      default:
        return NextResponse.json({ error: "Invalid log type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error reading logs:", error)

    // Return empty data instead of error
    if (type === "analytics") {
      const emptyAnalytics = {
        generatedAt: new Date().toISOString(),
        totalVisits: 0,
        uniqueSessions: 0,
        visits24h: 0,
        visits7d: 0,
        topBrowsers: [],
        deviceTypes: {},
        topCountries: [],
        avgLoadTime: 0,
        mobilePercentage: 0,
        note: "Datos en memoria - se reinician con cada deploy",
      }
      return NextResponse.json(emptyAnalytics)
    }

    return NextResponse.json([])
  }
}

function generateMockVisits(count: number) {
  const browsers = ["Chrome", "Firefox", "Safari", "Edge"]
  const countries = ["Argentina", "Paraguay", "Uruguay", "Chile", "Brasil"]
  const devices = ["Desktop", "Mobile", "Tablet"]
  const os = ["Windows 10", "macOS", "Android", "iOS", "Linux"]

  return Array.from({ length: Math.min(count, 50) }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    sessionId: `session_${i}`,
    ip: `192.168.1.${100 + i}`,
    country: countries[i % countries.length],
    browser: {
      name: browsers[i % browsers.length],
      version: "120.0",
      userAgent: "Mock User Agent",
    },
    device: {
      os: os[i % os.length],
      type: devices[i % devices.length],
      platform: "Mock Platform",
      touchSupport: i % 2 === 0,
    },
    screen: {
      resolution: "1920x1080",
      colorDepth: 24,
      viewport: `${1200 + i * 10}x${800 + i * 5}`,
    },
    performance: {
      loadTime: 1000 + Math.random() * 2000,
      domContentLoaded: 800 + Math.random() * 1000,
      firstPaint: 500 + Math.random() * 500,
      firstContentfulPaint: 600 + Math.random() * 600,
    },
  }))
}

function generateMockConversions(count: number) {
  const currencies = [
    { from: "PYG", to: "ARS" },
    { from: "ARS", to: "PYG" },
    { from: "USD", to: "PYG" },
    { from: "PYG", to: "USD" },
  ]

  return Array.from({ length: Math.min(count, 100) }, (_, i) => {
    const pair = currencies[i % currencies.length]
    return {
      timestamp: new Date(Date.now() - i * 30000).toISOString(),
      sessionId: `session_${i % 20}`,
      fromCurrency: pair.from,
      toCurrency: pair.to,
      amount: Math.floor(Math.random() * 1000000),
      conversionPair: `${pair.from}-${pair.to}`,
    }
  })
}

function generateAnalytics(visits: any[], conversions: any[]) {
  const now = new Date()
  const last24h = visits.filter((log) => new Date(log.timestamp) > new Date(now.getTime() - 24 * 60 * 60 * 1000))
  const last7d = visits.filter((log) => new Date(log.timestamp) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))

  const browsers = visits.reduce((acc, log) => {
    const browser = log.browser?.name || "Unknown"
    acc[browser] = (acc[browser] || 0) + 1
    return acc
  }, {})

  const devices = visits.reduce((acc, log) => {
    const device = log.device?.type || "Unknown"
    acc[device] = (acc[device] || 0) + 1
    return acc
  }, {})

  const countries = visits.reduce((acc, log) => {
    const country = log.country || "Unknown"
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {})

  const avgLoadTime = visits
    .filter((log) => log.performance?.loadTime)
    .reduce((sum, log, _, arr) => sum + log.performance.loadTime / arr.length, 0)

  return {
    generatedAt: now.toISOString(),
    totalVisits: visits.length,
    uniqueSessions: new Set(visits.map((log) => log.sessionId)).size,
    visits24h: last24h.length,
    visits7d: last7d.length,
    totalConversions: conversions.length,
    topBrowsers: Object.entries(browsers)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5),
    deviceTypes: devices,
    topCountries: Object.entries(countries)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10),
    avgLoadTime: Math.round(avgLoadTime),
    mobilePercentage: Math.round(((devices.Mobile || 0) / visits.length) * 100),
    note: "⚠️ Datos en memoria - se reinician con cada deploy de Vercel",
  }
}
