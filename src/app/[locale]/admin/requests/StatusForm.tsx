"use client";

import { useActionState } from "react";
import { updateRequestStatus, AdminActionState } from "@/actions/adminRequests";

const initialState: AdminActionState = { ok: false, message: "" };

const STATUSES = [
  "NEW", "UNDER_REVIEW", "NEEDS_DOCUMENTS", "ASSIGNED", "IN_PROGRESS",
  "RESOLVED", "CLOSED", "REJECTED", "ESCALATED"
];

export function StatusForm({ requestId, currentStatus }: { requestId: string; currentStatus: string }) {
  const [state, formAction, pending] = useActionState(updateRequestStatus, initialState);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="requestId" value={requestId} />
      <select name="status" defaultValue={currentStatus} className="rounded-lg border border-diplomatic-slate/30 px-2 py-1.5 text-xs">
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <button type="submit" disabled={pending} className="rounded-full bg-diplomatic-navy text-white text-xs font-semibold px-3 py-1.5 disabled:opacity-60">
        {pending ? "..." : "تحديث"}
      </button>
      {state.message && <span className={`text-xs ${state.ok ? "text-green-600" : "text-vn-red"}`}>{state.message}</span>}
    </form>
  );
}
