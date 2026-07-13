"use client";

import { useActionState } from "react";
import { changePassword, SettingsState } from "@/actions/settings";

const initialState: SettingsState = { ok: false, message: "" };

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input name="currentPassword" type="password" required minLength={8} placeholder="كلمة المرور الحالية" className="w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      <input name="newPassword" type="password" required minLength={8} placeholder="كلمة المرور الجديدة" className="w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      {state.message && <p className={`text-sm ${state.ok ? "text-green-600" : "text-vn-red"}`}>{state.message}</p>}
      <button type="submit" disabled={pending} className="rounded-full bg-diplomatic-navy text-white text-sm font-semibold px-5 py-2 disabled:opacity-60">
        {pending ? "..." : "تحديث كلمة المرور"}
      </button>
    </form>
  );
}
