"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { EmergencyType } from "@prisma/client";
import { verifyCaptcha } from "@/lib/captcha";
import { checkEmergencyRateLimit } from "@/lib/rateLimit";

const schema = z.object({
  type: z.nativeEnum(EmergencyType),
  description: z.string().min(5),
  locationConsent: z.string().optional(),
  captchaToken: z.string().min(1),
  captchaAnswer: z.string().min(1)
});

export type EmergencyState = { ok: boolean; message: string; refNumber?: string };

export async function submitEmergency(_prev: EmergencyState, formData: FormData): Promise<EmergencyState> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: "يرجى تسجيل الدخول أولاً لإرسال بلاغ طوارئ / Please log in first" };
  }

  const rl = checkEmergencyRateLimit((session.user as any).id);
  if (!rl.allowed) {
    return { ok: false, message: "تم إرسال عدة بلاغات مؤخرًا. إن كانت حالتك تهدد الحياة اتصل فورًا بالطوارئ المحلية." };
  }

  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  if (!verifyCaptcha(parsed.data.captchaToken, parsed.data.captchaAnswer)) {
    return { ok: false, message: "فشل التحقق الأمني، يرجى إعادة المحاولة" };
  }

  const record = await prisma.emergencyCase.create({
    data: {
      userId: (session.user as any).id,
      type: parsed.data.type,
      description: parsed.data.description,
      locationConsent: parsed.data.locationConsent === "on"
    }
  });

  await prisma.auditLog.create({
    data: { userId: (session.user as any).id, action: "EMERGENCY_SUBMIT", entity: "EmergencyCase", entityId: record.id }
  });

  return {
    ok: true,
    message: "تم إنشاء تذكرة طوارئ عاجلة وسيتم التواصل معك في أقرب وقت ممكن.",
    refNumber: record.refNumber
  };
}
