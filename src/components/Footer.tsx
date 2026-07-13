import Link from "next/link";
import { getDictionary } from "@/i18n/config";

export function Footer({ locale }: { locale: string }) {
  const dict = getDictionary(locale);

  return (
    <footer className="bg-diplomatic-navy text-white mt-24">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-vn-red flex items-center justify-center font-bold text-sm">VE</span>
              <span className="font-bold text-lg">{dict.brand.name}</span>
            </div>
            <p className="mt-3 text-sm text-white/70 leading-relaxed">{dict.brand.tagline}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-white/40 mb-3">{dict.nav.services}</h3>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <Link href={`/${locale}/students`} className="hover:text-white transition">{dict.nav.students}</Link>
              <Link href={`/${locale}/business`} className="hover:text-white transition">{dict.nav.business}</Link>
              <Link href={`/${locale}/investment`} className="hover:text-white transition">{dict.nav.investment}</Link>
              <Link href={`/${locale}/directory`} className="hover:text-white transition">{dict.nav.directory}</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-white/40 mb-3">Support</h3>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <Link href={`/${locale}/faq`} className="hover:text-white transition">FAQ</Link>
              <Link href={`/${locale}/complaints`} className="hover:text-white transition">Complaints &amp; Suggestions</Link>
              <Link href={`/${locale}/emergency`} className="hover:text-white transition">{dict.nav.emergency}</Link>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-white/40 mb-3">Legal</h3>
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <Link href={`/${locale}/terms`} className="hover:text-white transition">{dict.footer.terms}</Link>
              <Link href={`/${locale}/privacy`} className="hover:text-white transition">{dict.footer.privacy}</Link>
              <Link href={`/${locale}/cookies`} className="hover:text-white transition">{dict.footer.cookies}</Link>
              <Link href={`/${locale}/accessibility`} className="hover:text-white transition">{dict.footer.accessibility}</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs text-white/60 leading-relaxed max-w-3xl">{dict.footer.disclaimer}</p>

          <details className="mt-2 text-xs text-white/40">
            <summary className="cursor-pointer hover:text-white/60">عرض التنبيه بلغات أخرى / View this notice in other languages</summary>
            <div className="mt-2 space-y-2 max-w-3xl">
              <p dir="rtl">VietConnect Egy هو مقترح تعاون رقمي مستقل، وليس منصة حكومية أو قنصلية رسمية إلا بعد اعتماده رسميًا من الجهات المختصة.</p>
              <p>VietConnect Egy là một đề xuất hợp tác kỹ thuật số độc lập, không phải là nền tảng chính thức của chính phủ hoặc lãnh sự quán trừ khi được cơ quan có thẩm quyền chính thức phê duyệt.</p>
            </div>
          </details>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
            <p>© {new Date().getFullYear()} VietConnect Egy — {dict.footer.rights}.</p>
            <p className="text-white/30">Alexandria, Egypt</p>
          </div>
        </div>
      </div>
    </footer>
  );
}