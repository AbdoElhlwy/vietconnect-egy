"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

const schema = z.object({
  slotId: z.string().min(1),
  serviceName: z.string().min(2)
});

export type BookingState = { ok: boolean; message: string };

export async function bookAppointment(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "يرجى تسجيل الدخول أولاً" };

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  const slot = await prisma.appointmentSlot.findUnique({ where: { id: parsed.data.slotId } });
  if (!slot) return { ok: false, message: "الموعد غير موجود" };
  if (slot.bookedCount >= slot.capacity) return { ok: false, message: "هذا الموعد مكتمل، يرجى اختيار موعد آخر" };

  await prisma.$transaction([
    prisma.appointment.create({
      data: {
        userId: (session.user as any).id,
        slotId: slot.id,
        serviceName: parsed.data.serviceName,
        status: "CONFIRMED"
      }
    }),
    prisma.appointmentSlot.update({ where: { id: slot.id }, data: { bookedCount: { increment: 1 } } })
  ]);

  revalidatePath("/appointments");
  return { ok: true, message: "تم تأكيد حجز الموعد بنجاح" };
}
