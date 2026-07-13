import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UploadForm } from "./UploadForm";
import { DeleteButton } from "./DeleteButton";

export default async function DocumentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/auth/login`);

  const userId = (session.user as any).id as string;

  const [documents, types] = await Promise.all([
    prisma.document.findMany({ where: { userId }, include: { type: true }, orderBy: { createdAt: "desc" } }),
    prisma.documentType.findMany()
  ]);

  return (
    <div className="container-page py-12 max-w-3xl">
      <h1 className="section-title">خزينة المستندات / Document Vault</h1>
      <p className="text-diplomatic-navy/60 text-sm mb-6">
        الملفات المسموح بها: JPG, PNG, PDF, DOC/DOCX — بحد أقصى 10 ميجابايت.
      </p>

      <div className="card-diplomatic mb-8">
        <h2 className="font-bold text-diplomatic-navy mb-3">رفع مستند جديد</h2>
        <UploadForm types={types} />
      </div>

      <div className="space-y-3">
        {documents.map((d) => (
          <div key={d.id} className="card-diplomatic flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{d.type.nameAr} — {d.fileName}</p>
              <p className="text-xs text-diplomatic-navy/50">
                {d.verificationStatus} · {d.confidentiality} · {d.createdAt.toLocaleDateString(locale)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-diplomatic-navy underline">
                عرض
              </a>
              <DeleteButton documentId={d.id} />
            </div>
          </div>
        ))}
        {documents.length === 0 && <p className="text-diplomatic-navy/50 text-sm">لا توجد مستندات مرفوعة بعد.</p>}
      </div>
    </div>
  );
}
