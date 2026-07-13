import Link from "next/link";

export default async function CitizensPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const items = [
    "إدارة الملف الشخصي والمستندات",
    "متابعة حالة الطلبات القنصلية",
    "حجز المواعيد الرسمية",
    "التنبيهات المتعلقة بانتهاء المستندات",
    "الوصول لدليل الإسكندرية الشامل",
    "الدعم في الحالات الطارئة"
  ];

  return (
    <div className="container-page py-12 max-w-3xl">
      <h1 className="section-title">خدمات المواطنين / Citizen Services</h1>
      <ul className="mt-6 space-y-3 text-diplomatic-navy/80 text-sm">
        {items.map((i) => <li key={i} className="card-diplomatic">{i}</li>)}
      </ul>
      <Link href={`/${locale}/auth/register`} className="mt-8 inline-block rounded-full bg-vn-red text-white text-sm font-semibold px-5 py-2.5">
        تسجيل كمواطن
      </Link>
    </div>
  );
}
