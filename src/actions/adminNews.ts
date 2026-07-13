"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { requirePermission } from "@/lib/rbac";
import { ContentStatus } from "@prisma/client";

export type AdminActionState = { ok: boolean; message: string };

const createSchema = z.object({
  titleAr: z.string().min(3),
  titleEn: z.string().min(3),
  titleVi: z.string().min(3),
  bodyAr: z.string().min(10),
  bodyEn: z.string().min(10),
  bodyVi: z.string().min(10)
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60) || `news-${Date.now()}`;
}

export async function createNewsArticle(_prev: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await auth();
  try {
    await requirePermission((session?.user as any)?.id, "news:manage");
  } catch {
    return { ok: false, message: "غير مصرح لك بهذا الإجراء" };
  }

  const parsed = createSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة — تأكد من ملء جميع الحقول بجميع اللغات" };

  await prisma.newsArticle.create({
    data: {
      ...parsed.data,
      slug: `${slugify(parsed.data.titleEn)}-${Date.now().toString(36)}`,
      status: "DRAFT"
    }
  });

  revalidatePath("/admin/news");
  return { ok: true, message: "تم إنشاء المقال كمسودة" };
}

export async function updateNewsStatus(articleId: string, status: ContentStatus) {
  const session = await auth();
  await requirePermission((session?.user as any)?.id, "news:manage");

  await prisma.newsArticle.update({
    where: { id: articleId },
    data: { status, publishedAt: status === "PUBLISHED" ? new Date() : undefined }
  });

  revalidatePath("/admin/news");
}
