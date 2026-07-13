"use client";

import { useTransition } from "react";
import { updateNewsStatus } from "@/actions/adminNews";
import { ContentStatus } from "@prisma/client";

const TRANSITIONS: Record<string, { label: string; next: ContentStatus }[]> = {
  DRAFT: [{ label: "إرسال للمراجعة", next: "PENDING_REVIEW" }],
  PENDING_REVIEW: [{ label: "نشر", next: "PUBLISHED" }, { label: "إعادة للمسودة", next: "DRAFT" }],
  PUBLISHED: [{ label: "أرشفة", next: "ARCHIVED" }],
  ARCHIVED: [{ label: "إعادة نشر", next: "PUBLISHED" }]
};

export function NewsStatusButtons({ articleId, currentStatus }: { articleId: string; currentStatus: string }) {
  const [pending, startTransition] = useTransition();
  const options = TRANSITIONS[currentStatus] ?? [];

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.next}
          disabled={pending}
          onClick={() => startTransition(() => updateNewsStatus(articleId, opt.next))}
          className="rounded-full border border-diplomatic-slate/30 text-xs font-semibold px-3 py-1.5 disabled:opacity-40"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
