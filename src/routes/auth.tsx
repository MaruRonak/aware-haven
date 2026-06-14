import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { EyeOff, Lock, Mail, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login — Cyber Raksha" },
      { name: "description", content: "Sign in or create your Cyber Raksha account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<"woman" | "parent" | "senior">("woman");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
  }, [navigate]);


  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, role },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to Cyber Raksha.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/dashboard`,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_30px_90px_-30px_rgba(86,76,255,0.28)]">
        <div className="grid min-h-[calc(100vh-2rem)] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative hidden overflow-hidden lg:block" style={{ background: "linear-gradient(180deg, oklch(0.97 0.02 245), oklch(0.9 0.06 250), oklch(0.48 0.21 274))" }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.9),transparent_22%),radial-gradient(circle_at_70%_75%,rgba(255,255,255,0.22),transparent_30%)]" />
            <div className="relative flex h-full flex-col justify-between p-10 text-slate-900">
              <div className="hero-badge ml-auto inline-flex w-fit items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700">
                🌐 English
              </div>
              <div>
                <div className="text-8xl">🛡️</div>
                <h1 className="mt-6 text-6xl font-extrabold leading-none tracking-tight">CYBER RAKSHA</h1>
                <p className="mt-4 text-3xl font-medium text-slate-700">Protect. Educate. Empower.</p>
                <div className="mt-5 h-1 w-20 rounded-full bg-primary" />
                <p className="mt-8 text-4xl font-bold">Your Safety, Our Priority</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/20 p-5 text-white backdrop-blur">
                <div className="text-sm font-semibold">Together for a Safer Tomorrow</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-10">
            <div className="w-full max-w-xl">
              <div className="text-center lg:hidden">
                <div className="text-6xl">🛡️</div>
                <h1 className="mt-4 text-4xl font-extrabold">CYBER RAKSHA</h1>
                <p className="mt-2 text-lg text-muted-foreground">Protect. Educate. Empower.</p>
              </div>

              <div className="mobile-shell mt-6 p-5 sm:p-7">
                <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
                  <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-accent/60 p-1">
                    <TabsTrigger value="signin" className="rounded-2xl">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-2xl">Create Account</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="mt-6">
                    <form onSubmit={handleEmail} className="space-y-4">
                      <Field label="Email / Mobile Number" icon={<Mail className="h-5 w-5" />}>
                        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 rounded-[1.25rem] border-0 bg-transparent text-lg shadow-none" placeholder="Email / Mobile Number" />
                      </Field>
                      <Field label="Password" icon={<Lock className="h-5 w-5" />} right={<EyeOff className="h-5 w-5 text-muted-foreground" />}>
                        <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-14 rounded-[1.25rem] border-0 bg-transparent text-lg shadow-none" placeholder="Password" />
                      </Field>

                      <div className="flex items-center justify-between px-1 text-sm">
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Remember me</label>
                        <button type="button" className="text-primary">Forgot Password?</button>
                      </div>

                      <Button type="submit" disabled={loading} className="h-14 w-full rounded-[1.25rem] text-xl font-bold">
                        <Shield className="h-5 w-5" /> {loading ? "Logging in…" : "Login"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-6">
                    <form onSubmit={handleEmail} className="space-y-4">
                      <Field label="Full Name" icon={<User className="h-5 w-5" />}>
                        <Input required value={name} onChange={(e) => setName(e.target.value)} className="h-14 rounded-[1.25rem] border-0 bg-transparent text-lg shadow-none" placeholder="Priya Patel" />
                      </Field>
                      <div>
                        <Label htmlFor="role" className="text-sm font-semibold">Safety Module</Label>
                        <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                          <SelectTrigger id="role" className="mt-2 h-14 rounded-[1.25rem] bg-accent/50 text-base shadow-none">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="woman">Women Safety</SelectItem>
                            <SelectItem value="parent">Children Safety</SelectItem>
                            <SelectItem value="senior">Senior Citizen Safety</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Field label="Email" icon={<Mail className="h-5 w-5" />}>
                        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 rounded-[1.25rem] border-0 bg-transparent text-lg shadow-none" placeholder="you@example.com" />
                      </Field>
                      <Field label="Password" icon={<Lock className="h-5 w-5" />}>
                        <Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-14 rounded-[1.25rem] border-0 bg-transparent text-lg shadow-none" placeholder="Create password" />
                      </Field>
                      <Button type="submit" disabled={loading} className="h-14 w-full rounded-[1.25rem] text-lg font-bold">
                        {loading ? "Creating account…" : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground">OR</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <Button variant="outline" type="button" disabled={loading} onClick={handleGoogle} className="h-14 w-full rounded-[1.25rem] text-lg">
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
                  Continue with Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, right, children }: { label: string; icon: React.ReactNode; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 block text-sm font-semibold">{label}</Label>
      <div className="flex h-14 items-center rounded-[1.25rem] border border-border bg-accent/35 px-4">
        <div className="mr-3 text-primary">{icon}</div>
        <div className="min-w-0 flex-1">{children}</div>
        {right ? <div className="ml-3">{right}</div> : null}
      </div>
    </div>
  );
}
