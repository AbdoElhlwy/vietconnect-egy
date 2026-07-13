"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const openThreadSchema = z.object({ subject: z.string().min(3) });
const sendMessageSchema = z.object({ threadId: z.string().min(1), body: z.string().min(1) });

export type MessageState = { ok: boolean; message: string };

export async function openThread(_prev: MessageState, formData: FormData): Promise<MessageState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "يرجى تسجيل الدخول أولاً" };

  const parsed = openThreadSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  await prisma.messageThread.create({
    data: { subject: parsed.data.subject, creatorId: (session.user as any).id }
  });

  revalidatePath("/messages");
  return { ok: true, message: "تم فتح محادثة جديدة" };
}

export async function sendMessage(_prev: MessageState, formData: FormData): Promise<MessageState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "يرجى تسجيل الدخول أولاً" };

  const parsed = sendMessageSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  const thread = await prisma.messageThread.findUnique({ where: { id: parsed.data.threadId } });
  if (!thread || thread.creatorId !== (session.user as any).id) {
    // Regular users can only message within their own threads; staff-side access is a
    // permission-gated extension for the admin messaging console (roadmap).
    return { ok: false, message: "غير مصرح لك بالوصول لهذه المحادثة" };
  }

  await prisma.message.create({
    data: { threadId: parsed.data.threadId, senderId: (session.user as any).id, body: parsed.data.body }
  });

  revalidatePath(`/messages/${parsed.data.threadId}`);
  return { ok: true, message: "" };
}
