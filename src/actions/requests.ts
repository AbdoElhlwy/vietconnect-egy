"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { RequestType, RequestPriority } from "@prisma/client";

const schema = z.object({
  type: z.nativeEnum(RequestType),
  subject: z.string().min(3),
  description: z.string().min(10),
  priority: z.nativeEnum(RequestPriority).default("NORMAL")
});

export type RequestState = { ok: boolean; message: string };

export async function createServiceRequest(_prev: RequestState, formData: FormData): Promise<RequestState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "UNAUTHORIZED" };

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة / Invalid data" };

  const request = await prisma.serviceRequest.create({
    data: {
      userId: (session.user as any).id,
      ...parsed.data
    }
  });

  await prisma.auditLog.create({
    data: {
      userId: (session.user as any).id,
      action: "CREATE_REQUEST",
      entity: "ServiceRequest",
      entityId: request.id
    }
  });

  revalidatePath("/dashboard");
  return { ok: true, message: `تم إنشاء الطلب برقم مرجعي ${request.refNumber}` };
}
