import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SOSButton } from "@/components/SOSButton";
import { MapView } from "@/components/MapView";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { ThreatAnalyzer } from "@/components/ThreatAnalyzer";
import { FakeCallButton } from "@/components/FakeCallButton";
import { RecentAlerts } from "@/components/RecentAlerts";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SafeSphere AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("there");
  const [external, setExternal] = useState<{ latitude: number | null; longitude: number | null }>();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("name").maybeSingle();
      if (data?.name) setName(data.name.split(" ")[0]);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <span className="font-semibold">SafeSphere<span className="gradient-text">AI</span></span>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Hi {name}, you're protected.</h1>
          <p className="mt-1 text-muted-foreground">Tap SOS to instantly alert your trusted contacts.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
            <SOSButton onSent={setExternal} />
            <div className="mt-6 w-full max-w-xs">
              <FakeCallButton />
            </div>
          </div>
          <MapView external={external} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ThreatAnalyzer />
          <RecentAlerts />
        </div>

        <EmergencyContacts />
      </main>
    </div>
  );
}
