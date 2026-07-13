import { getDictionary } from "@/i18n/config";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <div className="container-page py-16 max-w-md">
      <div className="card-diplomatic">
        <h1 className="section-title">{dict.auth.loginTitle}</h1>
        <p className="text-xs text-diplomatic-navy/60 mb-4">{dict.auth.demoNotice}</p>
        <div className="mb-4 rounded-lg bg-diplomatic-fog p-3 text-xs text-diplomatic-navy/70 space-y-1">
          <p>admin@vietconnect-egy.local / Admin@123456</p>
          <p>student@vietconnect-egy.local / Student@123456</p>
          <p>business@vietconnect-egy.local / Business@123456</p>
        </div>
        <LoginForm locale={locale} dict={dict} />
      </div>
    </div>
  );
}
