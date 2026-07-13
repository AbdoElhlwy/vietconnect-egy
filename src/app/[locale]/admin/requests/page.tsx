import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { userHasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { StatusForm } from "./StatusForm";

export default async function AdminRequestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const userId = (session.user as any).id as string;
  const canManage = await userHasPermission(userId, "requests:manage");
  if (!canManage) redirect(`/${locale}/dashboard`);

  const requests = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
    take: 50
  });

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title mb-0">إدارة الطلبات / Manage Requests</h1>
        <div className="flex gap-3">
          <Link href={`/${locale}/admin`} className="text-sm underline text-diplomatic-navy">لوحة الإدارة</Link>
          <a href="/api/reports/requests" className="rounded-full bg-diplomatic-navy text-white text-xs font-semibold px-4 py-2">
            تصدير CSV
          </a>
        </div>
      </div>

      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="card-diplomatic">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-sm">{r.subject}</p>
                <p className="text-xs text-diplomatic-navy/50">{r.user.fullName} · {r.type} · {r.priority} · {r.refNumber.slice(0, 8)}</p>
              </div>
              <StatusForm requestId={r.id} currentStatus={r.status} />
            </div>
          </div>
        ))}
        {requests.length === 0 && <p className="text-diplomatic-navy/60">لا توجد طلبات.</p>}
      </div>
    </div>
  );
}
