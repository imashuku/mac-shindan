import { createClient, type Client } from "@libsql/client/web";

let tursoClient: Client | null = null;

export function getTursoClient(): Client | null {
  if (tursoClient) return tursoClient;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.warn("Turso環境変数が設定されていません");
    return null;
  }

  tursoClient = createClient({ url, authToken });
  return tursoClient;
}
