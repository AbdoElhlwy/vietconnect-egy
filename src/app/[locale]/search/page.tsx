import { SearchClient } from "./SearchClient";

export default function SearchPage() {
  return (
    <div className="container-page py-12 max-w-2xl">
      <h1 className="section-title">البحث الشامل / Site Search</h1>
      <p className="text-diplomatic-navy/60 text-sm mb-6">
        ابحث في الخدمات، الأخبار، الدليل، الجامعات، الشركات، الأسئلة الشائعة، والفعاليات.
      </p>
      <SearchClient />
    </div>
  );
}
