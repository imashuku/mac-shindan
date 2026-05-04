export type MacModel = "neo" | "air13" | "air15" | "pro14" | "pro14pro" | "pro16pro";
export type MemorySize = "8gb" | "16gb" | "24gb" | "32gb" | "64gb";
export type StorageSize = "256gb" | "512gb" | "1tb" | "2tb" | "4tb";

export type Scores = {
  model: Partial<Record<MacModel, number>>;
  memory: Partial<Record<MemorySize, number>>;
  storage: Partial<Record<StorageSize, number>>;
};

export type QuestionOption = {
  label: string;
  sub: string;
  scores: Scores;
};

export type Question = {
  id: string;
  question: string;
  sub?: string;
  type: "sa" | "ma";
  options: QuestionOption[];
};

export const questions: Question[] = [
  {
    id: "apple_devices",
    question: "iPhoneやiPadは使っていますか？",
    type: "sa",
    options: [
      {
        label: "iPhoneを使っている",
        sub: "Macと繋がると、仕事の流れが変わります",
        scores: {
          model: { air13: 1 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "iPhoneもiPadも使っている",
        sub: "Mac が加わると、Apple製品の連携が本領を発揮します",
        scores: {
          model: { air13: 1, pro14: 1 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "使っていない",
        sub: "Macは単体でも十分活躍します",
        scores: {
          model: {},
          memory: {},
          storage: {},
        },
      },
    ],
  },
  {
    id: "current_frustrations",
    question: "今のパソコンで困っていることは？",
    sub: "あてはまるものをすべて選んでください",
    type: "ma",
    options: [
      {
        label: "起動や動作が遅い",
        sub: "電源を入れてから使えるまでに時間がかかる",
        scores: {
          model: {},
          memory: { "16gb": 1 },
          storage: {},
        },
      },
      {
        label: "バッテリーが持たない",
        sub: "外出先ですぐ充電が必要になる",
        scores: {
          model: { air13: 1 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "重くて持ち運びがつらい",
        sub: "カバンに入れると肩が凝る",
        scores: {
          model: { neo: 1, air13: 1 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "画面が小さい・見づらい",
        sub: "文字が小さくて目が疲れる",
        scores: {
          model: { air15: 1, pro16pro: 1 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "やりたいことに性能が足りない",
        sub: "ソフトが重い、フリーズする",
        scores: {
          model: { pro14: 1, pro14pro: 1 },
          memory: { "24gb": 1 },
          storage: {},
        },
      },
      {
        label: "特に不満はない・初めて買う",
        sub: "現状に困っていない、またはパソコン未所持",
        scores: {
          model: {},
          memory: {},
          storage: {},
        },
      },
    ],
  },
  {
    id: "current_pc_age",
    question: "今のパソコンはどのくらい使っていますか？",
    type: "sa",
    options: [
      {
        label: "1年未満",
        sub: "まだ新しい",
        scores: {
          model: {},
          memory: {},
          storage: {},
        },
      },
      {
        label: "1〜3年",
        sub: "まだ現役だけど、そろそろ気になる",
        scores: {
          model: {},
          memory: {},
          storage: {},
        },
      },
      {
        label: "3〜5年",
        sub: "動作が重くなってきた頃",
        scores: {
          model: {},
          memory: { "16gb": 1 },
          storage: {},
        },
      },
      {
        label: "5年以上",
        sub: "かなり年季が入っている",
        scores: {
          model: {},
          memory: { "16gb": 1 },
          storage: {},
        },
      },
      {
        label: "パソコンを持っていない",
        sub: "今回が初めての購入",
        scores: {
          model: { neo: 1, air13: 1 },
          memory: {},
          storage: {},
        },
      },
    ],
  },
  {
    id: "experience",
    question: "パソコンはどれくらい使っていますか？",
    type: "sa",
    options: [
      {
        label: "ほぼ使ったことがない",
        sub: "スマホ中心。パソコンは触る機会がほとんどない",
        scores: {
          model: { neo: 4, air13: 1 },
          memory: { "8gb": 3, "16gb": 1 },
          storage: { "256gb": 3, "512gb": 1 },
        },
      },
      {
        label: "ときどき使う程度",
        sub: "仕事や調べ物で、たまに触る",
        scores: {
          model: { neo: 1, air13: 3, air15: 2 },
          memory: { "16gb": 3 },
          storage: { "512gb": 3 },
        },
      },
      {
        label: "毎日のように使っている",
        sub: "仕事やプライベートで日常的に使う",
        scores: {
          model: { air13: 1, air15: 2, pro14: 3, pro14pro: 2 },
          memory: { "16gb": 2, "24gb": 2 },
          storage: { "512gb": 2, "1tb": 2 },
        },
      },
    ],
  },
  {
    id: "purpose",
    question: "どんなことに使いたいですか？",
    sub: "あてはまるものをすべて選んでください",
    type: "ma",
    options: [
      {
        label: "メールやネット検索",
        sub: "調べ物、ニュース、ネットショッピングなど",
        scores: {
          model: { neo: 2, air13: 1 },
          memory: { "8gb": 2, "16gb": 1 },
          storage: { "256gb": 2 },
        },
      },
      {
        label: "文書・資料づくり",
        sub: "Word、Excel、PowerPointなどの事務作業",
        scores: {
          model: { air13: 2, air15: 1, pro14: 1 },
          memory: { "16gb": 3 },
          storage: { "512gb": 2 },
        },
      },
      {
        label: "プレゼン・会議での発表",
        sub: "スライドを映したり、会議室で資料を見せる",
        scores: {
          model: { air15: 1, pro14: 3, pro14pro: 2, pro16pro: 1 },
          memory: { "16gb": 2 },
          storage: { "512gb": 2 },
        },
      },
      {
        label: "AIツールの活用",
        sub: "ChatGPTやClaudeなどを仕事に使いたい",
        scores: {
          model: { air13: 2, air15: 2, pro14: 2 },
          memory: { "16gb": 2, "24gb": 2 },
          storage: { "512gb": 2 },
        },
      },
      {
        label: "写真・画像の編集",
        sub: "Canva、Lightroom、Photoshopなど",
        scores: {
          model: { air13: 1, air15: 2, pro14: 2, pro14pro: 1 },
          memory: { "16gb": 1, "24gb": 3 },
          storage: { "512gb": 1, "1tb": 3 },
        },
      },
      {
        label: "動画の編集",
        sub: "YouTube動画、プロモーション映像など",
        scores: {
          model: { pro14: 2, pro14pro: 3, pro16pro: 2 },
          memory: { "24gb": 2, "32gb": 3 },
          storage: { "1tb": 2, "2tb": 3 },
        },
      },
      {
        label: "プログラミング・開発",
        sub: "Webサイトやアプリの開発、AI開発など",
        scores: {
          model: { pro14: 2, pro14pro: 3, pro16pro: 2 },
          memory: { "24gb": 2, "32gb": 3, "64gb": 1 },
          storage: { "512gb": 1, "1tb": 3 },
        },
      },
    ],
  },
  {
    id: "budget",
    question: "予算はどのくらいですか？",
    type: "sa",
    options: [
      {
        label: "10万円くらいまで",
        sub: "なるべく出費を抑えたい",
        scores: {
          model: { neo: 5 },
          memory: { "8gb": 3 },
          storage: { "256gb": 3, "512gb": 1 },
        },
      },
      {
        label: "15〜20万円くらい",
        sub: "ある程度の投資はできる",
        scores: {
          model: { air13: 4, air15: 2 },
          memory: { "16gb": 3, "24gb": 1 },
          storage: { "512gb": 3, "1tb": 1 },
        },
      },
      {
        label: "25万円くらいまで",
        sub: "しっかり使えるものを選びたい",
        scores: {
          model: { air13: 1, air15: 2, pro14: 4 },
          memory: { "16gb": 1, "24gb": 3 },
          storage: { "512gb": 2, "1tb": 2 },
        },
      },
      {
        label: "30万円以上でもOK",
        sub: "長く使うからいいものがほしい",
        scores: {
          model: { pro14: 1, pro14pro: 4, pro16pro: 3 },
          memory: { "24gb": 2, "32gb": 3, "64gb": 1 },
          storage: { "1tb": 2, "2tb": 2 },
        },
      },
    ],
  },
  {
    id: "portability",
    question: "パソコンの持ち運び、どうなりそうですか？",
    type: "sa",
    options: [
      {
        label: "電車やバスで毎日持ち歩く",
        sub: "カバンに入れて通勤・外出する",
        scores: {
          model: { neo: 3, air13: 3 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "車移動が多いので重さは気にならない",
        sub: "駐車場から会議室まで運ぶ程度",
        scores: {
          model: { air13: 1, air15: 2, pro14: 3, pro14pro: 2, pro16pro: 1 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "たまに外に持ち出す程度",
        sub: "基本は自宅だけど、時々外でも",
        scores: {
          model: { air13: 2, air15: 2, pro14: 2 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "ほぼ自宅・オフィスで使う",
        sub: "持ち運びはあまり考えていない",
        scores: {
          model: { air15: 3, pro14: 1, pro14pro: 2, pro16pro: 3 },
          memory: {},
          storage: {},
        },
      },
    ],
  },
  {
    id: "screen",
    question: "画面の大きさ、どちらが好みですか？",
    type: "sa",
    options: [
      {
        label: "コンパクトなほうがいい",
        sub: "13インチ前後。軽さ・取り回しを重視",
        scores: {
          model: { neo: 2, air13: 3, pro14: 1 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "大きめの画面がいい",
        sub: "15〜16インチ。一覧性を重視",
        scores: {
          model: { air15: 4, pro16pro: 3 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "こだわりはない",
        sub: "使いやすければどちらでも",
        scores: {
          model: { neo: 1, air13: 2, air15: 1, pro14: 1 },
          memory: {},
          storage: {},
        },
      },
    ],
  },
  {
    id: "data",
    question: "保存したいデータはどのくらい？",
    sub: "写真・動画・ファイルなどの量",
    type: "sa",
    options: [
      {
        label: "少ない",
        sub: "書類が中心。写真はスマホに入れている",
        scores: {
          model: {},
          memory: {},
          storage: { "256gb": 4, "512gb": 1 },
        },
      },
      {
        label: "そこそこある",
        sub: "写真が数千枚、書類もそれなりに",
        scores: {
          model: {},
          memory: {},
          storage: { "512gb": 4, "1tb": 1 },
        },
      },
      {
        label: "けっこう多い",
        sub: "動画や大量の写真がある",
        scores: {
          model: {},
          memory: {},
          storage: { "1tb": 4, "2tb": 1 },
        },
      },
      {
        label: "非常に多い",
        sub: "仕事の動画素材やプロジェクトファイルなど",
        scores: {
          model: {},
          memory: {},
          storage: { "2tb": 4, "4tb": 1 },
        },
      },
      {
        label: "よくわからない",
        sub: "判断がつかないので、おまかせしたい",
        scores: {
          model: {},
          memory: {},
          storage: { "512gb": 3, "1tb": 1 },
        },
      },
    ],
  },
  {
    id: "ambition",
    question: "これからの目標を教えてください",
    type: "sa",
    options: [
      {
        label: "まずはパソコンに慣れたい",
        sub: "基本的な操作から始めたい",
        scores: {
          model: { neo: 3, air13: 1 },
          memory: { "8gb": 2, "16gb": 1 },
          storage: { "256gb": 2, "512gb": 1 },
        },
      },
      {
        label: "AIで仕事を変えたい",
        sub: "最新のAIツールを使いこなしたい",
        scores: {
          model: { air13: 2, air15: 2, pro14: 2 },
          memory: { "16gb": 2, "24gb": 2 },
          storage: { "512gb": 3 },
        },
      },
      {
        label: "プロの仕事もやりたい",
        sub: "制作・開発など本格的なスキルを身につけたい",
        scores: {
          model: { pro14: 2, pro14pro: 3, pro16pro: 1 },
          memory: { "24gb": 2, "32gb": 3 },
          storage: { "1tb": 3, "2tb": 1 },
        },
      },
    ],
  },
];

export type MacSpec = {
  id: MacModel;
  name: string;
  chip: string;
  priceFrom: number;
  screen: string;
  availableMemory: MemorySize[];
  availableStorage: StorageSize[];
  weight: string;
  battery: string;
  ports: string;
  colors: string;
  fanless: boolean;
};

export const macSpecs: Record<MacModel, MacSpec> = {
  neo: {
    id: "neo",
    name: "MacBook Neo",
    chip: "A18 Pro",
    priceFrom: 99800,
    screen: "13インチ",
    availableMemory: ["8gb"],
    availableStorage: ["256gb", "512gb"],
    weight: "1.23 kg",
    battery: "最大16時間",
    ports: "USB-C ×2",
    colors: "Silver, Blush, Citrus, Indigo",
    fanless: true,
  },
  air13: {
    id: "air13",
    name: "MacBook Air 13インチ",
    chip: "M5",
    priceFrom: 184800,
    screen: "13.6インチ",
    availableMemory: ["16gb", "24gb", "32gb"],
    availableStorage: ["512gb", "1tb", "2tb", "4tb"],
    weight: "1.23 kg",
    battery: "最大18時間",
    ports: "USB-C ×2、MagSafe",
    colors: "Sky Blue, Silver, Starlight, Midnight",
    fanless: true,
  },
  air15: {
    id: "air15",
    name: "MacBook Air 15インチ",
    chip: "M5",
    priceFrom: 219800,
    screen: "15.3インチ",
    availableMemory: ["16gb", "24gb", "32gb"],
    availableStorage: ["512gb", "1tb", "2tb", "4tb"],
    weight: "1.51 kg",
    battery: "最大18時間",
    ports: "USB-C ×2、MagSafe",
    colors: "Sky Blue, Silver, Starlight, Midnight",
    fanless: true,
  },
  pro14: {
    id: "pro14",
    name: "MacBook Pro 14インチ",
    chip: "M5",
    priceFrom: 248800,
    screen: "14.2インチ XDR",
    availableMemory: ["16gb", "24gb", "32gb"],
    availableStorage: ["512gb", "1tb", "2tb", "4tb"],
    weight: "1.55 kg",
    battery: "最大24時間",
    ports: "Thunderbolt 4 ×3、HDMI、SDカード、MagSafe",
    colors: "Space Black, Silver",
    fanless: false,
  },
  pro14pro: {
    id: "pro14pro",
    name: "MacBook Pro 14インチ",
    chip: "M5 Pro",
    priceFrom: 369800,
    screen: "14.2インチ XDR",
    availableMemory: ["24gb", "32gb", "64gb"],
    availableStorage: ["512gb", "1tb", "2tb", "4tb"],
    weight: "1.55 kg",
    battery: "最大24時間",
    ports: "Thunderbolt 5 ×3、HDMI、SDカード、MagSafe",
    colors: "Space Black, Silver",
    fanless: false,
  },
  pro16pro: {
    id: "pro16pro",
    name: "MacBook Pro 16インチ",
    chip: "M5 Pro",
    priceFrom: 449800,
    screen: "16.2インチ XDR",
    availableMemory: ["24gb", "32gb", "64gb"],
    availableStorage: ["1tb", "2tb", "4tb"],
    weight: "約2.1 kg",
    battery: "最大24時間",
    ports: "Thunderbolt 5 ×3、HDMI、SDカード、MagSafe",
    colors: "Space Black, Silver",
    fanless: false,
  },
};

export const memoryLabels: Record<MemorySize, string> = {
  "8gb": "8GB",
  "16gb": "16GB",
  "24gb": "24GB",
  "32gb": "32GB",
  "64gb": "64GB",
};

export const storageLabels: Record<StorageSize, string> = {
  "256gb": "256GB",
  "512gb": "512GB",
  "1tb": "1TB",
  "2tb": "2TB",
  "4tb": "4TB",
};

export type ReasonEntry = {
  answer: string;
  reason: string;
};

export type SharedConfig = {
  model: MacModel;
  memory: MemorySize;
  storage: StorageSize;
  spec: MacSpec;
};

export function getSharedConfig(
  model: string | null | undefined,
  memory: string | null | undefined,
  storage: string | null | undefined,
): SharedConfig | null {
  if (!model || !memory || !storage) return null;

  const spec = macSpecs[model as MacModel];
  if (!spec) return null;

  const validMemory = spec.availableMemory.includes(memory as MemorySize);
  const validStorage = spec.availableStorage.includes(storage as StorageSize);
  if (!validMemory || !validStorage) return null;

  return {
    model: model as MacModel,
    memory: memory as MemorySize,
    storage: storage as StorageSize,
    spec,
  };
}

export function parseAnswersPayload(
  value: unknown,
): Record<string, number[]> | null {
  if (typeof value !== "string") return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  const questionById = new Map(questions.map((q) => [q.id, q]));
  const result: Record<string, number[]> = {};

  for (const [questionId, selected] of Object.entries(parsed)) {
    const question = questionById.get(questionId);
    if (!question || !Array.isArray(selected)) return null;
    if (question.type === "sa" && selected.length !== 1) return null;
    if (question.type === "ma" && selected.length === 0) return null;

    const unique = new Set<number>();
    for (const optionIndex of selected) {
      if (!Number.isInteger(optionIndex)) return null;
      if (optionIndex < 0 || optionIndex >= question.options.length) return null;
      if (unique.has(optionIndex)) return null;
      unique.add(optionIndex);
    }
    result[questionId] = selected;
  }

  return result;
}

export function computeResult(answers: Record<string, number[]>) {
  const modelScores: Record<MacModel, number> = {
    neo: 0, air13: 0, air15: 0, pro14: 0, pro14pro: 0, pro16pro: 0,
  };
  const memoryScores: Record<MemorySize, number> = {
    "8gb": 0, "16gb": 0, "24gb": 0, "32gb": 0, "64gb": 0,
  };
  const storageScores: Record<StorageSize, number> = {
    "256gb": 0, "512gb": 0, "1tb": 0, "2tb": 0, "4tb": 0,
  };

  for (const q of questions) {
    const selected = answers[q.id] ?? [];
    for (const idx of selected) {
      const opt = q.options[idx];
      if (!opt) continue;
      for (const [k, v] of Object.entries(opt.scores.model)) {
        modelScores[k as MacModel] += v;
      }
      for (const [k, v] of Object.entries(opt.scores.memory)) {
        memoryScores[k as MemorySize] += v;
      }
      for (const [k, v] of Object.entries(opt.scores.storage)) {
        storageScores[k as StorageSize] += v;
      }
    }
  }

  const bestModel = (Object.entries(modelScores) as [MacModel, number][])
    .sort(([, a], [, b]) => b - a)[0][0];

  const spec = macSpecs[bestModel];

  const memoryRank = (Object.entries(memoryScores) as [MemorySize, number][])
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => k);
  const bestMemory = memoryRank.find((m) => spec.availableMemory.includes(m))
    ?? spec.availableMemory[0];

  const storageRank = (Object.entries(storageScores) as [StorageSize, number][])
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => k);
  const bestStorage = storageRank.find((s) => spec.availableStorage.includes(s))
    ?? spec.availableStorage[0];

  const runners = (Object.entries(modelScores) as [MacModel, number][])
    .sort(([, a], [, b]) => b - a)
    .slice(1, 3)
    .map(([id]) => id);

  const reasons = buildReasons(answers, bestModel, bestMemory, bestStorage);

  return { bestModel, bestMemory, bestStorage, runners, reasons, modelScores };
}

function findQuestion(id: string): number {
  return questions.findIndex((q) => q.id === id);
}

function buildReasons(
  answers: Record<string, number[]>,
  model: MacModel,
  memory: MemorySize,
  storage: StorageSize,
): ReasonEntry[] {
  const result: ReasonEntry[] = [];
  const spec = macSpecs[model];
  const isPro = model === "pro14" || model === "pro14pro" || model === "pro16pro";

  const purposeIdx = findQuestion("purpose");
  const purposeIdxs = answers["purpose"] ?? [];
  const purposeLabels = purposeIdxs.map((i) => questions[purposeIdx]?.options[i]?.label).filter(Boolean);

  if (purposeLabels.length > 0) {
    const joined = purposeLabels.join("、");
    result.push({
      answer: joined,
      reason: `この用途に合った処理性能を持つ${spec.name}（${spec.chip}）をおすすめします`,
    });
  }

  const hasPurpose = (label: string) => purposeLabels.includes(label);
  if (isPro && hasPurpose("プレゼン・会議での発表")) {
    result.push({
      answer: "プレゼンが多い",
      reason: "ProならHDMIケーブルを直接挿せるので、変換アダプタなしでプロジェクターやモニターに接続できます",
    });
  }

  if (isPro) {
    result.push({
      answer: "Proの実用的なメリット",
      reason: "USB-Cポートが左右両側にあるので、電源の位置を気にせず作業できます。ポート数も豊富で周辺機器の接続に困りません",
    });
  }

  const memLabel = memoryLabels[memory];
  if (hasPurpose("動画の編集") || hasPurpose("プログラミング・開発")) {
    result.push({
      answer: "高負荷な作業あり",
      reason: `処理の重い作業を快適にこなすため、メモリは${memLabel}がおすすめです`,
    });
  } else if (hasPurpose("AIツールの活用") || hasPurpose("写真・画像の編集")) {
    result.push({
      answer: "AI・画像編集を予定",
      reason: `複数アプリの同時利用やAIツールに備え、メモリは${memLabel}を推奨します`,
    });
  } else {
    result.push({
      answer: "一般的な用途",
      reason: `普段使いに十分な${memLabel}メモリで快適に動作します`,
    });
  }

  const storLabel = storageLabels[storage];
  const dataQIdx = findQuestion("data");
  const dataIdx = (answers["data"] ?? [0])[0];
  const dataLabel = questions[dataQIdx]?.options[dataIdx]?.label ?? "";
  result.push({
    answer: `データ量「${dataLabel}」`,
    reason: `お持ちのデータ量に合わせて、ストレージは${storLabel}をおすすめします`,
  });

  const portIdx = (answers["portability"] ?? [0])[0];
  if (portIdx === 0) {
    result.push({
      answer: "電車で毎日持ち歩く",
      reason: `${spec.weight}と軽量で、毎日の持ち運びも苦になりません`,
    });
  } else if (portIdx === 1) {
    result.push({
      answer: "車移動が中心",
      reason: "車移動なら重さはほぼ気になりません。性能やポートの充実度を優先した構成をおすすめします",
    });
  }

  const appleIdx = (answers["apple_devices"] ?? [])[0];
  if (appleIdx === 0) {
    result.push({
      answer: "iPhoneを利用中",
      reason: "Macが加わると、AirDropでのファイル共有、iPhoneで撮った写真の自動同期、通話やメッセージの引き継ぎなど、iPhoneがもっと便利になります",
    });
  } else if (appleIdx === 1) {
    result.push({
      answer: "iPhone + iPadを利用中",
      reason: "MacならiPadをサブディスプレイにしたり（Sidecar）、デバイス間でコピペやファイル共有がシームレスに。3台揃うとApple製品の連携が本領を発揮します",
    });
  }

  return result;
}

export type ComparisonEntry = {
  frustration: string;
  resolution: string;
};

export function buildComparison(
  answers: Record<string, number[]>,
  model: MacModel,
): ComparisonEntry[] {
  const frustrationIdxs = answers["current_frustrations"] ?? [];
  const frustrationQ = questions.find((q) => q.id === "current_frustrations");
  if (!frustrationQ) return [];

  const selected = frustrationIdxs
    .map((i) => frustrationQ.options[i]?.label)
    .filter(Boolean);

  if (selected.length === 0 || selected.includes("特に不満はない・初めて買う")) {
    return [];
  }

  const spec = macSpecs[model];
  const result: ComparisonEntry[] = [];

  const ageIdxs = answers["current_pc_age"] ?? [];
  const ageQ = questions.find((q) => q.id === "current_pc_age");
  const ageLabel = ageQ?.options[ageIdxs[0]]?.label ?? "";
  const isOld = ageLabel === "3〜5年" || ageLabel === "5年以上";

  if (selected.includes("起動や動作が遅い")) {
    result.push({
      frustration: "起動や動作が遅い",
      resolution: isOld
        ? `${spec.chip}チップ搭載。${ageLabel}前のPCとは別次元の速さで、スリープからの復帰は一瞬です`
        : `${spec.chip}チップで瞬時に起動。スリープからの復帰も一瞬です`,
    });
  }

  if (selected.includes("バッテリーが持たない")) {
    result.push({
      frustration: "バッテリーが持たない",
      resolution: `${spec.battery}のバッテリー駆動。1日中充電なしで使えます`,
    });
  }

  if (selected.includes("重くて持ち運びがつらい")) {
    result.push({
      frustration: "重くて持ち運びがつらい",
      resolution: `${spec.weight}の軽量設計。毎日カバンに入れても負担になりません`,
    });
  }

  if (selected.includes("画面が小さい・見づらい")) {
    result.push({
      frustration: "画面が小さい・見づらい",
      resolution: `${spec.screen}の高精細ディスプレイ。文字もくっきり、長時間の作業でも目が疲れにくい`,
    });
  }

  if (selected.includes("やりたいことに性能が足りない")) {
    result.push({
      frustration: "性能が足りない",
      resolution: `${spec.chip}の高性能チップで、複数アプリの同時使用もAIツールもサクサク動きます`,
    });
  }

  return result;
}
