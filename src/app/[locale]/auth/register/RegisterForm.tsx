"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser, RegisterState } from "@/actions/register";
import { CaptchaField } from "@/components/CaptchaField";

const initialState: RegisterState = { ok: false, message: "" };

export function RegisterForm({ locale, dict }: { locale: string; dict: any }) {
  const [state, formAction, pending] = useActionState(registerUser, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-medium">{dict.auth.fullName}</label>
        <input name="fullName" required minLength={3} className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium">{dict.auth.email}</label>
        <input name="email" type="email" required className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium">{dict.auth.password}</label>
        <input name="password" type="password" required minLength={8} className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium">{dict.auth.accountType}</label>
        <select name="accountType" className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm">
          <option value="CITIZEN">Citizen</option>
          <option value="STUDENT">Student</option>
          <option value="RESEARCHER">Researcher</option>
          <option value="BUSINESS">Business</option>
          <option value="INVESTOR">Investor</option>
        </select>
      </div>
      <CaptchaField />

      <div className="flex items-start gap-2 text-xs text-diplomatic-navy/70">
        <input type="checkbox" required id="terms" className="mt-0.5" />
        <label htmlFor="terms">
          أوافق على <Link href={`/${locale}/terms`} className="underline">الشروط</Link> و
          <Link href={`/${locale}/privacy`} className="underline"> سياسة الخصوصية</Link>
        </label>
      </div>

      {state.message && (
        <p className={`text-sm ${state.ok ? "text-green-600" : "text-vn-red"}`}>{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-vn-red text-white font-bold py-2.5 hover:opacity-90 transition disabled:opacity-60"
      >
        {pending ? dict.common.loading : dict.auth.submit}
      </button>

      {state.ok && (
        <Link href={`/${locale}/auth/login`} className="block text-center text-sm underline text-diplomatic-navy">
          {dict.nav.login}
        </Link>
      )}
    </form>
  );
}
