import { useState } from "react";
import { Search, ShieldCheck, ShieldAlert } from "lucide-react";

export default function ChildScamChecker() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<{
    safe: boolean;
    message: string;
  } | null>(null);

  const checkWebsite = () => {
    const website = url.toLowerCase();

    const suspiciousKeywords = [
      "free-money",
      "win-prize",
      "bit.ly",
      "tinyurl",
      ".tk",
      ".ml",
      "verify-account",
      "login-free",
      "otp"
    ];

    const isScam = suspiciousKeywords.some((word) =>
      website.includes(word)
    );

    if (isScam) {
      setResult({
        safe: false,
        message:
          "This website looks suspicious. Ask your parents before opening it.",
      });
    } else {
      setResult({
        safe: true,
        message:
          "No obvious danger found. Still be careful online.",
      });
    }
  };

  return (
    <div className="rounded-3xl border bg-card p-6">
      <h2 className="mb-4 text-xl font-bold">
        Scam Website Checker
      </h2>

      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full rounded-xl border p-3"
      />

      <button
        onClick={checkWebsite}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary p-3 text-white"
      >
        <Search className="h-4 w-4" />
        Check Website
      </button>

      {result && (
        <div
          className={`mt-4 rounded-xl p-4 ${
            result.safe
              ? "bg-green-50"
              : "bg-red-50"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {result.safe ? (
              <ShieldCheck className="h-5 w-5 text-green-600" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-red-600" />
            )}

            {result.safe ? "Safe" : "Danger"}
          </div>

          <p className="mt-2 text-sm">
            {result.message}
          </p>
        </div>
      )}
    </div>
  );
}