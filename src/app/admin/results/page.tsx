import Link from "next/link";
import {
  getResultSummary,
  type DiagnosticResult,
  type ResultSummary,
} from "@/lib/db";
import {
  macSpecs,
  memoryLabels,
  questions,
  storageLabels,
  type MacModel,
  type MemorySize,
  type StorageSize,
} from "@/app/data";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ token?: string | string[] }>;

function isAuthorized(token: string | undefined) {
  const adminToken = process.env.RESULTS_ADMIN_TOKEN;
  if (!adminToken) return process.env.NODE_ENV !== "production";
  return token === adminToken;
}

function getToken(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDateTime(value: string) {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function modelLabel(key: string) {
  const spec = macSpecs[key as MacModel];
  return spec ? `${spec.name} ${spec.chip}` : key;
}

function memoryLabel(key: string) {
  return memoryLabels[key as MemorySize] ?? key;
}

function storageLabel(key: string) {
  return storageLabels[key as StorageSize] ?? key;
}

function answerSummary(result: DiagnosticResult) {
  try {
    const parsed = JSON.parse(result.answers) as Record<string, number[]>;
    return questions
      .map((question) => {
        const selected = parsed[question.id] ?? [];
        const labels = selected
          .map((index) => question.options[index]?.label)
          .filter(Boolean);
        if (labels.length === 0) return null;
        return `${question.question}: ${labels.join("、")}`;
      })
      .filter(Boolean)
      .slice(0, 3)
      .join(" / ");
  } catch {
    return "回答データを解析できません";
  }
}

function percentage(count: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}

function generateInsights(data: ResultSummary) {
  if (data.total === 0) {
    return [
      {
        label: "利用傾向",
        title: "まだ分析できるデータがありません",
        body: "診断データが蓄積されると、モデル・メモリ・ストレージの傾向をここに表示します。",
      },
    ];
  }

  const topModel = data.byModel[0];
  const topMemory = data.byMemory[0];
  const topStorage = data.byStorage[0];
  const latestDay = data.byDate[0];
  const previousDay = data.byDate[1];
  const proCount = data.byModel
    .filter((item) => item.key.startsWith("pro"))
    .reduce((sum, item) => sum + item.count, 0);

  const insights = [];

  if (topModel) {
    insights.push({
      label: "利用傾向",
      title: `${modelLabel(topModel.key)} が最多`,
      body: `全体の${percentage(topModel.count, data.total)}%を占めています。今の流入では、このモデル帯への関心が強く出ています。`,
    });
  }

  if (topMemory && topStorage) {
    insights.push({
      label: "構成ニーズ",
      title: `${memoryLabel(topMemory.key)} / ${storageLabel(topStorage.key)} が中心`,
      body: `メモリは${memoryLabel(topMemory.key)}、ストレージは${storageLabel(topStorage.key)}が最多です。標準構成に近いニーズか、制作・開発寄りかを見分ける基準になります。`,
    });
  }

  if (latestDay) {
    const diff = previousDay ? latestDay.count - previousDay.count : latestDay.count;
    const movement =
      diff > 0
        ? `前日より${diff.toLocaleString()}件増えています。`
        : diff < 0
          ? `前日より${Math.abs(diff).toLocaleString()}件少ない状態です。`
          : "前日と同じ件数です。";
    insights.push({
      label: "直近の動き",
      title: `${latestDay.key} は ${latestDay.count.toLocaleString()}件`,
      body: previousDay
        ? movement
        : "比較対象となる前日データがまだ少ないため、今後の推移を見て判断します。",
    });
  }

  insights.push({
    label: "相談導線",
    title:
      proCount >= data.total / 2
        ? "高性能モデルへの関心が強め"
        : "ライトから標準構成の検討が中心",
    body:
      proCount >= data.total / 2
        ? "制作・開発・業務改善の相談につながりやすい層が多い可能性があります。結果ページ下部の相談導線のクリック率をGA4で確認すると次の改善につながります。"
        : "初めてのMac選びや日常業務の環境整備に近いニーズが見えます。購入前の不安解消や初期設定支援との相性が良さそうです。",
  });

  return insights.slice(0, 4);
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

function InsightCard({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <p className="text-xs font-medium text-muted">{label}</p>
      <h3 className="mt-2 text-sm font-bold leading-relaxed text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </article>
  );
}

function BreakdownList({
  title,
  items,
  labelFor,
}: {
  title: string;
  items: { key: string; count: number }[];
  labelFor: (key: string) => string;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <h2 className="text-sm font-bold text-foreground">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted">データなし</p>}
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4">
            <span className="text-sm text-foreground">{labelFor(item.key)}</span>
            <span className="text-sm font-bold text-foreground">
              {item.count.toLocaleString()}件
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function ResultsAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const token = getToken(params.token);

  if (!isAuthorized(token)) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-5">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-xs font-medium text-muted">Protected</p>
          <h1 className="mt-2 text-xl font-bold text-foreground">
            診断データ確認画面
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            本番環境では管理用トークンが必要です。
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex min-h-[44px] items-center rounded-full border border-border px-6 text-sm font-medium text-foreground hover:bg-foreground/5"
          >
            トップへ戻る
          </Link>
        </div>
      </main>
    );
  }

  const { data, error } = await getResultSummary(30);

  if (error || !data) {
    return (
      <main className="min-h-dvh bg-background px-5 py-10">
        <div className="mx-auto max-w-5xl rounded-lg border border-border bg-card p-6">
          <h1 className="text-xl font-bold text-foreground">診断データ</h1>
          <p className="mt-3 text-sm text-muted">
            データを取得できませんでした: {error ?? "unknown error"}
          </p>
        </div>
      </main>
    );
  }

  const insights = generateInsights(data);

  return (
    <main className="min-h-dvh bg-background px-5 py-8 sm:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium text-muted">
              ステップアウト 無料診断ツール
            </p>
            <h1 className="mt-2 text-2xl font-bold text-foreground">
              診断データ
            </h1>
            <p className="mt-2 text-sm text-muted">
              Mac診断の保存データを集計して確認できます。
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-foreground hover:bg-foreground/5"
          >
            診断ページへ
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="総診断数" value={data.total.toLocaleString()} />
          <StatCard
            label="直近24時間"
            value={data.last24Hours.toLocaleString()}
            sub="UTC基準の保存時刻から集計"
          />
          <StatCard
            label="直近表示件数"
            value={data.recent.length.toLocaleString()}
            sub="最大30件"
          />
        </div>

        <section className="mt-6">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted">Analysis</p>
              <h2 className="mt-1 text-lg font-bold text-foreground">
                分析サマリー
              </h2>
            </div>
            <p className="hidden text-xs text-muted sm:block">
              保存データから自動生成
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-4">
            {insights.map((insight) => (
              <InsightCard key={insight.label} {...insight} />
            ))}
          </div>
        </section>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <BreakdownList
            title="モデル別"
            items={data.byModel}
            labelFor={modelLabel}
          />
          <BreakdownList
            title="メモリ別"
            items={data.byMemory}
            labelFor={memoryLabel}
          />
          <BreakdownList
            title="ストレージ別"
            items={data.byStorage}
            labelFor={storageLabel}
          />
        </div>

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-bold text-foreground">日別推移</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {data.byDate.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-lg bg-background px-4 py-3"
              >
                <span className="text-sm text-muted">{item.key}</span>
                <span className="text-sm font-bold text-foreground">
                  {item.count.toLocaleString()}件
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-border bg-card">
          <div className="border-b border-border p-5">
            <h2 className="text-sm font-bold text-foreground">直近の診断</h2>
          </div>
          <div className="divide-y divide-border">
            {data.recent.length === 0 && (
              <p className="p-5 text-sm text-muted">データなし</p>
            )}
            {data.recent.map((result) => (
              <article key={result.id} className="p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {modelLabel(result.best_model)} /{" "}
                      {memoryLabel(result.best_memory)} /{" "}
                      {storageLabel(result.best_storage)}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">
                      {answerSummary(result)}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-muted">
                    {formatDateTime(result.created_at)}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
