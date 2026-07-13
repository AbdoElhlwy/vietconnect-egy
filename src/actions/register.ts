"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AccountType, RoleKey } from "@prisma/client";
import { verifyCaptcha } from "@/lib/captcha";
import { checkRegisterRateLimit } from "@/lib/rateLimit";

const registerSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  city: z.string().optional(),
  accountType: z.nativeEnum(AccountType),
  captchaToken: z.string().min(1),
  captchaAnswer: z.string().min(1)
});

const ACCOUNT_TYPE_TO_ROLE: Record<AccountType, RoleKey> = {
  CITIZEN: "CITIZEN",
  STUDENT: "STUDENT",
  RESEARCHER: "RESEARCHER",
  BUSINESS: "BUSINESS_OWNER",
  INVESTOR: "INVESTOR",
  PARTNER: "EGYPTIAN_PARTNER",
  STAFF: "CONTENT_EDITOR"
};

export type RegisterState = { ok: boolean; message: string };

export async function registerUser(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const rl = checkRegisterRateLimit(ip);
  if (!rl.allowed) {
    return { ok: false, message: "محاولات كثيرة جدًا، يرجى المحاولة لاحقًا / Too many attempts, please try again later" };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, message: "البيانات المدخلة غير صحيحة / Invalid input / Dữ liệu không hợp lệ" };
  }

  if (!verifyCaptcha(parsed.data.captchaToken, parsed.data.captchaAnswer)) {
    return { ok: false, message: "فشل التحقق الأمني، يرجى إعادة المحاولة / Security check failed" };
  }

  const { fullName, email, password, phone, city, accountType } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, message: "البريد الإلكتروني مستخدم بالفعل / Email already registered" };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { fullName, email, phone, city, accountType, passwordHash, isApproved: accountType === "CITIZEN" || accountType === "STUDENT" }
  });

  const roleKey = ACCOUNT_TYPE_TO_ROLE[accountType];
  const role = await prisma.role.findUnique({ where: { key: roleKey } });
  if (role) {
    await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });
  }

  await prisma.auditLog.create({
    data: { userId: user.id, action: "REGISTER", entity: "User", entityId: user.id }
  });

  return { ok: true, message: "تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن." };
}
