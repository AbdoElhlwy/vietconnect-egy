import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl font-extrabold text-diplomatic-navy">404</h1>
      <p className="mt-2 text-diplomatic-navy/60">الصفحة غير موجودة / Page not found</p>
      <Link href="/ar" className="mt-6 inline-block rounded-full bg-vn-red text-white px-5 py-2 text-sm font-semibold">
        العودة للرئيسية
      </Link>
    </div>
  );
}
