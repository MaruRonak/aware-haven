import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth-debug")({
  head: () => ({ meta: [{ title: "Auth Debug — Cyber Raksha" }] }),
  component: AuthDebugPage,
});

type LogKind = "info" | "log" | "warn" | "error" | "net";
interface LogEntry {
  t: string;
  kind: LogKind;
  msg: string;
}

function AuthDebugPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<string>("(unknown)");
  const [env, setEnv] = useState<{ url?: string; key?: string }>({});
  const logRef = useRef<HTMLDivElement>(null);

  const push = (kind: LogKind, ...parts: unknown[]) => {
    const msg = parts
      .map((p) => {
        if (p instanceof Error) return `${p.name}: ${p.message}\n${p.stack ?? ""}`;
        if (typeof p === "string") return p;
        try {
          return JSON.stringify(p, null, 2);
        } catch {
          return String(p);
        }
      })
      .join(" ");
    setLogs((prev) => [...prev, { t: new Date().toLocaleTimeString(), kind, msg }]);
  };

  // Intercept console + fetch only on this page
  useEffect(() => {
    setEnv({
      url: import.meta.env.VITE_SUPABASE_URL,
      key: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.slice(0, 12) + "…",
    });

    supabase.auth.getSession().then(({ data, error }) => {
      if (error) push("error", "getSession error:", error.message);
      setSession(data.session ? `signed in as ${data.session.user.email}` : "no session");
    });

    const origLog = console.log;
    const origWarn = console.warn;
    const origErr = console.error;
    console.log = (...a) => { push("log", ...a); origLog(...a); };
    console.warn = (...a) => { push("warn", ...a); origWarn(...a); };
    console.error = (...a) => { push("error", ...a); origErr(...a); };

    const origFetch = window.fetch;
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [input, init] = args;
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
      const method = init?.method || (typeof input !== "string" && !(input instanceof URL) ? input.method : "GET");
      const start = performance.now();
      try {
        const res = await origFetch(...args);
        const ms = Math.round(performance.now() - start);
        if (url.includes("supabase") || url.includes("/auth/") || url.includes("oauth")) {
          let body = "";
          try {
            const clone = res.clone();
            const text = await clone.text();
            body = text.length > 500 ? text.slice(0, 500) + "…" : text;
          } catch { /* ignore */ }
          push(res.ok ? "net" : "error", `${method} ${url} → ${res.status} (${ms}ms)${body ? "\n" + body : ""}`);
        }
        return res;
      } catch (err) {
        const ms = Math.round(performance.now() - start);
        push("error", `${method} ${url} → THREW (${ms}ms):`, err);
        throw err;
      }
    };

    const onErr = (e: ErrorEvent) => push("error", "window.error:", e.message, e.error);
    const onRej = (e: PromiseRejectionEvent) => push("error", "unhandledrejection:", e.reason);
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);

    return () => {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origErr;
      window.fetch = origFetch;
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [logs]);

  const testEmail = async () => {
    push("info", `Testing email sign-in for ${email || "(empty)"}…`);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) push("error", "signInWithPassword error:", { name: error.name, status: error.status, message: error.message });
      else push("info", "signInWithPassword OK:", { user: data.user?.email, hasSession: !!data.session });
    } catch (err) {
      push("error", "signInWithPassword threw:", err);
    }
  };

  const testGoogle = async () => {
    push("info", "Testing Google OAuth (managed via lovable broker)…");
    push("info", `redirect_uri = ${window.location.origin}/dashboard`);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/dashboard`,
      });
      push("info", "lovable.auth.signInWithOAuth result:", result);
    } catch (err) {
      push("error", "Google OAuth threw:", err);
    }
  };

  const testDirectGoogle = async () => {
    push("info", "Testing Google OAuth (direct supabase, bypassing broker)…");
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) push("error", "supabase.signInWithOAuth error:", error);
      else push("info", "supabase.signInWithOAuth OK:", data);
    } catch (err) {
      push("error", "supabase.signInWithOAuth threw:", err);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) push("error", "signOut error:", error.message);
    else push("info", "signed out");
    setSession("no session");
  };

  const copyLogs = async () => {
    const text = logs.map((l) => `[${l.t}] ${l.kind.toUpperCase()} ${l.msg}`).join("\n");
    await navigator.clipboard.writeText(text);
    push("info", "logs copied to clipboard");
  };

  const color = (k: LogKind) =>
    k === "error" ? "text-red-400" : k === "warn" ? "text-amber-400" : k === "net" ? "text-cyan-400" : k === "info" ? "text-emerald-400" : "text-slate-300";

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-3xl space-y-5">
        <header>
          <h1 className="text-2xl font-bold">Auth Debug</h1>
          <p className="text-sm text-muted-foreground">Runs real sign-in calls and captures console + network errors live.</p>
        </header>

        <section className="rounded-2xl border border-border bg-card p-4 text-sm">
          <div className="grid gap-1">
            <div><span className="text-muted-foreground">Origin:</span> {typeof window !== "undefined" ? window.location.origin : "—"}</div>
            <div><span className="text-muted-foreground">VITE_SUPABASE_URL:</span> {env.url || <span className="text-red-400">missing</span>}</div>
            <div><span className="text-muted-foreground">VITE_SUPABASE_PUBLISHABLE_KEY:</span> {env.key || <span className="text-red-400">missing</span>}</div>
            <div><span className="text-muted-foreground">Session:</span> {session}</div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h2 className="font-semibold">Email / Password</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={testEmail}>Test sign-in</Button>
            <Button variant="outline" onClick={signOut}>Sign out</Button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <h2 className="font-semibold">Google OAuth</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={testGoogle}>Test Google (managed broker)</Button>
            <Button variant="outline" onClick={testDirectGoogle}>Test Google (direct Supabase)</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Managed broker only works on *.lovable.app or a connected custom domain — not on http://localhost.
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Live log</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setLogs([])}>Clear</Button>
              <Button size="sm" variant="outline" onClick={copyLogs}>Copy</Button>
            </div>
          </div>
          <div ref={logRef} className="h-80 overflow-auto rounded-xl bg-slate-950 p-3 font-mono text-xs leading-relaxed">
            {logs.length === 0 ? (
              <div className="text-slate-500">No log entries yet. Run a test above.</div>
            ) : (
              logs.map((l, i) => (
                <div key={i} className={color(l.kind)}>
                  <span className="text-slate-500">[{l.t}] {l.kind.toUpperCase()}</span>
                  <pre className="whitespace-pre-wrap break-all">{l.msg}</pre>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
