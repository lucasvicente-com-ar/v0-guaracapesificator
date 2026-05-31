import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Since we can't create files in Vercel, we'll just return success
    // The in-memory system is already initialized

    return NextResponse.json({
      success: true,
      message: "Sistema de logs inicializado en memoria",
      note: "⚠️ Los datos se almacenan en memoria y se reinician con cada deploy",
      recommendation: "Para persistencia real, considera usar Supabase, Neon, o Upstash",
      filesCreated: ["In-memory storage initialized"],
    })
  } catch (error) {
    console.error("Error initializing logs:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize logs",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  return GET()
}
