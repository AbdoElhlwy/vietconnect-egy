"use client";

import { useTransition, useActionState } from "react";
import { toggleUserApproval, toggleUserActive, assignRole, AdminActionState } from "@/actions/adminUsers";

const initialState: AdminActionState = { ok: false, message: "" };

type UserData = {
  id: string;
  fullName: string;
  email: string;
  accountType: string;
  isApproved: boolean;
  isActive: boolean;
  roles: string[];
};

export function UserRow({ user, allRoles }: { user: UserData; allRoles: string[] }) {
  const [pending, startTransition] = useTransition();
  const [state, formAction] = useActionState(assignRole, initialState);

  return (
    <div className="card-diplomatic">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">{user.fullName} <span className="text-diplomatic-navy/50 font-normal">— {user.email}</span></p>
          <p className="text-xs text-diplomatic-navy/50 mt-1">
            {user.accountType} · {user.roles.join(", ") || "no roles"} ·{" "}
            <span className={user.isApproved ? "text-green-600" : "text-amber-600"}>{user.isApproved ? "Approved" : "Pending"}</span> ·{" "}
            <span className={user.isActive ? "text-green-600" : "text-vn-red"}>{user.isActive ? "Active" : "Suspended"}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={pending}
            onClick={() => startTransition(() => toggleUserApproval(user.id, !user.isApproved))}
            className="rounded-full border border-diplomatic-slate/30 text-xs font-semibold px-3 py-1.5 disabled:opacity-40"
          >
            {user.isApproved ? "إلغاء الموافقة" : "الموافقة"}
          </button>
          <button
            disabled={pending}
            onClick={() => startTransition(() => toggleUserActive(user.id, !user.isActive))}
            className="rounded-full border border-diplomatic-slate/30 text-xs font-semibold px-3 py-1.5 disabled:opacity-40"
          >
            {user.isActive ? "تعليق الحساب" : "تفعيل الحساب"}
          </button>

          <form action={formAction} className="flex items-center gap-1">
            <input type="hidden" name="userId" value={user.id} />
            <select name="roleKey" className="rounded-lg border border-diplomatic-slate/30 px-2 py-1.5 text-xs">
              {allRoles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <button type="submit" className="rounded-full bg-diplomatic-navy text-white text-xs font-semibold px-3 py-1.5">
              إسناد دور
            </button>
          </form>
        </div>
      </div>
      {state.message && <p className="text-xs text-green-600 mt-2">{state.message}</p>}
    </div>
  );
}
