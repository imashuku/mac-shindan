import { createClient } from "@libsql/client/web";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await client.execute(`
  CREATE TABLE IF NOT EXISTS results (
    id TEXT PRIMARY KEY,
    nickname TEXT NOT NULL,
    answers TEXT NOT NULL,
    best_model TEXT NOT NULL,
    best_memory TEXT NOT NULL,
    best_storage TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

console.log("Schema created successfully.");
