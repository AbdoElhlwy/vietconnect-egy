import { describe, it, expect } from "vitest";
import { z } from "zod";

const registerSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8)
});

describe("Registration form validation", () => {
  it("accepts valid input", () => {
    const result = registerSchema.safeParse({ fullName: "Nguyen Van A", email: "a@example.com", password: "Str0ngPass" });
    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = registerSchema.safeParse({ fullName: "Nguyen Van A", email: "a@example.com", password: "123" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({ fullName: "Nguyen Van A", email: "not-an-email", password: "Str0ngPass" });
    expect(result.success).toBe(false);
  });
});
