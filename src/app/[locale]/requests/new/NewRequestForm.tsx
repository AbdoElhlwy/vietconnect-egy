"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createServiceRequest, RequestState } from "@/actions/requests";

const initialState: RequestState = { ok: false, message: "" };

const REQUEST_TYPES = [
  "GENERAL_INQUIRY", "LOST_PASSPORT", "LOST_DOCUMENTS", "RESIDENCY_ISSUE",
  "STUDENT_CASE", "DOCUMENT_ATTESTATION", "LEGAL_ASSISTANCE", "HEALTH_ISSUE",
  "UNIVERSITY_ISSUE", "BUSINESS_ISSUE", "TRADE_DISPUTE", "COMPLAINT", "SUGGESTION"
];

export function NewRequestForm({ locale, dict }: { locale: string; dict: any }) {
  const [state, formAction, pending] = useActionState(createServiceRequest, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-medium">نوع الطلب / Type</label>
        <select name="type" className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm">
          {REQUEST_TYPES.map((t) => <option key={t} value={t}>{t.replaceAll("_", " ")}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">الأولوية / Priority</label>
        <select name="priority" className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm">
          <option value="LOW">Low</option>
          <option value="NORMAL">Normal</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">الموضوع / Subject</label>
        <input name="subject" required minLength={3} className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium">الوصف / Description</label>
        <textarea name="description" required minLength={10} rows={5} className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>

      {state.message && (
        <p className={`text-sm ${state.ok ? "text-green-600" : "text-vn-red"}`}>{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-vn-red text-white font-bold py-2.5 hover:opacity-90 transition disabled:opacity-60"
      >
        {pending ? dict.common.loading : dict.common.submit}
      </button>

      {state.ok && (
        <Link href={`/${locale}/dashboard`} className="block text-center text-sm underline text-diplomatic-navy">
          {dict.nav.dashboard}
        </Link>
      )}
    </form>
  );
}
