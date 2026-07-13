"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";

export type AdminActionState = { ok: boolean; message: string };

export async function toggleUserApproval(userId: string, isApproved: boolean) {
  const session = await auth();
  await requirePermission((session?.user as any)?.id, "users:manage");

  await prisma.user.update({ where: { id: userId }, data: { isApproved } });
  await prisma.auditLog.create({
    data: {
      userId: (session?.user as any)?.id,
      action: isApproved ? "APPROVE_USER" : "UNAPPROVE_USER",
      entity: "User",
      entityId: userId
    }
  });

  revalidatePath("/admin/users");
}

export async function toggleUserActive(userId: string, isActive: boolean) {
  const session = await auth();
  await requirePermission((session?.user as any)?.id, "users:manage");

  await prisma.user.update({ where: { id: userId }, data: { isActive } });
  await prisma.auditLog.create({
    data: {
      userId: (session?.user as any)?.id,
      action: isActive ? "ACTIVATE_USER" : "SUSPEND_USER",
      entity: "User",
      entityId: userId
    }
  });

  revalidatePath("/admin/users");
}

const assignRoleSchema = z.object({
  userId: z.string().min(1),
  roleKey: z.string().min(1)
});

export async function assignRole(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await auth();
  try {
    await requirePermission((session?.user as any)?.id, "users:manage");
  } catch {
    return { ok: false, message: "غير مصرح لك بهذا الإجراء" };
  }

  const parsed = assignRoleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  const role = await prisma.role.findUnique({ where: { key: parsed.data.roleKey as any } });
  if (!role) return { ok: false, message: "الدور غير موجود" };

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: parsed.data.userId, roleId: role.id } },
    update: {},
    create: { userId: parsed.data.userId, roleId: role.id }
  });

  revalidatePath("/admin/users");
  return { ok: true, message: "تم إسناد الدور بنجاح" };
}
