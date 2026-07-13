"use client";

import { useActionState, useRef } from "react";
import { sendMessage, MessageState } from "@/actions/messages";

const initialState: MessageState = { ok: false, message: "" };

export function SendMessageForm({ threadId }: { threadId: string }) {
  const [, formAction, pending] = useActionState(sendMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await formAction(fd);
        formRef.current?.reset();
      }}
      className="flex gap-2"
    >
      <input type="hidden" name="threadId" value={threadId} />
      <input name="body" required className="flex-1 rounded-lg border border-diplomatic-slate/30 px-3 py-2 text-sm" placeholder="اكتب رسالتك..." />
      <button type="submit" disabled={pending} className="rounded-full bg-vn-red text-white text-sm font-semibold px-4 disabled:opacity-60">
        إرسال
      </button>
    </form>
  );
}
