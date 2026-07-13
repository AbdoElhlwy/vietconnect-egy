"use client";

import { useTransition } from "react";
import { setDirectoryVerification } from "@/actions/adminDirectory";

export function VerifyButtons({ placeId, currentStatus }: { placeId: string; currentStatus: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      {currentStatus !== "VERIFIED" && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => setDirectoryVerification(placeId, "VERIFIED"))}
          className="rounded-full bg-green-600 text-white text-xs font-semibold px-3 py-1.5 disabled:opacity-40"
        >
          توثيق
        </button>
      )}
      {currentStatus !== "REJECTED" && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => setDirectoryVerification(placeId, "REJECTED"))}
          className="rounded-full border border-diplomatic-slate/30 text-xs font-semibold px-3 py-1.5 disabled:opacity-40"
        >
          رفض
        </button>
      )}
    </div>
  );
}
