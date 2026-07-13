"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { deleteAccount } from "@/actions/settings";

export function DeleteAccountButton({ locale }: { locale: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("هل أنت متأكد؟ سيتم إلغاء تفعيل حسابك فورًا. Are you sure? Your account will be deactivated immediately.")) return;

    startTransition(async () => {
      await deleteAccount();
      await signOut({ redirect: false });
      router.push(`/${locale}`);
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="rounded-full bg-vn-red text-white text-sm font-semibold px-5 py-2 disabled:opacity-60"
    >
      {pending ? "..." : "حذف الحساب"}
    </button>
  );
}
