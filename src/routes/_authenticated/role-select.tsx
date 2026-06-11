import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shield, ArrowRight, Globe } from "lucide-react";
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
    desc: "Tools and support to help women stay safe, strong and empowered.",
    tone: "from-violet-50 to-fuchsia-50",
    accent: "text-primary",
  },
  {
    key: "parent",
    emoji: "🧒",
    title: "Children Safety",
    desc: "Learn, play and explore safely in the digital world with awareness and guidance.",
    tone: "from-orange-50 to-amber-50",
    accent: "text-orange-600",
  },
  {
    key: "senior",
    emoji: "👴",
    title: "Senior Citizen Safety",
    desc: "Digital safety, fraud protection and support for a secure and worry-free life.",
    tone: "from-emerald-50 to-teal-50",
    accent: "text-emerald-700",
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
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_90px_-30px_rgba(86,76,255,0.2)]">
        <div className="relative p-6 sm:p-10">
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-r from-primary via-primary-glow to-sky-400" />
          <div className="hero-badge ml-auto flex w-fit items-center gap-2 px-4 py-3 text-sm font-semibold text-muted-foreground">
            <Globe className="h-4 w-4" /> English
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <div className="text-7xl">🛡️</div>
            <h1 className="mt-4 text-5xl font-extrabold tracking-tight">CYBER RAKSHA</h1>
            <p className="mt-2 text-2xl text-muted-foreground">Protect. Educate. Empower.</p>
            <h2 className="mt-8 text-5xl font-extrabold leading-tight">Choose Your <span className="gradient-text">Safety Module</span></h2>
            <p className="mt-4 text-lg text-muted-foreground">Select the option that best describes you</p>
          </div>

          <div className="mx-auto mt-10 max-w-4xl space-y-5">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => pick(r.key)}
                disabled={saving !== null}
                className={`w-full overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br ${r.tone} p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60`}
              >
                <div className="grid items-center gap-4 sm:grid-cols-[160px_1fr_84px]">
                  <div className="grid h-36 w-36 place-items-center rounded-full bg-white/70 text-7xl shadow-inner">{r.emoji}</div>
                  <div>
                    <div className={`text-4xl font-extrabold ${r.accent}`}>{r.title}</div>
                    <p className="mt-3 max-w-xl text-xl leading-relaxed text-foreground/80">{r.desc}</p>
                  </div>
                  <div className="grid justify-center sm:justify-end">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-primary shadow-sm">
                      <ArrowRight className="h-8 w-8" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mx-auto mt-8 max-w-4xl rounded-[1.75rem] border border-border bg-gradient-to-r from-violet-50 to-sky-50 px-5 py-5">
            <div className="flex items-center gap-3 text-lg font-semibold"><Shield className="h-5 w-5 text-primary" /> Your safety is our priority.</div>
            <p className="mt-1 text-sm text-muted-foreground">Cyber Raksha is here to protect, guide and empower you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
