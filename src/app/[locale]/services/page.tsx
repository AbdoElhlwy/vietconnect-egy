import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const services = await prisma.service.findMany({ where: { isActive: true } });

  return (
    <div className="container-page py-12">
      <h1 className="section-title">جميع الخدمات / All Services</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {services.map((s) => (
          <div key={s.id} className="card-diplomatic">
            <h3 className="font-bold text-diplomatic-navy">{s.nameAr}</h3>
            <p className="text-sm text-diplomatic-navy/60">{s.nameEn}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link href={`/${locale}/requests/new`} className="rounded-full bg-vn-red text-white text-sm font-semibold px-5 py-2.5">
          تقديم طلب مساعدة
        </Link>
      </div>
    </div>
  );
}
