import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Bell, Globe, MapPin, Shield, User, BookOpen, AlertTriangle, Clock3, LogOut, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Profile = {
  user_id: string;
  name: string;
  role: string;
  phone: string | null;
  safety_score: number;
  language: string;
  location_enabled: boolean;
};

const roleLabel: Record<string, string> = {
  woman: "Women Safety",
  parent: "Children Safety",
  senior: "Senior Citizen",
  admin: "Admin",
};

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Cyber Raksha" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ sos: 0, ai: 0, contacts: 0, hours: 15 });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").maybeSingle();
      if (data) setP(data as Profile);
      const [a, b, c] = await Promise.all([
        supabase.from("sos_alerts").select("id", { count: "exact", head: true }),
        supabase.from("ai_alerts").select("id", { count: "exact", head: true }),
        supabase.from("emergency_contacts").select("id", { count: "exact", head: true }),
      ]);
      setStats({ sos: a.count ?? 0, ai: b.count ?? 0, contacts: c.count ?? 0, hours: 15 });
    })();
  }, []);

  const save = async () => {
    if (!p) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name: p.name, phone: p.phone, language: p.language, location_enabled: p.location_enabled })
      .eq("user_id", p.user_id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!p) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Link to="/dashboard" className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your account and safety settings</p>
            </div>
          </div>
          <button type="button" className="relative grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[10px] text-white">3</span>
          </button>
        </header>

        <section className="mobile-shell p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="flex items-center gap-5">
              <div className="grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-violet-100 to-violet-50 text-6xl">👩</div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-4xl font-bold">{p.name}</h2>
                  <span className="hero-badge px-3 py-1 text-sm font-semibold text-primary">{roleLabel[p.role] ?? p.role}</span>
                </div>
                <div className="mt-3 space-y-2 text-lg text-muted-foreground">
                  <div>{p.phone ?? "+91 98765 43210"}</div>
                  <div>your-account@cyberraksha.app</div>
                </div>
              </div>
            </div>
            <div className="rounded-[1.75rem] bg-gradient-to-br from-violet-50 to-sky-50 p-6 text-right text-7xl">🛡️</div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.5rem] bg-background/80 p-5">
              <div className="flex items-center gap-5">
                <div className="relative grid h-28 w-28 place-items-center rounded-full border-[10px] border-violet-200 bg-white">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-primary">Safety Score</div>
                  <div className="mt-1 text-5xl font-bold text-primary">{p.safety_score}%</div>
                  <div className="font-semibold text-emerald-600">Very Good</div>
                  <p className="mt-2 text-sm text-muted-foreground">Great job! You're following good safety practices.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[1.5rem] bg-background/80 p-5">
              <div className="text-sm font-semibold text-primary">Location Status</div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                <MapPin className="h-4 w-4" /> {p.location_enabled ? "ON" : "OFF"}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Location sharing is active during emergencies.</p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="mobile-shell p-6">
            <h3 className="text-2xl font-bold">Account & Settings</h3>
            <div className="mt-5 space-y-3">
              {[
                { label: "Personal Information", sub: "View and update your personal details" },
                { label: "Language Selection", sub: "Choose your preferred language" },
                { label: "Change Password", sub: "Update your account password" },
                { label: "Privacy & Security", sub: "Manage your privacy and security settings" },
                { label: "Notification Settings", sub: "Customize your notification preferences" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-[1.25rem] border border-border bg-background/70 px-4 py-4">
                  <div>
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.sub}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-6">
            <section className="mobile-shell p-6">
              <div className="flex items-center gap-2 text-2xl font-bold"><Globe className="h-5 w-5 text-primary" /> Language</div>
              <div className="mt-5 space-y-3">
                <Select value={p.language} onValueChange={(v) => setP({ ...p, language: v })}>
                  <SelectTrigger className="h-12 rounded-[1.25rem] bg-background/70"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                  </SelectContent>
                </Select>
                <Input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} className="h-12 rounded-[1.25rem] bg-background/70" placeholder="Full name" />
                <Input value={p.phone ?? ""} onChange={(e) => setP({ ...p, phone: e.target.value })} className="h-12 rounded-[1.25rem] bg-background/70" placeholder="Phone number" />
                <Button onClick={save} disabled={saving} className="h-12 w-full rounded-[1.25rem]">{saving ? "Saving…" : "Save changes"}</Button>
              </div>
            </section>

            <section className="mobile-shell p-6">
              <div className="flex items-center justify-between"><div className="text-2xl font-bold text-emerald-700">Activity Summary</div><div className="text-sm text-muted-foreground">This Month</div></div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Stat icon={BookOpen} label="Quizzes Completed" value="12" />
                <Stat icon={AlertTriangle} label="Reports Submitted" value={String(stats.ai)} />
                <Stat icon={Shield} label="Safe Checks Done" value={String(stats.contacts + stats.sos)} />
                <Stat icon={Clock3} label="Time Spent Learning" value={`${stats.hours}h`} />
              </div>
            </section>
          </div>
        </div>

        <section className="mobile-shell p-6">
          <div className="text-2xl font-bold">Achievements</div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["🛡️", "Safety Starter", "Complete your first quiz"],
              ["✅", "Aware User", "Complete 5 quizzes"],
              ["⭐", "Reporter", "Submit your first report"],
              ["🎖️", "Safety Champion", "Score 80% or above"],
              ["🔒", "Cyber Expert", "Complete 20 quizzes"],
            ].map(([emoji, title, sub]) => (
              <div key={title} className="rounded-[1.5rem] border border-border bg-background/70 p-5 text-center">
                <div className="text-5xl">{emoji}</div>
                <div className="mt-3 font-bold">{title}</div>
                <div className="mt-2 text-sm text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>
        </section>

        <button type="button" onClick={logout} className="flex w-full items-center justify-between rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-5 text-left text-rose-600">
          <div>
            <div className="text-xl font-bold">Logout</div>
            <div className="text-sm text-rose-500">Securely logout from your account</div>
          </div>
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof BookOpen; label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border bg-background/70 p-4">
      <Icon className="h-5 w-5 text-primary" />
      <div className="mt-3 text-4xl font-bold">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
