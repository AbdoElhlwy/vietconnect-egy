import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { userHasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { CreateNewsForm } from "./CreateNewsForm";
import { NewsStatusButtons } from "./NewsStatusButtons";

export default async function AdminNewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const canManage = await userHasPermission((session.user as any).id, "news:manage");
  if (!canManage) redirect(`/${locale}/dashboard`);

  const articles = await prisma.newsArticle.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <div className="container-page py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title mb-0">إدارة الأخبار / News CMS</h1>
        <Link href={`/${locale}/admin`} className="text-sm underline text-diplomatic-navy">لوحة الإدارة</Link>
      </div>

      <div className="card-diplomatic mb-8">
        <h2 className="font-bold text-diplomatic-navy mb-3">مقال جديد (يبدأ كمسودة)</h2>
        <CreateNewsForm />
      </div>

      <div className="space-y-3">
        {articles.map((a) => (
          <div key={a.id} className="card-diplomatic flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">{a.titleAr}</p>
              <p className="text-xs text-diplomatic-navy/50">{a.status} · {a.createdAt.toLocaleDateString(locale)}</p>
            </div>
            <NewsStatusButtons articleId={a.id} currentStatus={a.status} />
          </div>
        ))}
        {articles.length === 0 && <p className="text-diplomatic-navy/50 text-sm">لا توجد مقالات بعد.</p>}
      </div>
    </div>
  );
}
