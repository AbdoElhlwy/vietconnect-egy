import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/i18n/config";
import QRCode from "qrcode";

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);
  const session = await auth();

  if (!session?.user) redirect(`/${locale}/auth/login`);

  const userId = (session.user as any).id as string;
  const roles = ((session.user as any).roles ?? []) as string[];

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      serviceRequests: { orderBy: { createdAt: "desc" }, take: 5 },
      appointments: { include: { slot: true }, orderBy: { createdAt: "desc" }, take: 5 },
      documents: { include: { type: true }, take: 5 },
      notifications: { include: { notification: true }, orderBy: { id: "desc" }, take: 5 }
    }
  });

  if (!user) redirect(`/${locale}/auth/login`);

  const qrDataUrl = await QRCode.toDataURL(user.membershipNo);
  const isAdmin = roles.some((r) => ["SUPER_ADMIN", "EMBASSY_ADMIN", "CONSULAR_OFFICER", "STUDENT_OFFICER", "BUSINESS_OFFICER"].includes(r));

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title mb-0">{dict.nav.dashboard}</h1>
          <p className="text-diplomatic-navy/60 text-sm">{user.fullName} — {roles.join(", ")}</p>
        </div>
        {isAdmin && (
          <Link href={`/${locale}/admin`} className="rounded-full bg-diplomatic-navy text-white text-sm font-semibold px-4 py-2">
            Admin Panel
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link href={`/${locale}/documents`} className="rounded-full border border-diplomatic-slate/30 text-xs font-semibold px-4 py-2 text-diplomatic-navy">خزينة المستندات</Link>
        <Link href={`/${locale}/messages`} className="rounded-full border border-diplomatic-slate/30 text-xs font-semibold px-4 py-2 text-diplomatic-navy">الرسائل</Link>
        <Link href={`/${locale}/notifications`} className="rounded-full border border-diplomatic-slate/30 text-xs font-semibold px-4 py-2 text-diplomatic-navy">الإشعارات</Link>
        <Link href={`/${locale}/complaints`} className="rounded-full border border-diplomatic-slate/30 text-xs font-semibold px-4 py-2 text-diplomatic-navy">شكوى / اقتراح</Link>
        <Link href={`/${locale}/settings`} className="rounded-full border border-diplomatic-slate/30 text-xs font-semibold px-4 py-2 text-diplomatic-navy">الإعدادات والأمان</Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Digital ID Card */}
        <div className="card-diplomatic">
          <h2 className="font-bold text-diplomatic-navy mb-3">البطاقة الرقمية / Digital ID</h2>
          <div className="flex items-center gap-4">
            <img src={qrDataUrl} alt="QR" className="w-24 h-24 rounded-lg border" />
            <div className="text-sm">
              <p className="font-semibold">{user.fullName}</p>
              <p className="text-diplomatic-navy/60">{user.membershipNo}</p>
              <p className="text-diplomatic-navy/60">{user.accountType}</p>
            </div>
          </div>
        </div>

        {/* Requests */}
        <div className="card-diplomatic">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-diplomatic-navy">الطلبات / Requests</h2>
            <Link href={`/${locale}/requests/new`} className="text-xs font-semibold text-vn-red">+ طلب جديد</Link>
          </div>
          {user.serviceRequests.length === 0 ? (
            <p className="text-sm text-diplomatic-navy/50">{dict.common.empty}</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {user.serviceRequests.map((r) => (
                <li key={r.id} className="flex justify-between border-b border-diplomatic-slate/10 pb-2">
                  <span>{r.subject}</span>
                  <span className="text-xs font-semibold text-diplomatic-navy/60">{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Appointments */}
        <div className="card-diplomatic">
          <h2 className="font-bold text-diplomatic-navy mb-3">المواعيد / Appointments</h2>
          {user.appointments.length === 0 ? (
            <p className="text-sm text-diplomatic-navy/50">{dict.common.empty}</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {user.appointments.map((a) => (
                <li key={a.id} className="flex justify-between border-b border-diplomatic-slate/10 pb-2">
                  <span>{a.serviceName}</span>
                  <span className="text-xs font-semibold text-diplomatic-navy/60">
                    {a.slot.date.toLocaleDateString(locale)} — {a.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Documents */}
        <div className="card-diplomatic">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-diplomatic-navy">خزينة المستندات / Documents</h2>
            <Link href={`/${locale}/documents`} className="text-xs font-semibold text-vn-red">إدارة →</Link>
          </div>
          {user.documents.length === 0 ? (
            <p className="text-sm text-diplomatic-navy/50">{dict.common.empty}</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {user.documents.map((d) => (
                <li key={d.id} className="flex justify-between border-b border-diplomatic-slate/10 pb-2">
                  <span>{d.type.nameAr}</span>
                  <span className="text-xs font-semibold text-diplomatic-navy/60">{d.verificationStatus}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notifications */}
        <div className="card-diplomatic lg:col-span-2">
          <h2 className="font-bold text-diplomatic-navy mb-3">الإشعارات / Notifications</h2>
          {user.notifications.length === 0 ? (
            <p className="text-sm text-diplomatic-navy/50">{dict.common.empty}</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {user.notifications.map((n) => (
                <li key={n.id} className="border-b border-diplomatic-slate/10 pb-2">
                  {n.notification.titleAr}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
