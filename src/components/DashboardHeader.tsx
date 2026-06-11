import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Globe, LogOut, Menu, Shield, User } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  name: string;
  role: string;
  safety_score: number;
};

const accentStyles = {
  rose: { bg: "var(--gradient-women)" },
  amber: { bg: "var(--gradient-children)" },
  emerald: { bg: "var(--gradient-senior)" },
} as const;

export function DashboardHeader({ accent = "rose" }: { accent?: "rose" | "amber" | "emerald" }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("name, role, safety_score")
        .maybeSingle();
      if (data) setProfile(data as Profile);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="overflow-hidden rounded-b-[2rem] text-white" style={{ background: accentStyles[accent].bg }}>
      <div className="container mx-auto max-w-6xl px-4 pb-8 pt-5 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <button type="button" className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12 backdrop-blur">
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <div className="text-2xl font-bold leading-tight">{profile?.name ? `Hello, ${profile.name.split(" ")[0]}!` : "Hello!"}</div>
              <div className="mt-1 flex items-center gap-2 text-sm text-white/90">
                <Shield className="h-4 w-4" />
                {profile?.role === "parent" ? "Learn. Play. Stay Safe." : profile?.role === "senior" ? "Stay Safe. Stay Secure." : "Stay Alert, Stay Safe"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden hero-badge px-3 py-2 text-xs font-semibold text-white sm:flex">
              <Shield className="mr-1 h-3.5 w-3.5" /> Safety Score: {profile?.safety_score ?? 80}%
            </div>
            <button type="button" className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/12 backdrop-blur">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold">3</span>
            </button>
            <Link to="/profile" className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12 backdrop-blur">
              <User className="h-5 w-5" />
            </Link>
            <Link to="/role-select" className="hidden items-center gap-2 rounded-2xl bg-white/12 px-3 py-2 text-sm backdrop-blur sm:flex">
              <Globe className="h-4 w-4" /> Switch
            </Link>
            <button type="button" onClick={signOut} className="grid h-11 w-11 place-items-center rounded-2xl bg-white/12 backdrop-blur">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
