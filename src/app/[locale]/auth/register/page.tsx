import { getDictionary } from "@/i18n/config";
import { RegisterForm } from "./RegisterForm";

export default async function RegisterPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(locale);

  return (
    <div className="container-page py-16 max-w-lg">
      <div className="card-diplomatic">
        <h1 className="section-title">{dict.auth.registerTitle}</h1>
        <RegisterForm locale={locale} dict={dict} />
      </div>
    </div>
  );
}
