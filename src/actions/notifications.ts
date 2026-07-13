"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function markNotificationRead(recipientId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");

  const recipient = await prisma.notificationRecipient.findUnique({ where: { id: recipientId } });
  if (!recipient || recipient.userId !== (session.user as any).id) throw new Error("FORBIDDEN");

  await prisma.notificationRecipient.update({
    where: { id: recipientId },
    data: { isRead: true, readAt: new Date() }
  });

  revalidatePath("/notifications");
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");

  await prisma.notificationRecipient.updateMany({
    where: { userId: (session.user as any).id, isRead: false },
    data: { isRead: true, readAt: new Date() }
  });

  revalidatePath("/notifications");
}
