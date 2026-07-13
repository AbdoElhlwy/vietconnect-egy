import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SendMessageForm } from "./SendMessageForm";

export default async function ThreadPage({
  params
}: {
  params: Promise<{ locale: string; threadId: string }>;
}) {
  const { locale, threadId } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const thread = await prisma.messageThread.findUnique({
    where: { id: threadId },
    include: { messages: { orderBy: { createdAt: "asc" }, include: { sender: true } } }
  });

  if (!thread || thread.creatorId !== (session.user as any).id) notFound();

  return (
    <div className="container-page py-12 max-w-2xl">
      <h1 className="section-title">{thread.subject}</h1>

      <div className="card-diplomatic space-y-3 max-h-96 overflow-y-auto mb-4">
        {thread.messages.map((m) => (
          <div key={m.id} className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${m.senderId === (session.user as any).id ? "bg-diplomatic-navy text-white ms-auto" : "bg-diplomatic-fog"}`}>
            <p>{m.body}</p>
            <p className="text-[10px] opacity-60 mt-1">{m.sender.fullName}</p>
          </div>
        ))}
        {thread.messages.length === 0 && <p className="text-diplomatic-navy/50 text-sm">لا توجد رسائل بعد.</p>}
      </div>

      <SendMessageForm threadId={thread.id} />
    </div>
  );
}
