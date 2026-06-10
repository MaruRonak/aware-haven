import { useState } from "react";
import { Gamepad2, Globe, Trophy, Brain, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThreatAnalyzer } from "@/components/ThreatAnalyzer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Question = { q: string; options: string[]; answer: number; tip: string };

const QUESTIONS: Question[] = [
  { q: "A stranger online asks for your school name and address. What do you do?", options: ["Share it — they seem nice", "Ignore and tell a parent", "Send them a photo too"], answer: 1, tip: "Never share personal details with strangers online." },
  { q: "Which password is safest?", options: ["password123", "MyDog2010", "k9$Run!Blue7"], answer: 2, tip: "Long passwords with letters, numbers and symbols are strongest." },
  { q: "You got a link saying 'You won an iPhone! Click here.' What do you do?", options: ["Click immediately", "Delete and tell an adult", "Forward to friends"], answer: 1, tip: "Unexpected prize links are almost always scams." },
  { q: "A new app wants access to your contacts, camera and location. What's smart?", options: ["Allow all", "Deny — only allow what's needed", "Uninstall later"], answer: 1, tip: "Only grant permissions an app actually needs." },
  { q: "Someone says something mean to you in a game chat. Best move?", options: ["Reply meanly back", "Block, report and tell a trusted adult", "Stay quiet and ignore forever"], answer: 1, tip: "Block + report + tell a trusted adult. You're not alone." },
];

function badge(score: number, total: number) {
  const pct = (score / total) * 100;
  if (pct >= 80) return { label: "🥇 Gold", color: "from-amber-500 to-yellow-500" };
  if (pct >= 60) return { label: "🥈 Silver", color: "from-slate-400 to-slate-300" };
  return { label: "🥉 Bronze", color: "from-orange-600 to-amber-700" };
}

export function ChildrenModule() {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const [savedBadge, setSavedBadge] = useState<string | null>(null);

  const [url, setUrl] = useState("");
  const [urlVerdict, setUrlVerdict] = useState<{ safe: boolean; reason: string } | null>(null);

  const checkUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const u = url.trim().toLowerCase();
    if (!u) return;
    const bad = ["bit.ly", "tinyurl", "free-", "win-", "prize", ".tk", ".ml", ".ga", "verify-", "login-"];
    const isBad = bad.some((b) => u.includes(b));
    setUrlVerdict({
      safe: !isBad,
      reason: isBad
        ? "This link uses patterns common in phishing. Don't click it — ask a parent."
        : "No obvious red flags. Still, only open links from people you trust.",
    });
  };

  const next = async () => {
    if (picked === null) return;
    const correct = picked === QUESTIONS[step].answer;
    const newScore = score + (correct ? 1 : 0);
    setScore(newScore);
    setPicked(null);
    if (step + 1 >= QUESTIONS.length) {
      setDone(true);
      const b = badge(newScore, QUESTIONS.length);
      setSavedBadge(b.label);
      const { data: u } = await supabase.auth.getUser();
      if (u.user) {
        await supabase.from("quiz_scores").insert({ user_id: u.user.id, score: newScore, total: QUESTIONS.length, topic: "online_safety" });
      }
      toast.success(`You earned ${b.label}!`);
    } else {
      setStep(step + 1);
    }
  };

  const restart = () => { setStep(0); setScore(0); setPicked(null); setDone(false); setSavedBadge(null); };

  const q = QUESTIONS[step];
  const showAnswer = picked !== null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Quiz */}
        <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 sm:p-8" style={{ background: "linear-gradient(135deg, color-mix(in oklab, oklch(0.78 0.18 75) 12%, transparent), transparent)" }}>
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-soft">
              <Gamepad2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Awareness Quiz</h3>
              <p className="text-xs text-muted-foreground">Earn a badge — Gold, Silver or Bronze.</p>
            </div>
          </div>

          {!done ? (
            <>
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Question {step + 1} of {QUESTIONS.length}</span>
                  <span>Score: {score}</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all" style={{ width: `${((step) / QUESTIONS.length) * 100}%` }} />
                </div>
              </div>

              <p className="mt-6 text-lg font-medium">{q.q}</p>
              <div className="mt-4 space-y-2">
                {q.options.map((opt, i) => {
                  const isPicked = picked === i;
                  const isCorrect = showAnswer && i === q.answer;
                  const isWrong = showAnswer && isPicked && i !== q.answer;
                  return (
                    <button
                      key={i}
                      onClick={() => !showAnswer && setPicked(i)}
                      disabled={showAnswer}
                      className={`w-full text-left rounded-xl border p-4 text-sm transition-all ${
                        isCorrect ? "border-emerald-500 bg-emerald-500/10" :
                        isWrong ? "border-rose-500 bg-rose-500/10" :
                        isPicked ? "border-primary bg-primary/5" :
                        "border-border hover:border-primary/40 hover:bg-accent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {showAnswer && isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        {showAnswer && isWrong && <XCircle className="h-4 w-4 text-rose-500" />}
                        <span>{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {showAnswer && (
                <div className="mt-4 rounded-xl bg-accent/50 p-3 text-sm">
                  <strong>Tip:</strong> {q.tip}
                </div>
              )}

              <Button className="mt-5 w-full" onClick={next} disabled={picked === null}>
                {step + 1 >= QUESTIONS.length ? "See result" : "Next question"}
              </Button>
            </>
          ) : (
            <div className="mt-8 text-center">
              <div className={`mx-auto inline-grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br ${badge(score, QUESTIONS.length).color} text-4xl shadow-glow`}>
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div className="mt-4 text-2xl font-bold">{savedBadge}</div>
              <p className="mt-1 text-muted-foreground">You scored {score} of {QUESTIONS.length}</p>
              <Button className="mt-6" onClick={restart}>Play again</Button>
            </div>
          )}
        </div>

        {/* Website checker */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-soft">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Website Checker</h3>
              <p className="text-xs text-muted-foreground">Paste a link before you click it.</p>
            </div>
          </div>
          <form onSubmit={checkUrl} className="mt-4 space-y-3">
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
            <Button type="submit" className="w-full" variant="secondary">
              <Sparkles className="h-4 w-4" /> Check this link
            </Button>
          </form>
          {urlVerdict && (
            <div className={`mt-4 rounded-xl border p-4 text-sm ${urlVerdict.safe ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300"}`}>
              <div className="flex items-center gap-2 font-semibold">
                {urlVerdict.safe ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {urlVerdict.safe ? "Looks okay" : "Suspicious link"}
              </div>
              <p className="mt-1 opacity-90">{urlVerdict.reason}</p>
            </div>
          )}

          <div className="mt-6 rounded-xl border border-dashed border-border p-4 text-sm">
            <div className="flex items-center gap-2 font-semibold"><Brain className="h-4 w-4 text-primary" /> AI Learning Assistant</div>
            <p className="mt-1 text-muted-foreground">Ask anything about online safety in the message checker below ↓</p>
          </div>
        </div>
      </div>

      <ThreatAnalyzer />
    </div>
  );
}
