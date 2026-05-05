import Link from "next/link";
import Image from "next/image";

export default function BrandBar() {
  return (
    <header className="w-full px-5 pt-4 sm:pt-5">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between gap-3 text-xs text-muted">
        <Link
          href="https://www.step-out.jp/"
          className="group inline-flex min-h-[36px] items-center gap-2 rounded-full px-1.5 pr-3 transition-colors hover:bg-foreground/[0.04]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card shadow-sm">
            <Image
              src="/stepout-logo.png"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 object-contain"
              aria-hidden="true"
            />
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
