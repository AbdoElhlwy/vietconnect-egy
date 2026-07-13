import { TranslateForm } from "./TranslateForm";

export default function TranslatePage() {
  return (
    <div className="container-page py-12 max-w-2xl">
      <h1 className="section-title">مركز الترجمة / Translation Center</h1>
      <p className="text-xs text-vn-red mb-6">
        تنبيه: الترجمة الآلية أداة مساعدة ولا تُعتمد كترجمة رسمية للمستندات القانونية.
      </p>
      <div className="card-diplomatic">
        <TranslateForm />
      </div>
    </div>
  );
}
