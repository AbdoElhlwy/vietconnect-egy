"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteDocument } from "@/actions/documents";
import { toast } from "sonner";

export function DeleteButton({ documentId }: { documentId: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("هل أنت متأكد من حذف هذا المستند؟")) return;
    startTransition(async () => {
      await deleteDocument(documentId);
      toast.success("تم حذف المستند");
    });
  }

  return (
    <button onClick={handleDelete} disabled={pending} className="text-vn-red disabled:opacity-40" aria-label="Delete document">
      <Trash2 size={16} />
    </button>
  );
}
