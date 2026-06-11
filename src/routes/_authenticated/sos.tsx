import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, PhoneCall, Siren, MapPinned, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { MapView } from "@/components/MapView";
import { SOSButton } from "@/components/SOSButton";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { RecentAlerts } from "@/components/RecentAlerts";

export const Route = createFileRoute("/_authenticated/sos")({
  head: () => ({ meta: [{ title: "SOS Emergency — Cyber Raksha" }] }),
  component: SosPage,
});

function SosPage() {
  const [external, setExternal] = useState<{ latitude: number | null; longitude: number | null }>();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto max-w-6xl px-4 py-6 space-y-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">SOS Emergency</h1>
              <p className="text-sm text-muted-foreground">Help is just one tap away</p>
            </div>
          </div>
          <a href="tel:112" className="hero-badge inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-rose-600">
            <PhoneCall className="h-4 w-4" /> Call 112
          </a>
        </header>

        <section className="mobile-shell p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.2fr_0.8fr] lg:items-center">
            <div className="space-y-5">
              {[
                { icon: MapPinned, title: "Share Location", desc: "Send your live location" },
                { icon: Siren, title: "Send Alert", desc: "Instant alert to your contacts" },
                { icon: PhoneCall, title: "Call Emergency", desc: "Call police, ambulance or fire service" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-rose-50 text-rose-600"><item.icon className="h-6 w-6" /></div>
                  <div>
                    <div className="font-semibold text-rose-600">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <SOSButton onSent={setExternal} />
              <div>
                <div className="text-3xl font-bold text-rose-600">Tap to Send SOS</div>
                <p className="mt-2 text-sm text-muted-foreground">Your location and alert will be shared with emergency contacts.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-rose-100 bg-rose-50 p-4">
                <div className="flex items-center gap-3 text-rose-600"><ShieldCheck className="h-5 w-5" /> <span className="font-semibold">You are Protected</span></div>
                <p className="mt-2 text-sm text-muted-foreground">We're here to help keep you safe.</p>
              </div>
              <div className="rounded-[1.5rem] border border-border bg-gradient-to-br from-violet-50 to-pink-50 p-4 text-right text-7xl">🙍‍♀️</div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <MapView external={external} />
          <EmergencyContacts />
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Police", phone: "100", tone: "from-sky-50 to-indigo-50", color: "text-sky-700" },
            { label: "Ambulance", phone: "108", tone: "from-emerald-50 to-lime-50", color: "text-emerald-700" },
            { label: "Fire Service", phone: "101", tone: "from-orange-50 to-rose-50", color: "text-orange-700" },
          ].map((item) => (
            <a key={item.label} href={`tel:${item.phone}`} className={`soft-tile soft-tile-hover block bg-gradient-to-br ${item.tone} p-5`}>
              <div className={`text-2xl font-bold ${item.color}`}>{item.label}</div>
              <div className="mt-2 text-sm text-muted-foreground">Emergency assistance</div>
              <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-foreground">
                <PhoneCall className="h-4 w-4" /> Call {item.phone}
              </div>
            </a>
          ))}
        </section>

        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          <div className="flex items-center gap-2 font-semibold"><ShieldAlert className="h-4 w-4" /> Safety Tip</div>
          <p className="mt-1 text-amber-800">Stay calm and alert. Your location is shared only during SOS or when you choose to share it.</p>
        </div>

        <RecentAlerts />
      </div>
    </div>
  );
}
