"use client";

import { useActionState } from "react";
import { submitComplaint, ComplaintState } from "@/actions/complaints";

const initialState: ComplaintState = { ok: false, message: "" };

export function ComplaintForm() {
  const [state, formAction, pending] = useActionState(submitComplaint, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-medium">النوع / Category</label>
        <select name="category" className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm">
          <option value="complaint">شكوى / Complaint</option>
          <option value="suggestion">اقتراح / Suggestion</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">الموضوع / Subject</label>
        <input name="subject" required minLength={3} className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium">التفاصيل / Details</label>
        <textarea name="description" required minLength={10} rows={5} className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isAnonymous" id="anon" />
        <label htmlFor="anon">إرسال بشكل مجهول / Submit anonymously</label>
      </div>

      {state.message && (
        <p className={`text-sm ${state.ok ? "text-green-600" : "text-vn-red"}`}>
          {state.message} {state.refNumber && `— Ref: ${state.refNumber}`}
        </p>
      )}

      <button type="submit" disabled={pending} className="w-full rounded-full bg-diplomatic-navy text-white font-bold py-2.5 disabled:opacity-60">
        {pending ? "..." : "إرسال"}
      </button>
    </form>
  );
}
