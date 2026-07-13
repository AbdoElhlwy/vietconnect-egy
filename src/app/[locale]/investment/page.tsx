import { prisma } from "@/lib/prisma";

export default async function InvestmentPage() {
  const opportunities = await prisma.investmentOpportunity.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container-page py-12">
      <h1 className="section-title">بوابة الاستثمار / Investment Portal</h1>
      <p className="text-diplomatic-navy/60 max-w-2xl mb-6">
        فرص استثمارية موثقة في مصر وفيتنام. القيم والعوائد المعروضة إرشادية وغير مضمونة.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {opportunities.map((o) => (
          <div key={o.id} className="card-diplomatic">
            <span className="badge-demo">بيانات تجريبية</span>
            <h3 className="mt-3 font-bold text-diplomatic-navy">{o.titleAr}</h3>
            <p className="text-sm text-diplomatic-navy/60 mt-1">{o.sector} — {o.country}</p>
            <p className="text-xs text-diplomatic-navy/50 mt-2">المرحلة: {o.stage}</p>
            {o.riskNote && <p className="text-xs text-vn-red mt-2">{o.riskNote}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
