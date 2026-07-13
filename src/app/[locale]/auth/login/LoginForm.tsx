"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LoginForm({ locale, dict }: { locale: string; dict: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false
    });
    setLoading(false);

    if (res?.error) {
      toast.error("بيانات الدخول غير صحيحة / Invalid credentials");
      return;
    }
    toast.success("تم تسجيل الدخول بنجاح");
    router.push(`/${locale}/dashboard`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">{dict.auth.email}</label>
        <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium">{dict.auth.password}</label>
        <input name="password" type="password" required minLength={8} className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-diplomatic-navy text-white font-bold py-2.5 hover:bg-diplomatic-navyLight transition disabled:opacity-60"
      >
        {loading ? dict.common.loading : dict.auth.submit}
      </button>
    </form>
  );
}
