import { AIProvider, AIMessage } from "./provider";
import { MockAIProvider } from "./mockProvider";

/**
 * Minimal adapters for external providers. They only activate when the
 * corresponding API key is present in the environment; otherwise the
 * MockAIProvider is used so the platform works fully offline / without keys.
 */
class OpenAIProvider implements AIProvider {
  name = "openai";
  async chat(messages: AIMessage[]): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({ model: "gpt-4o-mini", messages })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }
}

class AnthropicProvider implements AIProvider {
  name = "anthropic";
  async chat(messages: AIMessage[]): Promise<string> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        messages: messages.filter((m) => m.role !== "system")
      })
    });
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  }
}

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER || "mock";

  if (provider === "openai" && process.env.OPENAI_API_KEY) return new OpenAIProvider();
  if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) return new AnthropicProvider();
  // Gemini adapter can be added the same way once needed.

  return new MockAIProvider();
}
