import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function GET() {
  try {
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({ message: "Database initialized successfully" })
    } else {
      return NextResponse.json({ error: "Failed to initialize database", details: result.error }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Server error", details: error }, { status: 500 })
  }
}
