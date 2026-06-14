import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shield, Siren, MapPin, Brain, PhoneCall, HeartPulse, ArrowRight, Sparkles, Users, BookOpen, Lock } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cyber Raksha — Smart cybersecurity for women, children & seniors" },
      { name: "description", content: "Cyber Raksha is a human-centric cybersecurity platform with SOS alerts, scam detection, awareness tools and live location for women, children and seniors." },
      { property: "og:title", content: "Cyber Raksha" },
      { property: "og:description", content: "Awareness · Prevention · Reporting — privacy-first cybersecurity for everyone." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Siren,      title: "One-tap SOS",          desc: "A panic button that shares your live GPS with trusted contacts in under 2 seconds.", color: "from-rose-500 to-pink-500" },
  { icon: Brain,      title: "AI scam detection",    desc: "Paste any message, call number or link — our AI flags scams, threats and predators instantly.", color: "from-indigo-500 to-violet-500" },
  { icon: BookOpen,   title: "Awareness quizzes",    desc: "Gamified safety learning for children with gold, silver and bronze badges.", color: "from-amber-500 to-orange-500" },
  { icon: PhoneCall,  title: "Scam call checker",    desc: "Senior-friendly tool to verify suspicious calls before you pick up.", color: "from-emerald-500 to-teal-500" },
  { icon: MapPin,     title: "Privacy-first GPS",    desc: "Location shared only with consent. No background tracking. Ever.", color: "from-sky-500 to-cyan-500" },
  { icon: Lock,       title: "Password safety",      desc: "Check leaked passwords and learn habits that keep your accounts safe.", color: "from-fuchsia-500 to-purple-500" },
];

const audiences = [
  { emoji: "👩", title: "Women", desc: "SOS, harassment reporting, message safety, AI assistant", grad: "from-rose-500/20 to-pink-500/10" },
  { emoji: "🧒", title: "Children", desc: "Awareness quizzes, website checker, learning badges", grad: "from-amber-500/20 to-orange-500/10" },
  { emoji: "👴", title: "Seniors", desc: "Scam call & password checker, learning videos, complaints", grad: "from-emerald-500/20 to-teal-500/10" },
];

function Landing() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);
  return (
    <div className="min-h-screen bg-background">

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-lg">Cyber<span className="gradient-text">Raksha</span></span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/auth" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Sign in
            </Link>
            <Button asChild>
              <Link to="/auth">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden surface-glow">
        <div className="container mx-auto max-w-6xl px-4 pt-20 pb-20 sm:pt-28 sm:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Smart cybersecurity · Awareness · Prevention · Reporting
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Safety is a right —
              <br />
              <span className="gradient-text">Cyber Raksha</span> makes it simple.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              A human-centric cybersecurity platform built for <strong className="text-foreground">women</strong>, <strong className="text-foreground">children</strong>, and <strong className="text-foreground">senior citizens</strong> — with real-time SOS, AI scam detection, and privacy-first technology.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-7 text-base">
                <Link to="/auth">
                  Create your safety profile <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
                <a href="#audiences">Who is it for?</a>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4 text-center sm:gap-8">
              {[
                { v: "<2s", l: "SOS dispatch" },
                { v: "3", l: "User groups" },
                { v: "100%", l: "Privacy-first" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
                  <div className="text-2xl font-bold gradient-text sm:text-3xl">{s.v}</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audiences */}
      <section id="audiences" className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">3 groups. 3 targeted solutions.</h2>
          <p className="mt-4 text-muted-foreground">Every feature is shaped around the real needs of the people using it.</p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {audiences.map((a) => (
            <div key={a.title} className={`relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br ${a.grad} p-8 transition-all hover:-translate-y-1 hover:shadow-glow`}>
              <div className="text-5xl">{a.emoji}</div>
              <h3 className="mt-4 text-2xl font-bold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto max-w-6xl px-4 pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to feel safe online & offline</h2>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-soft hover:-translate-y-1">
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-soft`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-6xl px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary via-primary to-primary-glow p-10 text-center sm:p-16">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="relative">
            <Users className="mx-auto h-10 w-10 text-primary-foreground" />
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-primary-foreground">Your safety, simplified.</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
              Join Cyber Raksha free. Pick your role, add trusted contacts and feel protected in under 2 minutes.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-7 text-base">
              <Link to="/auth">Get started — it's free</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>Cyber Raksha © {new Date().getFullYear()} — Awareness · Prevention · Reporting</span>
          </div>
          <span>Not a replacement for emergency services. In a real emergency, dial 112.</span>
        </div>
      </footer>
    </div>
  );
}
