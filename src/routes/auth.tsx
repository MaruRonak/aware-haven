import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, Shield, User } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
const [showPassword, setShowPassword] = useState(false);
const [forgotMode, setForgotMode] = useState(false);
const [otpSent, setOtpSent] = useState(false);
const [otpVerified, setOtpVerified] = useState(false);
const [showLoginPassword, setShowLoginPassword] = useState(false);
const [showSignupPassword, setShowSignupPassword] = useState(false);
const [otp, setOtp] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [timer, setTimer] = useState(30);
const [canResend, setCanResend] = useState(false);

  useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    if (data.session) navigate({ to: "/dashboard", replace: true });
  });
}, [navigate]);

useEffect(() => {
  if (!otpSent || canResend) return;

  const interval = setInterval(() => {
    setTimer((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        setCanResend(true);
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [otpSent, canResend]);

  const handleEmail = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const endpoint =
      mode === "signup"
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    localStorage.setItem("token", data.token);

    toast.success(data.message);

    navigate({
      to: "/role-select",
    });
  } catch (err) {
    toast.error(
      err instanceof Error
        ? err.message
        : "Authentication failed"
    );
  } finally {
    setLoading(false);
  }
};
  const sendResetOTP = async () => {
  const response = await fetch(
    "http://localhost:5000/api/auth/forgot-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  const data = await response.json();

  if (response.ok) {
  toast.success("OTP sent to email");

  setOtpSent(true);

  setCanResend(false);
  setTimer(30);
} else {
    toast.error(data.message);
  }
};

const verifyOTP = async () => {
  const response = await fetch(
    "http://localhost:5000/api/auth/verify-reset-otp",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    toast.success("OTP verified");
    setOtpVerified(true);
  } else {
    toast.error(data.message);
  }
};

const handleResetPassword = async () => {
  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  const response = await fetch(
    "http://localhost:5000/api/auth/reset-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
        password: newPassword,
      }),
    }
  );

  const data = await response.json();

if (response.ok) {
  toast.success("Password reset successful");

  setForgotMode(false);
  setOtpSent(false);
  setOtpVerified(false);

  setOtp("");
  setNewPassword("");
  setConfirmPassword("");

  navigate({
    to: "/auth",
  });

  setMode("signin");
} else {
    toast.error(data.message);
  }
};

  const handleGoogle = async () => {
    setLoading(true);
    try {
     const result = await lovable.auth.signInWithOAuth("google", {
redirect_uri: `${window.location.origin}/auth-callback`,});
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
                            <Dialog open={forgotMode} onOpenChange={setForgotMode}>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reset Password</DialogTitle>
                                  </DialogHeader>

                                  <div className="space-y-4">

                                    <Input
                                      type="email"
                                      placeholder="Enter your email"
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                    />

                                    {!otpSent && (
                                      <Button
                                        type="button"
                                        onClick={sendResetOTP}
                                        className="w-full"
                                      >
                                        Send OTP
                                      </Button>
                                    )}

                                    {otpSent && !otpVerified && (
                                      <>
                                        <Input
                                          placeholder="Enter OTP"
                                          value={otp}
                                          onChange={(e) => setOtp(e.target.value)}
                                        />

                                        <Button
                                          type="button"
                                          onClick={verifyOTP}
                                          className="w-full"
                                        >
                                          Verify OTP
                                        </Button>

                                        {!canResend ? (
                                          <p className="text-sm text-center">
                                            Resend OTP in {timer}s
                                          </p>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            type="button"
                                            className="w-full"
                                            onClick={sendResetOTP}
                                          >
                                            Resend OTP
                                          </Button>
                                        )}
                                      </>
                                    )}

                                    {otpVerified && (
                                      <>
                                        <Input
                                          type="password"
                                          placeholder="New Password"
                                          value={newPassword}
                                          onChange={(e) =>
                                            setNewPassword(e.target.value)
                                          }
                                        />

                                        <Input
                                          type="password"
                                          placeholder="Confirm Password"
                                          value={confirmPassword}
                                          onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                          }
                                        />

                                        <Button
                                          type="button"
                                          className="w-full"
                                          onClick={handleResetPassword}
                                        >
                                          Save Password
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
                  <TabsList className="grid w-full grid-cols-2 rounded-2xl bg-accent/60 p-1">
                    <TabsTrigger value="signin" className="rounded-2xl">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="rounded-2xl">Create Account</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="mt-6">
                    <form onSubmit={handleEmail} className="space-y-4">
                      <Field label="Email / Mobile Number" icon={<Mail className="h-5 w-5" />}>
                        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-14 rounded-[1.25rem] border-0 bg-transparent text-lg shadow-none" placeholder="Email" />
                      </Field>
                                                        <Field
                                    label="Password"
                                    icon={<Lock className="h-5 w-5" />}
                                    right={
                                    <button
                                      type="button"
                                       className="cursor-pointer"
                                      onClick={() => setShowPassword(!showPassword)}
                                    >
                                      {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                                      ) : (
                                        <Eye className="h-5 w-5 text-muted-foreground" />
                                      )}
                                    </button>
                                    }
                                    >
                                    <Input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    minLength={6}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-14 rounded-[1.25rem] border-0 bg-transparent text-lg shadow-none"
                                    placeholder="Password"
                                    />
                                    </Field>
                                                      <div className="flex items-center justify-between px-1 text-sm">
                        <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Remember me</label>
                        <button
                                type="button"
                                 className="text-primary cursor-pointer"
                                onClick={() => setForgotMode(true)}
                              >
                                Forgot Password?
                              </button>
                      </div>

                      <Button type="submit" disabled={loading} className="h-14 w-full rounded-[1.25rem] text-xl font-bold">
                        <Shield className="h-5 w-5" /> {loading ? "Logging in…" : "Login"}
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-sm text-muted-foreground">OR</span>
                        <div className="h-px flex-1 bg-border" />
                      </div>

                      <Button
                        variant="outline"
                        type="button"
                        disabled={loading}
                        onClick={handleGoogle}
                        className="h-14 w-full rounded-[1.25rem] text-lg"
                      >
                        Continue with Google
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
                     <Field
                          label="Password"
                          icon={<Lock className="h-5 w-5" />}
                          right={
                            <button
                              type="button"
                              className="cursor-pointer"
                              onClick={() => setShowSignupPassword(!showSignupPassword)}
                            >
                              {showSignupPassword ? (
                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <Eye className="h-5 w-5 text-muted-foreground" />
                              )}
                            </button>
                          }
                        >
                          <Input
                            type={showSignupPassword ? "text" : "password"}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-14 rounded-[1.25rem] border-0 bg-transparent text-lg shadow-none"
                            placeholder="Create password"
                          />
                        </Field>
                      <Button type="submit" disabled={loading} className="h-14 w-full rounded-[1.25rem] text-lg font-bold">
                        {loading ? "Creating account…" : "Create Account"}
                      </Button>
                      <div className="flex items-center gap-3">
                          <div className="h-px flex-1 bg-border" />
                          <span className="text-sm text-muted-foreground">OR</span>
                          <div className="h-px flex-1 bg-border" />
                        </div>

                        <Button
                          variant="outline"
                          type="button"
                          disabled={loading}
                          onClick={handleGoogle}
                          className="h-14 w-full rounded-[1.25rem] text-lg"
                        >
                          Continue with Google
                        </Button>
                    </form>
                  </TabsContent>
                </Tabs>

             
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
