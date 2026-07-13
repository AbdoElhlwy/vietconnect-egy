import { prisma } from "@/lib/prisma";

export default async function NewsPage() {
  const [news, events] = await Promise.all([
    prisma.newsArticle.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } }),
    prisma.event.findMany({ where: { status: "PUBLISHED" }, orderBy: { startAt: "asc" } })
  ]);

  return (
    <div className="container-page py-12 space-y-12">
      <section>
        <h1 className="section-title">الأخبار / News</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {news.map((n) => (
            <article key={n.id} className="card-diplomatic">
              <span className="badge-demo">بيانات تجريبية</span>
              <h3 className="mt-3 font-bold text-diplomatic-navy">{n.titleAr}</h3>
              <p className="text-sm text-diplomatic-navy/60 mt-1 line-clamp-3">{n.bodyAr}</p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">الفعاليات / Events</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {events.map((e) => (
            <article key={e.id} className="card-diplomatic">
              <h3 className="font-bold text-diplomatic-navy">{e.titleAr}</h3>
              <p className="text-xs text-diplomatic-navy/50 mt-1">{e.startAt.toLocaleDateString("ar")}</p>
              {e.location && <p className="text-sm text-diplomatic-navy/60 mt-1">{e.location}</p>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
