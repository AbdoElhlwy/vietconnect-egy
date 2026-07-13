import { prisma } from "@/lib/prisma";

export default async function FAQPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const faqs = await prisma.fAQ.findMany({
    where: {
      isPublished: true,
      ...(q
        ? {
            OR: [
              { questionAr: { contains: q, mode: "insensitive" } },
              { questionEn: { contains: q, mode: "insensitive" } },
              { questionVi: { contains: q, mode: "insensitive" } }
            ]
          }
        : {})
    }
  });

  return (
    <div className="container-page py-12 max-w-3xl">
      <h1 className="section-title">الأسئلة الشائعة / FAQ</h1>

      <form className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="ابحث في الأسئلة الشائعة..."
          className="w-full rounded-lg border border-diplomatic-slate/30 px-4 py-2.5 text-sm"
        />
      </form>

      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.id} className="card-diplomatic">
            <summary className="font-semibold cursor-pointer">{f.questionAr}</summary>
            <p className="mt-2 text-sm text-diplomatic-navy/70">{f.answerAr}</p>
          </details>
        ))}
        {faqs.length === 0 && <p className="text-diplomatic-navy/60 text-sm">لا توجد نتائج مطابقة.</p>}
      </div>
    </div>
  );
}
