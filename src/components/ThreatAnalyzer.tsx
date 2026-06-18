import { useState } from "react";
import { Brain, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { analyzeThreat, type ThreatAnalysis } from "@/lib/ai.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const sevStyles: Record<ThreatAnalysis["severity"], string> = {
  low: "bg-success/15 text-success border-success/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  high: "bg-destructive/15 text-destructive border-destructive/30",
  critical: "bg-destructive text-destructive-foreground border-destructive",
};

export function ThreatAnalyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ThreatAnalysis | null>(null);
  const analyze = useServerFn(analyzeThreat);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await analyze({ data: { text } });
      setResult(r);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="analyzer" className="scroll-mt-24 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <Brain className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI threat analyzer</h3>
          <p className="text-xs text-muted-foreground">Paste a suspicious message — get an instant safety verdict.</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a message you received…"
          rows={4}
          maxLength={5000}
          required
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{text.length}/5000</span>
          <Button type="submit" disabled={loading || !text.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Brain className="h-4 w-4" />}
            Analyze
          </Button>
        </div>
      </form>

      {result && (
        <div className={`mt-5 rounded-xl border p-4 ${sevStyles[result.severity]}`}>
          <div className="flex items-center gap-2 font-semibold">
            {result.isThreat ? <ShieldAlert className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            <span className="capitalize">{result.severity} risk · {result.type}</span>
          </div>
          <p className="mt-2 text-sm opacity-90">{result.explanation}</p>
          <div className="mt-3 rounded-lg bg-background/60 p-3 text-sm text-foreground">
            <strong className="text-xs uppercase tracking-wide text-muted-foreground">Recommended action</strong>
            <p className="mt-1">{result.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
