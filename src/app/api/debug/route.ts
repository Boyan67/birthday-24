import { NextResponse } from "next/server"
import { Pool } from "pg"
import { checkDatabaseConnection } from "@/lib/db"

export async function GET() {
  try {
    // Check database connection
    const connectionStatus = await checkDatabaseConnection()

    // Direct query to check guests table
    const pool = new Pool({
      connectionString: process.env.DATABASE,
    })

    let guestsResult = { rows: [] }
    let error = null

    try {
      guestsResult = await pool.query("SELECT * FROM guests")
    } catch (err) {
      error = err
    }

    return NextResponse.json({
      connectionStatus,
      databaseUrl: process.env.DATABASE ? `${process.env.DATABASE.substring(0, 20)}...` : "Not set",
      guests: guestsResult.rows,
      error: error ? String(error) : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to debug database",
        details: String(error),
      },
      { status: 500 },
    )
  }
}
