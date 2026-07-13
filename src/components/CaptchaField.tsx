"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

export function CaptchaField() {
  const [challenge, setChallenge] = useState<{ question: string; token: string } | null>(null);

  async function loadChallenge() {
    const res = await fetch("/api/captcha");
    setChallenge(await res.json());
  }

  useEffect(() => {
    loadChallenge();
  }, []);

  return (
    <div>
      <label className="text-sm font-medium">تحقق أمني / Security Check: {challenge?.question ?? "..."}</label>
      <div className="mt-1 flex gap-2">
        <input
          name="captchaAnswer"
          type="number"
          required
          className="flex-1 rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm"
        />
        <input type="hidden" name="captchaToken" value={challenge?.token ?? ""} />
        <button
          type="button"
          onClick={loadChallenge}
          className="rounded-lg border border-diplomatic-slate/30 px-3 text-diplomatic-navy/60"
          aria-label="Refresh captcha"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}
