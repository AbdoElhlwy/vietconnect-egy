"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { storeUploadedFile, FileValidationError } from "@/lib/storage";
import { DocumentConfidentiality } from "@prisma/client";

export type DocumentState = { ok: boolean; message: string };

const uploadSchema = z.object({
  typeId: z.string().min(1),
  confidentiality: z.nativeEnum(DocumentConfidentiality).default("INTERNAL")
});

export async function uploadDocument(_prev: DocumentState, formData: FormData): Promise<DocumentState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "يرجى تسجيل الدخول أولاً" };

  const parsed = uploadSchema.safeParse({
    typeId: formData.get("typeId"),
    confidentiality: formData.get("confidentiality") || "INTERNAL"
  });
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "يرجى اختيار ملف" };
  }

  try {
    const stored = await storeUploadedFile(file);

    const document = await prisma.document.create({
      data: {
        userId: (session.user as any).id,
        typeId: parsed.data.typeId,
        fileUrl: stored.url,
        fileName: stored.fileName,
        confidentiality: parsed.data.confidentiality
      }
    });

    await prisma.auditLog.create({
      data: { userId: (session.user as any).id, action: "UPLOAD_DOCUMENT", entity: "Document", entityId: document.id }
    });

    revalidatePath("/documents");
    return { ok: true, message: "تم رفع المستند بنجاح" };
  } catch (err) {
    if (err instanceof FileValidationError) return { ok: false, message: err.message };
    console.error(err);
    return { ok: false, message: "تعذر رفع الملف حاليًا" };
  }
}

export async function deleteDocument(documentId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("UNAUTHORIZED");

  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc || doc.userId !== (session.user as any).id) throw new Error("FORBIDDEN");

  await prisma.document.delete({ where: { id: documentId } });
  await prisma.auditLog.create({
    data: { userId: (session.user as any).id, action: "DELETE_DOCUMENT", entity: "Document", entityId: documentId }
  });

  revalidatePath("/documents");
}
