"use client";

import { useActionState } from "react";
import { uploadDocument, DocumentState } from "@/actions/documents";

const initialState: DocumentState = { ok: false, message: "" };

export function UploadForm({ types }: { types: { id: string; nameAr: string }[] }) {
  const [state, formAction, pending] = useActionState(uploadDocument, initialState);

  return (
    <form action={formAction} className="space-y-3" encType="multipart/form-data">
      <select name="typeId" required className="w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm">
        {types.map((t) => <option key={t.id} value={t.id}>{t.nameAr}</option>)}
      </select>
      <input type="file" name="file" required accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx" className="w-full text-sm" />
      {state.message && <p className={`text-sm ${state.ok ? "text-green-600" : "text-vn-red"}`}>{state.message}</p>}
      <button type="submit" disabled={pending} className="rounded-full bg-diplomatic-navy text-white text-sm font-semibold px-5 py-2 disabled:opacity-60">
        {pending ? "جارٍ الرفع..." : "رفع المستند"}
      </button>
    </form>
  );
}
