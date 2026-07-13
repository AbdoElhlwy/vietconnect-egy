"use client";

import { useActionState } from "react";
import { bookAppointment, BookingState } from "@/actions/appointments";

const initialState: BookingState = { ok: false, message: "" };

export function BookingForm({ slotId, full }: { slotId: string; full: boolean }) {
  const [state, formAction, pending] = useActionState(bookAppointment, initialState);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="slotId" value={slotId} />
      <input type="hidden" name="serviceName" value="Consular Appointment" />
      <button
        type="submit"
        disabled={pending || full}
        className="rounded-full bg-diplomatic-navy text-white text-xs font-semibold px-4 py-2 disabled:opacity-40"
      >
        {full ? "مكتمل" : pending ? "..." : "حجز"}
      </button>
      {state.message && <span className={`text-xs ${state.ok ? "text-green-600" : "text-vn-red"}`}>{state.message}</span>}
    </form>
  );
}
