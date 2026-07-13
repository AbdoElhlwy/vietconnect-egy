"use client";

import { useActionState } from "react";
import { openThread, MessageState } from "@/actions/messages";

const initialState: MessageState = { ok: false, message: "" };

export function NewThreadForm() {
  const [state, formAction, pending] = useActionState(openThread, initialState);

  return (
    <form action={formAction} className="flex gap-2">
      <input name="subject" required minLength={3} placeholder="موضوع المحادثة" className="flex-1 rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      <button type="submit" disabled={pending} className="rounded-full bg-diplomatic-navy text-white text-sm font-semibold px-4 disabled:opacity-60">
        {pending ? "..." : "فتح"}
      </button>
      {state.message && <span className="text-xs text-green-600 self-center">{state.message}</span>}
    </form>
  );
}
