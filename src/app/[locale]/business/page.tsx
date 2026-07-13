import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BusinessPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sector?: string; country?: string }>;
}) {
  const { locale } = await params;
  const { sector, country } = await searchParams;

  const opportunities = await prisma.businessOpportunity.findMany({
    where: {
      isActive: true,
      ...(sector ? { sector } : {}),
      ...(country ? { country } : {})
    },
    include: { company: true },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  const sectors = await prisma.businessOpportunity.findMany({
    select: { sector: true },
    distinct: ["sector"]
  });

  return (
    <div className="container-page py-12">
      <h1 className="section-title">بوابة الأعمال والتجارة / Business & Trade</h1>
      <p className="text-diplomatic-navy/60 max-w-2xl mb-6">
        دليل فرص التصدير والاستيراد والشراكة بين الشركات المصرية والفيتنامية.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link href={`/${locale}/business`} className={`rounded-full px-4 py-1.5 text-sm border ${!sector ? "bg-diplomatic-navy text-white" : "border-diplomatic-slate/30"}`}>
          الكل
        </Link>
        {sectors.map((s) => (
          <Link
            key={s.sector}
            href={`/${locale}/business?sector=${encodeURIComponent(s.sector)}`}
            className={`rounded-full px-4 py-1.5 text-sm border ${sector === s.sector ? "bg-diplomatic-navy text-white" : "border-diplomatic-slate/30"}`}
          >
            {s.sector}
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {opportunities.map((o) => (
          <div key={o.id} className="card-diplomatic">
            <span className="badge-demo">بيانات تجريبية</span>
            <h3 className="mt-3 font-bold text-diplomatic-navy">{o.titleAr}</h3>
            <p className="text-sm text-diplomatic-navy/60 mt-1">{o.company.nameAr} — {o.sector}</p>
            <p className="text-xs text-diplomatic-navy/50 mt-2">{o.type} · {o.country}</p>
          </div>
        ))}
        {opportunities.length === 0 && <p className="text-diplomatic-navy/60">لا توجد فرص مطابقة حاليًا.</p>}
      </div>
    </div>
  );
}
