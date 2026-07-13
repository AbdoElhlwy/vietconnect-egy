import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/adapter";

const schema = z.object({
  locale: z.enum(["ar", "en", "vi"]).default("ar"),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1).max(2000)
  })).min(1).max(20)
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const provider = getAIProvider();
  const reply = await provider.chat(parsed.data.messages, parsed.data.locale);

  return NextResponse.json({ reply, provider: provider.name });
}
