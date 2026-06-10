import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SOSButton } from "@/components/SOSButton";
import { MapView } from "@/components/MapView";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { ThreatAnalyzer } from "@/components/ThreatAnalyzer";
import { FakeCallButton } from "@/components/FakeCallButton";
import { RecentAlerts } from "@/components/RecentAlerts";
import { ChildrenModule } from "@/components/ChildrenModule";
import { SeniorModule } from "@/components/SeniorModule";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Cyber Raksha" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState("there");
  const [external, setExternal] = useState<{ latitude: number | null; longitude: number | null }>();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("profiles").select("name, role").maybeSingle();
      if (!data?.role) {
        navigate({ to: "/role-select", replace: true });
        return;
      }
      setRole(data.role);
      if (data.name) setName(data.name.split(" ")[0]);
    })();
  }, [navigate]);

  if (!role) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading dashboard…</div>;

  const accent = role === "parent" ? "amber" : role === "senior" ? "emerald" : "rose";
  const greeting =
    role === "parent" ? "Let's keep learning, stay safe online." :
    role === "senior" ? "We've got your back against scams." :
    "Tap SOS to instantly alert your trusted contacts.";

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader accent={accent as "rose" | "amber" | "emerald"} />
      <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Hi {name},{" "}
            <span className="gradient-text">
              {role === "parent" ? "ready to play?" : role === "senior" ? "you're protected." : "you're protected."}
            </span>
          </h1>
          <p className="mt-1 text-muted-foreground">{greeting}</p>
        </div>

        {role === "woman" && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-border p-8 flex flex-col items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
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
          </>
        )}

        {role === "parent" && <ChildrenModule />}
        {role === "senior" && <SeniorModule />}
      </main>
    </div>
  );
}
