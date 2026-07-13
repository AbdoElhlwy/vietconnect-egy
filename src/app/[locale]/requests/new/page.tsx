import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDictionary } from "@/i18n/config";
import { NewRequestForm } from "./NewRequestForm";

export default async function NewRequestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/auth/login`);
  const dict = getDictionary(locale);

  return (
    <div className="container-page py-12 max-w-xl">
      <div className="card-diplomatic">
        <h1 className="section-title">طلب مساعدة جديد / New Service Request</h1>
        <NewRequestForm locale={locale} dict={dict} />
      </div>
    </div>
  );
}
