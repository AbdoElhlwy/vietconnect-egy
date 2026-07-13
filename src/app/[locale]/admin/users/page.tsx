import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { userHasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { UserRow } from "./UserRow";

export default async function AdminUsersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const canManage = await userHasPermission((session.user as any).id, "users:manage");
  if (!canManage) redirect(`/${locale}/dashboard`);

  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { roles: { include: { role: true } } },
      take: 100
    }),
    prisma.role.findMany()
  ]);

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title mb-0">إدارة المستخدمين / Manage Users</h1>
        <Link href={`/${locale}/admin`} className="text-sm underline text-diplomatic-navy">لوحة الإدارة</Link>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <UserRow
            key={u.id}
            user={{
              id: u.id,
              fullName: u.fullName,
              email: u.email,
              accountType: u.accountType,
              isApproved: u.isApproved,
              isActive: u.isActive,
              roles: u.roles.map((r) => r.role.key)
            }}
            allRoles={roles.map((r) => r.key)}
          />
        ))}
      </div>
    </div>
  );
}
