import { NextRequest, NextResponse } from "next/server";
import { computeResult, parseAnswersPayload } from "@/app/data";

const MAX_NICKNAME_LENGTH = 20;
const MAX_ANSWERS_LENGTH = 500;

export async function POST(request: NextRequest) {
  try {
    const { saveResult } = await import("@/lib/db");
    const body = await request.json();

    const { id, nickname, answers } = body;

    if (!id || nickname == null || !answers) {
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

    const parsedAnswers = parseAnswersPayload(answers);
    if (!parsedAnswers) {
      return NextResponse.json(
        { error: "Invalid answers" },
        { status: 400 }
      );
    }

    const result = computeResult(parsedAnswers);

    const { data, error } = await saveResult({
      id: String(id).slice(0, 36),
      nickname: nickname.trim(),
      answers,
      best_model: result.bestModel,
      best_memory: result.bestMemory,
      best_storage: result.bestStorage,
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Failed to save result" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
