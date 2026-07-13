"use client";

import { useActionState } from "react";
import { translateText, TranslateState } from "@/actions/translate";

const initialState: TranslateState = { ok: false, message: "" };

export function TranslateForm() {
  const [state, formAction, pending] = useActionState(translateText, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <select name="sourceLang" className="rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm">
          <option value="ar">العربية</option>
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>
        <select name="targetLang" className="rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm">
          <option value="en">English</option>
          <option value="ar">العربية</option>
          <option value="vi">Tiếng Việt</option>
        </select>
      </div>
      <textarea name="sourceText" required rows={5} className="w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" placeholder="النص المراد ترجمته..." />
      <button type="submit" disabled={pending} className="rounded-full bg-diplomatic-navy text-white font-bold px-5 py-2.5 text-sm disabled:opacity-60">
        {pending ? "..." : "ترجمة"}
      </button>
      {state.translated && (
        <div className="rounded-lg bg-diplomatic-fog p-3 text-sm">{state.translated}</div>
      )}
    </form>
  );
}
