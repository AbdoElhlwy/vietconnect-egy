import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/i18n/config";
import Link from "next/link";

export default async function StudentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  const [universities, scholarships, internships, jobs, events] = await Promise.all([
    prisma.university.findMany({ take: 6 }),
    prisma.scholarship.findMany({ where: { isActive: true }, take: 5 }),
    prisma.internship.findMany({ where: { isActive: true }, take: 5 }),
    prisma.jobOpportunity.findMany({ where: { isActive: true }, take: 5 }),
    prisma.event.findMany({ where: { status: "PUBLISHED" }, take: 4, orderBy: { startAt: "asc" } })
  ]);

  return (
    <div className="container-page py-12 space-y-12">
      <div>
        <h1 className="section-title">بوابة الطلاب / Student Portal</h1>
        <p className="text-diplomatic-navy/60 max-w-2xl">
          دعم شامل للطلاب والباحثين الفيتناميين في الجامعات المصرية: بيانات الإقامة، السكن، التأمين،
          المنح، فرص التدريب، والمساعدة القنصلية.
        </p>
        <Link href={`/${locale}/requests/new`} className="mt-4 inline-block rounded-full bg-vn-red text-white text-sm font-semibold px-5 py-2.5">
          طلب مساعدة كطالب
        </Link>
      </div>

      <section>
        <h2 className="font-bold text-lg text-diplomatic-navy mb-4">الجامعات الشريكة / Partner Universities</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {universities.map((u) => (
            <div key={u.id} className="card-diplomatic">
              <p className="font-semibold">{u.nameAr}</p>
              <p className="text-sm text-diplomatic-navy/60">{u.nameEn} — {u.city}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="font-bold text-lg text-diplomatic-navy mb-4">المنح / Scholarships</h2>
          <ul className="space-y-2 text-sm">
            {scholarships.map((s) => <li key={s.id} className="card-diplomatic">{s.titleAr}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="font-bold text-lg text-diplomatic-navy mb-4">التدريب / Internships</h2>
          <ul className="space-y-2 text-sm">
            {internships.map((s) => <li key={s.id} className="card-diplomatic">{s.titleAr}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="font-bold text-lg text-diplomatic-navy mb-4">وظائف طلابية / Jobs</h2>
          <ul className="space-y-2 text-sm">
            {jobs.map((s) => <li key={s.id} className="card-diplomatic">{s.titleAr}</li>)}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg text-diplomatic-navy mb-4">الفعاليات الثقافية / Cultural Events</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((e) => (
            <div key={e.id} className="card-diplomatic">
              <p className="font-semibold text-sm">{e.titleAr}</p>
              <p className="text-xs text-diplomatic-navy/60">{e.startAt.toLocaleDateString(locale)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
