import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { saveResult } = await import("@/lib/db");
    const body = await request.json();

    const { id, nickname, answers, best_model, best_memory, best_storage } =
      body;

    if (!id || !nickname || !answers || !best_model || !best_memory || !best_storage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await saveResult({
      id,
      nickname,
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

export async function GET() {
  try {
    const { getResults } = await import("@/lib/db");
    const { data, error } = await getResults();

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
