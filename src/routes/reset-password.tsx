import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Cyber Raksha" },
      { name: "description", content: "Set a new password for your Cyber Raksha account." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase places the recovery token in the URL hash and the client
    // automatically processes it, firing PASSWORD_RECOVERY on the listener.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // Also accept an already-active session that landed here from email link.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. Please sign in.");
      await supabase.auth.signOut();
      navigate({ to: "/auth", replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mobile-shell p-6 sm:p-8">
        <div className="text-center">
          <div className="text-5xl">🛡️</div>
          <h1 className="mt-3 text-2xl font-extrabold">Reset Password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {ready ? "Choose a new password for your account." : "Verifying your reset link…"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label className="text-sm font-semibold">New Password</Label>
            <div className="mt-2 flex h-14 items-center rounded-[1.25rem] border border-border bg-accent/35 px-4">
              <Lock className="h-5 w-5 text-primary mr-3" />
              <Input
                type={show ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-[1.25rem] border-0 bg-transparent text-lg shadow-none"
                placeholder="New password"
                disabled={!ready}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="ml-3 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Confirm Password</Label>
            <div className="mt-2 flex h-14 items-center rounded-[1.25rem] border border-border bg-accent/35 px-4">
              <Lock className="h-5 w-5 text-primary mr-3" />
              <Input
                type={show ? "text" : "password"}
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="h-14 rounded-[1.25rem] border-0 bg-transparent text-lg shadow-none"
                placeholder="Confirm password"
                disabled={!ready}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading || !ready} className="h-14 w-full rounded-[1.25rem] text-lg font-bold">
            <Shield className="h-5 w-5" /> {loading ? "Updating…" : "Update Password"}
          </Button>

          <p className="text-center text-sm">
            <button type="button" onClick={() => navigate({ to: "/auth" })} className="text-primary font-medium">
              Back to Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
