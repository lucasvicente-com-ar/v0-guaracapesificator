import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, you'd use a database like Supabase, Neon, or Upstash
let visits: any[] = []
const conversions: any[] = []

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for")
    const realIp = request.headers.get("x-real-ip")
    const ip = forwarded?.split(",")[0] || realIp || "unknown"

    // Get request data
    const body = await request.json()
    const { timestamp, url, referrer, browserInfo, performanceMetrics, viewport, sessionId } = body

    // Create comprehensive log entry
    const logEntry = {
      timestamp,
      sessionId,
      ip,
      country: await getCountryFromIP(ip),
      url,
      referrer,
      browser: {
        name: browserInfo.browserName,
        version: browserInfo.browserVersion,
        userAgent: browserInfo.userAgent,
      },
      device: {
        os: browserInfo.osName,
        type: browserInfo.deviceType,
        platform: browserInfo.platform,
        touchSupport: browserInfo.touchSupport,
      },
      screen: {
        resolution: browserInfo.screenResolution,
        colorDepth: browserInfo.screenColorDepth,
        viewport: `${viewport.width}x${viewport.height}`,
      },
      capabilities: {
        cookieEnabled: browserInfo.cookieEnabled,
        onLine: browserInfo.onLine,
        webGL: browserInfo.webGL,
        localStorage: browserInfo.localStorage,
        sessionStorage: browserInfo.sessionStorage,
        indexedDB: browserInfo.indexedDB,
      },
      locale: {
        language: browserInfo.language,
        languages: browserInfo.languages,
        timezone: browserInfo.timezone,
      },
      performance: performanceMetrics
        ? {
            loadTime: performanceMetrics.loadTime,
            domContentLoaded: performanceMetrics.domContentLoaded,
            firstPaint: performanceMetrics.firstPaint,
            firstContentfulPaint: performanceMetrics.firstContentfulPaint,
            connectionType: performanceMetrics.connectionType,
            connectionDownlink: performanceMetrics.connectionDownlink,
            connectionRtt: performanceMetrics.connectionRtt,
          }
        : null,
    }

    // Add to in-memory storage
    visits.push(logEntry)

    // Keep only last 1000 entries to prevent memory issues
    if (visits.length > 1000) {
      visits = visits.slice(-1000)
    }

    // Log to console for Vercel logs
    console.log(
      `Visit logged: ${timestamp} | ${sessionId} | IP: ${ip} | ${browserInfo.browserName} | ${browserInfo.deviceType}`,
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging visit:", error)
    return NextResponse.json({ error: "Failed to log visit" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    visits: visits.length,
    lastVisit: visits[visits.length - 1]?.timestamp || null,
  })
}

async function getCountryFromIP(ip: string): Promise<string> {
  if (ip === "unknown" || ip === "127.0.0.1" || ip === "::1") {
    return "Local"
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country`, {
      signal: AbortSignal.timeout(5000),
    })
    const data = await response.json()
    return data.country || "Unknown"
  } catch (error) {
    console.error("Error getting country from IP:", error)
    return "Unknown"
  }
}

// Export visits for other routes to access
export { visits }
