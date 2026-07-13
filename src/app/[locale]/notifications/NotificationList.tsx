"use client";

import { useTransition } from "react";
import { markNotificationRead, markAllNotificationsRead } from "@/actions/notifications";

type Item = { id: string; isRead: boolean; titleAr: string; bodyAr: string };

export function NotificationList({ items }: { items: Item[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={() => startTransition(() => markAllNotificationsRead())}
          disabled={pending}
          className="text-xs font-semibold text-diplomatic-navy underline disabled:opacity-40"
        >
          تحديد الكل كمقروء
        </button>
      </div>
      <div className="space-y-2">
        {items.map((n) => (
          <div key={n.id} className={`card-diplomatic flex items-start justify-between gap-4 ${!n.isRead ? "border-vn-red/40" : ""}`}>
            <div>
              <p className="font-semibold text-sm">{n.titleAr}</p>
              <p className="text-xs text-diplomatic-navy/60 mt-1">{n.bodyAr}</p>
            </div>
            {!n.isRead && (
              <button
                onClick={() => startTransition(() => markNotificationRead(n.id))}
                disabled={pending}
                className="text-xs font-semibold text-vn-red whitespace-nowrap disabled:opacity-40"
              >
                تحديد كمقروء
              </button>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-diplomatic-navy/50 text-sm">لا توجد إشعارات.</p>}
      </div>
    </div>
  );
}
