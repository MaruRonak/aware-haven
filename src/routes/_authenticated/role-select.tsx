import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shield, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/role-select")({
  head: () => ({ meta: [{ title: "Choose your role — Cyber Raksha" }] }),
  component: RoleSelect,
});

const roles = [
  {
    key: "woman",
    emoji: "👩",
    title: "Women Safety",
    desc: "SOS button, report harassment, message safety, AI assistant.",
    grad: "from-rose-500 to-pink-500",
    bg: "from-rose-500/15 to-pink-500/5",
  },
  {
    key: "parent",
    emoji: "🧒",
    title: "Children Safety",
    desc: "Awareness quizzes, website & message checker, learning badges.",
    grad: "from-amber-500 to-orange-500",
    bg: "from-amber-500/15 to-orange-500/5",
  },
  {
    key: "senior",
    emoji: "👴",
    title: "Senior Citizen",
    desc: "Scam call checker, password safety, learning videos, file complaint.",
    grad: "from-emerald-500 to-teal-500",
    bg: "from-emerald-500/15 to-teal-500/5",
  },
] as const;

function RoleSelect() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState<string | null>(null);

  const pick = async (role: "woman" | "parent" | "senior") => {
    setSaving(role);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return navigate({ to: "/auth" });
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("user_id", u.user.id);
    if (error) {
      toast.error(error.message);
      setSaving(null);
      return;
    }
    toast.success("Role updated");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen surface-glow">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <Shield className="h-4 w-4 text-primary" /> Cyber Raksha
        </Link>
        <div className="mt-6 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Who are we protecting today?</h1>
          <p className="mt-3 text-muted-foreground">Pick a role to unlock a dashboard tailored just for you. You can switch anytime.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => pick(r.key)}
              disabled={saving !== null}
              className={`group relative text-left overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${r.bg} p-7 transition-all hover:-translate-y-1 hover:shadow-glow disabled:opacity-60 disabled:hover:translate-y-0`}
            >
              <div className={`inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${r.grad} text-3xl shadow-soft`}>
                {r.emoji}
              </div>
              <h3 className="mt-5 text-xl font-bold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                {saving === r.key ? "Saving…" : "Continue"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
