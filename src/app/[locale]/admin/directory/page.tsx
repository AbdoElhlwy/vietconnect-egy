import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { userHasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { CreatePlaceForm } from "./CreatePlaceForm";
import { VerifyButtons } from "./VerifyButtons";

export default async function AdminDirectoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const canManage = await userHasPermission((session.user as any).id, "directory:manage");
  if (!canManage) redirect(`/${locale}/dashboard`);

  const places = await prisma.directoryPlace.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title mb-0">إدارة الدليل / Directory CMS</h1>
        <Link href={`/${locale}/admin`} className="text-sm underline text-diplomatic-navy">لوحة الإدارة</Link>
      </div>

      <div className="card-diplomatic mb-8">
        <h2 className="font-bold text-diplomatic-navy mb-3">إضافة مكان جديد</h2>
        <CreatePlaceForm />
      </div>

      <div className="space-y-3">
        {places.map((p) => (
          <div key={p.id} className="card-diplomatic flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">{p.nameAr} <span className="text-xs text-diplomatic-navy/50">({p.category})</span></p>
              <p className="text-xs text-diplomatic-navy/50">{p.verificationStatus}</p>
            </div>
            <VerifyButtons placeId={p.id} currentStatus={p.verificationStatus} />
          </div>
        ))}
        {places.length === 0 && <p className="text-diplomatic-navy/50 text-sm">لا توجد أماكن بعد.</p>}
      </div>
    </div>
  );
}
