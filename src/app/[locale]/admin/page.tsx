import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/StatCard";

const ADMIN_ROLES = ["SUPER_ADMIN", "EMBASSY_ADMIN", "CONSULAR_OFFICER", "STUDENT_OFFICER", "BUSINESS_OFFICER", "ANALYST", "CONTENT_EDITOR", "EMERGENCY_OFFICER"];

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) redirect(`/${locale}/auth/login`);
  const roles = ((session.user as any).roles ?? []) as string[];

  // Server-side RBAC enforcement — never rely on hidden UI alone.
  if (!roles.some((r) => ADMIN_ROLES.includes(r))) {
    redirect(`/${locale}/dashboard`);
  }

  const [users, students, companies, requests, openRequests, appointments, emergencies, news] = await Promise.all([
    prisma.user.count(),
    prisma.studentProfile.count(),
    prisma.company.count(),
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({ where: { status: { in: ["NEW", "UNDER_REVIEW", "IN_PROGRESS"] } } }),
    prisma.appointment.count({ where: { status: "CONFIRMED" } }),
    prisma.emergencyCase.count({ where: { status: "OPEN" } }),
    prisma.newsArticle.count({ where: { status: "PUBLISHED" } })
  ]);

  const recentRequests = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { user: true }
  });

  return (
    <div className="container-page py-10">
      <h1 className="section-title">لوحة الإدارة / Admin Overview</h1>
      <p className="text-diplomatic-navy/50 text-xs mb-6">بيانات تجريبية — Demo Data</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <a href={`/${locale}/admin/requests`} className="rounded-full bg-diplomatic-navy text-white text-xs font-semibold px-4 py-2">إدارة الطلبات</a>
        <a href={`/${locale}/admin/users`} className="rounded-full bg-diplomatic-navy text-white text-xs font-semibold px-4 py-2">إدارة المستخدمين</a>
        <a href={`/${locale}/admin/news`} className="rounded-full bg-diplomatic-navy text-white text-xs font-semibold px-4 py-2">إدارة الأخبار</a>
        <a href={`/${locale}/admin/directory`} className="rounded-full bg-diplomatic-navy text-white text-xs font-semibold px-4 py-2">إدارة الدليل</a>
        <a href="/api/reports/requests" className="rounded-full border border-diplomatic-slate/30 text-xs font-semibold px-4 py-2 text-diplomatic-navy">تصدير تقرير CSV</a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard value={users} label="المستخدمون" />
        <StatCard value={students} label="الطلاب" />
        <StatCard value={companies} label="الشركات" />
        <StatCard value={requests} label="إجمالي الطلبات" />
        <StatCard value={openRequests} label="طلبات مفتوحة" />
        <StatCard value={appointments} label="مواعيد مؤكدة" />
        <StatCard value={emergencies} label="حالات طوارئ مفتوحة" />
        <StatCard value={news} label="أخبار منشورة" />
      </div>

      <div className="card-diplomatic">
        <h2 className="font-bold text-diplomatic-navy mb-4">أحدث الطلبات / Recent Requests</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-start text-diplomatic-navy/50 border-b">
              <th className="py-2 text-start">المرجع</th>
              <th className="text-start">المستخدم</th>
              <th className="text-start">النوع</th>
              <th className="text-start">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {recentRequests.map((r) => (
              <tr key={r.id} className="border-b border-diplomatic-slate/10">
                <td className="py-2">{r.refNumber.slice(0, 8)}</td>
                <td>{r.user.fullName}</td>
                <td>{r.type}</td>
                <td className="font-semibold">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
