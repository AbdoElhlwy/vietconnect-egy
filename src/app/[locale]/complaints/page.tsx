import { ComplaintForm } from "./ComplaintForm";

export default function ComplaintsPage() {
  return (
    <div className="container-page py-12 max-w-xl">
      <h1 className="section-title">الشكاوى والمقترحات / Complaints &amp; Suggestions</h1>
      <p className="text-diplomatic-navy/60 text-sm mb-6">
        يمكنك تقديم شكوى أو اقتراح، مع إمكانية إخفاء هويتك اختياريًا.
      </p>
      <div className="card-diplomatic">
        <ComplaintForm />
      </div>
    </div>
  );
}
