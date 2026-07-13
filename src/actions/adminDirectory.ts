"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";
import { VerificationStatus } from "@prisma/client";

export type AdminActionState = { ok: boolean; message: string };

const schema = z.object({
  category: z.string().min(2),
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  nameVi: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().optional()
});

export async function createDirectoryPlace(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await auth();
  try {
    await requirePermission((session?.user as any)?.id, "directory:manage");
  } catch {
    return { ok: false, message: "غير مصرح لك بهذا الإجراء" };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  await prisma.directoryPlace.create({
    data: { ...parsed.data, verificationStatus: "PENDING", languagesSupported: ["ar", "en"] }
  });

  revalidatePath("/admin/directory");
  return { ok: true, message: "تمت إضافة المكان (بانتظار التحقق)" };
}

export async function setDirectoryVerification(placeId: string, status: VerificationStatus) {
  const session = await auth();
  await requirePermission((session?.user as any)?.id, "directory:manage");

  await prisma.directoryPlace.update({ where: { id: placeId }, data: { verificationStatus: status } });
  revalidatePath("/admin/directory");
}
