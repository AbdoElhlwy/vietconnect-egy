"use client";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="text-2xl font-bold text-vn-red">حدث خطأ ما / Something went wrong</h1>
      <p className="mt-2 text-diplomatic-navy/60 text-sm">{error.message}</p>
      <button onClick={reset} className="mt-6 rounded-full bg-diplomatic-navy text-white px-5 py-2 text-sm font-semibold">
        إعادة المحاولة / Try again
      </button>
    </div>
  );
}
