import crypto from "crypto";

/**
 * Lightweight, self-hosted CAPTCHA for sensitive forms (registration, emergency submission).
 * Avoids depending on a third-party CAPTCHA provider/API key for this MVP, while still blocking
 * naive bots: a simple arithmetic challenge is generated server-side and its expected answer is
 * embedded in a signed, tamper-proof token (HMAC with AUTH_SECRET) rather than trusted from the
 * client.
 *
 * For production hardening against sophisticated bots, swap this for hCaptcha/Turnstile/reCAPTCHA
 * by replacing generateCaptcha()/verifyCaptcha() — calling forms only depend on these two
 * functions and the `question` / `token` / `answer` field names.
 */

const SECRET = process.env.AUTH_SECRET || "dev-fallback-secret-change-me";

export function generateCaptcha() {
  const a = Math.floor(Math.random() * 8) + 1;
  const b = Math.floor(Math.random() * 8) + 1;
  const answer = a + b;
  const expiresAt = Date.now() + 5 * 60 * 1000;
  const payload = `${answer}:${expiresAt}`;
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  const token = Buffer.from(`${payload}:${signature}`).toString("base64url");

  return { question: `${a} + ${b} = ?`, token };
}

export function verifyCaptcha(token: string, userAnswer: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [answer, expiresAt, signature] = decoded.split(":");
    const payload = `${answer}:${expiresAt}`;
    const expectedSignature = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");

    if (signature !== expectedSignature) return false;
    if (Date.now() > Number(expiresAt)) return false;

    return Number(userAnswer) === Number(answer);
  } catch {
    return false;
  }
}
