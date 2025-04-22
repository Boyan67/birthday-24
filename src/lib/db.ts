import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"

// Create a PostgreSQL pool with better error handling and connection management
let pool: Pool

try {
  pool = new Pool({
    connectionString: process.env.DATABASE,
    max: 5, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 5000, // How long to wait for a connection to become available
  })

  // Log when the pool connects
  pool.on("connect", () => {
    console.log("Connected to PostgreSQL database")
  })

  // Log errors
  pool.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL client", err)
  })
} catch (error) {
  console.error("Failed to initialize PostgreSQL pool", error)
  // Create an empty pool to prevent crashes
  pool = new Pool()
}

// Create a Drizzle ORM instance
export const db = drizzle(pool)

// Helper function to check database connection
export async function checkDatabaseConnection() {
  try {
    const result = await pool.query("SELECT NOW()")
    return {
      connected: true,
      timestamp: result.rows[0].now,
      poolSize: pool.totalCount,
      idleConnections: pool.idleCount,
    }
  } catch (error) {
    console.error("Database connection error:", error)
    return { connected: false, error: String(error) }
  }
}

// Initialize database schema
export async function initializeDatabase() {
  try {
    console.log("Starting database initialization...")

    // Create guests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS guests (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        rsvp VARCHAR(10),
        drink_preference VARCHAR(255)
      )
    `)
    console.log("Created guests table")

    // Create song_suggestions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS song_suggestions (
        id SERIAL PRIMARY KEY,
        guest_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (guest_id) REFERENCES guests(id)
      )
    `)
    console.log("Created song_suggestions table")

    // Insert sample guests if the table is empty
    const guestCount = await pool.query("SELECT COUNT(*) FROM guests")
    console.log(`Current guest count: ${guestCount.rows[0].count}`)

    if (Number.parseInt(guestCount.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO guests (id, name, rsvp) VALUES
        ('alex-42', 'Alex', NULL),
        ('jamie-77', 'Jamie', NULL),
        ('sam-23', 'Sam', NULL),
        ('taylor-55', 'Taylor', NULL)
      `)
      console.log("Inserted sample guests")
    }

    return { success: true }
  } catch (error) {
    console.error("Database initialization error:", error)
    return { success: false, error: String(error) }
  }
}

// Direct query function for debugging
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function directQuery(query: string, params: any[] = []) {
  try {
    return await pool.query(query, params)
  } catch (error) {
    console.error("Direct query error:", error)
    throw error
  }
}
