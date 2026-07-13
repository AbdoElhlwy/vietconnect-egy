import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PasswordForm } from "./PasswordForm";
import { DeleteAccountButton } from "./DeleteAccountButton";

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/${locale}/auth/login`);

  return (
    <div className="container-page py-12 max-w-xl space-y-8">
      <div>
        <h1 className="section-title">الإعدادات والأمان / Settings &amp; Security</h1>
        <p className="text-diplomatic-navy/60 text-sm">{session.user.email}</p>
      </div>

      <div className="card-diplomatic">
        <h2 className="font-bold text-diplomatic-navy mb-3">تغيير كلمة المرور</h2>
        <PasswordForm />
      </div>

      <div className="card-diplomatic border-vn-red/30">
        <h2 className="font-bold text-vn-red mb-2">منطقة الخطر / Danger Zone</h2>
        <p className="text-sm text-diplomatic-navy/60 mb-4">
          حذف الحساب يؤدي إلى إلغاء تفعيله فورًا ومنع تسجيل الدخول. لا يمكن التراجع عن هذا الإجراء
          من واجهة المستخدم.
        </p>
        <DeleteAccountButton locale={locale} />
      </div>
    </div>
  );
}
