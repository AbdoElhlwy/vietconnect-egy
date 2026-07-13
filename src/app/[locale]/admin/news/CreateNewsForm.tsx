"use client";

import { useActionState } from "react";
import { createNewsArticle, AdminActionState } from "@/actions/adminNews";

const initialState: AdminActionState = { ok: false, message: "" };

export function CreateNewsForm() {
  const [state, formAction, pending] = useActionState(createNewsArticle, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid sm:grid-cols-3 gap-2">
        <input name="titleAr" required minLength={3} placeholder="العنوان (عربي)" className="rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
        <input name="titleEn" required minLength={3} placeholder="Title (English)" className="rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
        <input name="titleVi" required minLength={3} placeholder="Tiêu đề (Tiếng Việt)" className="rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <textarea name="bodyAr" required minLength={10} rows={3} placeholder="المحتوى (عربي)" className="w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      <textarea name="bodyEn" required minLength={10} rows={3} placeholder="Content (English)" className="w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      <textarea name="bodyVi" required minLength={10} rows={3} placeholder="Nội dung (Tiếng Việt)" className="w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />

      {state.message && <p className={`text-sm ${state.ok ? "text-green-600" : "text-vn-red"}`}>{state.message}</p>}

      <button type="submit" disabled={pending} className="rounded-full bg-diplomatic-navy text-white text-sm font-semibold px-5 py-2 disabled:opacity-60">
        {pending ? "..." : "إنشاء كمسودة"}
      </button>
    </form>
  );
}
