import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for conversions
let conversions: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { timestamp, fromCurrency, toCurrency, amount, sessionId } = body

    const conversionEntry = {
      timestamp,
      sessionId,
      fromCurrency,
      toCurrency,
      amount,
      conversionPair: `${fromCurrency}-${toCurrency}`,
    }

    // Add to in-memory storage
    conversions.push(conversionEntry)

    // Keep only last 5000 entries
    if (conversions.length > 5000) {
      conversions = conversions.slice(-5000)
    }

    console.log(`Conversion logged: ${fromCurrency} -> ${toCurrency} | Amount: ${amount} | Session: ${sessionId}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging conversion:", error)
    return NextResponse.json({ error: "Failed to log conversion" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    conversions: conversions.length,
    lastConversion: conversions[conversions.length - 1]?.timestamp || null,
  })
}

// Export conversions for other routes to access
export { conversions }
