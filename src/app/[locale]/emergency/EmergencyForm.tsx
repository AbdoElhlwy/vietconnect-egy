"use client";

import { useActionState } from "react";
import { submitEmergency, EmergencyState } from "@/actions/emergency";
import { CaptchaField } from "@/components/CaptchaField";

const initialState: EmergencyState = { ok: false, message: "" };

const TYPES = ["MEDICAL", "LOST_DOCUMENTS", "ACCIDENT", "DETENTION", "SECURITY", "VIOLENCE_THREAT", "MISSING_STUDENT", "OTHER"];

export function EmergencyForm({ locale }: { locale: string }) {
  const [state, formAction, pending] = useActionState(submitEmergency, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="text-sm font-medium">نوع الحالة / Case Type</label>
        <select name="type" className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm">
          {TYPES.map((t) => <option key={t} value={t}>{t.replaceAll("_", " ")}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">وصف الحالة / Description</label>
        <textarea name="description" required minLength={5} rows={4} className="mt-1 w-full rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="locationConsent" id="loc" />
        <label htmlFor="loc">أوافق على مشاركة موقعي الحالي مع فريق الدعم</label>
      </div>

      <CaptchaField />

      {state.message && (
        <p className={`text-sm ${state.ok ? "text-green-600" : "text-vn-red"}`}>
          {state.message} {state.refNumber && `— Ref: ${state.refNumber}`}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-vn-red text-white font-bold py-3 hover:opacity-90 transition disabled:opacity-60"
      >
        {pending ? "جارٍ الإرسال..." : "إرسال بلاغ SOS"}
      </button>
    </form>
  );
}
