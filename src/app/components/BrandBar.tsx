import Link from "next/link";

export default function BrandBar() {
  return (
    <header className="w-full px-5 pt-4 sm:pt-5">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 text-xs text-muted">
        <Link
          href="https://www.step-out.jp/"
          className="group inline-flex min-h-[36px] items-center gap-2 rounded-full px-1.5 pr-3 transition-colors hover:bg-foreground/[0.04]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-[11px] font-bold tracking-tight text-foreground shadow-sm">
            SO
          </span>
          <span className="font-medium text-foreground/75 group-hover:text-foreground">
            ステップアウト 無料診断ツール
          </span>
        </Link>
        <Link
          href="https://www.step-out.jp/"
          className="inline-flex min-h-[36px] shrink-0 items-center rounded-full px-2.5 font-medium text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground sm:px-3"
        >
          公式サイトへ
        </Link>
      </div>
    </header>
  );
}
