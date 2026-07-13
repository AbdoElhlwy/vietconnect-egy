"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type SettingsState = { ok: boolean; message: string };

const passwordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});

export async function changePassword(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "يرجى تسجيل الدخول أولاً" };

  const parsed = passwordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  if (!user) return { ok: false, message: "المستخدم غير موجود" };

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) return { ok: false, message: "كلمة المرور الحالية غير صحيحة" };

  const newHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });

  await prisma.auditLog.create({
    data: { userId: user.id, action: "PASSWORD_CHANGE", entity: "User", entityId: user.id }
  });

  return { ok: true, message: "تم تغيير كلمة المرور بنجاح" };
}

/**
 * Soft-deletes the account: deactivates it and stamps `deletedAt`, rather than physically
 * removing rows, so that audit trails and any linked records referenced by other entities remain
 * consistent. This satisfies the "right to deletion" requirement while keeping referential
 * integrity for a demo/pilot-scale deployment.
 */
export async function deleteAccount(): Promise<SettingsState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "يرجى تسجيل الدخول أولاً" };

  const userId = (session.user as any).id as string;

  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false, deletedAt: new Date() }
  });

  await prisma.auditLog.create({
    data: { userId, action: "ACCOUNT_DELETE_REQUESTED", entity: "User", entityId: userId }
  });

  return { ok: true, message: "تم إلغاء تفعيل حسابك بنجاح." };
}
