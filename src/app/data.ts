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
          model: { air13: 2, air15: 2, pro14: 3, pro14pro: 1 },
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
          model: { air13: 3, air15: 1 },
          memory: { "16gb": 3 },
          storage: { "512gb": 2 },
        },
      },
      {
        label: "AIツールの活用",
        sub: "ChatGPTやClaudeなどを仕事に使いたい",
        scores: {
          model: { air13: 3, air15: 2, pro14: 1 },
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
    question: "持ち運びはどうしますか？",
    type: "sa",
    options: [
      {
        label: "毎日カバンに入れたい",
        sub: "カフェや外出先でも使いたい",
        scores: {
          model: { neo: 3, air13: 3, pro14: 1 },
          memory: {},
          storage: {},
        },
      },
      {
        label: "たまに持ち出す程度",
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
          model: { air13: 3, air15: 2, pro14: 1 },
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

function buildReasons(
  answers: Record<string, number[]>,
  model: MacModel,
  memory: MemorySize,
  storage: StorageSize,
): ReasonEntry[] {
  const result: ReasonEntry[] = [];
  const spec = macSpecs[model];

  const purposeIdxs = answers["purpose"] ?? [];
  const purposeLabels = purposeIdxs.map((i) => questions[1].options[i]?.label).filter(Boolean);
  if (purposeLabels.length > 0) {
    const joined = purposeLabels.join("、");
    result.push({
      answer: joined,
      reason: `この用途に合った処理性能を持つ${spec.name}（${spec.chip}）をおすすめします`,
    });
  }

  const memLabel = memoryLabels[memory];
  const hasPurpose = (label: string) => purposeLabels.includes(label);
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
  const dataIdx = (answers["data"] ?? [0])[0];
  const dataLabel = questions[5].options[dataIdx]?.label ?? "";
  result.push({
    answer: `データ量「${dataLabel}」`,
    reason: `お持ちのデータ量に合わせて、ストレージは${storLabel}をおすすめします`,
  });

  const portIdx = (answers["portability"] ?? [0])[0];
  if (portIdx === 0) {
    result.push({
      answer: "毎日持ち歩く",
      reason: `${spec.weight}と軽量で、毎日の持ち運びも苦になりません`,
    });
  }

  return result;
}
