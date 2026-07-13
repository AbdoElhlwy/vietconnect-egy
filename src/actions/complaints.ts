"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const schema = z.object({
  category: z.string().min(2),
  subject: z.string().min(3),
  description: z.string().min(10),
  isAnonymous: z.string().optional()
});

export type ComplaintState = { ok: boolean; message: string; refNumber?: string };

export async function submitComplaint(_prev: ComplaintState, formData: FormData): Promise<ComplaintState> {
  const session = await auth();
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  const isAnonymous = parsed.data.isAnonymous === "on";

  const record = await prisma.complaint.create({
    data: {
      userId: isAnonymous ? null : (session?.user as any)?.id ?? null,
      isAnonymous,
      category: parsed.data.category,
      subject: parsed.data.subject,
      description: parsed.data.description
    }
  });

  return { ok: true, message: "تم استلام شكواك/اقتراحك بنجاح.", refNumber: record.refNumber };
}
