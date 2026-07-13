"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";
import { RequestStatus } from "@prisma/client";

const schema = z.object({
  requestId: z.string().min(1),
  status: z.nativeEnum(RequestStatus),
  comment: z.string().optional()
});

export type AdminActionState = { ok: boolean; message: string };

export async function updateRequestStatus(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  try {
    await requirePermission(userId, "requests:manage");
  } catch {
    return { ok: false, message: "غير مصرح لك بهذا الإجراء" };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  await prisma.serviceRequest.update({
    where: { id: parsed.data.requestId },
    data: { status: parsed.data.status, assigneeId: userId }
  });

  if (parsed.data.comment) {
    await prisma.requestComment.create({
      data: { requestId: parsed.data.requestId, authorId: userId!, body: parsed.data.comment, isInternal: true }
    });
  }

  await prisma.auditLog.create({
    data: { userId, action: "UPDATE_REQUEST_STATUS", entity: "ServiceRequest", entityId: parsed.data.requestId, metadata: { status: parsed.data.status } }
  });

  revalidatePath("/admin/requests");
  return { ok: true, message: "تم تحديث حالة الطلب" };
}
