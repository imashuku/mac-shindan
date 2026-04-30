import { getTursoClient } from "./turso";

export type DiagnosticResult = {
  id: string;
  nickname: string;
  answers: string;
  best_model: string;
  best_memory: string;
  best_storage: string;
  created_at: string;
};

export async function saveResult(result: Omit<DiagnosticResult, "created_at">) {
  const client = getTursoClient();
  if (!client) return { data: null, error: "DB not configured" };

  try {
    await client.execute({
      sql: `INSERT INTO results (id, nickname, answers, best_model, best_memory, best_storage, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        result.id,
        result.nickname,
        result.answers,
        result.best_model,
        result.best_memory,
        result.best_storage,
        new Date().toISOString(),
      ],
    });
    return { data: result, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}

export async function getResults(limit = 50) {
  const client = getTursoClient();
  if (!client) return { data: null, error: "DB not configured" };

  try {
    const rs = await client.execute({
      sql: `SELECT * FROM results ORDER BY created_at DESC LIMIT ?`,
      args: [limit],
    });
    return { data: rs.rows as unknown as DiagnosticResult[], error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}
