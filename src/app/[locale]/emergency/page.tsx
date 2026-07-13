import { EmergencyForm } from "./EmergencyForm";

export default async function EmergencyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="container-page py-12 max-w-2xl">
      <div className="rounded-2xl bg-vn-red text-white p-6 mb-8">
        <h1 className="text-2xl font-extrabold">مركز الطوارئ / Emergency Center</h1>
        <p className="mt-2 text-sm text-white/90">
          هذا النموذج يُنشئ تذكرة طوارئ داخلية تصل لفريق الدعم. لا يوجد اتصال مباشر بالشرطة أو
          الإسعاف حتى يتم تفعيل تكامل رسمي. في حال وجود خطر مباشر على الحياة، يرجى الاتصال فورًا
          بأرقام الطوارئ المحلية في مصر (الشرطة 122 / الإسعاف 123).
        </p>
      </div>

      <div className="card-diplomatic">
        <EmergencyForm locale={locale} />
      </div>
    </div>
  );
}
