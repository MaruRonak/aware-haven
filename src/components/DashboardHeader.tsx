import { Link, useNavigate } from "@tanstack/react-router";
import { Shield, User, MapPin, LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Profile = {
  name: string;
  role: string;
  safety_score: number;
  location_enabled: boolean;
};

export function DashboardHeader({ accent = "rose" }: { accent?: "rose" | "amber" | "emerald" }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("name, role, safety_score, location_enabled")
        .maybeSingle();
      if (data) setProfile(data as Profile);
    })();
  }, []);

  const toggleLocation = async () => {
    if (!profile) return;
    const next = !profile.location_enabled;
    setProfile({ ...profile, location_enabled: next });
    await supabase.from("profiles").update({ location_enabled: next }).eq("role", profile.role);
    toast.success(next ? "Location sharing ON" : "Location sharing OFF");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  const score = profile?.safety_score ?? 75;
  const scoreColor = score >= 75 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-rose-500";
  const accentGrad: Record<string, string> = {
    rose: "from-rose-500 to-pink-500",
    amber: "from-amber-500 to-orange-500",
    emerald: "from-emerald-500 to-teal-500",
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${accentGrad[accent]} text-white shadow-glow`}>
            <Shield className="h-4 w-4" />
          </div>
          <span className="font-semibold">Cyber<span className="gradient-text">Raksha</span></span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Safety Score */}
          <div className={`hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium sm:flex ${scoreColor}`}>
            <span className="text-base">🛡️</span>
            <span>Safety {score}%</span>
          </div>

          {/* Location toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLocation}
            className={profile?.location_enabled ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400" : ""}
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">{profile?.location_enabled ? "On" : "Off"}</span>
          </Button>

          {/* Profile */}
          <Button asChild variant="ghost" size="icon" aria-label="Profile">
            <Link to="/profile"><User className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Switch role">
            <Link to="/role-select"><Settings className="h-4 w-4" /></Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
