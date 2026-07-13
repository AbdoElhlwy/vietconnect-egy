export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIProvider {
  name: string;
  chat(messages: AIMessage[], locale: string): Promise<string>;
}

export const ASSISTANT_SYSTEM_NOTICE =
  "VietConnect AI is an informational assistant only. It does not provide final legal advice, " +
  "does not guarantee approvals, and does not represent the Embassy officially.";
