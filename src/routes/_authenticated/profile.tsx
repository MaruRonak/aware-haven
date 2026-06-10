import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, User, Globe, MapPin, Shield, Activity } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Cyber Raksha" }] }),
  component: Profile,
});

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

function Profile() {
  const [p, setP] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ sos: 0, ai: 0, contacts: 0 });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("*").maybeSingle();
      if (data) setP(data as Profile);
      const [a, b, c] = await Promise.all([
        supabase.from("sos_alerts").select("id", { count: "exact", head: true }),
        supabase.from("ai_alerts").select("id", { count: "exact", head: true }),
        supabase.from("emergency_contacts").select("id", { count: "exact", head: true }),
      ]);
      setStats({ sos: a.count ?? 0, ai: b.count ?? 0, contacts: c.count ?? 0 });
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

  if (!p) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  const score = p.safety_score;
  const scoreColor = score >= 75 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/85 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto max-w-3xl flex h-16 items-center gap-3 px-4">
          <Button asChild variant="ghost" size="icon"><Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="font-semibold text-lg">Your profile</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Identity card */}
        <div className="rounded-3xl border border-border p-6 sm:p-8" style={{ background: "var(--gradient-hero)" }}>
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground text-2xl font-bold shadow-glow">
              {p.name?.[0]?.toUpperCase() ?? <User className="h-6 w-6" />}
            </div>
            <div>
              <div className="text-xl font-bold">{p.name || "Unnamed user"}</div>
              <div className="text-sm text-muted-foreground">{roleLabel[p.role] ?? p.role}</div>
            </div>
            <div className={`ml-auto text-right ${scoreColor}`}>
              <div className="text-3xl font-bold">{score}%</div>
              <div className="text-xs">Safety Score</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "SOS alerts", value: stats.sos, icon: Shield },
            { label: "AI checks", value: stats.ai, icon: Activity },
            { label: "Contacts", value: stats.contacts, icon: User },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
              <s.icon className="mx-auto h-4 w-4 text-muted-foreground" />
              <div className="mt-2 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Editable fields */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-semibold">Account details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={p.phone ?? ""} onChange={(e) => setP({ ...p, phone: e.target.value })} className="mt-1.5" placeholder="+91 …" />
            </div>
            <div>
              <Label htmlFor="lang"><Globe className="inline h-3.5 w-3.5 mr-1" /> Language</Label>
              <Select value={p.language} onValueChange={(v) => setP({ ...p, language: v })}>
                <SelectTrigger id="lang" className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Role</Label>
              <div className="mt-1.5 flex items-center justify-between rounded-md border border-input px-3 h-9 text-sm">
                <span>{roleLabel[p.role] ?? p.role}</span>
                <Link to="/role-select" className="text-xs text-primary hover:underline">Change</Link>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-primary mt-0.5" />
              <div>
                <div className="font-medium text-sm">Location sharing</div>
                <div className="text-xs text-muted-foreground">Used only during SOS. No background tracking.</div>
              </div>
            </div>
            <Switch checked={p.location_enabled} onCheckedChange={(v) => setP({ ...p, location_enabled: v })} />
          </div>

          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </main>
    </div>
  );
}
