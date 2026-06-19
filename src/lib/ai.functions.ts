import { createServerFn } from "@tanstack/react-start";

export type ThreatAnalysis = {
  isThreat: boolean;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  explanation: string;
  recommendation: string;
};

const SYSTEM_PROMPT = `You are SafeSphere AI, a safety analyst for women's safety, child internet safety, and senior welfare.
Analyze the user's text/message for: cyberbullying, harassment, scams, predatory behavior, threats, or coercion.
Respond ONLY with strict JSON matching this shape:
{
  "isThreat": boolean,
  "type": "harassment" | "cyberbullying" | "scam" | "threat" | "predator" | "safe" | "other",
  "severity": "low" | "medium" | "high" | "critical",
  "explanation": string (1-2 sentences, plain language),
  "recommendation": string (1-2 concrete safety actions)
}
No markdown, no code fences, no commentary outside JSON.`;

function safeJsonParse(text: string): ThreatAnalysis | null {
  try {
    const cleaned = text
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    const obj = JSON.parse(cleaned);
    if (typeof obj.isThreat !== "boolean") return null;
    return obj as ThreatAnalysis;
  } catch {
    return null;
  }
}
export const analyzeThreat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const data = input as { text?: unknown };

    if (typeof data?.text !== "string" || data.text.trim().length === 0) {
      throw new Error("text is required");
    }

    if (data.text.length > 5000) {
      throw new Error("text too long (max 5000 chars)");
    }

    return { text: data.text };
  })
  .handler(async ({ data }) => {
    const text = data.text.toLowerCase();

    const isThreat =
      text.includes("otp") ||
      text.includes("bank") ||
      text.includes("kyc") ||
      text.includes("winner") ||
      text.includes("prize") ||
      text.includes("click here") ||
      text.includes("urgent") ||
      text.includes("verify");

    return {
      isThreat,
      type: isThreat ? "scam" : "safe",
      severity: isThreat ? "high" : "low",
      explanation: isThreat
        ? "This message contains words commonly used in phishing or scam attempts."
        : "No suspicious scam indicators were detected in this message.",
      recommendation: isThreat
        ? "Do not click links, share OTPs, or provide personal information."
        : "The message appears safe, but always remain cautious online.",
    };
  });