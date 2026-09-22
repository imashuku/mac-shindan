#!/usr/bin/env node
// Apple公式（日本）の購入ページ・仕様ページを取得し、src/app/data.ts の macSpecs と突き合わせる。
//
//   node scripts/apple-lineup-check.mjs                 差分を表示（変更なし）
//   node scripts/apple-lineup-check.mjs --report out.md 差分レポートをMarkdownで書き出す
//   node scripts/apple-lineup-check.mjs --apply         価格差分だけを data.ts に書き込み、日付表記を更新する
//   node scripts/apple-lineup-check.mjs --data path.ts  突き合わせ対象を差し替える（テスト用）
//
// 終了コード  0: 差分なし  10: 差分あり  2: 取得・解析に失敗（推測で埋めず止まる）
//
// 自動で書き換えるのは priceFrom だけ。メモリ・ストレージ・重さ・バッテリー・チップ・新機種は
// 「警告」として報告し、人の判断に回す（採点ロジックに影響するため）。

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : true) : null;
};
const DATA_PATH = typeof flag("--data") === "string" ? resolve(flag("--data")) : resolve(ROOT, "src/app/data.ts");
const REPORT_PATH = typeof flag("--report") === "string" ? resolve(flag("--report")) : null;
const APPLY = flag("--apply") === true;

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";

const SOURCES = {
  buyIndex: "https://www.apple.com/jp/shop/buy-mac",
  neo: { buy: "https://www.apple.com/jp/shop/buy-mac/macbook-neo", specs: "https://www.apple.com/jp/macbook-neo/specs/" },
  air: { buy: "https://www.apple.com/jp/shop/buy-mac/macbook-air", specs: "https://www.apple.com/jp/macbook-air/specs/" },
  pro: { buy: "https://www.apple.com/jp/shop/buy-mac/macbook-pro", specs: "https://www.apple.com/jp/macbook-pro/specs/" },
};

// data.ts の各モデルがどの製品ファミリーに属し、購入ページの構成キーをどう絞るか
const MODELS = {
  neo: { family: "neo", pick: () => true },
  air13: { family: "air", pick: (k) => k.startsWith("13inch-") },
  air15: { family: "air", pick: (k) => k.startsWith("15inch-") },
  pro14: { family: "pro", pick: (k) => k.startsWith("14inch-") && k.split("-")[3] === "m5" },
  pro14pro: { family: "pro", pick: (k) => k.startsWith("14inch-") && k.split("-")[3] === "m5pro" },
  pro16pro: { family: "pro", pick: (k) => k.startsWith("16inch-") && k.split("-")[3] === "m5pro" },
};

// 診断対象外と決めているチップ（検知しても新機種扱いにしない）
const IGNORED_CHIPS = new Set(["M5 Max"]);
const KNOWN_MACBOOK_SLUGS = new Set(["macbook-neo", "macbook-air", "macbook-pro"]);

function fail(msg) {
  console.error(`取得失敗: ${msg}`);
  process.exit(2);
}

async function fetchText(url) {
  let res;
  try {
    res = await fetch(url, { headers: { "user-agent": UA, "accept-language": "ja" }, redirect: "follow" });
  } catch (e) {
    fail(`${url} → ${e.message}`);
  }
  if (!res.ok) fail(`${url} → HTTP ${res.status}`);
  const text = await res.text();
  if (text.length < 20000) fail(`${url} → 本文が短すぎる（${text.length}文字）。ページ構造の変更か遮断の可能性`);
  return text;
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/[﻿​]/g, "");
}

// 購入ページに埋め込まれた構成別価格 {"<構成キー>":{"comparativeDisplayPrice":…,"amount":N}}
function parsePrices(html) {
  const prices = {};
  const re = /"([a-z0-9_\-]+)":\{"comparativeDisplayPrice":"[^"]*","amount":([0-9.]+)/g;
  for (const m of html.matchAll(re)) prices[m[1]] = Number(m[2]);
  return prices;
}

function parseVariantOrders(html) {
  const lists = [];
  for (const m of html.matchAll(/"variantOrder":\[([^\]]*)\]/g)) {
    lists.push(m[1].split(",").map((s) => s.replace(/"/g, "").trim()).filter(Boolean));
  }
  const storage = lists.find((l) => l.length && l.every((v) => /^\d+(gb|tb)$/.test(v)) && l.some((v) => v.endsWith("tb")));
  const memory = lists.find(
    (l) => l.length && l.every((v) => /^\d+gb$/.test(v)) && l.some((v) => ["16gb", "24gb", "32gb"].includes(v)),
  );
  return { storage: storage ?? null, memory: memory ?? null };
}

function parseSpecs(html) {
  const text = stripHtml(html);
  const chips = new Set();
  for (const m of text.matchAll(/Apple\s*((?:M|A)\d+(?:\s*(?:Pro|Max|Ultra))?)\s*チ/g)) chips.add(m[1].replace(/\s+/g, " "));
  const weights = new Set([...text.matchAll(/(\d\.\d{2})\s*kg/g)].map((m) => m[1]));
  const batteries = new Set([...text.matchAll(/最大\s*(\d+)\s*時間のビデオ/g)].map((m) => m[1]));
  const memories = new Set([...text.matchAll(/(\d+)GB\s*ユニファイドメモリ/g)].map((m) => `${m[1]}gb`));
  const storages = new Set(
    [...text.matchAll(/(\d+)(GB|TB)\s*SSD/g)].map((m) => `${m[1]}${m[2].toLowerCase()}`),
  );
  return { chips, weights, batteries, memories, storages };
}

// data.ts から macSpecs の各モデルの値を取り出す（TypeScriptを実行せず正規表現で読む）
function parseDataTs(src) {
  const start = src.indexOf("export const macSpecs");
  if (start < 0) fail("data.ts に macSpecs が見つからない");
  const body = src.slice(start);
  const models = {};
  for (const m of body.matchAll(/\n  (\w+): \{\n([\s\S]*?)\n  \},/g)) {
    const [, id, block] = m;
    const get = (key) => block.match(new RegExp(`\\n\\s*${key}: ("([^"]*)"|(\\d+)),`))?.[2] ?? block.match(new RegExp(`\\n\\s*${key}: (\\d+),`))?.[1];
    const list = (key) => [...(block.match(new RegExp(`${key}: \\[([^\\]]*)\\]`))?.[1] ?? "").matchAll(/"([^"]+)"/g)].map((x) => x[1]);
    models[id] = {
      name: get("name"),
      chip: get("chip"),
      priceFrom: Number(get("priceFrom")),
      weight: get("weight"),
      battery: get("battery"),
      availableMemory: list("availableMemory"),
      availableStorage: list("availableStorage"),
    };
  }
  for (const id of Object.keys(MODELS)) if (!models[id]) fail(`data.ts に ${id} が見つからない`);
  return models;
}

function applyToDataTs(src, priceDiffs) {
  let out = src;
  for (const d of priceDiffs) {
    const re = new RegExp(`(\\n  ${d.model}: \\{[\\s\\S]*?\\n    priceFrom: )${d.current},`);
    if (!re.test(out)) fail(`data.ts の ${d.model}.priceFrom を書き換えられない`);
    out = out.replace(re, `$1${d.official},`);
  }
  return out;
}

function tokyoNow() {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
  }).formatToParts(new Date());
  const g = (t) => parts.find((p) => p.type === t).value;
  return { y: g("year"), m: g("month"), d: g("day"), w: g("weekday") };
}

async function main() {
  const dataSrc = readFileSync(DATA_PATH, "utf8");
  const data = parseDataTs(dataSrc);

  const fetched = {};
  for (const fam of ["neo", "air", "pro"]) {
    const [buy, specs] = await Promise.all([fetchText(SOURCES[fam].buy), fetchText(SOURCES[fam].specs)]);
    const prices = parsePrices(buy);
    if (Object.keys(prices).length === 0) fail(`${SOURCES[fam].buy} に構成別価格が見つからない（ページ構造の変更）`);
    fetched[fam] = { prices, variants: parseVariantOrders(buy), specs: parseSpecs(specs) };
  }
  const buyIndex = await fetchText(SOURCES.buyIndex);

  const priceDiffs = [];
  const warnings = [];

  for (const [id, def] of Object.entries(MODELS)) {
    const fam = fetched[def.family];
    const cur = data[id];
    const keys = Object.keys(fam.prices).filter(def.pick);
    if (keys.length === 0) fail(`${id} に該当する構成が購入ページに無い（型番の変更か終売）`);
    const official = Math.min(...keys.map((k) => fam.prices[k]));
    if (official !== cur.priceFrom) {
      priceDiffs.push({ model: id, name: `${cur.name}（${cur.chip}）`, current: cur.priceFrom, official, source: SOURCES[def.family].buy });
    }

    const sp = fam.specs;
    const w = cur.weight?.match(/(\d\.\d{2})/)?.[1];
    if (w && !sp.weights.has(w)) warnings.push(`${id}: 重さ「${cur.weight}」が仕様ページに無い（掲載: ${[...sp.weights].join("/")}kg）`);
    const b = cur.battery?.match(/(\d+)時間/)?.[1];
    if (b && !sp.batteries.has(b)) warnings.push(`${id}: バッテリー「${cur.battery}」が仕様ページに無い（掲載: 最大${[...sp.batteries].join("/")}時間）`);
    if (!sp.chips.has(cur.chip)) warnings.push(`${id}: チップ「${cur.chip}」が仕様ページに無い（掲載: ${[...sp.chips].join(", ")}）— 世代交代の可能性`);

    const storageList = fam.variants.storage ?? [...sp.storages];
    for (const s of cur.availableStorage) if (!storageList.includes(s)) warnings.push(`${id}: ストレージ ${s} が公式の選択肢に無い（公式: ${storageList.join("/")}）`);
    const memoryList = fam.variants.memory ?? [...sp.memories];
    for (const mem of cur.availableMemory) if (memoryList.length && !memoryList.includes(mem)) warnings.push(`${id}: メモリ ${mem} が公式の選択肢に無い（公式: ${memoryList.join("/")}）`);
  }

  // 新チップ・新機種の検知（追加は人が行う）
  const knownChips = new Set(Object.values(data).map((m) => m.chip));
  for (const fam of ["neo", "air", "pro"]) {
    for (const c of fetched[fam].specs.chips) {
      if (!knownChips.has(c) && !IGNORED_CHIPS.has(c)) warnings.push(`新チップ検知: ${fam} の仕様ページに「${c}」— 診断対象に加えるかは人の判断`);
    }
  }
  for (const m of buyIndex.matchAll(/\/jp\/shop\/buy-mac\/(macbook[a-z0-9-]*)/g)) {
    if (!KNOWN_MACBOOK_SLUGS.has(m[1])) warnings.push(`新機種検知: 購入ページに /buy-mac/${m[1]} — 診断対象に加えるかは人の判断`);
  }
  const uniqWarnings = [...new Set(warnings)];

  const now = tokyoNow();
  const lines = [];
  lines.push(`# MacBookラインナップ照合 ${now.y}/${now.m}/${now.d}（${now.w}）`);
  lines.push("");
  lines.push("出典: Apple公式（日本）購入ページ・仕様ページ（この実行で実際に取得したもの）");
  lines.push("");
  lines.push("## 価格（自動反映の対象）");
  if (priceDiffs.length === 0) lines.push("差分なし");
  else {
    lines.push("| 機種 | 現在 | 公式 | 出典 |");
    lines.push("|---|---:|---:|---|");
    for (const d of priceDiffs) lines.push(`| ${d.name} | ${d.current.toLocaleString("ja-JP")}円 | ${d.official.toLocaleString("ja-JP")}円 | ${d.source} |`);
  }
  lines.push("");
  lines.push("## 警告（人の判断が要る・自動では書き換えない）");
  if (uniqWarnings.length === 0) lines.push("なし");
  else for (const w of uniqWarnings) lines.push(`- ${w}`);
  const report = lines.join("\n") + "\n";
  console.log(report);
  if (REPORT_PATH) writeFileSync(REPORT_PATH, report);

  if (APPLY && priceDiffs.length > 0) {
    writeFileSync(DATA_PATH, applyToDataTs(dataSrc, priceDiffs));
    const shindan = resolve(ROOT, "src/app/components/Shindan.tsx");
    const s = readFileSync(shindan, "utf8");
    if (!/\d{4}年\d{1,2}月時点/.test(s)) fail("Shindan.tsx の「YYYY年M月時点」表記が見つからない");
    writeFileSync(shindan, s.replace(/\d{4}年\d{1,2}月時点/, `${now.y}年${Number(now.m)}月時点`));
    const llms = resolve(ROOT, "public/llms.txt");
    const l = readFileSync(llms, "utf8");
    if (!/最終更新: \d{4}\/\d{2}\/\d{2}（.）/.test(l)) fail("llms.txt の最終更新行が見つからない");
    writeFileSync(llms, l.replace(/最終更新: \d{4}\/\d{2}\/\d{2}（.）/, `最終更新: ${now.y}/${now.m}/${now.d}（${now.w}）`));
    console.log(`適用: ${priceDiffs.length}件の価格を data.ts に書き込み、日付表記を更新した`);
  }

  process.exit(priceDiffs.length > 0 || uniqWarnings.length > 0 ? 10 : 0);
}

main().catch((e) => fail(e.stack ?? String(e)));
