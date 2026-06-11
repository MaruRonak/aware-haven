import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, ImageIcon, FileVideo, FileText, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/report")({
  head: () => ({ meta: [{ title: "Report & Complaint — Cyber Raksha" }] }),
  component: ReportPage,
});

const categories = [
  "Harassment / Abuse",
  "Online Scam / Fraud",
  "Hate Speech",
  "Inappropriate Content",
  "Cyberbullying",
  "Other Issue",
] as const;

function ReportPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("Harassment / Abuse");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [locationType, setLocationType] = useState<"online" | "offline">("online");
  const [anonymous, setAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!description.trim()) {
      toast.error("Please describe the issue.");
      return;
    }
    setSubmitting(true);
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      await supabase.from("ai_alerts").insert({
        user_id: user.user.id,
        alert_type: "report",
        severity: "medium",
        description: `${category} report submitted`,
        input_text: JSON.stringify({ category, description, date, time, locationType, anonymous }),
      });
    }
    setSubmitting(false);
    setDescription("");
    toast.success("Report submitted successfully.");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link to="/dashboard" className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Report & Complaint</h1>
              <p className="text-sm text-muted-foreground">Report an incident or issue. Your voice helps make everyone safer.</p>
            </div>
          </div>
          <div className="hero-badge px-4 py-3 text-sm font-semibold text-emerald-700">
            <BadgeCheck className="mr-2 inline h-4 w-4" /> Your identity is 100% confidential
          </div>
        </header>

        <section className="mobile-shell p-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="rounded-[1.5rem] bg-gradient-to-br from-violet-50 to-indigo-50 p-5">
              <h2 className="text-3xl font-bold text-foreground">See something wrong? Report it.</h2>
              <p className="mt-3 text-sm text-muted-foreground">Your report helps us take action and create a safer digital and physical world for everyone.</p>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] border border-border bg-background/70 p-5 text-sm">
              <div className="flex items-center gap-2 text-primary font-semibold"><ShieldCheck className="h-4 w-4" /> Quick & Easy</div>
              <div className="flex items-center gap-2 text-primary font-semibold"><ShieldCheck className="h-4 w-4" /> Confidential</div>
              <div className="flex items-center gap-2 text-primary font-semibold"><ShieldCheck className="h-4 w-4" /> Action Oriented</div>
            </div>
          </div>

          <div className="mt-8 space-y-7">
            <div>
              <h3 className="text-xl font-semibold">1. What do you want to report?</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-[1.25rem] border px-4 py-5 text-sm font-medium transition-colors ${category === item ? "border-primary bg-primary/5 text-primary" : "border-border bg-background hover:border-primary/40"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">2. Tell us more about the issue</h3>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={7} maxLength={1000} className="mt-4 rounded-[1.5rem] bg-background/80" placeholder="Provide a detailed description of the incident…" />
              <div className="mt-2 text-right text-xs text-muted-foreground">{description.length}/1000</div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">3. Add evidence (optional)</h3>
              <p className="mt-1 text-sm text-muted-foreground">Upload screenshots, images, or documents that support your report.</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Upload Image", icon: ImageIcon },
                  { label: "Upload Screenshot", icon: ImageIcon },
                  { label: "Upload Video", icon: FileVideo },
                  { label: "Other File", icon: FileText },
                ].map((item) => (
                  <button key={item.label} type="button" className="rounded-[1.25rem] border border-border bg-background px-4 py-4 text-left text-sm font-medium hover:border-primary/40">
                    <item.icon className="mb-3 h-5 w-5 text-primary" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-xl font-semibold">4. When did it happen?</h3>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-4 h-12 rounded-[1.25rem] bg-background/80" />
              </div>
              <div className="pt-8 sm:pt-10">
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-12 rounded-[1.25rem] bg-background/80" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold">5. Where did it happen?</h3>
              <div className="mt-4 space-y-3 text-sm">
                <label className="flex items-center gap-3"><input type="radio" checked={locationType === "online"} onChange={() => setLocationType("online")} /> Online (Website / App / Social Media)</label>
                <label className="flex items-center gap-3"><input type="radio" checked={locationType === "offline"} onChange={() => setLocationType("offline")} /> Offline (Physical Location)</label>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-border bg-background/70 p-5 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold">Report anonymously?</div>
                <p className="mt-1 text-sm text-muted-foreground">Your identity will be hidden. We will not share your personal details with anyone.</p>
              </div>
              <button type="button" onClick={() => setAnonymous((v) => !v)} className={`relative h-8 w-14 rounded-full transition-colors ${anonymous ? "bg-primary" : "bg-muted"}`}>
                <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${anonymous ? "left-7" : "left-1"}`} />
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-5">
              <div className="text-2xl font-bold text-emerald-800">What happens next?</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4 text-sm text-emerald-900">
                <div>We receive your report</div>
                <div>Our team reviews it</div>
                <div>Appropriate action is taken</div>
                <div>You are notified (if needed)</div>
              </div>
            </div>

            <Button onClick={submit} disabled={submitting} className="h-14 w-full rounded-[1.5rem] text-lg">
              <Send className="h-5 w-5" /> {submitting ? "Submitting…" : "Submit Report"}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
