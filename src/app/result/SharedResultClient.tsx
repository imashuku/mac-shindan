"use client";

import Link from "next/link";

export default function SharedResultClient() {
  return (
    <div className="text-center animate-fade-in-up">
      <Link
        href="/"
        className="inline-block min-h-[48px] px-10 py-3.5 bg-foreground text-background rounded-full text-base font-medium hover:bg-foreground/90 active:bg-foreground/80 transition-colors duration-200"
      >
        自分も診断してみる
      </Link>
    </div>
  );
}
