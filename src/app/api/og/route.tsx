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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const model = searchParams.get("m") as MacModel | null;
  const memory = searchParams.get("mem") as MemorySize | null;
  const storage = searchParams.get("s") as StorageSize | null;

  const spec = model && macSpecs[model] ? macSpecs[model] : null;
  const memLabel = memory && memoryLabels[memory] ? memoryLabels[memory] : "";
  const stoLabel =
    storage && storageLabels[storage] ? storageLabels[storage] : "";

  return new ImageResponse(
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
        }}
      >
        <div style={{ fontSize: 28, color: "#6e6e73", marginBottom: 16 }}>
          Mac診断の結果
        </div>

        {spec ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 18, color: "#6e6e73", marginBottom: 4 }}>
              {spec.chip}
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: "#1d1d1f",
                marginBottom: 8,
              }}
            >
              {spec.name}
            </div>
            <div style={{ fontSize: 20, color: "#6e6e73", marginBottom: 40 }}>
              {spec.screen}
            </div>
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
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f" }}
                  >
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
                  <div style={{ fontSize: 16, color: "#6e6e73" }}>
                    ストレージ
                  </div>
                  <div
                    style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f" }}
                  >
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
                <div
                  style={{ fontSize: 32, fontWeight: 700, color: "#1d1d1f" }}
                >
                  {spec.priceFrom.toLocaleString()}円〜
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 700,
                color: "#1d1d1f",
                marginBottom: 16,
              }}
            >
              あなたに合うMacは
            </div>
            <div style={{ fontSize: 52, fontWeight: 700, color: "#1d1d1f" }}>
              どれだろう？
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
    { width: 1200, height: 630 }
  );
}
