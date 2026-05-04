import { NextRequest, NextResponse } from "next/server";

const VALID_MODELS = new Set(["neo", "air13", "air15", "pro14", "pro14pro", "pro16pro"]);
const VALID_MEMORY = new Set(["8gb", "16gb", "24gb", "32gb", "64gb"]);
const VALID_STORAGE = new Set(["256gb", "512gb", "1tb", "2tb", "4tb"]);
const MAX_NICKNAME_LENGTH = 20;
const MAX_ANSWERS_LENGTH = 500;

export async function POST(request: NextRequest) {
  try {
    const { saveResult } = await import("@/lib/db");
    const body = await request.json();

    const { id, nickname, answers, best_model, best_memory, best_storage } =
      body;

    if (!id || nickname == null || !answers || !best_model || !best_memory || !best_storage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (typeof nickname !== "string" || nickname.length > MAX_NICKNAME_LENGTH) {
      return NextResponse.json(
        { error: "Invalid nickname" },
        { status: 400 }
      );
    }

    if (typeof answers !== "string" || answers.length > MAX_ANSWERS_LENGTH) {
      return NextResponse.json(
        { error: "Invalid answers" },
        { status: 400 }
      );
    }

    if (!VALID_MODELS.has(best_model)) {
      return NextResponse.json(
        { error: "Invalid model" },
        { status: 400 }
      );
    }

    if (!VALID_MEMORY.has(best_memory)) {
      return NextResponse.json(
        { error: "Invalid memory" },
        { status: 400 }
      );
    }

    if (!VALID_STORAGE.has(best_storage)) {
      return NextResponse.json(
        { error: "Invalid storage" },
        { status: 400 }
      );
    }

    const { data, error } = await saveResult({
      id: String(id).slice(0, 36),
      nickname: nickname.trim(),
      answers,
      best_model,
      best_memory,
      best_storage,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
