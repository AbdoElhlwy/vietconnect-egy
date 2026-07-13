import Link from "next/link";
import { Search } from "lucide-react";
import { getDictionary } from "@/i18n/config";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { auth } from "@/lib/auth";

export async function Navbar({ locale }: { locale: string }) {
  const dict = getDictionary(locale);
  const session = await auth();

  const links = [
    ["services", `/${locale}/services`],
    ["students", `/${locale}/students`],
    ["business", `/${locale}/business`],
    ["investment", `/${locale}/investment`],
    ["directory", `/${locale}/directory`],
    ["news", `/${locale}/news`],
    ["emergency", `/${locale}/emergency`],
    ["proposal", `/${locale}/proposal`]
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-diplomatic-slate/10">
      <div className="container-page flex items-center justify-between h-16">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-diplomatic-navy to-vn-red flex items-center justify-center text-white font-bold text-sm">VE</span>
          <span className="font-bold text-diplomatic-navy">{dict.brand.name}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-diplomatic-navy/80">
          {links.map(([key, href]) => (
            <Link key={key} href={href} className="hover:text-vn-red transition">
              {(dict.nav as any)[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href={`/${locale}/search`} aria-label="Search" className="text-diplomatic-navy/70 hover:text-vn-red">
            <Search size={20} />
          </Link>
          <LanguageSwitcher current={locale} />
          {session?.user ? (
            <Link
              href={`/${locale}/dashboard`}
              className="rounded-full bg-diplomatic-navy text-white text-sm font-semibold px-4 py-2 hover:bg-diplomatic-navyLight transition"
            >
              {dict.nav.dashboard}
            </Link>
          ) : (
            <>
              <Link href={`/${locale}/auth/login`} className="text-sm font-medium text-diplomatic-navy hover:text-vn-red">
                {dict.nav.login}
              </Link>
              <Link
                href={`/${locale}/auth/register`}
                className="rounded-full bg-vn-red text-white text-sm font-semibold px-4 py-2 hover:opacity-90 transition"
              >
                {dict.nav.register}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
