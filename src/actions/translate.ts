"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAIProvider } from "@/lib/ai/adapter";

const schema = z.object({
  sourceText: z.string().min(1).max(2000),
  sourceLang: z.enum(["ar", "en", "vi"]),
  targetLang: z.enum(["ar", "en", "vi"])
});

export type TranslateState = { ok: boolean; message: string; translated?: string };

export async function translateText(_prev: TranslateState, formData: FormData): Promise<TranslateState> {
  const parsed = schema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { ok: false, message: "بيانات غير صحيحة" };

  const provider = getAIProvider();
  const translated = await provider.chat(
    [{ role: "user", content: `Translate the following text from ${parsed.data.sourceLang} to ${parsed.data.targetLang}: ${parsed.data.sourceText}` }],
    parsed.data.targetLang
  );

  await prisma.translation.create({
    data: {
      sourceText: parsed.data.sourceText,
      sourceLang: parsed.data.sourceLang,
      targetLang: parsed.data.targetLang,
      translatedText: translated
    }
  });

  return { ok: true, message: "تمت الترجمة — الترجمة الآلية لا تغني عن الترجمة المعتمدة للمستندات الرسمية.", translated };
}
