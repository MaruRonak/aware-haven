import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Siren, MapPin, Brain, PhoneCall, HeartPulse, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeSphere AI — AI-powered safety for women, children & seniors" },
      { name: "description", content: "An AI-powered safety ecosystem with SOS alerts, live location, threat detection and emergency contacts — built for women, children and seniors." },
      { property: "og:title", content: "SafeSphere AI" },
      { property: "og:description", content: "AI-powered SOS, threat detection and emergency response." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Siren,      title: "One-tap SOS",         desc: "Big, hard-to-miss panic button shares your live GPS with trusted contacts instantly." },
  { icon: Brain,      title: "AI threat detection", desc: "Paste any message and our AI flags harassment, scams and predatory behavior in seconds." },
  { icon: MapPin,     title: "Live location share", desc: "Real-time map shows where you are so help can find you, fast." },
  { icon: PhoneCall,  title: "Fake call escape",    desc: "Trigger a realistic incoming call to slip out of unsafe situations." },
  { icon: HeartPulse, title: "Senior wellness",     desc: "Medicine reminders, vitals tracking and scam-message detection for elders." },
  { icon: Shield,     title: "Privacy first",       desc: "End-to-end encrypted storage. Your data is yours — never sold, never shared." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-4 w-4" />
            </div>
            <span className="text-lg">SafeSphere<span className="gradient-text">AI</span></span>
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
        <div className="container mx-auto max-w-6xl px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-powered safety, built for everyone
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-foreground">
              Help is one tap away.
              <br />
              <span className="gradient-text">SafeSphere AI</span> has your back.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              A complete safety ecosystem for women, children and seniors — SOS alerts, live location sharing, AI threat detection and instant emergency response.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-7 text-base">
                <Link to="/auth">
                  Create your safety profile <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7 text-base">
                <a href="#features">See how it works</a>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4 text-center sm:gap-8">
              {[
                { v: "<2s", l: "SOS dispatch" },
                { v: "24/7", l: "AI monitoring" },
                { v: "100%", l: "Private by design" },
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

      {/* Features */}
      <section id="features" className="container mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to feel safe</h2>
          <p className="mt-4 text-muted-foreground">Six built-in tools that work together, online and offline.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:shadow-soft hover:-translate-y-1">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
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
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary to-primary-glow p-10 text-center sm:p-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">Your safety, simplified.</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Join SafeSphere AI free. Add your trusted contacts and feel protected in under 2 minutes.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-7 text-base">
            <Link to="/auth">Get started — it's free</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>SafeSphere AI © {new Date().getFullYear()}</span>
          </div>
          <span>Not a replacement for emergency services. In a real emergency, dial your local emergency number.</span>
        </div>
      </footer>
    </div>
  );
}
