import { prisma } from "@/lib/prisma";
import Link from "next/link";

const CATEGORIES = [
  "university", "hospital", "pharmacy", "police", "hotel", "restaurant",
  "translator", "lawyer", "shipping", "port", "airport", "bank", "telecom",
  "accommodation", "attraction"
];

export default async function DirectoryPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;

  const places = await prisma.directoryPlace.findMany({
    where: category ? { category } : {},
    orderBy: { nameAr: "asc" }
  });

  return (
    <div className="container-page py-12">
      <h1 className="section-title">دليل الإسكندرية الذكي / Alexandria Smart Directory</h1>

      <div className="flex flex-wrap gap-2 my-6">
        <Link href={`/${locale}/directory`} className={`rounded-full px-4 py-1.5 text-xs border ${!category ? "bg-diplomatic-navy text-white" : "border-diplomatic-slate/30"}`}>الكل</Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/${locale}/directory?category=${c}`}
            className={`rounded-full px-4 py-1.5 text-xs border capitalize ${category === c ? "bg-diplomatic-navy text-white" : "border-diplomatic-slate/30"}`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {places.map((p) => (
          <div key={p.id} className="card-diplomatic">
            <span className="text-xs uppercase tracking-wide text-diplomatic-navy/50">{p.category}</span>
            <h3 className="mt-1 font-bold text-diplomatic-navy">{p.nameAr}</h3>
            <p className="text-sm text-diplomatic-navy/60">{p.nameEn}</p>
            {p.address && <p className="text-xs text-diplomatic-navy/50 mt-2">{p.address}</p>}
            <span className="mt-2 inline-block text-xs font-semibold text-green-700">{p.verificationStatus}</span>
          </div>
        ))}
        {places.length === 0 && <p className="text-diplomatic-navy/60">لا توجد نتائج.</p>}
      </div>
    </div>
  );
}
