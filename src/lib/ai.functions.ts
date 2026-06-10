import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const data = input as { text?: unknown };
    if (typeof data?.text !== "string" || data.text.trim().length === 0) {
      throw new Error("text is required");
    }
    if (data.text.length > 5000) throw new Error("text too long (max 5000 chars)");
    return { text: data.text };
  })
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this message:\n\n"""${data.text}"""` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (response.status === 429) {
      throw new Error("AI rate limit reached. Please wait a moment and try again.");
    }
    if (response.status === 402) {
      throw new Error("AI credits exhausted. Please add credits in your workspace billing.");
    }
    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`AI gateway error (${response.status}): ${errText.slice(0, 200)}`);
    }

    const payload = await response.json();
    const content: string = payload?.choices?.[0]?.message?.content ?? "";
    const parsed = safeJsonParse(content) ?? {
      isThreat: false,
      type: "other",
      severity: "low" as const,
      explanation: "Could not analyze message. Please review manually.",
      recommendation: "If you feel unsafe, contact a trusted person or local emergency services.",
    };

    // Persist alert
    const { supabase, userId } = context;
    await supabase.from("ai_alerts").insert({
      user_id: userId,
      alert_type: parsed.type,
      severity: parsed.severity,
      description: parsed.explanation,
      input_text: data.text.slice(0, 2000),
      ai_response: parsed as unknown as Record<string, unknown>,
    });

    return parsed;
  });
