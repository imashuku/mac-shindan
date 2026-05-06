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

export type ResultBreakdown = {
  key: string;
  count: number;
};

export type ResultSummary = {
  total: number;
  last24Hours: number;
  byModel: ResultBreakdown[];
  byMemory: ResultBreakdown[];
  byStorage: ResultBreakdown[];
  byDate: ResultBreakdown[];
  recent: DiagnosticResult[];
};

function rowsToBreakdown(rows: unknown[]): ResultBreakdown[] {
  return rows.map((row) => {
    const record = row as Record<string, unknown>;
    return {
      key: String(record.key ?? ""),
      count: Number(record.count ?? 0),
    };
  });
}

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

export async function getResultSummary(limit = 25) {
  const client = getTursoClient();
  if (!client) return { data: null, error: "DB not configured" };

  try {
    const [total, last24Hours, byModel, byMemory, byStorage, byDate, recent] =
      await Promise.all([
        client.execute(`SELECT COUNT(*) AS count FROM results`),
        client.execute(
          `SELECT COUNT(*) AS count FROM results WHERE datetime(created_at) >= datetime('now', '-1 day')`
        ),
        client.execute(
          `SELECT best_model AS key, COUNT(*) AS count FROM results GROUP BY best_model ORDER BY count DESC`
        ),
        client.execute(
          `SELECT best_memory AS key, COUNT(*) AS count FROM results GROUP BY best_memory ORDER BY count DESC`
        ),
        client.execute(
          `SELECT best_storage AS key, COUNT(*) AS count FROM results GROUP BY best_storage ORDER BY count DESC`
        ),
        client.execute(
          `SELECT date(datetime(created_at, '+9 hours')) AS key, COUNT(*) AS count FROM results GROUP BY key ORDER BY key DESC LIMIT 14`
        ),
        client.execute({
          sql: `SELECT * FROM results ORDER BY created_at DESC LIMIT ?`,
          args: [limit],
        }),
      ]);

    return {
      data: {
        total: Number(total.rows[0]?.count ?? 0),
        last24Hours: Number(last24Hours.rows[0]?.count ?? 0),
        byModel: rowsToBreakdown(byModel.rows),
        byMemory: rowsToBreakdown(byMemory.rows),
        byStorage: rowsToBreakdown(byStorage.rows),
        byDate: rowsToBreakdown(byDate.rows),
        recent: recent.rows as unknown as DiagnosticResult[],
      } satisfies ResultSummary,
      error: null,
    };
  } catch (err) {
    return { data: null, error: (err as Error).message };
  }
}
