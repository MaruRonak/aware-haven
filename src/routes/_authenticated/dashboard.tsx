import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Shield, MessageSquareWarning, Bot, BookOpen, PhoneCall, ChevronRight, Siren, Bell, UserRound } from "lucide-react";
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
  const [score, setScore] = useState(75);
  const [external, setExternal] = useState<{ latitude: number | null; longitude: number | null }>();

  useEffect(() => {
  const selectedRole = localStorage.getItem("role");

  if (!selectedRole) {
    navigate({
      to: "/role-select",
      replace: true,
    });
    return;
  }

  setRole(selectedRole);
}, [navigate]);

  if (!role) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading dashboard…</div>;

  const accent = role === "parent" ? "amber" : role === "senior" ? "emerald" : "rose";

  return (
    <div className="min-h-screen bg-background pb-24">
      <DashboardHeader accent={accent as "rose" | "amber" | "emerald"} />
      <main className="container mx-auto max-w-6xl px-4 -mt-2 space-y-6 pb-8">
        {role === "woman" && (
          <>
            <section className="mobile-shell p-5 sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
                <div className="rounded-[1.75rem] bg-background/80 p-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="flex items-center gap-4">
                      <div className="relative grid h-28 w-28 place-items-center rounded-full border-[10px] border-violet-200 bg-white">
                        <Shield className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-primary">SAFETY SCORE</div>
                        <div className="mt-1 text-5xl font-bold text-primary">{score}%</div>
                        <div className="text-emerald-600 font-semibold">Safe</div>
                        <p className="mt-2 max-w-xs text-sm text-muted-foreground">Keep following safety practices to improve.</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between rounded-[1.5rem] bg-gradient-to-br from-violet-50 to-pink-50 p-5">
                      <div>
                        <div className="text-sm font-semibold text-primary">LOCATION STATUS</div>
                        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                          <MapPin className="h-4 w-4" /> ON
                        </div>
                        <p className="mt-3 text-sm text-muted-foreground">Live location is active and ready to share.</p>
                      </div>
                      <div className="mt-4 text-right text-5xl floaty">🛡️</div>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[1.75rem] p-5 text-white" style={{ background: "linear-gradient(135deg, oklch(0.69 0.2 6), oklch(0.61 0.24 340))" }}>
                  <div className="grid h-full gap-4 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                    <div>
                      <div className="text-sm font-medium text-white/85">In Emergency?</div>
                      <h2 className="mt-2 text-4xl font-bold leading-none">Press SOS</h2>
                      <p className="mt-3 text-sm text-white/85">Your location will be shared with your contacts and police.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-4">
                      <SOSButton onSent={setExternal} />
                      <div className="grid w-full grid-cols-3 gap-2 text-center text-xs text-white/90">
                        <Link to="/sos" className="rounded-2xl bg-white/10 px-3 py-3 backdrop-blur">Share Location</Link>
                        <a href="tel:100" className="rounded-2xl bg-white/10 px-3 py-3 backdrop-blur">Call Police</a>
                        <a href="#contacts" className="rounded-2xl bg-white/10 px-3 py-3 backdrop-blur">Alert Contacts</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { to: "/report", title: "Report Harassment", desc: "Report any harassment or inappropriate behavior", icon: MessageSquareWarning, tone: "from-rose-50 to-pink-50", iconTone: "bg-rose-100 text-rose-600" },
                { to: "#analyzer", title: "Check Suspicious Message", desc: "Analyze messages and detect possible scams or threats", icon: MessageSquareWarning, tone: "from-sky-50 to-indigo-50", iconTone: "bg-sky-100 text-sky-600" },
                { to: "#analyzer", title: "AI Safety Assistant", desc: "Get instant help and guidance from our AI assistant", icon: Bot, tone: "from-emerald-50 to-lime-50", iconTone: "bg-emerald-100 text-emerald-600" },
                { to: "/sos", title: "Safe Route Finder", desc: "Find the safest routes to your destination", icon: MapPin, tone: "from-orange-50 to-amber-50", iconTone: "bg-orange-100 text-orange-600" },
                { to: "#contacts", title: "Trusted Contacts", desc: "Manage your emergency contacts and family", icon: PhoneCall, tone: "from-violet-50 to-fuchsia-50", iconTone: "bg-violet-100 text-violet-600" },
                { to: "/alerts-history", title: "SOS History", desc: "View all past SOS alerts and statuses", icon: BookOpen, tone: "from-yellow-50 to-orange-50", iconTone: "bg-yellow-100 text-yellow-600" },
              ].map((card) => (
                <Link key={card.title} to={card.to as never} className={`soft-tile soft-tile-hover block bg-gradient-to-br ${card.tone} p-5`}>
                  <div className={`grid h-14 w-14 place-items-center rounded-2xl ${card.iconTone}`}>
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-bold leading-tight">{card.title}</h3>
                      <p className="mt-3 text-sm text-muted-foreground">{card.desc}</p>
                    </div>
                    <ChevronRight className="mt-1 h-5 w-5 text-primary" />
                  </div>
                </Link>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <RecentAlerts />
              <EmergencyContacts />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <MapView external={external} />
              <div className="space-y-6">
                <ThreatAnalyzer />
                <FakeCallButton latestLocation={external} />
              </div>
            </section>
          </>
        )}

        {role === "parent" && <ChildrenModule />}
        {role === "senior" && <SeniorModule />}
      </main>

      <nav className="fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[calc(100%-1.5rem)] max-w-xl items-center justify-around rounded-[2rem] border border-border bg-card/92 px-3 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] backdrop-blur">
        <Link to="/dashboard" className="flex min-w-0 flex-col items-center gap-1 rounded-2xl px-4 py-2 text-primary">
          <Shield className="h-5 w-5" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <button type="button" className="relative flex min-w-0 flex-col items-center gap-1 rounded-2xl px-4 py-2 text-muted-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-3 top-0 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] text-white">3</span>
          <span className="text-xs font-medium">Alerts</span>
        </button>
        <Link to="/sos" className="-mt-8 grid h-20 w-20 place-items-center rounded-full text-white shadow-xl" style={{ background: "var(--gradient-danger)" }}>
          <div className="flex flex-col items-center gap-1">
            <Siren className="h-7 w-7" />
            <span className="text-xs font-bold">SOS</span>
          </div>
        </Link>
        <Link to="/dashboard" className="flex min-w-0 flex-col items-center gap-1 rounded-2xl px-4 py-2 text-muted-foreground">
          <Bot className="h-5 w-5" />
          <span className="text-xs font-medium">AI</span>
        </Link>
        <Link to="/profile" className="flex min-w-0 flex-col items-center gap-1 rounded-2xl px-4 py-2 text-muted-foreground">
          <UserRound className="h-5 w-5" />
          <span className="text-xs font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
