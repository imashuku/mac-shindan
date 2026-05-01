import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import {
  MacModel,
  MemorySize,
  StorageSize,
  macSpecs,
  memoryLabels,
  storageLabels,
} from "../../data";

const fontUrl =
  "https://cdn.jsdelivr.net/fontsource/fonts/noto-sans-jp@latest/japanese-400-normal.woff";

let fontCache: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;
  const res = await fetch(fontUrl);
  fontCache = await res.arrayBuffer();
  return fontCache;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const model = searchParams.get("m") as MacModel | null;
  const memory = searchParams.get("mem") as MemorySize | null;
  const storage = searchParams.get("s") as StorageSize | null;

  const spec = model && macSpecs[model] ? macSpecs[model] : null;
  const memLabel = memory && memoryLabels[memory] ? memoryLabels[memory] : "";
  const stoLabel =
    storage && storageLabels[storage] ? storageLabels[storage] : "";

  const fontData = await getFont();

  const name = spec?.name ?? "あなたに合うMacは？";
  const chip = spec?.chip ?? "";
  const screen = spec?.screen ?? "";
  const price = spec ? `${spec.priceFrom.toLocaleString()}円〜` : "";

  const response = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafafa",
          fontFamily: "NotoSansJP",
        }}
      >
        <div style={{ fontSize: 28, color: "#6e6e73", marginBottom: 16 }}>
          Mac診断の結果
        </div>
        {chip && (
          <div style={{ fontSize: 18, color: "#6e6e73", marginBottom: 4 }}>
            {chip}
          </div>
        )}
        <div
          style={{
            fontSize: spec ? 56 : 52,
            fontWeight: 400,
            color: "#1d1d1f",
            marginBottom: 8,
          }}
        >
          {name}
        </div>
        {screen && (
          <div style={{ fontSize: 20, color: "#6e6e73", marginBottom: 40 }}>
            {screen}
          </div>
        )}
        {spec && (
          <div style={{ display: "flex", gap: 48 }}>
            {memLabel && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 16, color: "#6e6e73" }}>メモリ</div>
                <div style={{ fontSize: 32, fontWeight: 400, color: "#1d1d1f" }}>
                  {memLabel}
                </div>
              </div>
            )}
            {stoLabel && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: 16, color: "#6e6e73" }}>ストレージ</div>
                <div style={{ fontSize: 32, fontWeight: 400, color: "#1d1d1f" }}>
                  {stoLabel}
                </div>
              </div>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 16, color: "#6e6e73" }}>価格</div>
              <div style={{ fontSize: 32, fontWeight: 400, color: "#1d1d1f" }}>
                {price}
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "#86868b",
          }}
        >
          mac-shindan.vercel.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: "NotoSansJP", data: fontData, style: "normal" }],
    }
  );

  response.headers.set(
    "Cache-Control",
    "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"
  );

  return response;
}
