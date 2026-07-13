import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewThreadForm } from "./NewThreadForm";

export default async function MessagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const threads = await prisma.messageThread.findMany({
    where: { creatorId: (session.user as any).id, isArchived: false },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { messages: true } } }
  });

  return (
    <div className="container-page py-12 max-w-2xl">
      <h1 className="section-title">الرسائل / Messages</h1>

      <div className="card-diplomatic mb-8">
        <h2 className="font-bold text-diplomatic-navy mb-3">فتح محادثة جديدة مع فريق الدعم</h2>
        <NewThreadForm />
      </div>

      <div className="space-y-2">
        {threads.map((t) => (
          <Link key={t.id} href={`/${locale}/messages/${t.id}`} className="card-diplomatic flex justify-between items-center block">
            <span className="font-semibold text-sm">{t.subject}</span>
            <span className="text-xs text-diplomatic-navy/50">{t._count.messages} رسالة</span>
          </Link>
        ))}
        {threads.length === 0 && <p className="text-diplomatic-navy/50 text-sm">لا توجد محادثات بعد.</p>}
      </div>
    </div>
  );
}
