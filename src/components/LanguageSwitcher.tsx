"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, Locale } from "@/i18n/config";
import { Globe } from "lucide-react";

const LABELS: Record<Locale, string> = { ar: "العربية", en: "English", vi: "Tiếng Việt" };

export function LanguageSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(locale: string) {
    const segments = pathname.split("/");
    segments[1] = locale;
    const next = segments.join("/") || "/";
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    router.push(next);
  }

  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1 rounded-full border border-diplomatic-slate/30 px-3 py-1.5 text-sm text-diplomatic-navy hover:bg-diplomatic-fog transition"
        aria-haspopup="listbox"
      >
        <Globe size={16} />
        {LABELS[current as Locale] ?? current}
      </button>
      <div className="absolute end-0 mt-1 hidden group-hover:block bg-white rounded-xl shadow-diplomatic border border-diplomatic-slate/10 overflow-hidden z-50 min-w-[140px]">
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => switchTo(l)}
            className="block w-full text-start px-4 py-2 text-sm hover:bg-diplomatic-fog"
          >
            {LABELS[l]}
          </button>
        ))}
      </div>
    </div>
  );
}
