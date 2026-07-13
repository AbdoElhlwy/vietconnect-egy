"use client";

import { useActionState } from "react";
import { createDirectoryPlace, AdminActionState } from "@/actions/adminDirectory";

const initialState: AdminActionState = { ok: false, message: "" };

const CATEGORIES = [
  "university", "hospital", "pharmacy", "police", "hotel", "restaurant",
  "translator", "lawyer", "shipping", "port", "airport", "bank", "telecom",
  "accommodation", "attraction"
];

export function CreatePlaceForm() {
  const [state, formAction, pending] = useActionState(createDirectoryPlace, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <select name="category" className="w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm">
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <div className="grid sm:grid-cols-3 gap-2">
        <input name="nameAr" required minLength={2} placeholder="الاسم (عربي)" className="rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
        <input name="nameEn" required minLength={2} placeholder="Name (English)" className="rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
        <input name="nameVi" required minLength={2} placeholder="Tên (Tiếng Việt)" className="rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <input name="address" placeholder="العنوان" className="w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      <input name="phone" placeholder="رقم الهاتف" className="w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />

      {state.message && <p className={`text-sm ${state.ok ? "text-green-600" : "text-vn-red"}`}>{state.message}</p>}

      <button type="submit" disabled={pending} className="rounded-full bg-diplomatic-navy text-white text-sm font-semibold px-5 py-2 disabled:opacity-60">
        {pending ? "..." : "إضافة"}
      </button>
    </form>
  );
}
